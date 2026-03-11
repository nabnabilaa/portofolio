import React, { useState } from "react";
import { motion, useInView } from "framer-motion";
import { Code, ShieldCheck, BarChart3, Wrench } from "lucide-react";
import { skills } from "../data/mock";

const categories = [
  {
    key: "programming",
    label: "Programming & Web",
    icon: Code,
    color: "#00e5a0",
    description: "Core languages and web technologies",
  },
  {
    key: "productQA",
    label: "Product & QA",
    icon: ShieldCheck,
    color: "#38bdf8",
    description: "Analysis, testing, and design process",
  },
  {
    key: "data",
    label: "Data & Reporting",
    icon: BarChart3,
    color: "#fbbf24",
    description: "Data analysis and visualization",
  },
  {
    key: "tools",
    label: "Tools & Platforms",
    icon: Wrench,
    color: "#a78bfa",
    description: "Development and collaboration tools",
  },
];

const SkillBar = ({ skill, color, delay }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <div ref={ref} className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-[#c8ccd4] font-medium">{skill.name}</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.5 }}
          className="text-xs font-mono"
          style={{ color }}
        >
          {skill.level}%
        </motion.span>
      </div>
      <div className="h-2 rounded-full bg-[#1a1d2e] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

const TiltCard = ({ children, className }) => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateX: (y - 0.5) * -10,
      rotateY: (x - 0.5) * 10,
    });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ rotateX: 0, rotateY: 0 })}
      animate={tilt}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Skills = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState("programming");

  const activeData = categories.find((c) => c.key === activeCategory);
  const activeSkills = skills[activeCategory] || [];

  return (
    <section
      id="skills"
      className="relative py-24 lg:py-32"
      style={{ background: "#080a14" }}
    >
      {/* Subtle bg pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,229,160,0.08) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[#00e5a0] text-sm font-mono tracking-wider uppercase">
            // Skills & Expertise
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mt-3 font-space">
            What I Bring
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Category Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.key;
              return (
                <TiltCard key={cat.key} className="h-full">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`w-full h-full text-left p-5 rounded-2xl border transition-all duration-500 ${
                      isActive
                        ? "bg-[#0d0f1a] border-[#00e5a0]/30"
                        : "bg-[#0d0f1a]/50 border-[#1a1d2e] hover:border-[#1a1d2e]/80"
                    }`}
                    style={{
                      boxShadow: isActive
                        ? `0 0 30px ${cat.color}15, inset 0 1px 0 ${cat.color}20`
                        : "none",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                      style={{ background: `${cat.color}15` }}
                    >
                      <Icon size={20} style={{ color: cat.color }} />
                    </div>
                    <h4 className="text-white text-sm font-semibold font-space mb-1">
                      {cat.label}
                    </h4>
                    <p className="text-xs text-[#64748b] leading-relaxed">
                      {cat.description}
                    </p>
                    {isActive && (
                      <motion.div
                        layoutId="activeSkillIndicator"
                        className="mt-3 h-0.5 rounded-full"
                        style={{ background: cat.color }}
                      />
                    )}
                  </motion.button>
                </TiltCard>
              );
            })}
          </div>

          {/* Skill Details */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7"
          >
            <div className="p-8 rounded-2xl bg-[#0d0f1a] border border-[#1a1d2e]">
              <div className="flex items-center gap-3 mb-8">
                {activeData && (
                  <>
                    <activeData.icon size={24} style={{ color: activeData.color }} />
                    <h3 className="text-xl font-bold text-white font-space">
                      {activeData.label}
                    </h3>
                  </>
                )}
              </div>
              {activeSkills.map((skill, i) => (
                <SkillBar
                  key={skill.name}
                  skill={skill}
                  color={activeData?.color || "#00e5a0"}
                  delay={i * 0.1}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
