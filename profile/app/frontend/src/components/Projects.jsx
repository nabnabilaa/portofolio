import React, { useState } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { projects } from "../data/mock";

const ProjectCard = ({ project, index }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setHoveredId(project.id)}
      onMouseLeave={() => setHoveredId(null)}
      className="group relative overflow-hidden rounded-2xl"
    >
      {/* Background with gradient */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, ${project.color}15, ${project.color}05)` }}
      />

      {/* Border gradient */}
      <div className="absolute inset-0 rounded-2xl border border-[#1a1d2e] group-hover:border-[#00e5a0]/30 transition-colors duration-300" />

      {/* Content */}
      <div className="relative p-6 md:p-8 h-full flex flex-col justify-between min-h-[400px]">
        {/* Top Section */}
        <div>
          {/* Color Indicator */}
          <div
            className="w-2 h-8 rounded-full mb-4 group-hover:h-12 transition-all duration-300"
            style={{ background: project.color }}
          />

          {/* Title & Description */}
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 font-space">
            {project.title}
          </h3>
          <p className="text-[#94a3b8] text-sm md:text-base leading-relaxed mb-5">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs rounded-md bg-[#0d0f1a] border border-[#1a1d2e] text-[#64748b] group-hover:border-[#00e5a0]/20 group-hover:text-[#00e5a0] transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Section - Category Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={hoveredId === project.id ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-lg border transition-colors"
          style={{
            borderColor: hoveredId === project.id ? project.color : "#1a1d2e",
            background: hoveredId === project.id ? `${project.color}10` : "transparent",
          }}
        >
          <span className="text-xs font-medium" style={{ color: project.color }}>
            {project.category}
          </span>
          <ArrowUpRight size={12} style={{ color: project.color }} />
        </motion.div>
      </div>

      {/* Hover Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={hoveredId === project.id ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/40 rounded-2xl pointer-events-none"
      />
    </motion.div>
  );
};

const Projects = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", ...new Set(projects.map((p) => p.category))];
  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section
      id="projects"
      className="relative py-24 lg:py-32"
      style={{ background: "#06060e" }}
    >
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-10 blur-[120px]"
          style={{ background: "#00e5a0", bottom: 0, right: "-10%" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[#00e5a0] text-sm font-mono tracking-wider uppercase">
            // Portfolio & Projects
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mt-3 font-space">
            What I've Built
          </h2>
          <p className="text-[#64748b] text-lg mt-4 max-w-2xl">
            A collection of projects that showcase my expertise in full-stack development,
            system design, and problem-solving across different domains.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-[#00e5a0] text-[#06060e]"
                  : "bg-[#0d0f1a] text-[#94a3b8] border border-[#1a1d2e] hover:border-[#00e5a0]/30"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <motion.div layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Empty state or placeholder */}
          </motion.div>

          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-[#64748b] text-lg">No projects found in this category.</p>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 p-8 md:p-12 rounded-2xl border border-[#1a1d2e] bg-[#0d0f1a]/50 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-3 font-space">Want to see more?</h3>
          <p className="text-[#94a3b8] mb-6 max-w-2xl mx-auto">
            Check out my GitHub for more projects, open-source contributions, and ongoing work.
          </p>
          <motion.a
            href="https://github.com/nabilamelsyana"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00e5a0] text-[#06060e] font-semibold rounded-lg hover:bg-[#00cc8e] transition-colors"
          >
            <Github size={18} />
            Visit My GitHub
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
