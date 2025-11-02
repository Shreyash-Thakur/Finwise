import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    // Get user data from URL params or make API call to get authenticated user
    const fetchAuthenticatedUser = async () => {
      try {
        // Check for user data in URL params (from Google OAuth redirect)
        const urlParams = new URLSearchParams(window.location.search);
        const userParam = urlParams.get('user');
        const tokenParam = urlParams.get('token');

        if (userParam && tokenParam) {
          // Parse user data from URL params
          const userData = JSON.parse(decodeURIComponent(userParam));
          
          // Store token in localStorage for API access
          localStorage.setItem('accessToken', tokenParam);
          
          // Set user in context
          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            kycStatus: userData.kycStatus || 'pending',
            role: userData.role || 'user'
          });
          
          navigate('/dashboard');
          return;
        }

        // Fallback: Make API call to get authenticated user
        const response = await fetch('http://localhost:5001/api/auth/me', {
          method: 'GET',
          credentials: 'include', // Include cookies for session-based auth
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.user) {
            setUser({
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              kycStatus: result.user.kycStatus || 'pending',
              role: result.user.role || 'user'
            });
            navigate('/dashboard');
          } else {
            console.error('Failed to get authenticated user');
            navigate('/login');
          }
        } else {
          console.error('Failed to get authenticated user');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching authenticated user:', error);
        navigate('/login');
      }
    };

    fetchAuthenticatedUser();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Authentication Successful
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Redirecting you to dashboard...
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccess;