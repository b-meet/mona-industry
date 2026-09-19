import { company } from '@/constants/company';

export const metadata = {
    title: 'Terms & Conditions',
    description: 'Terms and conditions governing the use of the Mona Industry website and the enquiries submitted through it.',
};

export default function Terms() {
    return (
        <div className="section">
            <div className="container-narrow prose">
                <h1 className="page-title" style={{ marginBottom: '0.75rem' }}>Terms &amp; Conditions</h1>
                <p className="text-subtle" style={{ marginBottom: '2rem' }}>
                    These terms govern your use of this website and any enquiry you submit through it.
                </p>

                <h2>1. Agreement to these terms</h2>
                <p>
                    By using this website and submitting product enquiries, you agree to be bound by these terms and
                    conditions. If you do not accept them, please do not use the site.
                </p>

                <h2>2. Product information</h2>
                <p>
                    Constructions, dimensions, ratings and standards shown on this site describe our typical
                    manufacturing range and are provided for guidance. The binding specification for any order is the
                    one confirmed in writing between you and {company.legalName}. We reserve the right to improve
                    constructions and compounds, and to update this site without prior notice.
                </p>

                <h2>3. Enquiries and quotations</h2>
                <p>
                    Submitting an enquiry does not create a contract of sale. Our team will review the requirement
                    and issue an official quotation. Prices are subject to prevailing copper and polymer costs, and
                    quotations remain valid only for the period stated on them.
                </p>

                <h2>4. Certifications and approvals</h2>
                <p>
                    Certification and approval details published on this site relate to the specific scopes stated on
                    each certificate. Copies are issued on request. Where an approval is required for a particular
                    destination market, please confirm it with us in writing before placing an order.
                </p>

                <h2>5. Intellectual property</h2>
                <p>
                    The content, structure, graphics and design of this site are protected by applicable copyright and
                    trademark law. Copying, redistribution or republication of any part of it without written
                    permission is not permitted.
                </p>

                <h2>6. Limitation of liability</h2>
                <p>
                    {company.legalName} shall not be liable for any direct, indirect, incidental, special or
                    consequential loss arising from the use of, or inability to use, this website. Nothing in these
                    terms limits liability that cannot be limited under applicable law.
                </p>

                <h2>7. Governing law</h2>
                <p>
                    These terms are governed by the laws of India, and the courts at Surat, Gujarat shall have
                    jurisdiction over any dispute arising from them.
                </p>

                <h2>8. Contact</h2>
                <p>
                    Questions about these terms can be sent to{' '}
                    <a href={`mailto:${company.email}`} className="text-copper">{company.email}</a>.
                </p>
            </div>
        </div>
    );
}
