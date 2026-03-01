import React from "react";
import { colors, fonts } from "../../design/tokens";

export const MockNavbar: React.FC<{
  scale?: number;
  transparent?: boolean;
}> = ({ scale = 1, transparent = false }) => {
  const height = 56 * scale;
  const logoSize = 28 * scale;

  return (
    <div
      style={{
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `0 ${16 * scale}px`,
        borderBottom: transparent ? "none" : `1px solid ${colors.base200}`,
        background: transparent ? "transparent" : `${colors.base100}ee`,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 * scale }}>
        <div
          style={{
            width: logoSize,
            height: logoSize,
            borderRadius: 6 * scale,
            background: colors.secondary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width={logoSize * 0.6}
            height={logoSize * 0.6}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"
              fill="#000"
            />
          </svg>
        </div>
        <span
          style={{
            fontFamily: fonts.heading,
            fontWeight: 800,
            fontSize: 14 * scale,
            color: transparent ? colors.white : colors.baseContent,
          }}
        >
          InclusivAI
        </span>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 * scale }}>
        <div
          style={{
            padding: `${4 * scale}px ${12 * scale}px`,
            borderRadius: 6 * scale,
            background: colors.primary,
            color: colors.white,
            fontSize: 11 * scale,
            fontFamily: fonts.body,
            fontWeight: 600,
          }}
        >
          Analisar
        </div>
        <svg
          width={22 * scale}
          height={22 * scale}
          viewBox="0 0 24 24"
          fill={transparent ? colors.white : colors.baseContent}
          opacity={0.6}
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="9" r="3" fill={transparent ? "rgba(0,0,0,0.3)" : colors.base100} />
          <path
            d="M12 14c-4 0-6 2-6 4v1h12v-1c0-2-2-4-6-4z"
            fill={transparent ? "rgba(0,0,0,0.3)" : colors.base100}
          />
        </svg>
      </div>
    </div>
  );
};
