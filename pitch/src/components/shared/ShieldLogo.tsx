import React from "react";
import { colors, fonts } from "../../design/tokens";

export const ShieldLogo: React.FC<{
  size?: number;
  showText?: boolean;
  textColor?: string;
}> = ({ size = 48, showText = true, textColor = colors.white }) => {
  const iconSize = size * 0.6;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.2,
          background: colors.secondary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"
            fill="#000"
          />
          <path
            d="M10 15.5l-3.5-3.5 1.41-1.41L10 12.67l5.59-5.59L17 8.5l-7 7z"
            fill={colors.secondary}
          />
        </svg>
      </div>
      {showText && (
        <span
          style={{
            fontFamily: fonts.heading,
            fontWeight: 800,
            fontSize: size * 0.5,
            color: textColor,
          }}
        >
          InclusivAI
        </span>
      )}
    </div>
  );
};
