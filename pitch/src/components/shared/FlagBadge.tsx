import React from "react";
import { colors, fonts, fontSize } from "../../design/tokens";

export const FlagBadge: React.FC<{
  flag: string;
  name: string;
  laws: readonly string[];
  scale?: number;
}> = ({ flag, name, laws, scale = 1 }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6 * scale,
        padding: `${8 * scale}px`,
      }}
    >
      <span style={{ fontSize: 20 * scale }}>{flag}</span>
      <span
        style={{
          fontFamily: fonts.heading,
          fontSize: 10 * scale,
          fontWeight: 700,
          color: colors.baseContent,
        }}
      >
        {name}
      </span>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 3 * scale,
          alignItems: "center",
        }}
      >
        {laws.map((law) => (
          <span
            key={law}
            style={{
              fontFamily: fonts.mono,
              fontSize: 7 * scale,
              color: colors.primary,
              background: `${colors.primary}1a`,
              padding: `${2 * scale}px ${6 * scale}px`,
              borderRadius: 4 * scale,
            }}
          >
            {law}
          </span>
        ))}
      </div>
    </div>
  );
};
