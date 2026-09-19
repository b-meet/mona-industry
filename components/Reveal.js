"use client";

import { motion } from 'framer-motion';

/** Small scroll-into-view wrapper so sections share one reveal behaviour. */
export default function Reveal({ children, delay = 0, y = 24, className, style }) {
    return (
        <motion.div
            className={className}
            style={style}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}
