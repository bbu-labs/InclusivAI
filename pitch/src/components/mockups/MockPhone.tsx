import React from "react";
import { colors } from "../../design/tokens";

export const MockPhone: React.FC<{
  children: React.ReactNode;
  scale?: number;
  style?: React.CSSProperties;
}> = ({ children, scale = 1, style = {} }) => {
  const phoneWidth = 375 * scale;
  const phoneHeight = 812 * scale;
  const borderRadius = 44 * scale;
  const bezelWidth = 8 * scale;
  const notchWidth = 150 * scale;
  const notchHeight = 30 * scale;
  const statusBarHeight = 44 * scale;

  return (
    <div
      style={{
        width: phoneWidth + bezelWidth * 2,
        height: phoneHeight + bezelWidth * 2,
        borderRadius: borderRadius + bezelWidth,
        background: "#1a1a1a",
        padding: bezelWidth,
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        position: "relative",
        ...style,
      }}
    >
      {/* Phone screen */}
      <div
        style={{
          width: phoneWidth,
          height: phoneHeight,
          borderRadius,
          background: colors.base100,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: notchWidth,
            height: notchHeight,
            background: "#1a1a1a",
            borderRadius: `0 0 ${16 * scale}px ${16 * scale}px`,
            zIndex: 10,
          }}
        />

        {/* Status bar */}
        <div
          style={{
            height: statusBarHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `0 ${24 * scale}px`,
            fontSize: 12 * scale,
            fontWeight: 600,
            color: colors.baseContent,
            position: "relative",
            zIndex: 5,
          }}
        >
          <span>9:41</span>
          <div style={{ display: "flex", gap: 4 * scale, alignItems: "center" }}>
            <svg width={16 * scale} height={12 * scale} viewBox="0 0 16 12">
              <rect x="0" y="6" width="3" height="6" rx="0.5" fill={colors.baseContent} />
              <rect x="4.5" y="4" width="3" height="8" rx="0.5" fill={colors.baseContent} />
              <rect x="9" y="2" width="3" height="10" rx="0.5" fill={colors.baseContent} />
              <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" fill={colors.baseContent} />
            </svg>
            <svg width={22 * scale} height={12 * scale} viewBox="0 0 25 12">
              <rect x="0" y="1" width="22" height="10" rx="2" stroke={colors.baseContent} strokeWidth="1" fill="none" />
              <rect x="1.5" y="2.5" width="16" height="7" rx="1" fill={colors.baseContent} />
              <rect x="23" y="4" width="2" height="4" rx="1" fill={colors.baseContent} />
            </svg>
          </div>
        </div>

        {/* Content area */}
        <div
          style={{
            height: phoneHeight - statusBarHeight,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
