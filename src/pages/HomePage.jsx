import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, HeartPulse, UserCheck, ShieldAlert } from 'lucide-react';

export default function HomePage({ reports }) {
    // Get recent 2 reports
    const recentReports = reports.slice().reverse().slice(0, 2);

    return (
        <div className="animate-fade-in">
            <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                <h1 className="animate-fade-in animate-delay-1" style={{ fontSize: '2.5rem', lineHeight: '1.2' }}>
                    Reuniting families,<br />
                    <span className="text-primary">restoring hope.</span>
                </h1>
                <p className="text-muted animate-fade-in animate-delay-2" style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
                    A secure community network for helping displaced people find their loved ones.
                </p>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center' }} className="animate-fade-in animate-delay-3">
                    <Link to="/report" className="btn btn-primary">Report Missing</Link>
                    <Link to="/search" className="btn btn-outline">Find Person</Link>
                </div>
            </div>

            <div className="card animate-fade-in animate-delay-2" style={{ background: 'linear-gradient(135deg, var(--color-primary-light) 0%, rgba(12, 166, 146, 0.05) 100%)', border: '1px solid rgba(12, 166, 146, 0.2)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary-dark)' }}>
                    <HeartPulse size={20} />
                    Impact So Far
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>1,432</h2>
                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>Reunited</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>849</h2>
                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>Searching</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>24</h2>
                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>Regions</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', marginBottom: '1rem' }}>
                <h3>Recently Reported</h3>
                <Link to="/search" className="text-primary" style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                    View all <ChevronRight size={16} />
                </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentReports.map((report) => (
                    <div key={report.id} className="card person-card animate-fade-in">
                        <img src={report.image} alt={report.name} className="person-img" loading="lazy" />
                        <div className="person-info">
                            <span className="chip urgent" style={{ alignSelf: 'flex-start', marginBottom: '0.4rem', fontSize: '0.7rem' }}>Missing Person</span>
                            <h4 className="person-title">{report.name}, {report.age}</h4>
                            <p className="person-detail text-muted">Last seen: {report.location}</p>
                            <p className="person-detail text-muted">Date: {report.dateLost}</p>
                            <Link to={`/search?id=${report.id}`} className="text-primary" style={{ marginTop: 'auto', fontSize: '0.9rem', fontWeight: 600 }}>
                                View details &rarr;
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
