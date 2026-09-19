"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    ShieldCheck,
    Factory,
    Ruler,
    Gauge,
    PackageCheck,
    FileCheck2,
    Layers,
    Plug,
    Cable,
    Workflow,
    Magnet,
    CircleCheck,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import CableGraphic from '@/components/CableGraphic';
import { categories, productCount } from '@/lib/catalog';
import { company, stats, whatsappUrl } from '@/constants/company';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const categoryIcons = {
    'wires-cables': Cable,
    'enamelled-wire': Magnet,
    'power-cords': Plug,
    'wire-harnesses': Workflow,
};

const RANGE_WORDS = { 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six' };

const capabilities = [
    {
        icon: Ruler,
        title: 'Built to the written standard',
        desc: 'Every construction is made against a named specification — IS, IEC, JASO, EN or your own drawing — not against a generic house recipe.',
    },
    {
        icon: Gauge,
        title: 'Tested, then released',
        desc: 'Conductor resistance, spark, hipot and insulation resistance checks run on production lots, and every harness is electrically tested before packing.',
    },
    {
        icon: Factory,
        title: 'One roof, full control',
        desc: 'Drawing, stranding, extrusion, assembly and testing happen in the same plant, so a problem is traced back to its step instead of a supplier.',
    },
    {
        icon: PackageCheck,
        title: 'Documented dispatch',
        desc: 'Test certificates, drum schedules and batch traceability go out with the consignment, so your incoming inspection has something to check against.',
    },
];

const process = [
    { step: '01', title: 'Specification', desc: 'We review your drawing, standard or sample and confirm construction, compound and approvals in writing.' },
    { step: '02', title: 'First article', desc: 'A documented sample is produced and tested against the agreed specification before any series run is scheduled.' },
    { step: '03', title: 'Series production', desc: 'Lots run with in-line spark testing and dimensional checks, recorded against the batch.' },
    { step: '04', title: 'Test & dispatch', desc: 'Final electrical testing, certificates issued, packing and drum marking to your requirement.' },
];

const industries = [
    'Automotive & e-mobility',
    'Elevators & escalators',
    'Solar & renewables',
    'Data centres',
    'Process plants',
    'Appliance OEMs',
    'Machine builders',
    'Building & infrastructure',
];

export default function Home() {
    return (
        <div>
            {/* ---------- Hero ---------- */}
            <section className="section-deep" style={{ position: 'relative', overflow: 'hidden' }}>
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                            'radial-gradient(circle at 78% 18%, rgba(184,115,51,0.28) 0%, transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 40%)',
                    }}
                />
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.35,
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                        backgroundSize: '64px 64px',
                        maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.6), transparent 70%)',
                        WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.6), transparent 70%)',
                    }}
                />

                <div
                    className="container"
                    style={{
                        position: 'relative',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '4rem',
                        alignItems: 'center',
                        padding: '5.5rem 1.5rem 5rem',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span
                            className="badge"
                            style={{ background: 'rgba(184,115,51,0.16)', borderColor: 'rgba(184,115,51,0.35)', color: 'var(--copper-light)' }}
                        >
                            <ShieldCheck size={14} /> Manufacturing in Surat since {company.established}
                        </span>

                        <h1 className="display-title" style={{ margin: '1.5rem 0 1.25rem' }}>
                            Wires, cables and harnesses <br />
                            <span className="text-gradient">built to specification</span>
                        </h1>

                        <p className="subtitle" style={{ marginBottom: '2.25rem', color: 'rgba(255,255,255,0.76)', fontSize: '1.14rem' }}>
                            {productCount} standard product lines across automotive and industrial cable, elevator
                            travelling cable, solar and instrumentation cable, enamelled winding wire, approval-ready
                            power cords and build-to-print wire harnesses — each made against a named standard and
                            tested before it ships.
                        </p>

                        <div className="btn-row">
                            <Link href="/products" className="btn-primary">
                                View the catalogue <ArrowRight size={18} />
                            </Link>
                            <Link href="/contact" className="btn-secondary">
                                Request a quotation
                            </Link>
                        </div>

                        <ul
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.6rem 1.5rem',
                                marginTop: '2.5rem',
                                color: 'rgba(255,255,255,0.66)',
                                fontSize: '0.9rem',
                            }}
                        >
                            {['IS & IEC constructions', 'JASO / DIN automotive', 'EN 50618 solar', 'IPC/WHMA-A-620 harnessing'].map((item) => (
                                <li key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                                    <CircleCheck size={15} color="var(--copper-light)" /> {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        style={{ position: 'relative' }}
                    >
                        <div
                            style={{
                                border: '1px solid rgba(255,255,255,0.14)',
                                borderRadius: 'var(--radius-lg)',
                                background: 'rgba(255,255,255,0.04)',
                                padding: '2.25rem',
                            }}
                        >
                            <div style={{ maxWidth: 320, margin: '0 auto' }}>
                                <CableGraphic />
                            </div>
                            <ul
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                                    gap: '0.75rem',
                                    marginTop: '2rem',
                                    fontSize: '0.85rem',
                                    color: 'rgba(255,255,255,0.72)',
                                }}
                            >
                                {[
                                    { swatch: 'linear-gradient(140deg,#e8b98a,#8a5322)', label: 'Class 5 copper' },
                                    { swatch: 'linear-gradient(140deg,#f7ede3,#e6d3c1)', label: 'Insulation' },
                                    { swatch: 'linear-gradient(140deg,#1d3350,#0b1524)', label: 'Outer sheath' },
                                ].map((item) => (
                                    <li key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span
                                            aria-hidden="true"
                                            style={{ width: 12, height: 12, borderRadius: 3, background: item.swatch, flexShrink: 0 }}
                                        />
                                        {item.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ---------- Trust bar ---------- */}
            <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}>
                <div
                    className="container"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                        gap: '2rem',
                        padding: '2.75rem 1.5rem',
                    }}
                >
                    {stats.map((stat, i) => (
                        <Reveal key={stat.label} delay={i * 0.06}>
                            <p className="text-gradient" style={{ fontFamily: 'var(--font-display)', fontSize: '2.1rem', fontWeight: 800, lineHeight: 1 }}>
                                {stat.value}
                            </p>
                            <p className="text-subtle" style={{ marginTop: '0.5rem', fontSize: '0.92rem' }}>{stat.label}</p>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ---------- Product categories ---------- */}
            <section className="section">
                <div className="container">
                    <div className="section-head">
                        <span className="eyebrow">Product range</span>
                        <h2 className="section-title">{RANGE_WORDS[categories.length] || categories.length} lines, one supply chain</h2>
                        <p className="subtitle">
                            Winding wire, cable, cordsets and finished harnesses from the same plant — so a single
                            assembly can be specified, approved and shipped without coordinating several vendors.
                        </p>
                    </div>

                    <div className="grid grid-3">
                        {categories.map((category, i) => {
                            const Icon = categoryIcons[category.slug] || Layers;
                            const groups = category.nodes.filter((node) => node.type === 'group');
                            const singles = category.nodes.filter((node) => node.type === 'product');
                            const count = category.nodes.reduce(
                                (total, node) => total + (node.type === 'group' ? node.products.length : 1),
                                0
                            );

                            return (
                                <Reveal key={category.slug} delay={i * 0.08}>
                                    <Link href={`/products#${category.slug}`} style={{ display: 'block', height: '100%' }}>
                                        <article
                                            className="card card-pad card-hover"
                                            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                        >
                                            <span
                                                style={{
                                                    width: 46,
                                                    height: 46,
                                                    borderRadius: 12,
                                                    background: 'var(--copper-pale)',
                                                    color: 'var(--copper-dark)',
                                                    display: 'grid',
                                                    placeItems: 'center',
                                                    marginBottom: '1.25rem',
                                                }}
                                            >
                                                <Icon size={22} />
                                            </span>

                                            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>{category.name}</h3>
                                            <p className="text-subtle" style={{ fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                                                {category.tagline}
                                            </p>

                                            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                                                {[...groups, ...singles].slice(0, 5).map((node) => (
                                                    <li key={node.slug} className="chip" style={{ fontSize: '0.78rem' }}>
                                                        {node.name}
                                                    </li>
                                                ))}
                                            </ul>

                                            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span className="text-subtle" style={{ fontSize: '0.85rem' }}>{count} products</span>
                                                <span className="btn-ghost">Explore <ArrowRight size={16} /></span>
                                            </div>
                                        </article>
                                    </Link>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ---------- Capabilities ---------- */}
            <section className="section section-muted">
                <div className="container">
                    <div className="section-head">
                        <span className="eyebrow">Why buyers stay</span>
                        <h2 className="section-title">Nothing leaves the plant unverified</h2>
                        <p className="subtitle">
                            Cable failures are expensive in the field and cheap to catch on the floor. Our process is
                            built around catching them here.
                        </p>
                    </div>

                    <div className="grid grid-2">
                        {capabilities.map((item, i) => (
                            <Reveal key={item.title} delay={i * 0.06}>
                                <div className="card card-pad" style={{ height: '100%', display: 'flex', gap: '1.25rem' }}>
                                    <span style={{ color: 'var(--copper)', flexShrink: 0 }}>
                                        <item.icon size={26} />
                                    </span>
                                    <div>
                                        <h3 style={{ fontSize: '1.12rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                                        <p className="text-subtle" style={{ fontSize: '0.95rem' }}>{item.desc}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- Process ---------- */}
            <section className="section">
                <div className="container">
                    <div className="section-head">
                        <span className="eyebrow">How we work</span>
                        <h2 className="section-title">From drawing to dispatch</h2>
                        <p className="subtitle">
                            The same four steps run whether you are ordering a standard drum of house wire or a
                            first-of-its-kind harness.
                        </p>
                    </div>

                    <div className="grid grid-4">
                        {process.map((item, i) => (
                            <Reveal key={item.step} delay={i * 0.06}>
                                <div style={{ borderTop: '2px solid var(--copper)', paddingTop: '1.25rem', height: '100%' }}>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--copper)' }}>
                                        {item.step}
                                    </span>
                                    <h3 style={{ fontSize: '1.1rem', margin: '0.5rem 0 0.6rem' }}>{item.title}</h3>
                                    <p className="text-subtle" style={{ fontSize: '0.93rem' }}>{item.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- Industries + certifications ---------- */}
            <section className="section section-deep">
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3.5rem' }}>
                    <Reveal>
                        <span className="eyebrow">Industries served</span>
                        <h2 className="section-title">Specified by engineers who check</h2>
                        <p className="subtitle" style={{ marginBottom: '2rem' }}>
                            Our cable ends up in places where a callback is not an option — lift shafts, process
                            plants, vehicle harnesses and rooftop arrays.
                        </p>
                        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                            {industries.map((industry) => (
                                <li
                                    key={industry}
                                    className="chip"
                                    style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.82)' }}
                                >
                                    {industry}
                                </li>
                            ))}
                        </ul>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <div className="panel-deep" style={{ padding: '2.25rem', background: 'rgba(255,255,255,0.05)' }}>
                            <FileCheck2 size={28} color="var(--copper-light)" />
                            <h3 style={{ fontSize: '1.25rem', margin: '1.25rem 0 0.75rem' }}>Certifications & test records</h3>
                            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.96rem', marginBottom: '1.75rem' }}>
                                Management system certificates, product approvals and material compliance
                                declarations, together with the in-house tests behind every batch.
                            </p>
                            <Link href="/certifications" className="btn-secondary">
                                See our certifications <ArrowRight size={16} />
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ---------- CTA ---------- */}
            <section className="section">
                <div className="container">
                    <Reveal>
                        <div
                            className="card"
                            style={{
                                padding: '3.5rem 2rem',
                                textAlign: 'center',
                                background: 'linear-gradient(160deg, var(--copper-pale), var(--surface) 65%)',
                                borderColor: 'var(--copper-tint)',
                            }}
                        >
                            <h2 className="section-title">Send us the specification</h2>
                            <p className="subtitle" style={{ margin: '0 auto 2rem' }}>
                                Share a drawing, a standard or just the application. We will come back with the
                                construction we would build and what it will take to get there.
                            </p>
                            <div className="btn-row" style={{ justifyContent: 'center' }}>
                                <Link href="/contact" className="btn-primary">
                                    Request a quotation <ArrowRight size={18} />
                                </Link>
                                <a
                                    href={whatsappUrl('Hello Mona Industry, I would like to enquire about your cables.')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-whatsapp"
                                >
                                    <WhatsAppIcon size={18} /> WhatsApp us
                                </a>
                                <Link href="/products" className="btn-secondary">
                                    Browse {productCount} products
                                </Link>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>
        </div>
    );
}
