import Link from 'next/link';
import { Mail, Sparkles } from 'lucide-react';
import Reveal from '@/components/Reveal';
import CareerOpenings from '@/components/CareerOpenings';
import careers from '@/constants/careers.json';
import { company } from '@/constants/company';

export const metadata = {
    title: 'Career',
    description:
        'No roles are open at Mona Industry right now. Send an open application to our Surat, Gujarat cable manufacturing plant and we will keep it on file.',
};

export default function Career() {
    const { openings, benefits } = careers;

    return (
        <div>
            <section className="section-deep" style={{ padding: '4.5rem 0' }}>
                <div className="container">
                    <span className="eyebrow">Career</span>
                    <h1 className="page-title" style={{ marginBottom: '1.25rem', maxWidth: 720 }}>
                        Build things that have to work the first time
                    </h1>
                    <p className="subtitle" style={{ color: 'rgba(255,255,255,0.76)', maxWidth: 700 }}>
                        Cable is unforgiving work: it either meets the specification or it does not. If you like
                        problems with a measurable answer, there is a place for you on our floor in {company.address.city}.
                    </p>
                    <div className="btn-row" style={{ marginTop: '2rem' }}>
                        <Link href="#apply" className="btn-primary">
                            Apply now
                        </Link>
                        <a href={`mailto:${company.careersEmail}`} className="btn-secondary">
                            <Mail size={18} /> {company.careersEmail}
                        </a>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section-head">
                        <span className="eyebrow">Why here</span>
                        <h2 className="section-title">What working here is actually like</h2>
                    </div>

                    <div className="grid grid-2">
                        {benefits.map((benefit, i) => (
                            <Reveal key={benefit.title} delay={i * 0.06}>
                                <div className="card card-pad" style={{ height: '100%', display: 'flex', gap: '1.15rem' }}>
                                    <Sparkles size={22} color="var(--copper)" style={{ flexShrink: 0 }} />
                                    <div>
                                        <h3 style={{ fontSize: '1.08rem', marginBottom: '0.5rem' }}>{benefit.title}</h3>
                                        <p className="text-subtle" style={{ fontSize: '0.94rem' }}>{benefit.detail}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <CareerOpenings openings={openings} />
        </div>
    );
}
