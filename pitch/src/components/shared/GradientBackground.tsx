import React from "react";
import { AbsoluteFill } from "remotion";
import { colors } from "../../design/tokens";

export const GradientBackground: React.FC<{
  from?: string;
  via?: string;
  to?: string;
}> = ({
  from = colors.bgDark,
  via = colors.bgCard,
  to = colors.bgDark,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${from} 0%, ${via} 50%, ${to} 100%)`,
      }}
    />
  );
};
