import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const CountUpNumber: React.FC<{
  target: number;
  startFrame?: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  style?: React.CSSProperties;
}> = ({
  target,
  startFrame = 0,
  duration = 45,
  decimals = 0,
  suffix = "",
  prefix = "",
  style = {},
}) => {
  const frame = useCurrentFrame();

  const value = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, target],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <span style={style}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};
