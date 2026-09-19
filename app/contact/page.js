import { MapPin, Phone, Mail, Clock, Building2, Truck } from 'lucide-react';
import InquiryForm from '@/components/InquiryForm';
import { company, addressLine } from '@/constants/company';

export const metadata = {
    title: 'Contact',
    description:
        'Contact Mona Industry in Surat, Gujarat for cable, power cord and wire harness enquiries, quotations, samples and plant visits.',
};

const contactPoints = [
    {
        icon: MapPin,
        label: 'Plant & office',
        value: addressLine,
    },
    {
        icon: Phone,
        label: 'Phone',
        value: company.phone,
        href: `tel:${company.phoneHref}`,
    },
    {
        icon: Mail,
        label: 'General enquiries',
        value: company.email,
        href: `mailto:${company.email}`,
    },
    {
        icon: Building2,
        label: 'Sales & quotations',
        value: company.salesEmail,
        href: `mailto:${company.salesEmail}`,
    },
    {
        icon: Clock,
        label: 'Business hours',
        value: company.hours,
    },
];

const helpItems = [
    {
        icon: Truck,
        title: 'Quotations',
        detail: 'Send the size, construction or standard and the quantity. Written quotations usually go out within one working day.',
    },
    {
        icon: Building2,
        title: 'Samples & first articles',
        detail: 'Sample lengths and documented first articles are available before any series order is committed.',
    },
];

export default function Contact() {
    return (
        <div>
            <section className="section-deep" style={{ padding: '4.5rem 0' }}>
                <div className="container">
                    <span className="eyebrow">Contact</span>
                    <h1 className="page-title" style={{ marginBottom: '1.25rem' }}>Talk to our team</h1>
                    <p className="subtitle" style={{ color: 'rgba(255,255,255,0.76)' }}>
                        Send a drawing, a standard, or just describe the application. An engineer reads every enquiry
                        before it gets a price.
                    </p>
                </div>
            </section>

            <section className="section">
                <div
                    className="container"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="card card-pad">
                            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Get in touch</h2>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                                {contactPoints.map((point) => (
                                    <li key={point.label} style={{ display: 'flex', gap: '0.9rem' }}>
                                        <point.icon size={20} color="var(--copper)" style={{ flexShrink: 0, marginTop: 3 }} />
                                        <div>
                                            <strong style={{ display: 'block', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-400)', fontWeight: 600, marginBottom: '0.25rem' }}>
                                                {point.label}
                                            </strong>
                                            {point.href ? (
                                                <a href={point.href} style={{ color: 'var(--ink-900)', fontWeight: 500 }}>{point.value}</a>
                                            ) : (
                                                <span style={{ color: 'var(--ink-700)' }}>{point.value}</span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="card card-pad" style={{ background: 'var(--surface-muted)' }}>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>What we can help with</h2>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                                {helpItems.map((item) => (
                                    <li key={item.title} style={{ display: 'flex', gap: '0.9rem' }}>
                                        <item.icon size={19} color="var(--copper)" style={{ flexShrink: 0, marginTop: 3 }} />
                                        <div>
                                            <strong style={{ display: 'block', marginBottom: '0.2rem' }}>{item.title}</strong>
                                            <span className="text-subtle" style={{ fontSize: '0.92rem' }}>{item.detail}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="card card-pad">
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Send an enquiry</h2>
                        <p className="text-subtle" style={{ fontSize: '0.94rem', marginBottom: '1.75rem' }}>
                            Fields marked * are required. Add as much of the specification as you have.
                        </p>
                        <InquiryForm />
                    </div>
                </div>
            </section>
        </div>
    );
}
