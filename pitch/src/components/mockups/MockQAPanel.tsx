import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { colors, fonts } from "../../design/tokens";

export const MockQAPanel: React.FC<{
  startFrame?: number;
  scale?: number;
}> = ({ startFrame = 0, scale = 1 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - startFrame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        background: colors.base200,
        borderRadius: 12 * scale,
        padding: `${12 * scale}px ${14 * scale}px`,
        display: "flex",
        alignItems: "center",
        gap: 8 * scale,
      }}
    >
      <svg
        width={16 * scale}
        height={16 * scale}
        viewBox="0 0 24 24"
        fill="none"
        stroke={colors.primary}
        strokeWidth={2}
        strokeLinecap="round"
      >
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
      <span
        style={{
          fontFamily: fonts.body,
          fontSize: 11 * scale,
          color: `${colors.baseContent}80`,
        }}
      >
        Faça uma pergunta sobre o documento...
      </span>
    </div>
  );
};
