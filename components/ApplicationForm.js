"use client";

import { useState } from 'react';
import { CheckCircle2, Loader2, Paperclip } from 'lucide-react';
import { createSubmission, validateResume } from '@/lib/submissions';
import { company } from '@/constants/company';

export default function ApplicationForm({ roles = [], selectedRole = '', onRoleChange }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        experience: '',
        employer: '',
        coverNote: '',
    });
    const [resume, setResume] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleResumeChange = (e) => {
        const file = e.target.files?.[0] || null;
        const problem = validateResume(file);
        if (problem) {
            setError(problem);
            setResume(null);
            e.target.value = '';
            return;
        }
        setError('');
        setResume(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!resume) {
            setError('Please attach your CV.');
            return;
        }

        setIsSubmitting(true);
        try {
            await createSubmission({
                type: 'application',
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                role: selectedRole || 'Open application',
                subject: `Application — ${selectedRole || 'Open application'}`,
                details: formData.coverNote || null,
                payload: {
                    experience: formData.experience || null,
                    employer: formData.employer || null,
                    cover_note: formData.coverNote || null,
                },
                resume,
            });
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError(
                `We could not submit your application just now. Please try again, or email your CV to ${company.careersEmail}.`
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
                <CheckCircle2 size={44} color="var(--copper)" style={{ margin: '0 auto 1.25rem' }} />
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Application received</h3>
                <p className="text-subtle" style={{ maxWidth: 460, margin: '0 auto' }}>
                    Thank you, {formData.name}. We read every application and come back within a week, whether or
                    not there is a fit.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
                <label className="field-label" htmlFor="app-role">Applying for</label>
                <select
                    id="app-role"
                    className="input-base"
                    value={selectedRole}
                    onChange={(e) => onRoleChange?.(e.target.value)}
                >
                    <option value="">Open application</option>
                    {roles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-2" style={{ gap: '1.25rem' }}>
                <div>
                    <label className="field-label" htmlFor="app-name">Full name *</label>
                    <input required id="app-name" type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-base" placeholder="Your name" autoComplete="name" />
                </div>
                <div>
                    <label className="field-label" htmlFor="app-email">Email address *</label>
                    <input required id="app-email" type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-base" placeholder="you@example.com" autoComplete="email" />
                </div>
            </div>

            <div className="grid grid-2" style={{ gap: '1.25rem' }}>
                <div>
                    <label className="field-label" htmlFor="app-phone">Phone number *</label>
                    <input required id="app-phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input-base" placeholder="+91 00000 00000" autoComplete="tel" />
                </div>
                <div>
                    <label className="field-label" htmlFor="app-experience">Years of experience</label>
                    <input id="app-experience" type="text" name="experience" value={formData.experience} onChange={handleInputChange} className="input-base" placeholder="e.g. 5 years" />
                </div>
            </div>

            <div>
                <label className="field-label" htmlFor="app-employer">Current or most recent employer</label>
                <input id="app-employer" type="text" name="employer" value={formData.employer} onChange={handleInputChange} className="input-base" placeholder="Company name" autoComplete="organization" />
            </div>

            <div>
                <label className="field-label" htmlFor="app-resume">CV / resume *</label>
                <input
                    required
                    id="app-resume"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleResumeChange}
                    className="input-base"
                    style={{ padding: '0.65rem 0.75rem' }}
                />
                <p className="text-subtle" style={{ fontSize: '0.82rem', marginTop: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Paperclip size={13} />
                    {resume ? `${resume.name} attached` : 'PDF or Word document, up to 5 MB.'}
                </p>
            </div>

            <div>
                <label className="field-label" htmlFor="app-cover">Cover note</label>
                <textarea
                    id="app-cover"
                    name="coverNote"
                    value={formData.coverNote}
                    onChange={handleInputChange}
                    className="input-base"
                    placeholder="What you have worked on, and why this role."
                />
            </div>

            {error && <p role="alert" style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{error}</p>}

            <button disabled={isSubmitting} type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? (<><Loader2 size={18} className="spin" /> Sending…</>) : 'Submit application'}
            </button>

            <p className="text-subtle" style={{ fontSize: '0.82rem' }}>
                Your CV is used only to assess this application. See our{' '}
                <a href="/privacy-policy" className="text-copper">privacy policy</a>.
            </p>
        </form>
    );
}
