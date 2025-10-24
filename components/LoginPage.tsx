import React, { useState } from 'react';
import { LogoIcon, SpinnerIcon } from './icons/Icons';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            // Mock validation
            if (!email || !password) {
                setError('Please enter both email and password.');
                setIsLoading(false);
                return;
            }
            if (isLoginView) {
                // Mock login
                if (email === 'admin@example.com' && password === 'password') {
                    onLoginSuccess();
                } else {
                    setError('Invalid credentials. Try admin@example.com and "password".');
                    setIsLoading(false);
                }
            } else {
                // Mock signup
                if (!name) {
                    setError('Please enter your name.');
                    setIsLoading(false);
                    return;
                }
                // Directly log in after successful signup
                onLoginSuccess();
            }
        }, 1000);
    };

    const inputClasses = "appearance-none bg-white bg-opacity-70 border border-purple-200 rounded-lg w-full py-3 px-4 text-text-main leading-tight focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition placeholder-text-light";
    const FormField: React.FC<{ label: string; type: string; value: string; setValue: (val: string) => void; placeholder?: string }> = ({ label, type, value, setValue, placeholder }) => (
        <div>
            <label className="block text-primary text-sm font-bold mb-2">{label}</label>
            <input 
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={inputClasses}
                placeholder={placeholder}
                required
            />
        </div>
    );

    return (
        <div className="min-h-screen w-full relative flex flex-col justify-center items-center p-4">
            <div
                className="absolute inset-0 z-0"
                style={{
                background: `
                    radial-gradient(ellipse 80% 60% at 5% 40%, rgba(175, 109, 255, 0.48), transparent 67%),
                    radial-gradient(ellipse 70% 60% at 45% 45%, rgba(255, 100, 180, 0.41), transparent 67%),
                    radial-gradient(ellipse 62% 52% at 83% 76%, rgba(255, 235, 170, 0.44), transparent 63%),
                    radial-gradient(ellipse 60% 48% at 75% 20%, rgba(120, 190, 255, 0.36), transparent 66%),
                    linear-gradient(45deg, #f7eaff 0%, #fde2ea 100%)
                `,
                }}
            />
            <div className="max-w-md w-full mx-auto z-10">
                <div className="flex justify-center mb-6">
                    <div className="bg-primary p-3 rounded-xl shadow-lg">
                        <LogoIcon />
                    </div>
                </div>
                <div className="bg-white bg-opacity-60 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full">
                    <div key={isLoginView ? 'login' : 'signup'} className="text-center animate-fade-in-down">
                        <h2 className="text-3xl font-bold text-primary mb-2">{isLoginView ? 'Welcome to Eventrix' : 'Create Your Account'}</h2>
                        <p className="text-text-light mb-8">{isLoginView ? 'Sign in to manage your events' : 'Get started in seconds'}</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <p className="bg-red-100 text-red-700 text-sm font-semibold p-3 rounded-lg text-center">{error}</p>}
                        {!isLoginView && (
                            <div className="animate-fade-in-down">
                                <FormField label="Full Name" type="text" value={name} setValue={setName} placeholder="John Doe" />
                            </div>
                        )}
                        <FormField label="Email Address" type="email" value={email} setValue={setEmail} placeholder="you@example.com" />
                        <FormField label="Password" type="password" value={password} setValue={setPassword} placeholder="••••••••" />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary-focus text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                            {isLoading && <SpinnerIcon />}
                            {isLoading ? (isLoginView ? 'Logging In...' : 'Signing Up...') : (isLoginView ? 'Login' : 'Sign Up')}
                        </button>
                    </form>
                    <div className="text-center mt-6">
                        <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="text-sm font-medium text-primary hover:underline" disabled={isLoading}>
                            {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;