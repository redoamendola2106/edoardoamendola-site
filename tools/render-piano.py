"""Render original miniature scores with a deterministic digital piano voice.
Requires numpy, scipy and ffmpeg. No third-party samples or melodies are used.
"""
from pathlib import Path
import numpy as np
from scipy.io import wavfile
from scipy.signal import lfilter
import subprocess, tempfile, json
SR=44100
ROOT=Path(__file__).resolve().parents[1]
# Each event is (onset seconds, MIDI pitch, velocity, pedal/sustain seconds).
SCORES={
'silence':[(.9,62,.36,4.5),(2.4,69,.27,4.3)],
'listening':[(.12,50,.28,6),(.2,57,.23,5),(.65,66,.48,3.5),(1.55,69,.42,3.5),(2.55,76,.38,4),(3.8,74,.34,4)],
'breath':[(.15,50,.3,6),(.55,57,.3,5),(.98,64,.37,4.5),(1.47,66,.4,4),(2.05,69,.44,4),(2.75,76,.36,4.3),(3.7,73,.3,4)],
'rubato':[(.12,47,.36,6),(.35,54,.32,5),(.95,59,.4,4),(1.7,62,.46,3.5),(2.03,66,.46,3),(2.29,69,.41,3),(2.83,74,.54,4),(3.8,73,.39,4),(5.05,69,.32,4)],
'cantabile':[(.12,50,.3,5),(.24,57,.25,4),(.4,66,.47,2.5),(1.2,69,.49,2),(1.95,71,.5,2.5),(2.7,47,.25,5),(2.8,69,.43,2),(3.65,76,.5,3),(4.7,74,.42,3),(5.55,78,.44,3),(6.4,76,.36,3),(7.55,74,.32,4)],
'resonance':[(.15,50,.33,8),(.21,57,.3,8),(.29,66,.37,7.5),(.4,76,.29,8)],
'dacapo':[(.15,50,.25,6),(.23,57,.2,5),(.65,66,.4,3.5),(1.65,69,.36,3.5),(2.8,76,.31,4),(4.1,74,.29,5)]
}
def piano(pitch,velocity,duration):
 n=int(duration*SR);t=np.arange(n)/SR;f=440*2**((pitch-69)/12)
 # Slightly inharmonic, softly struck double/triple strings; high partials
 # decay faster than the fundamental, with a small hammer transient.
 signal=np.zeros(n);B=.000055*2**((pitch-60)/18)
 for partial in range(1,min(32,int(SR*.44/f))+1):
  freq=f*partial*np.sqrt(1+B*partial*partial)
  strength=np.exp(-partial/(4.5+velocity*7))/partial**1.32
  strength*=np.sin(np.pi*partial*.137)**2+.18
  decay=(3.8*(220/f)**.32)/(1+.19*partial)
  env=(1-np.exp(-t/(.0018+.0001*partial)))*np.exp(-t/decay)
  strings=(np.cos(2*np.pi*freq*t)+.52*np.cos(2*np.pi*freq*1.0007*t)+.48*np.cos(2*np.pi*freq*.9994*t))/2
  signal+=strength*env*strings
 rng=np.random.default_rng(pitch)
 hammer=lfilter([.25,.5,.25],[1],rng.normal(0,1,n))*np.exp(-t/.009)*.018
 signal+=hammer
 signal*=np.minimum(1,(duration-t)/.35).clip(0,1)
 return signal*velocity

def render(name,events):
 duration=max(a+d for a,_,_,d in events)+1.2
 track=np.zeros((int(duration*SR),2))
 for onset,pitch,vel,dur in events:
  voice=piano(pitch,vel,dur);pos=int(onset*SR)
  pan=np.clip((pitch-62)/45,-.5,.5)
  track[pos:pos+len(voice),0]+=voice*np.sqrt((1-pan)/2)
  track[pos:pos+len(voice),1]+=voice*np.sqrt((1+pan)/2)
 # Quiet cross-channel early reflections and a diffuse, decaying room tail.
 dry=track.copy()
 for k in range(1,31):
  delay=int((.043*k+.009*(k%3))*SR)
  gain=.075*np.exp(-k/7)
  track[delay:]+=dry[:-delay,::-1 if k%2 else 1]*gain
 track*=2.1
 peak=np.max(np.abs(track))
 if peak>.82:track*=.82/peak
 fade=int(.65*SR);track[-fade:]*=np.linspace(1,0,fade)[:,None]
 dest=ROOT/'assets/audio'/f'{name}.mp3'
 with tempfile.TemporaryDirectory() as temp:
  wav=Path(temp)/'piano.wav';wavfile.write(wav,SR,(track*32767).astype(np.int16))
  subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','160k','-metadata',f'title={name.title()} — original digital piano miniature',str(dest)],check=True)
 return {'movement':name,'duration_seconds':round(duration,2),'peak':round(float(np.max(np.abs(track))),4),'rms':round(float(np.sqrt(np.mean(track**2))),4),'bytes':dest.stat().st_size}
if __name__=='__main__':
 print(json.dumps([render(n,e) for n,e in SCORES.items()],indent=2))
