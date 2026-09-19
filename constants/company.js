import { productCount } from '@/lib/catalog';

/**
 * Single source of truth for company details shown across the site.
 * Update the placeholder contact and registration values below with the
 * real ones before going live — they are referenced by the header, footer,
 * contact page and the structured data in the root layout.
 */
export const company = {
    name: 'Mona Industry',
    legalName: 'Mona Industry',
    tagline: 'Wires, cables, power cords & wire harnesses',
    description:
        'Mona Industry manufactures automotive and industrial cables, elevator travelling cables, solar and instrumentation cables, approval-ready power cords and build-to-print wire harnesses from its plant in Surat, Gujarat.',
    established: 1998,
    address: {
        line1: 'GIDC Estate',
        city: 'Surat',
        state: 'Gujarat',
        postalCode: '395003',
        country: 'India',
    },
    phone: '+91 89801 16179',
    phoneHref: '+918980116179',
    whatsappHref: '918980116179',
    email: 'info@monaindustry.com',
    salesEmail: 'sales@monaindustry.com',
    careersEmail: 'careers@monaindustry.com',
    hours: 'Monday – Saturday, 9:00 AM – 6:30 PM IST',
    // Replace with the actual registration numbers before publishing.
    gstin: 'GSTIN to be updated',
    iecCode: 'IEC to be updated',
};

export const addressLine = [
    company.address.line1,
    company.address.city,
    `${company.address.state} ${company.address.postalCode}`,
    company.address.country,
].join(', ');

/**
 * A wa.me link with an optional prefilled first message. Falls back to a plain
 * chat link when no message is given.
 */
export function whatsappUrl(message) {
    const base = `https://wa.me/${company.whatsappHref}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const stats = [
    { value: '25+', label: 'Years in cable manufacturing' },
    { value: String(productCount), label: 'Standard product lines' },
    { value: '100%', label: 'Assemblies electrically tested' },
    { value: '15+', label: 'Export markets served' },
];
