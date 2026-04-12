import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, ArrowRight, Building, Hash, Phone, Shield, Home } from 'lucide-react';
import { validateEmail, validatePassword, validateName, validateRequiredField } from '../../utils/validation';
import api from '../../Api';

export default function Signup({ setView, initialRole = 'student' }) {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        roll_no: '', hall_of_residence: '', room_no: '', contact_no: '', role: initialRole
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [halls, setHalls] = useState([]);

    useEffect(() => {
        const fetchHalls = async () => {
            try {
                const res = await api.get('/api/halls/');
                // Handle both paginated responses (res.data.results) and flat arrays (res.data)
                const hallsData = res.data?.results || res.data;
                if (Array.isArray(hallsData)) {
                    setHalls(hallsData);
                } else {
                    console.error("Expected array of halls, got:", res.data);
                }
            } catch (err) {
                console.error("Failed to fetch halls from backend:", err);
            }
        };
        fetchHalls();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateName(formData.name)) return setError('Name must be at least 2 characters');
        if (formData.role === 'student') {
            if (!validateRequiredField(formData.roll_no)) return setError('Roll Number is required');
            if (!validateRequiredField(formData.hall_of_residence)) return setError('Hall of Residence is required');
        }
        if (!validateEmail(formData.email)) return setError('Please enter a valid email address');
        if (!validatePassword(formData.password)) return setError('Password must be at least 8 characters, with 1 uppercase, 1 lowercase, and 1 number');
        if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');

        setLoading(true);
        try {
            // Endpoint to hit the django backend signup
            const res = await api.post('/api/signup/', {
                name: formData.name,
                email: formData.email,
                roll_no: formData.role === 'student' ? formData.roll_no : '',
                hall_of_residence: formData.role === 'student' ? formData.hall_of_residence : null,
                room_no: formData.role === 'student' ? formData.room_no : '',
                contact_no: formData.contact_no,
                role: formData.role,
                password: formData.password
            });
            console.log('Signup Success:', res.data);
            alert('Signup Successful! You can now log in.');
            setView('login'); // Redirect to login view on success
        } catch (err) {
            console.error(err);
            
            const errorData = err.response?.data;
            let specificError = '';

            if (errorData) {
                // 1. Check if the error is field-specific (e.g., email, roll_no)
                // This converts { email: ["error"] } into a readable string
                const fieldErrors = Object.entries(errorData)
                    .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(' ') : msgs}`)
                    .join(' | ');
                    
                // 2. Fallback to detail, message, or the joined field errors
                specificError = errorData.detail || errorData.message || fieldErrors;
            }

            setError(specificError || 'Error creating account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
                <p className="text-slate-500">Join us to start managing your assets</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Role is determined by initial selection from Home Page */}

                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-xl px-10 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                        required
                    />
                </div>

                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        name="contact_no"
                        placeholder="Contact Number"
                        value={formData.contact_no}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-xl px-10 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                    />
                </div>

                {formData.role === 'student' && (
                    <>
                        <div className="relative">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                name="roll_no"
                                placeholder="Roll Number"
                                value={formData.roll_no}
                                onChange={handleChange}
                                className="w-full bg-white border border-slate-200 rounded-xl px-10 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <select
                                name="hall_of_residence"
                                value={formData.hall_of_residence}
                                onChange={handleChange}
                                className="w-full bg-white border border-slate-200 rounded-xl px-10 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm appearance-none"
                                required
                            >
                                <option value="" disabled>Select Hall of Residence</option>
                                {halls.map((hall) => (
                                    <option key={hall.id} value={hall.id}>
                                        {hall.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="relative">
                            <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                name="room_no"
                                placeholder="Room Number"
                                value={formData.room_no}
                                onChange={handleChange}
                                className="w-full bg-white border border-slate-200 rounded-xl px-10 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                            />
                        </div>
                    </>
                )}

                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-xl px-10 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                        required
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-xl px-10 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                        required
                    />
                </div>

                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-xl px-10 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl py-3 font-medium transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 mt-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                            Sign Up
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-slate-500 text-sm">
                Already have an account?{' '}
                <button
                    onClick={() => setView('login')}
                    className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                    Sign In
                </button>
            </div>
        </motion.div>
    );
}
