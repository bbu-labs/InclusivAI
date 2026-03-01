import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { springConfig } from "../../design/tokens";

type AnimationType = "typewriter" | "fadeIn" | "slideUp";

export const AnimatedText: React.FC<{
  text: string;
  type?: AnimationType;
  delay?: number;
  style?: React.CSSProperties;
  charDelay?: number;
}> = ({ text, type = "fadeIn", delay = 0, style = {}, charDelay = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (type === "typewriter") {
    const adjustedFrame = Math.max(0, frame - delay);
    const charsToShow = Math.min(
      Math.floor(adjustedFrame / charDelay),
      text.length
    );
    return (
      <span style={style}>
        {text.slice(0, charsToShow)}
        {charsToShow < text.length && (
          <span
            style={{
              opacity: frame % 16 < 8 ? 1 : 0,
              color: style.color || "inherit",
            }}
          >
            |
          </span>
        )}
      </span>
    );
  }

  if (type === "slideUp") {
    const progress = spring({
      frame: frame - delay,
      fps,
      config: springConfig.default,
    });
    return (
      <div
        style={{
          opacity: progress,
          transform: `translateY(${(1 - progress) * 20}px)`,
          ...style,
        }}
      >
        {text}
      </div>
    );
  }

  // fadeIn
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <span style={{ opacity, ...style }}>{text}</span>;
};
