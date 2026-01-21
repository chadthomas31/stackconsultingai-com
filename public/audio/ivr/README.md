## IVR audio demos

This site’s VOIP/IVR section expects audio files in this folder.

### Add your files
- Put MP3 files here (recommended):
  - `public/audio/ivr/Liam_CISDemo_IVR1.mp3` (Male 1)
  - `public/audio/ivr/Liam_CISDemo_IVR2.mp3` (Male 2)
  - `public/audio/ivr/Rachel_CISDemo_IVR1.mp3` (Female 1)
  - `public/audio/ivr/Rachel_CISDemo_IVR2.mp3` (Female 2)
  - `public/audio/ivr/after-hours.mp3` (After Hours VM)

### Notes
- Filenames must match what the UI references (see `components/VoipIvr.tsx`), or update the `src` paths there.
- If you prefer WAV files, you can use `.wav` but make sure browsers you care about support playback.

