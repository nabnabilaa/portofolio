import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Linkedin, Github } from "lucide-react";
import { personalInfo, socialLinks } from "../data/mock";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);

      // Reset after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    }, 1200);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm text-[#94a3b8] mb-2 font-medium">Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-lg bg-[#0d0f1a] border border-[#1a1d2e] text-white placeholder-[#64748b] focus:outline-none focus:border-[#00e5a0]/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-[#94a3b8] mb-2 font-medium">Your Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
            className="w-full px-4 py-3 rounded-lg bg-[#0d0f1a] border border-[#1a1d2e] text-white placeholder-[#64748b] focus:outline-none focus:border-[#00e5a0]/50 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-[#94a3b8] mb-2 font-medium">Subject</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          placeholder="Project Inquiry"
          className="w-full px-4 py-3 rounded-lg bg-[#0d0f1a] border border-[#1a1d2e] text-white placeholder-[#64748b] focus:outline-none focus:border-[#00e5a0]/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-[#94a3b8] mb-2 font-medium">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="5"
          placeholder="Tell me about your project or opportunity..."
          className="w-full px-4 py-3 rounded-lg bg-[#0d0f1a] border border-[#1a1d2e] text-white placeholder-[#64748b] focus:outline-none focus:border-[#00e5a0]/50 transition-colors resize-none"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#00e5a0] text-[#06060e] font-semibold rounded-lg hover:bg-[#00cc8e] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-4 h-4 border-2 border-[#06060e] border-t-transparent rounded-full"
            />
            Sending...
          </>
        ) : (
          <>
            <Send size={18} />
            Send Message
          </>
        )}
      </motion.button>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-4 rounded-lg bg-[#00e5a0]/10 border border-[#00e5a0]/30 text-[#00e5a0] text-sm"
        >
          ✓ Thanks for reaching out! I'll get back to you soon.
        </motion.div>
      )}
    </motion.form>
  );
};

const Contact = () => {
  return (
    <section
      id="contact"
      className="relative py-24 lg:py-32"
      style={{ background: "#06060e" }}
    >
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-10 blur-[120px]"
          style={{ background: "#38bdf8", bottom: "-20%", left: "-10%" }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[120px]"
          style={{ background: "#00e5a0", top: "-10%", right: "-5%" }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="text-[#00e5a0] text-sm font-mono tracking-wider uppercase">
            // Get In Touch
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mt-3 font-space">
            Let's Create Something Amazing
          </h2>
          <p className="text-[#64748b] text-lg mt-4 max-w-2xl mx-auto">
            Whether you have a project in mind, want to collaborate, or just want to chat about tech,
            I'd love to hear from you!
          </p>
        </motion.div>

        {/* Contact Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info - Email */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-[#0d0f1a] border border-[#1a1d2e] hover:border-[#00e5a0]/30 transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-[#00e5a0]/10 flex items-center justify-center mb-4 group-hover:bg-[#00e5a0]/20 transition-colors">
              <Mail className="text-[#00e5a0]" size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2 font-space">Email</h4>
            <p className="text-[#64748b] mb-4">Send me an email and I'll get back to you ASAP.</p>
            <a
              href={socialLinks.email}
              className="text-[#00e5a0] font-semibold hover:text-[#00cc8e] transition-colors"
            >
              {personalInfo.email}
            </a>
          </motion.div>

          {/* Contact Info - Phone */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-[#0d0f1a] border border-[#1a1d2e] hover:border-[#38bdf8]/30 transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-[#38bdf8]/10 flex items-center justify-center mb-4 group-hover:bg-[#38bdf8]/20 transition-colors">
              <Phone className="text-[#38bdf8]" size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2 font-space">Phone</h4>
            <p className="text-[#64748b] mb-4">Call or WhatsApp me anytime – I'm happy to chat!</p>
            <a
              href={`https://wa.me/628885169997`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#38bdf8] font-semibold hover:text-[#0ea5e9] transition-colors"
            >
              {personalInfo.phone}
            </a>
          </motion.div>

          {/* Contact Info - Location */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-[#0d0f1a] border border-[#1a1d2e] hover:border-[#fbbf24]/30 transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-[#fbbf24]/10 flex items-center justify-center mb-4 group-hover:bg-[#fbbf24]/20 transition-colors">
              <MapPin className="text-[#fbbf24]" size={24} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2 font-space">Location</h4>
            <p className="text-[#64748b] mb-4">Based in Jakarta, but open to collaboration worldwide.</p>
            <p className="text-[#fbbf24] font-semibold">{personalInfo.location}</p>
          </motion.div>
        </div>

        {/* Form & Social */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <ContactForm />
          </div>

          {/* Social Links & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col justify-between"
          >
            {/* Social Links */}
            <div>
              <h4 className="text-xl font-bold text-white mb-6 font-space">Connect With Me</h4>
              <div className="flex flex-wrap gap-4 mb-10">
                <motion.a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-lg bg-[#0d0f1a] border border-[#1a1d2e] flex items-center justify-center text-[#94a3b8] hover:text-[#0ea5e9] hover:border-[#0ea5e9]/30 transition-colors"
                >
                  <Linkedin size={20} />
                </motion.a>

                <motion.a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-lg bg-[#0d0f1a] border border-[#1a1d2e] flex items-center justify-center text-[#94a3b8] hover:text-[#00e5a0] hover:border-[#00e5a0]/30 transition-colors"
                >
                  <Github size={20} />
                </motion.a>

                <motion.a
                  href={socialLinks.email}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-lg bg-[#0d0f1a] border border-[#1a1d2e] flex items-center justify-center text-[#94a3b8] hover:text-[#fbbf24] hover:border-[#fbbf24]/30 transition-colors"
                >
                  <Mail size={20} />
                </motion.a>
              </div>
            </div>

            {/* Fun Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-gradient-to-br from-[#00e5a0]/10 to-[#38bdf8]/10 border border-[#1a1d2e]"
            >
              <h5 className="text-lg font-bold text-white mb-3 font-space">
                💡 Quick Response Time
              </h5>
              <p className="text-[#94a3b8] text-sm leading-relaxed">
                I typically respond to messages within 24 hours. Whether it's a project inquiry,
                collaboration opportunity, or just a friendly hello, I'm always excited to connect!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
