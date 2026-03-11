import React, { useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Zap,
  Users,
  Search,
  RefreshCw,
  GraduationCap,
  Award,
  Briefcase,
  ChevronDown,
  MapPin,
  Calendar,
} from "lucide-react";
import { personalInfo, traits, education, certifications, experiences } from "../data/mock";

const iconMap = { Zap, Users, Search, RefreshCw };

const TraitCard = ({ trait, index }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = iconMap[trait.icon];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative p-6 rounded-2xl bg-[#0d0f1a] border border-[#1a1d2e] hover:border-[#00e5a0]/30 transition-all duration-500"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00e5a0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#00e5a0]/10 text-[#00e5a0] mb-4 group-hover:bg-[#00e5a0]/20 transition-colors">
          {Icon && <Icon size={22} />}
        </div>
        <h4 className="text-white font-semibold mb-2 font-space">{trait.title}</h4>
        <p className="text-sm text-[#64748b] leading-relaxed">{trait.description}</p>
      </div>
    </motion.div>
  );
};

const TimelineItem = ({ exp, index, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative pl-10 pb-10"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gradient-to-b from-[#00e5a0]/40 to-[#1a1d2e]" />
      )}
      {/* Timeline dot */}
      <motion.div
        className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#0d0f1a] border-2 border-[#00e5a0]/50 flex items-center justify-center"
        whileHover={{ scale: 1.2, borderColor: "#00e5a0" }}
      >
        <Briefcase size={14} className="text-[#00e5a0]" />
      </motion.div>

      <div
        className="group cursor-pointer p-5 rounded-xl bg-[#0d0f1a]/50 border border-[#1a1d2e] hover:border-[#00e5a0]/20 transition-all duration-300"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="text-white font-semibold font-space text-base">{exp.role}</h4>
            <p className="text-[#00e5a0] text-sm font-medium mt-1">{exp.company}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-[#64748b]">
              <span className="flex items-center gap-1">
                <Calendar size={11} /> {exp.period}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={11} /> {exp.location}
              </span>
            </div>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={18} className="text-[#64748b]" />
          </motion.div>
        </div>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <p className="text-sm text-[#94a3b8] leading-relaxed mb-3">{exp.description}</p>
            <div className="flex flex-wrap gap-2">
              {exp.highlights.map((h) => (
                <span
                  key={h}
                  className="px-2.5 py-1 text-xs rounded-md bg-[#00e5a0]/10 text-[#00e5a0] border border-[#00e5a0]/20"
                >
                  {h}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const About = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-24 lg:py-32" style={{ background: "#06060e" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[#00e5a0] text-sm font-mono tracking-wider uppercase">// About Me</span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mt-3 font-space">
            Who I Am
          </h2>
        </motion.div>

        {/* Story + Education */}
        <div className="grid lg:grid-cols-5 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <p className="text-lg text-[#94a3b8] leading-relaxed mb-6">
              {personalInfo.summary}
            </p>
            <p className="text-[#64748b] leading-relaxed">
              I thrive in collaborative environments and take pride in writing clean,
              well-documented code. My experience spans full-stack development, data management,
              UI/UX design, and teaching — giving me a well-rounded perspective on building
              digital products that truly serve users.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Education Card */}
            <div className="p-5 rounded-2xl bg-[#0d0f1a] border border-[#1a1d2e]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#38bdf8]/10 flex items-center justify-center">
                  <GraduationCap size={20} className="text-[#38bdf8]" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold font-space">{education.degree}</h4>
                  <p className="text-xs text-[#64748b]">{education.university}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-[#64748b]">
                <span>{education.period}</span>
                <span className="text-[#00e5a0] font-semibold">GPA: {education.gpa}</span>
              </div>
            </div>

            {/* Certification */}
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="p-5 rounded-2xl bg-[#0d0f1a] border border-[#1a1d2e]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#fbbf24]/10 flex items-center justify-center">
                    <Award size={20} className="text-[#fbbf24]" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-semibold font-space">{cert.name}</h4>
                    <p className="text-xs text-[#64748b]">{cert.issuer}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Traits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {traits.map((trait, i) => (
            <TraitCard key={trait.title} trait={trait} index={i} />
          ))}
        </div>

        {/* Experience Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-white mb-10 font-space">Experience Journey</h3>
          <div className="max-w-3xl">
            {experiences.map((exp, i) => (
              <TimelineItem
                key={exp.id}
                exp={exp}
                index={i}
                isLast={i === experiences.length - 1}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
