// Add Edoardo's own recordings to assets/audio/, then replace the corresponding
// null with the documented relative path. Keep silence null. No audio downloads
// or playback occur before an explicit click; an empty map hides the control.
window.PIANO_STORY_AUDIO = Object.freeze({
  silence: null,
  listening: null, // 'assets/audio/listening.mp3'
  breath: null, // 'assets/audio/breath.mp3'
  rubato: null, // 'assets/audio/rubato.mp3'
  cantabile: null, // 'assets/audio/cantabile.mp3'
  resonance: null, // 'assets/audio/resonance.mp3'
  dacapo: null // 'assets/audio/listening.mp3'
});
