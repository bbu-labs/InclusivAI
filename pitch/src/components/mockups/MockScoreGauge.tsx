import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { colors, fonts, fontSize } from "../../design/tokens";

export const MockScoreGauge: React.FC<{
  score: number;
  startFrame?: number;
  duration?: number;
  size?: number;
}> = ({ score, startFrame = 0, duration = 40, size = 128 }) => {
  const frame = useCurrentFrame();

  const animatedScore = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, score],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = animatedScore / 100;
  const offset = circumference * (1 - progress);

  const getColor = (s: number) => {
    if (s >= 70) return colors.success;
    if (s >= 40) return colors.warning;
    return colors.error;
  };

  const getLabel = (s: number) => {
    if (s >= 70) return "Boa proteção";
    if (s >= 40) return "Atenção necessária";
    return "Alto risco";
  };

  const scoreColor = getColor(animatedScore);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size}>
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.base200}
            strokeWidth={10}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        {/* Center text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: size * 0.25,
              color: colors.baseContent,
              lineHeight: 1,
            }}
          >
            {Math.round(animatedScore)}
          </span>
          <span
            style={{
              fontFamily: fonts.body,
              fontSize: size * 0.1,
              color: "rgba(31,41,55,0.5)",
            }}
          >
            /100
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          color: scoreColor,
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: fontSize.sm,
        }}
      >
        {getLabel(animatedScore)}
      </div>
    </div>
  );
};
