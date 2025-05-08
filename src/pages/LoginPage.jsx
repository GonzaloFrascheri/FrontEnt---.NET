import { useContext } from 'react';
import AuthForm from '../components/AuthForm';
import { AuthContext } from '../context/AuthContext';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

export default function LoginPage() {
  const { user } = useContext(AuthContext);

  const handleEmailPassword = ({ email, password }) => {
    // Por ahora no funcional, luego integrarás:
    console.log('Credenciales:', email, password);
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        console.log('Usuario Google:', result.user);
      })
      .catch(err => console.error(err));
  };

  if (user) {
    return <p>Ya estás logueado como {user.email}</p>;
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
