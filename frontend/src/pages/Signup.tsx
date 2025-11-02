import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3Icon, CheckCircleIcon, Loader2Icon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
export function Signup() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    submit: ''
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      submit: ''
    });

    // Validation
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      submit: ''
    };

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.values(newErrors).some(err => err)) {
      setErrors(newErrors);
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setStep('success');
    } catch (error: any) {
      setErrors({
        ...newErrors,
        submit: error.message || 'Registration failed. Please try again.'
      });
    }
  };
  if (step === 'success') {
    return <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Card className="text-center">
            <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-10 h-10 text-success-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Signup Successful!
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Welcome,{' '}
              <span className="font-semibold text-primary-600">
                {formData.name}
              </span>
              ! Your account has been created successfully.
            </p>

            <div className="space-y-3">
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Go to Dashboard
              </Button>
              <Button variant="ghost" onClick={() => navigate('/')} className="w-full border border-slate-300">
                Browse Plans
              </Button>
            </div>
          </Card>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4 py-12">
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
            Create Your Account
          </h1>
          <p className="text-slate-600">Start your financial journey today</p>
        </div>

        {/* Signup Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Full Name" 
              placeholder="Shreyash Kumar" 
              value={formData.name} 
              onChange={e => setFormData({
                ...formData,
                name: e.target.value
              })} 
              error={errors.name} 
            />

            <Input label="Email Address" type="email" placeholder="you@example.com" value={formData.email} onChange={e => setFormData({
            ...formData,
            email: e.target.value
          })} error={errors.email} />

            <Input label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({
            ...formData,
            password: e.target.value
          })} error={errors.password} helperText="At least 6 characters" />

            <Input label="Confirm Password" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={e => setFormData({
            ...formData,
            confirmPassword: e.target.value
          })} error={errors.confirmPassword} />

            <div className="text-sm text-slate-600">
              By signing up, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Privacy Policy
              </a>
            </div>

            {errors.submit && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {errors.submit}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </Card>

        {/* Login Link */}
        <p className="text-center mt-6 text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>;
}