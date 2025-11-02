import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PageContainer } from '../components/layout/PageContainer';

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');

        console.log('AuthSuccess - Token:', token ? 'Present' : 'Missing');
        console.log('AuthSuccess - User param:', userParam ? 'Present' : 'Missing');
        console.log('AuthSuccess - Full URL:', window.location.href);

        if (token && userParam) {
          console.log('AuthSuccess - Parsing user data...');
          let user;
          try {
            user = JSON.parse(decodeURIComponent(userParam));
            console.log('AuthSuccess - Parsed user:', user);
          } catch (parseError) {
            console.error('AuthSuccess - JSON parse error:', parseError);
            throw new Error('Failed to parse user data');
          }
          
          console.log('AuthSuccess - Attempting login with token...');
          const success = await loginWithToken(user, token);
          console.log('AuthSuccess - Login result:', success);
          
          if (success) {
            console.log('AuthSuccess - Redirecting to dashboard...');
            navigate('/dashboard', { replace: true });
          } else {
            throw new Error('Failed to authenticate with token');
          }
        } else {
          console.error('AuthSuccess - Missing data. Token:', !!token, 'User:', !!userParam);
          throw new Error('Missing authentication data');
        }
      } catch (error) {
        console.error('Auth success handler error:', error);
        navigate('/login?error=auth_failed', { replace: true });
      }
    };

    handleAuthSuccess();
  }, [searchParams, loginWithToken, navigate]);

  return (
    <PageContainer title="Authenticating...">
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Completing your Google login...
          </h2>
          <p className="text-gray-600 mb-4">
            Please wait while we authenticate your account.
          </p>
          <div className="text-sm text-gray-500">
            Processing authentication data...
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default AuthSuccess;