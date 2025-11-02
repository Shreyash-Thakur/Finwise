import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BarChart3Icon, CheckIcon, AlertCircleIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { LoginForm } from '../components/auth/LoginForm';

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Check for URL errors
  React.useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError) {
      switch (urlError) {
        case 'google_auth_failed':
          setError('Google authentication failed. Please try again.');
          break;
        case 'callback_failed':
          setError('Authentication callback failed. Please try again.');
          break;
        case 'auth_failed':
          setError('Authentication failed. Please try again.');
          break;
        default:
          setError('An error occurred during authentication.');
      }
    }
  }, [searchParams]);

  const handleLoginSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const handleLoginError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
              <BarChart3Icon className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">FinWise</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600">
            Log in to access your financial dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card>
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckIcon className="w-8 h-8 text-success-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Login Successful!
              </h2>
              <p className="text-slate-600">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <>
              {/* Display URL errors */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-danger-50 border border-danger-200 rounded-lg mb-4">
                  <AlertCircleIcon className="w-5 h-5 text-danger-600 flex-shrink-0" />
                  <span className="text-danger-700 text-sm">{error}</span>
                </div>
              )}
              <LoginForm 
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
              />
            </>
          )}
        </Card>

        {/* Sign Up Link */}
        {!success && (
          <p className="text-center mt-6 text-slate-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}