import React from "react";
import { motion } from "framer-motion";
import { Heart, Code } from "lucide-react";
import { personalInfo } from "../data/mock";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 bg-[#0d0f1a] border-t border-[#1a1d2e]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-white font-space">
              {personalInfo.firstName}
              <span className="text-[#00e5a0]">.</span>
            </h3>
            <p className="text-[#64748b] text-sm mt-2">
              {personalInfo.role} & {personalInfo.subtitle}
            </p>
            <p className="text-[#64748b] text-xs mt-3 leading-relaxed">
              Crafting beautiful, functional web experiences with clean code and
              creative thinking.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-white mb-4 font-space">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "About", href: "#about" },
                { label: "Skills", href: "#skills" },
                { label: "Projects", href: "#projects" },
                { label: "Game", href: "#game" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() =>
                      document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-[#64748b] text-sm hover:text-[#00e5a0] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-white mb-4 font-space">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="text-[#64748b] text-sm hover:text-[#00e5a0] transition-colors"
                >
                  {personalInfo.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/628885169997`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#64748b] text-sm hover:text-[#00e5a0] transition-colors"
                >
                  {personalInfo.phone}
                </a>
              </li>
              <li>
                <p className="text-[#64748b] text-sm">{personalInfo.location}</p>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#1a1d2e] to-transparent mb-8" />

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-[#64748b] text-xs text-center md:text-left">
            © {currentYear}{" "}
            <span className="text-[#00e5a0] font-semibold">{personalInfo.name}</span>. All rights
            reserved.
          </p>

          <div className="flex items-center gap-1 text-xs text-[#64748b]">
            <span>Crafted with</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              <Heart size={12} className="text-[#00e5a0]" />
            </motion.span>
            <span>using</span>
            <Code size={12} className="text-[#00e5a0]" />
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
