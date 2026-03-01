import React from "react";
import { useCurrentFrame, spring, useVideoConfig } from "remotion";
import { springConfig } from "../../design/tokens";

export const SpringFadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  style?: React.CSSProperties;
  config?: { damping: number; mass: number; stiffness: number };
}> = ({
  children,
  delay = 0,
  direction = "up",
  distance = 30,
  style = {},
  config = springConfig.default,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config,
  });

  const translateMap = {
    up: `translateY(${(1 - progress) * distance}px)`,
    down: `translateY(${(progress - 1) * distance}px)`,
    left: `translateX(${(1 - progress) * distance}px)`,
    right: `translateX(${(progress - 1) * distance}px)`,
    none: "none",
  };

  return (
    <div
      style={{
        opacity: progress,
        transform: translateMap[direction],
        ...style,
      }}
    >
      {children}
    </div>
  );
};
