import { useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import AuthForm from '../../components/AuthForm';
import { AuthContext } from '../../context/AuthContext';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../services/firebase';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleEmailPassword = ({ email, password }) => {
    // Por ahora no funcional, luego integrarás:
    console.log('Credenciales:', email, password);
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        console.log('Usuario Google:', result.user);
        navigate('/', { replace: true });
      })
      .catch(err => console.error('Error Google login:', err));
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <AuthForm
        onSubmit={handleEmailPassword}
        googleLogin={handleGoogleLogin}
      />
    </div>
  );
}