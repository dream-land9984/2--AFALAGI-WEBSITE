import React, { useState } from 'react';
import { User, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage({ user, setUser }) {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    // Mock form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            // Mock login
            setUser({ name: formData.phone === '' ? 'Guest' : 'User ' + formData.phone.slice(-4), phone: formData.phone });
        } else {
            // Mock register
            setUser({ name: formData.name, phone: formData.phone });
        }
        navigate('/');
    };

    const handleLogout = () => {
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

            <form onSubmit={handleSubmit} className="card animate-fade-in animate-delay-1">
                {!isLogin && (
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" name="name" className="input" placeholder="e.g. Abebe Bekele" required value={formData.name} onChange={handleChange} />
                    </div>
                )}

                <div className="form-group">
                    <label className="form-label">Phone Number (Required for PWA SMS auth)</label>
                    <input type="tel" name="phone" className="input" placeholder="+251 911 234 567" required value={formData.phone} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input type="password" name="password" className="input" placeholder="••••••••" required value={formData.password} onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                    {isLogin ? 'Secure Sign In' : 'Register Now'}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                    {isLogin ? 'Don\'t have an account?' : 'Already registered?'}
                </p>
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}
                >
                    {isLogin ? 'Create an Account' : 'Sign in here'}
                </button>
            </div>
        </div>
    );
}
