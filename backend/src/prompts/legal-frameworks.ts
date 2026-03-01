import type { SupportedCountry } from "../types";

export interface LegalFramework {
  country: SupportedCountry;
  language: string;
  languageInstruction: string;
  consumerProtection: {
    primaryLaw: string;
    additionalLaws: string[];
    agency: string;
    keyArticles: string[];
  };
  dataPrivacy: {
    primaryLaw: string;
    additionalLaws: string[];
    agency: string;
  };
  internetDigital: {
    primaryLaw: string;
    additionalLaws: string[];
  };
  contracts: {
    primaryLaw: string;
    additionalLaws: string[];
  };
  employment: {
    primaryLaw: string;
    laborCourt: string;
  };
  housing: {
    primaryLaw: string;
  };
  scamReporting: Array<{
    agency: string;
    description: string;
    contact: string;
    url: string;
  }>;
  documentTypes: Record<string, string>;
  citizenReference: string;
}

const BR_FRAMEWORK: LegalFramework = {
  country: "BR",
  language: "pt-BR",
  languageInstruction: "Responda em Português Brasileiro.",
  consumerProtection: {
    primaryLaw: "Código de Defesa do Consumidor (CDC - Lei 8.078/90)",
    additionalLaws: [
      "Decreto 7.962/13 (comércio eletrônico)",
      "Lei 14.181/21 (superendividamento)",
    ],
    agency: "Procon",
    keyArticles: [
      "Art. 6° (direitos básicos)",
      "Art. 39 (práticas abusivas)",
      "Art. 46 (transparência contratual)",
      "Art. 51 (cláusulas abusivas)",
    ],
  },
  dataPrivacy: {
    primaryLaw: "Lei Geral de Proteção de Dados (LGPD - Lei 13.709/18)",
    additionalLaws: ["Marco Civil da Internet (Lei 12.965/14)"],
    agency: "ANPD (Autoridade Nacional de Proteção de Dados)",
  },
  internetDigital: {
    primaryLaw: "Marco Civil da Internet (Lei 12.965/14)",
    additionalLaws: ["Lei de Crimes Cibernéticos (Lei 12.737/12)"],
  },
  contracts: {
    primaryLaw: "Código Civil (Lei 10.406/02)",
    additionalLaws: ["CPC (Lei 13.105/15)"],
  },
  employment: {
    primaryLaw: "CLT (Decreto-Lei 5.452/43)",
    laborCourt: "Justiça do Trabalho",
  },
  housing: {
    primaryLaw: "Lei do Inquilinato (Lei 8.245/91)",
  },
  scamReporting: [
    { agency: "Procon", description: "Defesa do consumidor", contact: "151", url: "https://www.procon.sp.gov.br" },
    { agency: "Polícia Civil", description: "Delegacia de crimes cibernéticos", contact: "197", url: "" },
    { agency: "Banco Central", description: "Denúncias envolvendo Pix e bancos", contact: "145", url: "https://www.bcb.gov.br" },
    { agency: "SaferNet Brasil", description: "Crimes na internet", contact: "https://new.safernet.org.br/denuncie", url: "https://new.safernet.org.br" },
  ],
  documentTypes: {
    termos_de_uso: "Termos de Uso",
    contrato: "Contrato",
    notificacao_judicial: "Notificação Judicial",
    carta_inss: "Carta do INSS",
    mensagem_suspeita: "Mensagem Suspeita",
    outro: "Outro",
  },
  citizenReference: "cidadão brasileiro",
};

const US_FRAMEWORK: LegalFramework = {
  country: "US",
  language: "en-US",
  languageInstruction: "Respond in American English.",
  consumerProtection: {
    primaryLaw: "FTC Act (15 U.S.C. §§ 41-58)",
    additionalLaws: [
      "State UDAP (Unfair and Deceptive Acts and Practices) laws",
      "Magnuson-Moss Warranty Act (15 U.S.C. §§ 2301-2312)",
      "Truth in Lending Act (TILA)",
    ],
    agency: "Federal Trade Commission (FTC)",
    keyArticles: [
      "Section 5 (unfair or deceptive acts)",
      "State consumer protection statutes",
    ],
  },
  dataPrivacy: {
    primaryLaw: "California Consumer Privacy Act (CCPA/CPRA, Cal. Civ. Code §§ 1798.100-1798.199)",
    additionalLaws: [
      "Children's Online Privacy Protection Act (COPPA)",
      "Health Insurance Portability and Accountability Act (HIPAA)",
      "Gramm-Leach-Bliley Act (GLBA)",
      "State privacy laws (Virginia CDPA, Colorado CPA, Connecticut DPA, etc.)",
    ],
    agency: "FTC / State Attorneys General",
  },
  internetDigital: {
    primaryLaw: "Section 230 of the Communications Decency Act (47 U.S.C. § 230)",
    additionalLaws: [
      "Digital Millennium Copyright Act (DMCA)",
      "Computer Fraud and Abuse Act (CFAA)",
      "CAN-SPAM Act",
    ],
  },
  contracts: {
    primaryLaw: "Uniform Commercial Code (UCC)",
    additionalLaws: [
      "Restatement (Second) of Contracts",
      "State contract law",
    ],
  },
  employment: {
    primaryLaw: "Fair Labor Standards Act (FLSA, 29 U.S.C. §§ 201-219)",
    laborCourt: "Department of Labor / EEOC / State labor boards",
  },
  housing: {
    primaryLaw: "Fair Housing Act (42 U.S.C. §§ 3601-3619)",
  },
  scamReporting: [
    { agency: "Federal Trade Commission (FTC)", description: "Consumer fraud complaints", contact: "1-877-FTC-HELP", url: "https://reportfraud.ftc.gov" },
    { agency: "FBI Internet Crime Complaint Center (IC3)", description: "Internet-related crimes", contact: "https://www.ic3.gov", url: "https://www.ic3.gov" },
    { agency: "Better Business Bureau (BBB)", description: "Business complaints", contact: "https://www.bbb.org", url: "https://www.bbb.org" },
    { agency: "State Attorney General", description: "State-level consumer protection", contact: "Varies by state", url: "https://www.naag.org" },
  ],
  documentTypes: {
    termos_de_uso: "Terms of Service",
    contrato: "Contract",
    notificacao_judicial: "Court Notice",
    carta_inss: "Government Letter",
    mensagem_suspeita: "Suspicious Message",
    outro: "Other",
  },
  citizenReference: "consumer",
};

const FR_FRAMEWORK: LegalFramework = {
  country: "FR",
  language: "fr-FR",
  languageInstruction: "Répondez en français. Utilisez le vouvoiement.",
  consumerProtection: {
    primaryLaw: "Code de la consommation",
    additionalLaws: [
      "Loi Hamon (Loi n° 2014-344 du 17 mars 2014)",
      "Loi Chatel (Loi n° 2008-3 du 3 janvier 2008)",
    ],
    agency: "DGCCRF (Direction générale de la concurrence, de la consommation et de la répression des fraudes)",
    keyArticles: [
      "Art. L212-1 (clauses abusives)",
      "Art. L221-18 (droit de rétractation)",
      "Art. L111-1 (obligation d'information)",
    ],
  },
  dataPrivacy: {
    primaryLaw: "RGPD (Règlement Général sur la Protection des Données - Règlement UE 2016/679)",
    additionalLaws: [
      "Loi Informatique et Libertés (Loi n° 78-17 du 6 janvier 1978, modifiée)",
    ],
    agency: "CNIL (Commission Nationale de l'Informatique et des Libertés)",
  },
  internetDigital: {
    primaryLaw: "LCEN (Loi pour la Confiance dans l'Économie Numérique - Loi n° 2004-575)",
    additionalLaws: [
      "Loi n° 2022-309 du 3 mars 2022 (mise en conformité RGPD)",
    ],
  },
  contracts: {
    primaryLaw: "Code civil (Articles 1101 à 1231-7)",
    additionalLaws: [
      "Code de commerce",
    ],
  },
  employment: {
    primaryLaw: "Code du travail",
    laborCourt: "Conseil de prud'hommes",
  },
  housing: {
    primaryLaw: "Loi ALUR (Loi n° 2014-366 du 24 mars 2014) / Loi du 6 juillet 1989",
  },
  scamReporting: [
    { agency: "DGCCRF", description: "Signalement de pratiques commerciales trompeuses", contact: "0809 540 550", url: "https://signal.conso.gouv.fr" },
    { agency: "Signal-Spam", description: "Signalement de spam et phishing", contact: "https://www.signal-spam.fr", url: "https://www.signal-spam.fr" },
    { agency: "Pharos", description: "Signalement de contenus illicites en ligne", contact: "https://www.internet-signalement.gouv.fr", url: "https://www.internet-signalement.gouv.fr" },
    { agency: "CNIL", description: "Plaintes relatives à la protection des données", contact: "https://www.cnil.fr", url: "https://www.cnil.fr/fr/plaintes" },
  ],
  documentTypes: {
    termos_de_uso: "Conditions générales d'utilisation",
    contrato: "Contrat",
    notificacao_judicial: "Notification judiciaire",
    carta_inss: "Courrier administratif",
    mensagem_suspeita: "Message suspect",
    outro: "Autre",
  },
  citizenReference: "consommateur",
};

const FRAMEWORKS: Record<SupportedCountry, LegalFramework> = {
  BR: BR_FRAMEWORK,
  US: US_FRAMEWORK,
  FR: FR_FRAMEWORK,
};

export function getFramework(country: SupportedCountry): LegalFramework {
  return FRAMEWORKS[country] ?? BR_FRAMEWORK;
}

export function buildLawsReference(framework: LegalFramework): string {
  return `Consumer Protection: ${framework.consumerProtection.primaryLaw}
Data Privacy: ${framework.dataPrivacy.primaryLaw}
Internet/Digital: ${framework.internetDigital.primaryLaw}
Contracts: ${framework.contracts.primaryLaw}
Employment: ${framework.employment.primaryLaw}
Housing: ${framework.housing.primaryLaw}`;
}

export function buildScamReportingSection(framework: LegalFramework): string {
  return framework.scamReporting
    .map(
      (r) =>
        `- ${r.agency}: ${r.description} (${r.contact}${r.url ? ", " + r.url : ""})`
    )
    .join("\n");
}
