// Seven consecutive equal excerpts from the user-supplied recording.
// Leading recorder silence removed; see assets/audio/segments.json.
// Audio remains off until the visitor explicitly enables it.
window.PIANO_STORY_AUDIO = Object.freeze({
  silence: 'assets/audio/recording-01.mp3',
  listening: 'assets/audio/recording-02.mp3',
  breath: 'assets/audio/recording-03.mp3',
  rubato: 'assets/audio/recording-04.mp3',
  cantabile: 'assets/audio/recording-05.mp3',
  resonance: 'assets/audio/recording-06.mp3',
  dacapo: 'assets/audio/recording-07.mp3'
});
