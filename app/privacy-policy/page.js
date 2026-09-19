import { company } from '@/constants/company';

export const metadata = {
    title: 'Privacy Policy',
    description: 'How Mona Industry collects, uses and protects the personal information submitted through its website enquiry forms.',
};

export default function PrivacyPolicy() {
    return (
        <div className="section">
            <div className="container-narrow prose">
                <h1 className="page-title" style={{ marginBottom: '0.75rem' }}>Privacy Policy</h1>
                <p className="text-subtle" style={{ marginBottom: '2rem' }}>
                    This policy explains what we collect through this website, why we collect it, and what we do with it.
                </p>

                <h2>1. Information we collect</h2>
                <p>
                    When you submit an enquiry we collect the details you provide: your name, company, phone number,
                    email address, the products you are interested in, and any requirement details you write in.
                    We do not ask for payment details anywhere on this site.
                </p>

                <h2>2. How we use it</h2>
                <p>
                    Your information is used to answer your enquiry, prepare quotations and correspond with you about
                    your order. We do not sell your personal data, and we do not share it with third parties for their
                    own marketing.
                </p>

                <h2>3. Applications for employment</h2>
                <p>
                    CVs and applications sent to our careers address are used solely to assess you for the role applied
                    for and for other openings we think may suit you. Tell us if you would prefer your details not to
                    be retained after a decision.
                </p>

                <h2>4. Retention</h2>
                <p>
                    Enquiry records are kept for as long as needed to serve the commercial relationship and to meet our
                    statutory record-keeping obligations, after which they are deleted.
                </p>

                <h2>5. Security</h2>
                <p>
                    Enquiries are stored in an access-controlled database. We take commercially reasonable measures to
                    protect your data, though no transmission over the internet can be guaranteed completely secure.
                </p>

                <h2>6. Your choices</h2>
                <p>
                    You may ask us to confirm what personal data we hold about you, to correct it, or to delete it.
                    Write to <a href={`mailto:${company.email}`} className="text-copper">{company.email}</a> and we will
                    respond within a reasonable period.
                </p>

                <h2>7. Contact</h2>
                <p>
                    Questions about this policy can be sent to{' '}
                    <a href={`mailto:${company.email}`} className="text-copper">{company.email}</a>, or by post to our
                    office in Surat, Gujarat.
                </p>
            </div>
        </div>
    );
}
