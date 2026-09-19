import { Factory, FlaskConical, Handshake, Recycle, Target } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { company, stats } from '@/constants/company';
import { productCount } from '@/lib/catalog';

export const metadata = {
    title: 'About Us',
    description:
        'Mona Industry manufactures wires, cables, power cords and wire harnesses in Surat, Gujarat — drawing, stranding, extrusion, assembly and testing under one roof.',
};

const values = [
    {
        icon: Target,
        title: 'Specification before price',
        detail: 'We quote against a construction we can actually build and test. If a target price needs a thinner wall or a cheaper compound, we say so rather than shipping something that will not hold up.',
    },
    {
        icon: FlaskConical,
        title: 'Evidence, not assurance',
        detail: 'Conductor resistance, hipot, insulation resistance and dimensional checks are recorded against the batch, and the certificates travel with the goods.',
    },
    {
        icon: Handshake,
        title: 'Long relationships',
        detail: 'Most of our volume is repeat business from OEMs who re-order the same construction year after year. That only works if the tenth lot matches the first.',
    },
    {
        icon: Recycle,
        title: 'Responsible material use',
        detail: 'Copper offcuts and compound waste are recovered and recycled, and we favour halogen-free compounds wherever the application allows.',
    },
];

const infrastructure = [
    { title: 'Wire drawing & annealing', detail: 'Rod breakdown, intermediate and fine drawing with in-line annealing for consistent conductor properties.' },
    { title: 'Bunching & stranding', detail: 'Class 2 and class 5 conductors laid up to IS 8130 / IEC 60228 limits.' },
    { title: 'Extrusion lines', detail: 'PVC, FRLS, LSZH and cross-linked XLPO insulation and sheathing with in-line spark testing.' },
    { title: 'Braiding & screening', detail: 'Tinned copper braid and foil screening for EMI-controlled constructions.' },
    { title: 'Cordset moulding', detail: 'Plug and connector overmoulding for Indian, European, UK, Australian, African, American and Japanese standards.' },
    { title: 'Harness assembly & test', detail: 'Applicator crimping, form-board routing and 100% continuity and hipot testing.' },
];

export default function About() {
    return (
        <div>
            <section className="section-deep" style={{ padding: '4.5rem 0' }}>
                <div className="container">
                    <span className="eyebrow">About us</span>
                    <h1 className="page-title" style={{ marginBottom: '1.25rem', maxWidth: 760 }}>
                        A cable plant built to specification
                    </h1>
                    <p className="subtitle" style={{ color: 'rgba(255,255,255,0.76)', maxWidth: 720 }}>
                        {company.name} manufactures wires, cables, power cords and wire harnesses from its plant in{' '}
                        {company.address.city}, {company.address.state} — {productCount} standard product lines across
                        automotive, elevator, solar, instrumentation and industrial cable, plus constructions built to
                        customer drawings.
                    </p>
                </div>
            </section>

            <section style={{ borderBottom: '1px solid var(--line)' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '2rem', padding: '2.5rem 1.5rem' }}>
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <p className="text-gradient" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>
                                {stat.value}
                            </p>
                            <p className="text-subtle" style={{ marginTop: '0.5rem', fontSize: '0.92rem' }}>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section">
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3.5rem', alignItems: 'start' }}>
                    <Reveal>
                        <span className="eyebrow">Our story</span>
                        <h2 className="section-title">From house wire to harnesses</h2>
                    </Reveal>

                    <Reveal delay={0.08}>
                        <div className="stack" style={{ gap: '1.25rem' }}>
                            <p className="lede">
                                We started with a single extrusion line making PVC insulated house wire for the
                                local market. What changed the business was a customer who needed a construction
                                nobody wanted to make in small volume.
                            </p>
                            <p className="text-subtle">
                                Taking that work on meant learning to read a specification properly, build against it and
                                prove the result. That habit set the direction: rather than compete on the widest
                                commodity range, we built depth in constructions where the specification actually
                                matters — automotive cable to JASO and DIN, elevator travelling cable that survives
                                millions of flex cycles, solar cable with a 25-year design life, and instrumentation
                                cable where a screen either works or the loop reads wrong.
                            </p>
                            <p className="text-subtle">
                                Power cords and wire harnesses followed from the same customers. An OEM that trusts
                                your cable would rather buy the finished, tested assembly than co-ordinate three
                                suppliers. Today we run the whole chain — drawing, stranding, extrusion, braiding,
                                moulding, assembly and testing — from one plant in {company.address.city}.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            <section className="section section-muted">
                <div className="container">
                    <div className="section-head">
                        <span className="eyebrow">Infrastructure</span>
                        <h2 className="section-title">What we run in-house</h2>
                        <p className="subtitle">
                            Keeping every step on site is what lets us trace a problem back to the process that caused
                            it instead of back to a supplier who will not answer.
                        </p>
                    </div>

                    <div className="grid grid-3">
                        {infrastructure.map((item, i) => (
                            <Reveal key={item.title} delay={i * 0.05}>
                                <div className="card card-pad" style={{ height: '100%' }}>
                                    <Factory size={22} color="var(--copper)" />
                                    <h3 style={{ fontSize: '1.08rem', margin: '1rem 0 0.5rem' }}>{item.title}</h3>
                                    <p className="text-subtle" style={{ fontSize: '0.93rem' }}>{item.detail}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section-head">
                        <span className="eyebrow">How we operate</span>
                        <h2 className="section-title">What our customers can hold us to</h2>
                    </div>

                    <div className="grid grid-2">
                        {values.map((value, i) => (
                            <Reveal key={value.title} delay={i * 0.06}>
                                <div className="card card-pad" style={{ height: '100%', display: 'flex', gap: '1.25rem' }}>
                                    <span style={{ color: 'var(--copper)', flexShrink: 0 }}><value.icon size={24} /></span>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{value.title}</h3>
                                        <p className="text-subtle" style={{ fontSize: '0.95rem' }}>{value.detail}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
