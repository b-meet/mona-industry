"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
// We'll use the generic form submission endpoint for the basic contact form as well, 
// though the requirement mainly specifies the robust inquiry form for products.
// We can use a simpler version here or just a standard controlled form.
import InquiryForm from '@/components/InquiryForm';

export default function Contact() {
    return (
        <div className="container section-padding">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 className="section-title text-gradient">Contact Us</h1>
                <p className="subtitle" style={{ margin: '0 auto' }}>
                    Have a question or need a bulk quotation? Reach out to our team in Surat.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                {/* Contact Information */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                >
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--border-radius-md)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>Get In Touch</h3>

                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--color-text-secondary)' }}>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <MapPin color="var(--color-accent-primary)" style={{ flexShrink: 0 }} />
                                <div>
                                    <strong style={{ display: 'block', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>Our Facility</strong>
                                    GIDC Estate, Surat, Gujarat 395003, India
                                </div>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <Phone color="var(--color-accent-primary)" style={{ flexShrink: 0 }} />
                                <div>
                                    <strong style={{ display: 'block', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>Phone</strong>
                                    +91 98765 43210
                                </div>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <Mail color="var(--color-accent-primary)" style={{ flexShrink: 0 }} />
                                <div>
                                    <strong style={{ display: 'block', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>Email</strong>
                                    info@monaindustry.com
                                </div>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <Clock color="var(--color-accent-primary)" style={{ flexShrink: 0 }} />
                                <div>
                                    <strong style={{ display: 'block', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>Business Hours</strong>
                                    Monday - Saturday: 9:00 AM - 6:30 PM (IST)
                                </div>
                            </li>
                        </ul>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--border-radius-md)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>Send an Inquiry</h3>

                        {/* We will instantiate the shared Inquiry Form component here. 
                We can pass a prop to hide the "specific product selector" if we just want a general contact! 
                Alternatively, we just render the full robust Inquiry Form. */}
                        <InquiryForm isGeneralContact={true} />

                    </div>
                </motion.div>
            </div>
        </div>
    );
}
