"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useApp } from "@/contexts/AppContext";
import {
  IoLink,
  IoCamera,
  IoDocument,
  IoShieldCheckmark,
  IoFlash,
  IoDocumentText,
  IoScan,
  IoArrowForward,
  IoCheckmarkCircle,
  IoLockClosed,
  IoEye,
  IoPerson,
  IoBag,
  IoPencil,
  IoBuild,
  IoPeople,
} from "react-icons/io5";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function Home() {
  const router = useRouter();
  const { reset } = useApp();
  const { t } = useTranslation();

  const handleSelect = () => {
    reset();
    router.push("/analyze");
  };

  const profiles = [
    {
      icon: <IoPerson className="w-5 h-5" />,
      title: t("landing.profileElderly"),
      pain: t("landing.profileElderlyPain"),
      solution: t("landing.profileElderlySolution"),
    },
    {
      icon: <IoBag className="w-5 h-5" />,
      title: t("landing.profileWorker"),
      pain: t("landing.profileWorkerPain"),
      solution: t("landing.profileWorkerSolution"),
    },
    {
      icon: <IoPencil className="w-5 h-5" />,
      title: t("landing.profileStudent"),
      pain: t("landing.profileStudentPain"),
      solution: t("landing.profileStudentSolution"),
    },
    {
      icon: <IoBuild className="w-5 h-5" />,
      title: t("landing.profileEntrepreneur"),
      pain: t("landing.profileEntrepreneurPain"),
      solution: t("landing.profileEntrepreneurSolution"),
    },
    {
      icon: <IoPeople className="w-5 h-5" />,
      title: t("landing.profileCitizen"),
      pain: t("landing.profileCitizenPain"),
      solution: t("landing.profileCitizenSolution"),
    },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar
        variant="transparent"
        showNav
        navLinks={[
          { label: t("navbar.howItWorks"), href: "#how-it-works" },
          { label: t("navbar.forWhom"), href: "#profiles" },
        ]}
      />

      {/* ───── Hero ───── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_var(--tw-gradient-stops))] from-[#17677b] via-primary to-[#1f3549] opacity-95" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-secondary bg-white/10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/10 mb-8"
            >
              <IoShieldCheckmark />
              {t("landing.heroBadge")}
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              {t("common.brandName")}
            </h1>
            <h5 className="text-1xl md:text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-6">
              {t("landing.heroSubtitle")}
            </h5>

            <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("landing.heroBody")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="btn btn-secondary btn-lg gap-2 rounded-2xl"
                onClick={handleSelect}
              >
                {t("landing.heroCta")}
                <IoArrowForward />
              </button>
              <a
                href="#how-it-works"
                className="btn btn-outline btn-lg rounded-2xl"
              >
                {t("landing.heroSecondary")}
              </a>
            </div>
          </div>
          <div className="mt-32 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary">
                  60M+
                </div>
                <p className="text-sm text-white/60">{t("landing.statBeneficiarios")}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary">
                  150M+
                </div>
                <p className="text-sm text-white/60">{t("landing.statSus")}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary">
                  80M+
                </div>
                <p className="text-sm text-white/60">{t("landing.statProcessos")}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary">
                  156M+
                </div>
                <p className="text-sm text-white/60">{t("landing.statInternet")}</p>
              </div>
            </div>
          </div>

          {/* Floating Mouse Scroll Indicator */}
          <motion.div
            className="flex justify-center mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.a
              href="#how-it-works"
              className="flex flex-col items-center cursor-pointer"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Mouse Icon */}
              <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center mb-2">
                <motion.div
                  className="w-1 h-2 bg-white/60 rounded-full mt-2"
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
              <p className="text-xs text-white/50 font-medium">{t("landing.scroll")}</p>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ───── How it works ───── */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              {t("landing.howTitle")}
            </h2>
            <p className="text-base-content/60 max-w-xl mx-auto">
              {t("landing.howSubtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* PASSO 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 * 0.15, duration: 0.5 }}
              className="text-center group"
            >
              <div className="relative inline-flex mb-6 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                <div className="w-20 h-20 rounded-3xl bg-[#5A8B9A] flex items-center justify-center shadow-lg">
                  <div className="flex gap-1">
                    <IoLink className="text-2xl text-white" />
                  </div>
                </div>
              </div>
              <div className="mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {t("landing.step1Label")}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {t("landing.step1Title")}
              </h3>
              <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                {t("landing.step1Desc")}
              </p>
            </motion.div>

            {/* PASSO 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 * 0.15, duration: 0.5 }}
              className="text-center group"
            >
              <div className="relative inline-flex mb-6 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                <div className="w-20 h-20 rounded-3xl bg-[#E6A947] flex items-center justify-center shadow-lg">
                  <IoDocumentText className="text-2xl text-white" />
                </div>
              </div>
              <div className="mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {t("landing.step2Label")}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {t("landing.step2Title")}
              </h3>
              <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                {t("landing.step2Desc")}
              </p>
            </motion.div>

            {/* PASSO 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2 * 0.15, duration: 0.5 }}
              className="text-center group"
            >
              <div className="relative inline-flex mb-6 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                <div className="w-20 h-20 rounded-3xl bg-[#6FAA75] flex items-center justify-center shadow-lg">
                  <IoShieldCheckmark className="text-2xl text-white" />
                </div>
              </div>
              <div className="mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {t("landing.step3Label")}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {t("landing.step3Title")}
              </h3>
              <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                {t("landing.step3Desc")}
              </p>
            </motion.div>

            {/* PASSO 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 3 * 0.15, duration: 0.5 }}
              className="text-center group"
            >
              <div className="relative inline-flex mb-6 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                <div className="w-20 h-20 rounded-3xl bg-[#5A8B9A] flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8C19.66,8 21,6.66 21,5C21,3.34 19.66,2 18,2C16.34,2 15,3.34 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9C4.34,9 3,10.34 3,12C3,13.66 4.34,15 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.92 18,21.92C19.61,21.92 20.92,20.61 20.92,19C20.92,17.39 19.61,16.08 18,16.08Z" />
                  </svg>
                </div>
              </div>
              <div className="mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {t("landing.step4Label")}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {t("landing.step4Title")}
              </h3>
              <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                {t("landing.step4Desc")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── Profile cards ───── */}
      <section id="profiles" className="py-24 bg-muted/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-base-content/60 max-w-xl mx-auto text-secondary">
              {t("landing.audienceLabel")}
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 ">
              {t("landing.audienceTitle")}
            </h2>
            <p className="text-base-content/60 max-w-xl mx-auto">
              {t("landing.audienceSubtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {profiles.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-primary/5 rounded-2xl p-6 shadow-soft hover:shadow-medium transition-shadow duration-300 "
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {p.icon}
                </div>
                <h3 className="font-display text-lg text-foreground mb-3">
                  {p.title}
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-destructive/80 font-body">
                    <span className="font-semibold text-red-500">{t("landing.pain")}</span>{" "}
                    {p.pain}
                  </p>
                  <p className="text-sm  font-body">
                    <span className="font-semibold text-green-500">
                      {t("landing.solution")}
                    </span>{" "}
                    {p.solution}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Features ───── */}
      <section id="features" className="py-20 px-6 bg-base-200/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              {t("landing.featuresTitle")}
            </h2>
            <p className="text-base-content/60 max-w-2xl mx-auto">
              {t("landing.featuresSubtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 * 0.1 }}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="card-body">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <IoFlash className="text-2xl text-primary" />
                </div>
                <h3 className="card-title text-lg">{t("landing.featureSimple")}</h3>
                <p className="text-sm text-base-content/60">
                  {t("landing.featureSimpleDesc")}
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 * 0.1 }}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="card-body">
                <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center mb-2">
                  <IoShieldCheckmark className="text-2xl text-error" />
                </div>
                <h3 className="card-title text-lg">
                  {t("landing.featureAbusive")}
                </h3>
                <p className="text-sm text-base-content/60">
                  {t("landing.featureAbusiveDesc")}
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2 * 0.1 }}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="card-body">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-2">
                  <IoDocumentText className="text-2xl text-warning" />
                </div>
                <h3 className="card-title text-lg">{t("landing.featureLegal")}</h3>
                <p className="text-sm text-base-content/60">
                  {t("landing.featureLegalDesc")}
                </p>
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 3 * 0.1 }}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="card-body">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-2">
                  <IoScan className="text-2xl text-secondary" />
                </div>
                <h3 className="card-title text-lg">{t("landing.featureOcr")}</h3>
                <p className="text-sm text-base-content/60">
                  {t("landing.featureOcrDesc")}
                </p>
              </div>
            </motion.div>

            {/* Card 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 4 * 0.1 }}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="card-body">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-2">
                  <IoLockClosed className="text-2xl text-success" />
                </div>
                <h3 className="card-title text-lg">{t("landing.featurePrivacy")}</h3>
                <p className="text-sm text-base-content/60">
                  {t("landing.featurePrivacyDesc")}
                </p>
              </div>
            </motion.div>

            {/* Card 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 5 * 0.1 }}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="card-body">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-2">
                  <IoEye className="text-2xl text-accent" />
                </div>
                <h3 className="card-title text-lg">{t("landing.featureScore")}</h3>
                <p className="text-sm text-base-content/60">
                  {t("landing.featureScoreDesc")}
                </p>
              </div>
            </motion.div>
          </div>
          {/* Mockup preview card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-16 max-w-2xl mx-auto"
          >
            <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-3 h-3 rounded-full bg-error" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-xs text-base-content/40 ml-2">
                  {t("landing.mockupStatus")}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-error/5 border border-error/20 rounded-lg">
                  <span className="badge badge-error badge-sm">{t("landing.mockupHigh")}</span>
                  <span className="text-sm font-medium flex-1">
                    {t("landing.mockupClause1")}
                  </span>
                  <span className="text-xs text-error hidden sm:inline">
                    Art. 51 CDC
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-error/5 border border-error/20 rounded-lg">
                  <span className="badge badge-error badge-sm">{t("landing.mockupHigh")}</span>
                  <span className="text-sm font-medium flex-1">
                    {t("landing.mockupClause2")}
                  </span>
                  <span className="text-xs text-error hidden sm:inline">
                    LGPD
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-warning/5 border border-warning/20 rounded-lg">
                  <span className="badge badge-warning badge-sm">{t("landing.mockupMedium")}</span>
                  <span className="text-sm font-medium flex-1">
                    {t("landing.mockupClause3")}
                  </span>
                  <span className="text-xs text-warning hidden sm:inline">
                    Art. 51 CDC
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-success/5 border border-success/20 rounded-lg">
                  <span className="badge badge-success badge-sm">{t("landing.mockupLow")}</span>
                  <span className="text-sm font-medium flex-1">
                    {t("landing.mockupClause4")}
                  </span>
                  <span className="text-xs text-success hidden sm:inline">
                    Art. 101 CDC
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───── Stats / Protection ───── */}
      <section
        id="protection"
        className="py-20 px-6 bg-[linear-gradient(45deg,_var(--tw-gradient-stops))] from-[#276c7f] via-[#578686] to-[#2b4355] opacity-95 text-white"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              {t("landing.statsTitle")}
            </h2>
            <p className="text-white/70 max-w-xl mx-auto">
              {t("landing.statsSubtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-extrabold mb-2">
                50+
              </div>
              <p className="text-sm text-white/70">
                {t("landing.statCdc")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-extrabold mb-2">
                100%
              </div>
              <p className="text-sm text-white/70">{t("landing.statPrivacy")}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2 * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-extrabold mb-2">3</div>
              <p className="text-sm text-white/70">{t("landing.statMethods")}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 3 * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-extrabold mb-2">
                &lt;30s
              </div>
              <p className="text-sm text-white/70">{t("landing.statTime")}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── Get Started / CTA ───── */}
      <section id="get-started" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              {t("landing.ctaTitle")}
            </h2>
            <p className="text-base-content/60 max-w-xl mx-auto">
              {t("landing.ctaSubtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* URL */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 * 0.15 }}
              className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-base-200 text-left"
              onClick={handleSelect}
            >
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                  <IoLink className="text-3xl text-primary" />
                </div>
                <h3 className="card-title text-lg">{t("landing.ctaUrl")}</h3>
                <p className="text-sm text-base-content/60">
                  {t("landing.ctaUrlDesc")}
                </p>
                <div className="card-actions mt-4">
                  <span className="btn btn-primary btn-sm gap-1">
                    {t("landing.ctaStart")} <IoArrowForward />
                  </span>
                </div>
              </div>
            </motion.button>

            {/* Camera */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 * 0.15 }}
              className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-base-200 text-left"
              onClick={handleSelect}
            >
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-2">
                  <IoCamera className="text-3xl text-secondary" />
                </div>
                <h3 className="card-title text-lg">{t("landing.ctaCamera")}</h3>
                <p className="text-sm text-base-content/60">
                  {t("landing.ctaCameraDesc")}
                </p>
                <div className="card-actions mt-4">
                  <span className="btn btn-secondary btn-sm gap-1">
                    {t("landing.ctaStart")} <IoArrowForward />
                  </span>
                </div>
              </div>
            </motion.button>

            {/* Upload */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2 * 0.15 }}
              className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-base-200 text-left"
              onClick={handleSelect}
            >
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-2">
                  <IoDocument className="text-3xl text-accent" />
                </div>
                <h3 className="card-title text-lg">{t("landing.ctaFile")}</h3>
                <p className="text-sm text-base-content/60">
                  {t("landing.ctaFileDesc")}
                </p>
                <div className="card-actions mt-4">
                  <span className="btn btn-accent btn-sm gap-1">
                    {t("landing.ctaStart")} <IoArrowForward />
                  </span>
                </div>
              </div>
            </motion.button>
          </div>

          <p className="text-center text-xs text-base-content/40 mt-8">
            {t("landing.ctaDisclaimer")}
          </p>
        </div>
      </section>
    </div>
  );
}
