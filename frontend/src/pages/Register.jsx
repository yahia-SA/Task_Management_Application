import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [validations, setValidations] = useState({
        length: false,
        upper: false,
        lower: false,
        number: false,
        special: false
    });

    useEffect(() => {
        setValidations({
            length: password.length >= 8,
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*]/.test(password)
        });
    }, [password]);

    const isPasswordValid = Object.values(validations).every(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isPasswordValid) {
            setError('Please satisfy all password requirements.');
            return;
        }
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    const ValidationItem = ({ valid, text }) => (
        <div style={{ color: valid ? 'green' : '#ef4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '5px' }}>{valid ? '✓' : '✗'}</span>
            {text}
        </div>
    );

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
            <div className="card">
                <h2>Register</h2>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div style={{ backgroundColor: '#f9fafb', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem' }}>
                        <small style={{ fontWeight: 'bold' }}>Password Requirements:</small>
                        <ValidationItem valid={validations.length} text="At least 8 characters" />
                        <ValidationItem valid={validations.upper} text="At least one uppercase check (A-Z)" />
                        <ValidationItem valid={validations.lower} text="At least one lowercase letter (a-z)" />
                        <ValidationItem valid={validations.number} text="At least one number (0-9)" />
                        <ValidationItem valid={validations.special} text="At least one special char (!@#$%^&*)" />
                    </div>

                    <button 
                        type="submit" 
                        style={{ width: '100%', opacity: isPasswordValid ? 1 : 0.5, cursor: isPasswordValid ? 'pointer' : 'not-allowed' }}
                        disabled={!isPasswordValid}
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
