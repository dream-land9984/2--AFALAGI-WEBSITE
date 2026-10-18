import React, { useState } from 'react';
import { Search as SearchIcon, MapPin, Calendar, Phone, PhoneOff, Lock } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function SearchPage({ reports }) {
    const [query, setQuery] = useState('');
    const [regionFilter, setRegionFilter] = useState('All Regions');
    const [dateFilter, setDateFilter] = useState('');

    // Add search URL params support for direct jumps
    const urlLocation = useLocation();
    const searchParams = new URLSearchParams(urlLocation.search);
    const selectedId = searchParams.get('id');

    // Contact Privacy State
    const [revealedContacts, setRevealedContacts] = useState({});

    const handleRevealContact = (id) => {
        // In real app: ask for user's details or reason, or verify auth before showing.
        setRevealedContacts(prev => ({ ...prev, [id]: true }));
    };

    const filtered = reports.filter(r => {
        const nameMatch = r.name.toLowerCase().includes(query.toLowerCase()) || r.description.toLowerCase().includes(query.toLowerCase());
        const regionMatch = regionFilter === 'All Regions' || r.location === regionFilter;
        const dateMatch = !dateFilter || r.dateLost >= dateFilter; // naive date filtering

        // Default show all if no id is specified, otherwise filter to that id
        if (selectedId && r.id.toString() !== selectedId && query === '') {
            return false;
        }

        return nameMatch && regionMatch && dateMatch;
    });

    return (
        <div className="animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Search Persons</h2>

            <div className="search-container" style={{ marginBottom: '1rem' }}>
                <SearchIcon color="var(--color-primary)" />
                <input
                    type="text"
                    placeholder="Search by name or description..."
                    className="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '2rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <select
                        className="input"
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value)}
                    >
                        <option>All Regions</option>
                        <option>Afar Region</option>
                        <option>Amhara Region</option>
                        <option>Oromia Region</option>
                        <option>Tigray Region</option>
                        <option>Somali Region</option>
                        <option>Addis Ababa</option>
                    </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <input
                        type="date"
                        className="input"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        title="Lost Date After"
                    />
                </div>
            </div>

            <div>
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--color-text-mutated)', padding: '3rem 0' }}>
                        <SearchIcon size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                        <p>No persons found matching your criteria.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {filtered.map(report => (
                            <div key={report.id} className="card animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
                                <img src={report.image} alt={report.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{report.name}, <span className="text-muted" style={{ fontWeight: 400 }}>{report.age}</span></h3>
                                        <div className="chip urgent">Missing</div>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-mutated)', fontSize: '0.9rem' }}>
                                            <MapPin size={16} color="var(--color-primary)" /> {report.location}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-mutated)', fontSize: '0.9rem' }}>
                                            <Calendar size={16} color="var(--color-primary)" /> Last seen {report.dateLost}
                                        </div>
                                    </div>

                                    <p style={{ marginTop: '1rem', lineHeight: 1.5 }}>
                                        {report.description}
                                    </p>

                                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(166, 180, 197, 0.2)' }}>
                                        {revealedContacts[report.id] ? (
                                            <div className="animate-fade-in" style={{ background: 'rgba(12, 166, 146, 0.1)', padding: '1rem', borderRadius: 'var(--border-radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>Contact Details</p>
                                                    <p style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={20} /> {report.contact}</p>
                                                </div>
                                                <a href={`tel:${report.contact}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Call</a>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--border-radius-sm)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-mutated)' }}>
                                                    <Lock size={18} />
                                                    <span style={{ fontSize: '0.9rem' }}>Contact hidden for privacy</span>
                                                </div>
                                                <button onClick={() => handleRevealContact(report.id)} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                                                    Request Access
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
