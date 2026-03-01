import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors, fonts, fontSize } from "../design/tokens";
import { GradientBackground } from "../components/shared/GradientBackground";
import { SectionLabel } from "../components/shared/SectionLabel";
import { SectionTitle } from "../components/shared/SectionTitle";
import { PipelineNode } from "../components/shared/PipelineNode";
import { PipelineArrow } from "../components/shared/PipelineArrow";
import { TechBadge } from "../components/shared/TechBadge";
import { pipelineAgents, techStack } from "../data/demo-data";

export const Scene07Technical: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <GradientBackground from="#0d1b2a" via="#0d1b2a" to="#132a3e" />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          padding: "0 80px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <SectionLabel text="Architecture" delay={5} />
          <div style={{ marginTop: 8 }}>
            <SectionTitle
              text="Multi-agent AI pipeline"
              delay={10}
              size={fontSize["3xl"]}
            />
          </div>
        </div>

        {/* Pipeline diagram */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
          }}
        >
          {pipelineAgents.map((agent, i) => (
            <React.Fragment key={agent.name}>
              <PipelineNode
                name={agent.name}
                description={agent.description}
                delay={20 + i * 15}
                isActive={frame > 20 + i * 15 + 10}
              />
              {i < pipelineAgents.length - 1 && (
                <PipelineArrow
                  startFrame={20 + i * 15 + 10}
                  duration={15}
                  width={70}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Tech stack badges */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          {techStack.map((tech, i) => (
            <TechBadge key={tech} text={tech} delay={80 + i * 5} />
          ))}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: fontSize.base,
            color: colors.whiteAlpha50,
            textAlign: "center",
          }}
        >
          Deployed on Cloudflare Workers for global edge performance
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
