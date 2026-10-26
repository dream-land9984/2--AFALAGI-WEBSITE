import React, { useState } from 'react';
import { User, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken, setSavedUser } from '../api/api';

export default function AuthPage({ user, setUser }) {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Email format fallback if user typed phone
                const loginEmail = formData.email || (formData.phone ? `${formData.phone.replace(/[^0-9]/g, '')}@afalagi.et` : '');
                const res = await api.login({
                    email: loginEmail,
                    password: formData.password
                });

                if (res && res.token && res.user) {
                    setAuthToken(res.token);
                    setSavedUser(res.user);
                    setUser(res.user);
                    navigate('/');
                    return;
                }
            } else {
                const registerEmail = formData.email || `${formData.phone.replace(/[^0-9]/g, '')}@afalagi.et`;
                const res = await api.register({
                    name: formData.name,
                    email: registerEmail,
                    phone: formData.phone,
                    password: formData.password
                });

                if (res && res.token && res.user) {
                    setAuthToken(res.token);
                    setSavedUser(res.user);
                    setUser(res.user);
                    navigate('/');
                    return;
                }
            }
        } catch (err) {
            // If backend is not connected yet, allow local demo sign-in
            console.warn('Backend authentication error:', err);
            if (err.message && err.message.includes('fetch')) {
                // Network unreachable, use mock user for offline test
                const mockUser = {
                    name: formData.name || 'User ' + (formData.phone || formData.email).slice(-4),
                    email: formData.email,
                    phone: formData.phone
                };
                setUser(mockUser);
                setSavedUser(mockUser);
                navigate('/');
                return;
            }
            setError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setAuthToken(null);
        setSavedUser(null);
        setUser(null);
    };

    if (user) {
        return (
            <div className="animate-fade-in" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <User size={64} color="var(--color-primary)" style={{ margin: '0 auto 1rem', background: 'rgba(12, 166, 146, 0.1)', padding: '1rem', borderRadius: '50%' }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Welcome, {user.name}</h2>
                <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>You are securely logged in. You can now post reports and securely share your contact info.</p>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.8rem 2rem' }}>Sign Out</button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <User size={48} color="var(--color-primary)" style={{ margin: '0 auto 1rem', background: 'rgba(12, 166, 146, 0.1)', padding: '0.5rem', borderRadius: '50%' }} />
                <h2 style={{ fontSize: '2rem' }}>{isLogin ? 'Sign In' : 'Create Account'}</h2>
                <p className="text-muted">{isLogin ? 'Access your reports and settings' : 'Join the Afalagi community network'}</p>
            </div>

            {error && (
                <div style={{ padding: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#dc2626', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="card animate-fade-in animate-delay-1">
                {!isLogin && (
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" name="name" className="input" placeholder="e.g. Abebe Bekele" required value={formData.name} onChange={handleChange} />
                    </div>
                )}

                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" name="email" className="input" placeholder="e.g. user@afalagi.et" required value={formData.email} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label className="form-label">Phone Number (Optional)</label>
                    <input type="tel" name="phone" className="input" placeholder="+251 911 234 567" value={formData.phone} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input type="password" name="password" className="input" placeholder="••••••••" required minLength={6} value={formData.password} onChange={handleChange} />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-full"
                    style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                    {loading ? 'Processing...' : (isLogin ? 'Secure Sign In' : 'Register Now')}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                    {isLogin ? "Don't have an account?" : "Already registered?"}
                </p>
                <button
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}
                >
                    {isLogin ? 'Create an Account' : 'Sign in here'}
                </button>
            </div>
        </div>
    );
}
