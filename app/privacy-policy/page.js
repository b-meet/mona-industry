export const metadata = {
    title: "Privacy Policy | Mona Industry",
};

export default function PrivacyPolicy() {
    return (
        <div className="container section-padding">
            <div style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                <h1 className="section-title text-gradient" style={{ textAlign: 'left', marginBottom: '2rem' }}>Privacy Policy</h1>

                <p style={{ marginBottom: '2rem' }}>Last updated: {new Date().toLocaleDateString()}</p>

                <h2 style={{ color: 'var(--color-text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
                <p>When you use our inquiry forms, we collect personal information such as your Name, Phone Number, Email Address, and any free-text details you provide regarding your product interests.</p>

                <h2 style={{ color: 'var(--color-text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
                <p>Your information is used strictly to fulfill your product inquiries, provide quotes, and communicate with you regarding your orders. We do not sell or share your personal data with third parties for marketing purposes.</p>

                <h2 style={{ color: 'var(--color-text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>3. Data Security</h2>
                <p>All inquiries are stored securely in our database. While we use commercially acceptable means to protect your Personal Data, remember that no method of transmission over the Internet is 100% secure.</p>

                <h2 style={{ color: 'var(--color-text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>4. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at info@monaindustry.com.</p>
            </div>
        </div>
    );
}
