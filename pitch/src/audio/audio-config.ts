/**
 * Frame timestamps for audio synchronization.
 * Each scene's start frame is relative to the full 4500-frame video.
 *
 * To use: place voiceover.mp3 and bgm.mp3 in pitch/public/
 * Then uncomment the <Audio> components in Video.tsx
 */

export const sceneTimestamps = {
  scene1: { startFrame: 0, endFrame: 599, duration: 600 },
  scene2: { startFrame: 600, endFrame: 1049, duration: 450 },
  scene3: { startFrame: 1050, endFrame: 1649, duration: 600 },
  scene4a: { startFrame: 1650, endFrame: 2009, duration: 360 },
  scene4b: { startFrame: 2010, endFrame: 2249, duration: 240 },
  scene4c: { startFrame: 2250, endFrame: 2699, duration: 450 },
  scene5: { startFrame: 2700, endFrame: 3299, duration: 600 },
  scene6: { startFrame: 3300, endFrame: 3749, duration: 450 },
  scene7: { startFrame: 3750, endFrame: 4049, duration: 300 },
  scene8: { startFrame: 4050, endFrame: 4499, duration: 450 },
} as const;

export const audioConfig = {
  voiceover: {
    src: "voiceover.mp3", // Place in pitch/public/
    volume: 1.0,
  },
  bgm: {
    src: "bgm.mp3", // Place in pitch/public/
    volume: 0.15,
  },
} as const;
