export const metadata = {
    title: "Terms & Conditions | Mona Industry",
};

export default function Terms() {
    return (
        <div className="container section-padding">
            <div style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                <h1 className="section-title text-gradient" style={{ textAlign: 'left', marginBottom: '2rem' }}>Terms & Conditions</h1>

                <p style={{ marginBottom: '2rem' }}>Last updated: {new Date().toLocaleDateString()}</p>

                <h2 style={{ color: 'var(--color-text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>1. Agreement to Terms</h2>
                <p>By accessing our website and submitting product inquiries, you agree to be bound by these Terms and Conditions.</p>

                <h2 style={{ color: 'var(--color-text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>2. Inquiries and Quotes</h2>
                <p>Submitting an inquiry through our website does not constitute a binding contract of sale. Our team will review your inquiry and provide an official quotation. Prices of copper materials are subject to market fluctuations (LME pricing).</p>

                <h2 style={{ color: 'var(--color-text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>3. Intellectual Property</h2>
                <p>The content, organization, graphics, design, and other matters related to the Site are protected under applicable copyrights and trademarks. The copying, redistribution, or publication of any such matters is strictly prohibited.</p>

                <h2 style={{ color: 'var(--color-text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>4. Limitation of Liability</h2>
                <p>Mona Industry shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our website or services.</p>
            </div>
        </div>
    );
}
