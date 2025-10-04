import { useState } from 'react';
import { Alert } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import MainScreen from './src/screens/MainScreen';
import { Screen, ScannedQR } from './src/types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Estados de Login/Registro
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');

  // Estados de QR
  const [scannedQRs, setScannedQRs] = useState<ScannedQR[]>([]);

  // ===== FUNCIONES DE AUTENTICACIÓN =====

  function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsLoggedIn(true);
    setCurrentScreen('main');
    Alert.alert('¡Bienvenido!', `Hola ${email.split('@')[0]}`);
  }

  function handleRegister() {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    Alert.alert('¡Registro exitoso!', 'Ahora puedes iniciar sesión', [
      {
        text: 'OK',
        onPress: () => {
          setCurrentScreen('login');
          setPassword('');
          setConfirmPassword('');
        }
      }
    ]);
  }

  function handleForgotPassword() {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }

    Alert.alert(
        'Email enviado',
        `Se ha enviado un enlace de recuperación a ${email}`,
        [
          {
            text: 'OK',
            onPress: () => setCurrentScreen('login')
          }
        ]
    );
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setCurrentScreen('login');
    setEmail('');
    setPassword('');
    setName('');
    setScannedQRs([]);
  }

  function resetFields() {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  }

  function handleNavigate(screen: Screen) {
    setCurrentScreen(screen);
    if (screen === 'login' || screen === 'register') {
      resetFields();
    }
  }

  // ===== FUNCIONES DE QR =====

  function handleQRScanned(data: string) {
    const newQR: ScannedQR = {
      id: Date.now().toString(),
      data: data,
      timestamp: new Date(),
    };

    setScannedQRs(prevQRs => [newQR, ...prevQRs]);
  }

  function handleDeleteQR(id: string) {
    setScannedQRs(prevQRs => prevQRs.filter(qr => qr.id !== id));
  }

  function handleClearAll() {
    setScannedQRs([]);
  }

  // ===== RENDERIZADO DE PANTALLAS =====

  if (currentScreen === 'login') {
    return (
        <LoginScreen
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onLogin={handleLogin}
            onNavigate={handleNavigate}
        />
    );
  }

  if (currentScreen === 'register') {
    return (
        <RegisterScreen
            name={name}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            onNameChange={setName}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onRegister={handleRegister}
            onNavigate={handleNavigate}
        />
    );
  }

  if (currentScreen === 'forgotPassword') {
    return (
        <ForgotPasswordScreen
            email={email}
            onEmailChange={setEmail}
            onSubmit={handleForgotPassword}
            onNavigate={handleNavigate}
        />
    );
  }

  return (
      <MainScreen
          userName={name || email.split('@')[0]}
          scannedQRs={scannedQRs}
          onLogout={handleLogout}
          onQRScanned={handleQRScanned}
          onDeleteQR={handleDeleteQR}
          onClearAll={handleClearAll}
      />
  );
}