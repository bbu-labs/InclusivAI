import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { colors } from "../../design/tokens";

export const PipelineArrow: React.FC<{
  startFrame?: number;
  duration?: number;
  width?: number;
}> = ({ startFrame = 0, duration = 20, width = 80 }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const dashLength = width;

  return (
    <div
      style={{
        width,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={width} height={40} viewBox={`0 0 ${width} 40`}>
        {/* Arrow line */}
        <line
          x1={0}
          y1={20}
          x2={width - 10}
          y2={20}
          stroke={colors.accent}
          strokeWidth={2}
          strokeDasharray={dashLength}
          strokeDashoffset={dashLength * (1 - progress)}
        />
        {/* Arrow head */}
        <polygon
          points={`${width - 12},14 ${width},20 ${width - 12},26`}
          fill={colors.accent}
          opacity={progress}
        />
        {/* Data packet */}
        {progress > 0.1 && progress < 0.95 && (
          <circle
            cx={progress * (width - 10)}
            cy={20}
            r={4}
            fill={colors.secondary}
          />
        )}
      </svg>
    </div>
  );
};
