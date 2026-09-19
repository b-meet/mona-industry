/**
 * Cross-section of a stranded, insulated cable, drawn rather than photographed so
 * the hero carries real artwork instead of a placeholder box. Strand positions are
 * computed for a standard 1 + 6 + 12 concentric lay.
 */
const strandRadius = 9;

function strandRing(count, radius) {
    if (count === 1) return [{ cx: 0, cy: 0 }];
    return Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        return { cx: Math.cos(angle) * radius, cy: Math.sin(angle) * radius };
    });
}

const strands = [
    ...strandRing(1, 0),
    ...strandRing(6, strandRadius * 2),
    ...strandRing(12, strandRadius * 4),
];

export default function CableGraphic() {
    return (
        <svg
            viewBox="-150 -150 300 300"
            role="img"
            aria-label="Cross-section of a stranded copper conductor with insulation and outer sheath"
            style={{ width: '100%', height: 'auto', display: 'block' }}
        >
            <defs>
                <radialGradient id="strandFill" cx="35%" cy="30%">
                    <stop offset="0%" stopColor="#e8b98a" />
                    <stop offset="60%" stopColor="#b87333" />
                    <stop offset="100%" stopColor="#7d4a1d" />
                </radialGradient>
                <linearGradient id="sheathFill" x1="0.2" y1="0" x2="0.8" y2="1">
                    <stop offset="0%" stopColor="#3c5a80" />
                    <stop offset="55%" stopColor="#24405f" />
                    <stop offset="100%" stopColor="#16283f" />
                </linearGradient>
                <linearGradient id="insulationFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f7ede3" />
                    <stop offset="100%" stopColor="#e6d3c1" />
                </linearGradient>
            </defs>

            {/* Outer sheath */}
            <circle r="132" fill="url(#sheathFill)" />
            <circle r="132" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
            {/* Bedding / filler */}
            <circle r="106" fill="#101f33" />
            <circle r="106" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {/* Insulation */}
            <circle r="86" fill="url(#insulationFill)" />
            <circle r="86" fill="none" stroke="rgba(11,21,36,0.12)" strokeWidth="1" />
            {/* Conductor bundle */}
            <circle r="58" fill="#8a5322" opacity="0.18" />
            {strands.map((strand, index) => (
                <circle
                    key={index}
                    cx={strand.cx}
                    cy={strand.cy}
                    r={strandRadius}
                    fill="url(#strandFill)"
                    stroke="#6d3f18"
                    strokeWidth="0.75"
                />
            ))}

        </svg>
    );
}
