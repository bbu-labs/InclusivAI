import React from "react";
import { Composition } from "remotion";
import { Video } from "./Video";
import { FPS, WIDTH, HEIGHT, TOTAL_FRAMES } from "./design/tokens";

export const Root: React.FC = () => {
  return (
    <Composition
      id="PitchVideo"
      component={Video}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
