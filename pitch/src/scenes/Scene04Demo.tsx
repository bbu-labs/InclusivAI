import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  spring,
  useVideoConfig,
  interpolate,
  Sequence,
} from "remotion";
import { colors, fonts, fontSize, springConfig } from "../design/tokens";
import { GradientBackground } from "../components/shared/GradientBackground";
import { SectionLabel } from "../components/shared/SectionLabel";
import { SectionTitle } from "../components/shared/SectionTitle";
import { SpringFadeIn } from "../components/shared/SpringFadeIn";
import { AnimatedText } from "../components/shared/AnimatedText";
import { MockPhone } from "../components/mockups/MockPhone";
import { MockNavbar } from "../components/mockups/MockNavbar";
import { MockInputCards } from "../components/mockups/MockInputCards";
import { MockProcessingSteps } from "../components/mockups/MockProcessingSteps";
import { MockScoreGauge } from "../components/mockups/MockScoreGauge";
import { MockClauseCard } from "../components/mockups/MockClauseCard";
import { MockAudioPlayer } from "../components/mockups/MockAudioPlayer";
import { MockQAPanel } from "../components/mockups/MockQAPanel";
import { demoClauses, demoDocTitle } from "../data/demo-data";

// Scene 4a: Input (0-359, 12s)
const Scene4aInput: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const urlText = "https://nubank.com.br/termos-de-uso";
  const typingStart = 60;
  const charsTyped = Math.min(
    Math.max(0, Math.floor((frame - typingStart) / 2)),
    urlText.length
  );

  const buttonOpacity = interpolate(
    frame,
    [typingStart + urlText.length * 2, typingStart + urlText.length * 2 + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const buttonPress = spring({
    frame: frame - (typingStart + urlText.length * 2 + 30),
    fps,
    config: springConfig.snappy,
  });

  return (
    <AbsoluteFill>
      <GradientBackground from="#0d1b2a" via="#132a3e" to="#0d1b2a" />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          padding: "0 100px",
        }}
      >
        {/* Left: Text */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          <SectionLabel text="Live Demo" delay={5} />
          <SectionTitle
            text="Five ways to analyze"
            delay={10}
            size={fontSize["3xl"]}
          />
          <SpringFadeIn delay={20} direction="up">
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: fontSize.lg,
                color: colors.whiteAlpha75,
                lineHeight: 1.6,
              }}
            >
              Paste a URL, type text, upload a file, snap a photo, or record audio.
            </div>
          </SpringFadeIn>
        </div>

        {/* Right: MockPhone with input */}
        <SpringFadeIn delay={10} direction="right" distance={40}>
          <MockPhone scale={0.85}>
            <MockNavbar scale={0.85} />
            <div style={{ padding: "12px 0" }}>
              {/* Page title */}
              <div
                style={{
                  textAlign: "center",
                  fontFamily: fonts.heading,
                  fontSize: 15,
                  fontWeight: 700,
                  color: colors.baseContent,
                  marginBottom: 12,
                }}
              >
                Analisar Documento
              </div>

              {/* Input cards */}
              <MockInputCards selectedMode="url" highlightDelay={30} scale={0.85} />

              {/* URL input panel */}
              <div
                style={{
                  margin: "14px 12px 0",
                  background: colors.base200,
                  borderRadius: 14,
                  padding: 14,
                }}
              >
                {/* URL input */}
                <div
                  style={{
                    background: colors.base100,
                    border: `1px solid ${colors.base200}`,
                    borderRadius: 8,
                    padding: "10px 12px",
                    fontFamily: fonts.body,
                    fontSize: 11,
                    color: colors.baseContent,
                    marginBottom: 10,
                    minHeight: 18,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {charsTyped > 0 ? (
                    <>
                      {urlText.slice(0, charsTyped)}
                      <span style={{ opacity: frame % 16 < 8 ? 1 : 0 }}>|</span>
                    </>
                  ) : (
                    <span style={{ color: `${colors.baseContent}40` }}>
                      Cole o link aqui...
                    </span>
                  )}
                </div>

                {/* Analyze button */}
                <div
                  style={{
                    opacity: buttonOpacity,
                    background: colors.primary,
                    color: colors.white,
                    fontFamily: fonts.body,
                    fontSize: 13,
                    fontWeight: 700,
                    textAlign: "center",
                    padding: "10px 0",
                    borderRadius: 8,
                    transform: `scale(${1 - buttonPress * 0.05 + (buttonPress > 0.5 ? (buttonPress - 0.5) * 0.05 : 0)})`,
                  }}
                >
                  Analisar
                </div>
              </div>
            </div>
          </MockPhone>
        </SpringFadeIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4b: Processing (0-239, 8s)
const Scene4bProcessing: React.FC = () => {
  return (
    <AbsoluteFill>
      <GradientBackground from="#0d1b2a" via="#132a3e" to="#0d1b2a" />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          padding: "0 100px",
        }}
      >
        {/* Left: Text */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          <SectionLabel text="AI Pipeline" delay={5} />
          <SectionTitle
            text="Multi-agent processing"
            delay={10}
            size={fontSize["3xl"]}
          />
          <SpringFadeIn delay={20} direction="up">
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: fontSize.lg,
                color: colors.whiteAlpha75,
                lineHeight: 1.6,
              }}
            >
              Four specialized AI agents extract, classify, analyze, and summarize — all in under 30 seconds.
            </div>
          </SpringFadeIn>
        </div>

        {/* Right: MockPhone with processing */}
        <SpringFadeIn delay={5} direction="right" distance={40}>
          <MockPhone scale={0.85}>
            <MockNavbar scale={0.85} />
            <div style={{ padding: "20px 12px" }}>
              {/* Spinner */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    border: `3px solid ${colors.primary}33`,
                    borderTopColor: colors.primary,
                    borderRadius: "50%",
                  }}
                />
              </div>

              <div
                style={{
                  textAlign: "center",
                  fontFamily: fonts.heading,
                  fontSize: 15,
                  fontWeight: 700,
                  color: colors.baseContent,
                  marginBottom: 4,
                }}
              >
                Analisando...
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontFamily: fonts.body,
                  fontSize: 11,
                  color: `${colors.baseContent}80`,
                  marginBottom: 16,
                }}
              >
                {demoDocTitle}
              </div>

              <MockProcessingSteps startFrame={10} stepDuration={45} scale={0.85} />
            </div>
          </MockPhone>
        </SpringFadeIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 4c: Results (0-449, 15s)
const Scene4cResults: React.FC = () => {
  return (
    <AbsoluteFill>
      <GradientBackground from="#0d1b2a" via="#132a3e" to="#0d1b2a" />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          padding: "0 100px",
        }}
      >
        {/* Left: Text */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          <SectionLabel text="Results" delay={5} />
          <SectionTitle
            text="Instant, actionable insights"
            delay={10}
            size={fontSize["3xl"]}
          />
          <SpringFadeIn delay={20} direction="up">
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: fontSize.lg,
                color: colors.whiteAlpha75,
                lineHeight: 1.6,
              }}
            >
              A Protection Score of 32 signals high risk. Each abusive clause is
              flagged with severity, plain-language explanation, and the specific
              legal article it violates.
            </div>
          </SpringFadeIn>
        </div>

        {/* Right: MockPhone with results */}
        <SpringFadeIn delay={5} direction="right" distance={40}>
          <MockPhone scale={0.85}>
            <MockNavbar scale={0.85} />
            <div
              style={{
                padding: "12px",
                overflow: "hidden",
                height: "100%",
              }}
            >
              {/* Doc title */}
              <div
                style={{
                  textAlign: "center",
                  fontFamily: fonts.heading,
                  fontSize: 14,
                  fontWeight: 700,
                  color: colors.baseContent,
                  marginBottom: 4,
                }}
              >
                {demoDocTitle}
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontFamily: fonts.body,
                  fontSize: 10,
                  color: `${colors.baseContent}80`,
                  marginBottom: 12,
                }}
              >
                Termos de Serviço
              </div>

              {/* Score gauge */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                <MockScoreGauge
                  score={32}
                  startFrame={15}
                  duration={40}
                  size={100}
                />
              </div>

              {/* Clause section title */}
              <div
                style={{
                  fontFamily: fonts.heading,
                  fontSize: 12,
                  fontWeight: 700,
                  color: colors.error,
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <svg width={14} height={14} viewBox="0 0 24 24" fill={colors.error}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                Cláusulas Abusivas
              </div>

              {/* Clause cards */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {demoClauses.map((clause, i) => (
                  <MockClauseCard
                    key={clause.id}
                    severity={clause.severity}
                    legalRef={clause.legalRef}
                    explanation={clause.explanation}
                    delay={60 + i * 20}
                    scale={0.85}
                  />
                ))}
              </div>

              {/* Audio player */}
              <div style={{ marginTop: 10 }}>
                <MockAudioPlayer startFrame={130} scale={0.85} />
              </div>

              {/* QA panel */}
              <div style={{ marginTop: 8 }}>
                <MockQAPanel startFrame={145} scale={0.85} />
              </div>
            </div>
          </MockPhone>
        </SpringFadeIn>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Main Scene04Demo — sequences the three sub-scenes
export const Scene04Demo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={360}>
        <Scene4aInput />
      </Sequence>
      <Sequence from={360} durationInFrames={240}>
        <Scene4bProcessing />
      </Sequence>
      <Sequence from={600} durationInFrames={450}>
        <Scene4cResults />
      </Sequence>
    </AbsoluteFill>
  );
};
