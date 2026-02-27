"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Box, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex-center" style={{ minHeight: '90vh', padding: '120px 0' }}>
        {/* Background Decorative Blobs */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 60%)', filter: 'blur(100px)', zIndex: -1 }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(227, 163, 110, 0.15) 0%, transparent 60%)', filter: 'blur(120px)', zIndex: -1 }}></div>

        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp} style={{ display: 'inline-block', padding: '0.5rem 1rem', border: 'var(--border-glass)', borderRadius: 'var(--border-radius-pill)', marginBottom: '1.5rem', fontSize: '0.875rem' }} className="glass-panel text-subtle">
              <span className="text-gradient" style={{ fontWeight: '600' }}>Leading Copper Manufacturers</span> based in Surat
            </motion.div>

            <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', marginBottom: '1.5rem', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Precision Crafted <br />
              <span className="text-gradient">Premium Copper</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="subtitle" style={{ marginBottom: '2.5rem' }}>
              Specializing in high-purity copper cathodes, scrap, sheets, and rods.
              Delivering unmatched quality for industrial and electronic applications worldwide.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/products" className="btn-primary">
                Explore Products <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="btn-secondary">
                Request Inquiry
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Video/Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            style={{ position: 'relative' }}
          >
            <div className="glass-panel" style={{ aspectRatio: '4/3', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Replace with actual video or image later */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, #fcfcfc, #fdf4ed)' }}></div>
              <div className="text-subtle" style={{ zIndex: 1, textAlign: 'center', padding: '2rem' }}>
                <Box size={48} style={{ margin: '0 auto 1rem auto', color: 'var(--color-accent-primary)', opacity: 0.8 }} />
                <p>High-Quality Factory Video / Image Placeholder</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>(Dimensions: 800x600px)</p>
              </div>
            </div>
            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="glass-panel"
              style={{ position: 'absolute', bottom: '-20px', left: '-20px', padding: '1rem 1.5rem', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <div style={{ background: 'var(--color-accent-glow)', padding: '0.5rem', borderRadius: '50%' }}>
                <ShieldCheck size={24} color="var(--color-accent-primary)" />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '1.125rem' }}>99.9%</p>
                <p className="text-subtle" style={{ fontSize: '0.75rem' }}>Purity Guaranteed</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="section-title">Why Choose <span className="text-gradient">Mona Industry</span></h2>
            <p className="subtitle" style={{ margin: '0 auto' }}>Decades of expertise in copper manufacturing and processing.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { icon: <ShieldCheck size={32} />, title: "Uncompromising Quality", desc: "Rigorous quality control ensuring 99.9% purity across our product range." },
              { icon: <Box size={32} />, title: "32+ Specialized Products", desc: "A comprehensive catalog of copper materials fitting various industrial needs." },
              { icon: <Zap size={32} />, title: "Rapid Fulfillment", desc: "Efficient logistics network based in Surat, guaranteeing timely deliveries." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel"
                style={{ padding: '2.5rem', borderRadius: 'var(--border-radius-md)', transition: 'transform 0.3s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ color: 'var(--color-accent-primary)', marginBottom: '1.5rem' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{feature.title}</h3>
                <p className="text-subtle" style={{ lineHeight: '1.6' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel"
          style={{ padding: '5rem 2rem', borderRadius: 'var(--border-radius-lg)', textAlign: 'center', background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(184,115,51,0.05) 100%)', border: '1px solid var(--color-accent-glow)' }}
        >
          <h2 className="section-title text-gradient">Ready to Source the Best?</h2>
          <p className="subtitle" style={{ margin: '0 auto 2.5rem auto' }}>
            Browse our comprehensive catalog of 32 specialized copper products or contact our team for bulk inquiries.
          </p>
          <div className="flex-center" style={{ gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/products" className="btn-primary" style={{ padding: '1rem 2rem' }}>
              View Catalog
            </Link>
            <Link href="/contact" className="btn-secondary" style={{ padding: '1rem 2rem' }}>
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
