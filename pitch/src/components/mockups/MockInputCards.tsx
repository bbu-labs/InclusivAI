import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { colors, fonts, springConfig } from "../../design/tokens";
import { inputModes } from "../../data/demo-data";

const IconSvg: React.FC<{ icon: string; size: number; color: string }> = ({
  icon,
  size,
  color,
}) => {
  const paths: Record<string, string> = {
    IoLink:
      "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
    IoDocumentText:
      "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    IoDocument:
      "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    IoCamera:
      "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",
    IoMic:
      "M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z M19 10v2a7 7 0 01-14 0v-2 M12 19v4m-4 0h8",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {(paths[icon] || "").split(" M").map((d, i) => (
        <path key={i} d={i === 0 ? d : `M${d}`} />
      ))}
    </svg>
  );
};

export const MockInputCards: React.FC<{
  selectedMode?: string;
  highlightDelay?: number;
  scale?: number;
}> = ({ selectedMode = "url", highlightDelay = 20, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const highlightProgress = spring({
    frame: frame - highlightDelay,
    fps,
    config: springConfig.default,
  });

  return (
    <div style={{ padding: `0 ${14 * scale}px` }}>
      {/* Row 1: URL, Text, File */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8 * scale,
          marginBottom: 8 * scale,
        }}
      >
        {inputModes.slice(0, 3).map((mode, i) => {
          const isSelected = mode.id === selectedMode;
          const cardDelay = i * 5;
          const opacity = interpolate(frame, [cardDelay, cardDelay + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={mode.id}
              style={{
                opacity,
                background: isSelected
                  ? `${colors.primary}0d`
                  : colors.base100,
                border: `2px solid ${isSelected ? colors.primary : colors.base200}`,
                borderRadius: 12 * scale,
                padding: `${16 * scale}px ${8 * scale}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6 * scale,
                transform: isSelected
                  ? `scale(${1 + highlightProgress * 0.03})`
                  : "scale(1)",
              }}
            >
              <div
                style={{
                  width: 36 * scale,
                  height: 36 * scale,
                  borderRadius: 10 * scale,
                  background: isSelected ? colors.primary : `${colors.primary}1a`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconSvg
                  icon={mode.icon}
                  size={18 * scale}
                  color={isSelected ? colors.white : colors.primary}
                />
              </div>
              <span
                style={{
                  fontFamily: fonts.body,
                  fontSize: 10 * scale,
                  fontWeight: 600,
                  color: colors.baseContent,
                  textAlign: "center",
                }}
              >
                {mode.title}
              </span>
            </div>
          );
        })}
      </div>
      {/* Row 2: Camera, Audio */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8 * scale,
          maxWidth: "66%",
          margin: "0 auto",
        }}
      >
        {inputModes.slice(3).map((mode, i) => {
          const cardDelay = (i + 3) * 5;
          const opacity = interpolate(frame, [cardDelay, cardDelay + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={mode.id}
              style={{
                opacity,
                background: colors.base100,
                border: `2px solid ${colors.base200}`,
                borderRadius: 12 * scale,
                padding: `${16 * scale}px ${8 * scale}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6 * scale,
              }}
            >
              <div
                style={{
                  width: 36 * scale,
                  height: 36 * scale,
                  borderRadius: 10 * scale,
                  background: `${colors.primary}1a`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconSvg
                  icon={mode.icon}
                  size={18 * scale}
                  color={colors.primary}
                />
              </div>
              <span
                style={{
                  fontFamily: fonts.body,
                  fontSize: 10 * scale,
                  fontWeight: 600,
                  color: colors.baseContent,
                  textAlign: "center",
                }}
              >
                {mode.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
