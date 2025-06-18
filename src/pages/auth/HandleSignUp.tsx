import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const HandleSignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL hash
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('token');
    const type = params.get('type');

    if (token && type === 'recovery') {
      // Verify the token first
      navigate(`/auth/set-password?token=${token}`);
    } else {
      // No valid token found, redirect to token entry
      navigate('/auth/signup-token');
    }
  }, [navigate, location]);

  return <div className="flex items-center justify-center min-h-screen">Processing...</div>;
};