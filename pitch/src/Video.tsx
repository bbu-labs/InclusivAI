import React from "react";
import { AbsoluteFill, Audio, Series, staticFile } from "remotion";
import { Scene01Hook } from "./scenes/Scene01Hook";
import { Scene02Scale } from "./scenes/Scene02Scale";
import { Scene03Solution } from "./scenes/Scene03Solution";
import { Scene04Demo } from "./scenes/Scene04Demo";
import { Scene05Accessibility } from "./scenes/Scene05Accessibility";
import { Scene06MultiCountry } from "./scenes/Scene06MultiCountry";
import { Scene07Technical } from "./scenes/Scene07Technical";
import { Scene08CTA } from "./scenes/Scene08CTA";

export const Video: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile("voiceover.mp3")} volume={1.0} />
      <Series>
      <Series.Sequence durationInFrames={600}>
        <Scene01Hook />
      </Series.Sequence>
      <Series.Sequence durationInFrames={450}>
        <Scene02Scale />
      </Series.Sequence>
      <Series.Sequence durationInFrames={600}>
        <Scene03Solution />
      </Series.Sequence>
      <Series.Sequence durationInFrames={1050}>
        <Scene04Demo />
      </Series.Sequence>
      <Series.Sequence durationInFrames={600}>
        <Scene05Accessibility />
      </Series.Sequence>
      <Series.Sequence durationInFrames={519}>
        <Scene06MultiCountry />
      </Series.Sequence>
      <Series.Sequence durationInFrames={482}>
        <Scene07Technical />
      </Series.Sequence>
      <Series.Sequence durationInFrames={339}>
        <Scene08CTA />
      </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
