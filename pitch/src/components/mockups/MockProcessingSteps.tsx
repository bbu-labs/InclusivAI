import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { colors, fonts } from "../../design/tokens";
import { processingSteps } from "../../data/demo-data";

export const MockProcessingSteps: React.FC<{
  startFrame?: number;
  stepDuration?: number;
  scale?: number;
}> = ({ startFrame = 0, stepDuration = 40, scale = 1 }) => {
  const frame = useCurrentFrame();
  const adjustedFrame = frame - startFrame;

  const getStepState = (index: number) => {
    const stepStart = index * stepDuration;
    const stepEnd = stepStart + stepDuration;
    if (adjustedFrame >= stepEnd) return "completed";
    if (adjustedFrame >= stepStart) return "current";
    return "pending";
  };

  const totalProgress = interpolate(
    adjustedFrame,
    [0, stepDuration * 4],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        background: colors.base200,
        borderRadius: 16 * scale,
        padding: `${20 * scale}px`,
        display: "flex",
        flexDirection: "column",
        gap: 10 * scale,
      }}
    >
      {processingSteps.map((step, i) => {
        const state = getStepState(i);
        return (
          <div
            key={step.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12 * scale,
              padding: `${10 * scale}px ${12 * scale}px`,
              borderRadius: 10 * scale,
              background:
                state === "current"
                  ? `${colors.primary}1a`
                  : state === "completed"
                    ? `${colors.success}0d`
                    : "transparent",
              border:
                state === "current"
                  ? `1px solid ${colors.primary}4d`
                  : state === "completed"
                    ? `1px solid ${colors.success}33`
                    : "1px solid transparent",
              opacity: state === "pending" ? 0.4 : 1,
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 24 * scale,
                height: 24 * scale,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {state === "completed" ? (
                <svg
                  width={20 * scale}
                  height={20 * scale}
                  viewBox="0 0 24 24"
                  fill={colors.success}
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              ) : state === "current" ? (
                <div
                  style={{
                    width: 18 * scale,
                    height: 18 * scale,
                    border: `2px solid ${colors.primary}`,
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 18 * scale,
                    height: 18 * scale,
                    borderRadius: "50%",
                    background: `${colors.baseContent}33`,
                  }}
                />
              )}
            </div>
            <span
              style={{
                fontFamily: fonts.body,
                fontSize: 12 * scale,
                fontWeight: 500,
                color:
                  state === "current"
                    ? colors.primary
                    : state === "completed"
                      ? colors.success
                      : colors.baseContent,
              }}
            >
              {step.label}
            </span>
          </div>
        );
      })}

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          height: 8 * scale,
          background: `${colors.primary}1a`,
          borderRadius: 4 * scale,
          overflow: "hidden",
          marginTop: 4 * scale,
        }}
      >
        <div
          style={{
            width: `${totalProgress}%`,
            height: "100%",
            background: colors.primary,
            borderRadius: 4 * scale,
            transition: "width 0.3s",
          }}
        />
      </div>
    </div>
  );
};
