export const metadata = {
    title: "About Us | Mona Industry",
};

export default function About() {
    return (
        <div className="container section-padding">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 className="section-title text-gradient">About Mona Industry</h1>

                <div className="glass-panel" style={{ padding: '3rem', borderRadius: 'var(--border-radius-lg)', marginTop: '2rem' }}>
                    <p className="subtitle" style={{ color: 'var(--color-text-primary)' }}>
                        Founded in Surat, Gujarat, Mona Industry has established itself as a premier manufacturer and supplier of high-quality copper products.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem', color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                        <p>
                            With decades of metallurgical expertise, we specialize in processing and refining copper to meet the exacting standards of modern industry. From 99.9% pure copper cathodes to meticulously extruded rods and sheets, our 32-product catalog serves diverse sectors including electronics, construction, and heavy machinery.
                        </p>
                        <p>
                            Our state-of-the-art facility in Surat utilizes advanced electrolysis and extrusion technologies to ensure every batch of copper meets international LME Grade A specifications. We pride ourselves on our rigorous quality control processes, ensuring uncompromised conductivity and durability in all our materials.
                        </p>
                        <p>
                            Beyond manufacturing, Mona Industry is committed to sustainable practices. Our copper scrap recycling division plays a crucial role in closing the industrial loop, providing high-quality reusable materials while minimizing environmental impact.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
