import React, { useState } from 'react';
import { Camera, AlertCircle, CheckCircle } from 'lucide-react';

export default function ReportPage({ setReports, user }) {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        location: '',
        dateLost: '',
        description: '',
        contact: user ? user.phone : '',
        image: null
    });

    const [submitted, setSubmitted] = useState(false);

    // In a real PWA this would be an IndexedDB queue for offline sync
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.age) return;

        const newReport = {
            id: Date.now(),
            ...formData,
            image: formData.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80"
        };

        setReports(prev => [newReport, ...prev]);
        setSubmitted(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (!user) {
        return (
            <div className="animate-fade-in" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <AlertCircle size={48} color="var(--color-secondary)" style={{ margin: '0 auto 1rem' }} />
                <h2>Authentication Required</h2>
                <p className="text-muted" style={{ margin: '1rem 0 2rem' }}>You must be signed in to submit a missing person report.<br />This prevents spam and helps verify information.</p>
                <a href="/auth" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Sign In to Report</a>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="animate-fade-in" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <CheckCircle size={64} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Report Submitted</h2>
                <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Your report is now live in the global search system. We hope for a quick reunification.</p>
                <button onClick={() => setSubmitted(false)} className="btn btn-outline" style={{ padding: '0.8rem 2rem' }}>Submit Another Report</button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Report Missing Person</h2>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>Fill in as many details as possible to help identify your loved one.</p>

            <form onSubmit={handleSubmit} className="card animate-fade-in animate-delay-1">
                <label className="form-label" style={{ display: 'block', marginBottom: '1rem' }}>Photo (Optional but highly recommended)</label>
                <div className="photo-upload" style={{ marginBottom: '1.5rem', position: 'relative', overflow: 'hidden', padding: formData.image ? '0' : '2rem' }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
                    />
                    {formData.image ? (
                        <img src={formData.image} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                    ) : (
                        <>
                            <Camera size={32} style={{ margin: '0 auto 0.5rem' }} />
                            <div>Tap to take photo or choose from gallery</div>
                        </>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" name="name" className="input" placeholder="e.g. Abebe Bekele" required value={formData.name} onChange={handleChange} />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Approximate Age</label>
                        <input type="number" name="age" className="input" placeholder="e.g. 35" required value={formData.age} onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ flex: 2 }}>
                        <label className="form-label">Last Known Region</label>
                        <select name="location" className="input" required value={formData.location} onChange={handleChange}>
                            <option value="">Select Region</option>
                            <option value="Addis Ababa">Addis Ababa</option>
                            <option value="Afar Region">Afar Region</option>
                            <option value="Amhara Region">Amhara Region</option>
                            <option value="Oromia Region">Oromia Region</option>
                            <option value="Somali Region">Somali Region</option>
                            <option value="Tigray Region">Tigray Region</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Date Last Seen (Approximate)</label>
                    <input type="date" name="dateLost" className="input" required value={formData.dateLost} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label className="form-label">Physical Description & Circumstance</label>
                    <textarea
                        name="description"
                        className="textarea"
                        rows="4"
                        style={{ fontFamily: 'inherit' }}
                        placeholder="Describe what they were wearing, distinguishing marks (scars, tattoos), or how they got separated..."
                        required
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="form-group">
                    <label className="form-label">Your Contact Phone (Protected)</label>
                    <input type="tel" name="contact" className="input" required value={formData.contact} onChange={handleChange} />
                    <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <AlertCircle size={14} /> Will not be public until requested by a verified finder.
                    </p>
                </div>

                <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1rem', fontSize: '1.2rem', padding: '1rem' }}>
                    Publish Report
                </button>
            </form>
        </div>
    );
}
