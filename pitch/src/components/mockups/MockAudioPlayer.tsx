import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { colors, fonts } from "../../design/tokens";

export const MockAudioPlayer: React.FC<{
  startFrame?: number;
  scale?: number;
}> = ({ startFrame = 0, scale = 1 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - startFrame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const playProgress = interpolate(
    frame - startFrame,
    [15, 120],
    [0, 35],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        opacity,
        background: `${colors.primary}0d`,
        border: `1px solid ${colors.primary}33`,
        borderRadius: 12 * scale,
        padding: `${10 * scale}px ${14 * scale}px`,
        display: "flex",
        alignItems: "center",
        gap: 10 * scale,
      }}
    >
      {/* Play button */}
      <div
        style={{
          width: 28 * scale,
          height: 28 * scale,
          borderRadius: "50%",
          background: colors.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          width={12 * scale}
          height={12 * scale}
          viewBox="0 0 24 24"
          fill={colors.white}
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>

      {/* Progress bar */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            width: "100%",
            height: 4 * scale,
            background: `${colors.primary}33`,
            borderRadius: 2 * scale,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${playProgress}%`,
              height: "100%",
              background: colors.primary,
              borderRadius: 2 * scale,
            }}
          />
        </div>
      </div>

      {/* Time */}
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: 9 * scale,
          color: `${colors.baseContent}80`,
          flexShrink: 0,
        }}
      >
        0:42
      </span>
    </div>
  );
};
