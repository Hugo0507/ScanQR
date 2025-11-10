import { useState, useEffect } from 'react';
import { Alert, ActivityIndicator, View, Modal } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import MainScreen from './src/screens/MainScreen';
import AttendeeDetailScreen from './src/screens/AttendeeDetailScreen';
import OperatorManagementScreen from './src/screens/OperatorManagementScreen';
import DeleteConfirmationModal from './src/components/DeleteConfirmationModal';
import { Screen, ScannedQR, AttendeeData, UserRole } from './src/types';
import { authService } from './src/services/authService';
import type { UserData } from './src/services/authService';
import { apiService } from './src/services/apiService';
import type { SearchResult } from './src/types';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

function AppContent() {
  const { colors } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Estados de Login
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [userData, setUserData] = useState<UserData | null>(null);

  // Estados de QR y Asistentes
  const [scannedQRs, setScannedQRs] = useState<ScannedQR[]>([]);
  const [currentAttendee, setCurrentAttendee] = useState<AttendeeData | null>(null);
  const [showAttendeeDetail, setShowAttendeeDetail] = useState<boolean>(false);

  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [operatorManagementVisible, setOperatorManagementVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        const user = await authService.getUserData();
        if (user) {
          setUserData(user);
          setEmail(user.email);
          setIsLoggedIn(true);
          setCurrentScreen('main');
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin() {
    try {
      const user = await authService.login(email, password);
      await authService.saveAuth(user);

      setUserData(user);
      setIsLoggedIn(true);
      setCurrentScreen('main');

      const roleLabel = user.role === 'admin' ? 'Administrador' : 'Operador';

      Alert.alert('Bienvenido', `${user.name}\nRol: ${roleLabel}`);
    } catch (error) {
      Alert.alert('Error', 'Credenciales inválidas');
      throw error;
    }
  }

  async function handleForgotPassword() {
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

  async function handleLogout() {
    try {
      await authService.logout();
      setIsLoggedIn(false);
      setCurrentScreen('login');
      setEmail('');
      setPassword('');
      setUserData(null);
      setScannedQRs([]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  }

  function handleNavigate(screen: Screen) {
    setCurrentScreen(screen);
    if (screen === 'login') {
      setEmail('');
      setPassword('');
    }
  }

  function handleQRScanned(attendeeData: AttendeeData) {
    setCurrentAttendee(attendeeData);
    setShowAttendeeDetail(true);
  }

  async function handleConfirmEntry() {
    if (!currentAttendee || !userData) return;

    try {
      // Mark as used in the backend
      await apiService.markAsUsed(currentAttendee.qrCode, currentAttendee.purchaseId, userData.id);

      const newQR: ScannedQR = {
        id: Date.now().toString(),
        qrCode: currentAttendee.qrCode,
        attendeeName: currentAttendee.attendeeName,
        totalTickets: currentAttendee.totalTickets,
        purchaseId: currentAttendee.purchaseId,
        timestamp: new Date(),
        status: currentAttendee.status,
        alreadyScanned: false,
        scannedBy: userData.id,
        operatorName: userData.name,
      };

      setScannedQRs(prevQRs => [newQR, ...prevQRs]);
      setShowAttendeeDetail(false);
      setCurrentAttendee(null);

      Alert.alert(
          'Ingreso confirmado',
          `${currentAttendee.attendeeName} - ${currentAttendee.totalTickets} ${currentAttendee.totalTickets === 1 ? 'persona' : 'personas'} registradas`,
          [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el ingreso. Intenta nuevamente.');
    }
  }

  function handleCancelEntry() {
    setShowAttendeeDetail(false);
    setCurrentAttendee(null);
  }

  function handleDeleteQR(id: string) {
    setRecordToDelete(id);
    setDeleteModalVisible(true);
  }

  async function handleConfirmDelete(password: string): Promise<boolean> {
    if (!userData || password !== 'admin123' && password !== 'opera123') {
      return false;
    }

    if (!recordToDelete) return false;

    setScannedQRs(prevQRs => prevQRs.filter(qr => qr.id !== recordToDelete));
    setDeleteModalVisible(false);
    setRecordToDelete(null);
    return true;
  }

  function handleClearAll() {
    if (!userData || userData.role !== 'admin') {
      Alert.alert('Permiso denegado', 'Solo los administradores pueden limpiar el historial');
      return;
    }
    setScannedQRs([]);
  }

  function handleSelectFromSearch(result: SearchResult) {
    setSearchModalVisible(false);

    if (result.hasEntered) {
      Alert.alert(
          'Ya ingresó previamente',
          `${result.attendeeName} ya registró su entrada al evento.\n\nID: ${result.purchaseId}\nEntradas: ${result.totalTickets}\n\nNo se puede registrar nuevamente.`,
          [{ text: 'OK' }]
      );
      return;
    }

    const alreadyInHistory = scannedQRs.some(qr =>
        qr.qrCode === result.qrCode || qr.purchaseId === result.purchaseId
    );

    if (alreadyInHistory) {
      Alert.alert(
          'Ya registrado en esta sesión',
          `${result.attendeeName} ya fue registrado en esta sesión.\n\nID: ${result.purchaseId}`,
          [{ text: 'OK' }]
      );
      return;
    }

    const attendeeData: AttendeeData = {
      qrCode: result.qrCode || '',
      attendeeName: result.attendeeName,
      totalTickets: result.totalTickets,
      purchaseId: result.purchaseId,
      hasEntered: result.hasEntered,
    };
    handleQRScanned(attendeeData); 
  }

  // Filtrar QRs según rol
  const filteredQRs = userData && userData.role === 'admin'
      ? scannedQRs // Admin ve todos
      : scannedQRs.filter(qr => qr.scannedBy === userData?.id); // Operador solo ve los suyos

  if (isLoading) {
    return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background
        }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
  }

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
      <>
        <MainScreen
            userName={userData?.name || email.split('@')[0]}
            userRole={userData?.role || 'operador'}
            userId={userData?.id || ''}
            scannedQRs={filteredQRs}
            onLogout={handleLogout}
            onQRScanned={handleQRScanned}
            onDeleteQR={handleDeleteQR}
            onClearAll={handleClearAll}
            onOpenOperatorManagement={userData?.role === 'admin' ? () => setOperatorManagementVisible(true) : undefined}
        />

        {/* Modal de detalles del asistente - Pantalla completa */}
        <Modal
            visible={showAttendeeDetail}
            animationType="slide"
            presentationStyle="fullScreen"
        >
          {currentAttendee && (
              <AttendeeDetailScreen
                  attendeeData={currentAttendee}
                  onConfirm={handleConfirmEntry}
                  onCancel={handleCancelEntry}
              />
          )}
        </Modal>

        {/* Modal de gestión de operadores (Admin only) */}
        {userData?.role === 'admin' && (
          <Modal
              visible={operatorManagementVisible}
              animationType="slide"
              presentationStyle="fullScreen"
          >
            <OperatorManagementScreen
                onClose={() => setOperatorManagementVisible(false)}
                currentUserPassword={password}
            />
          </Modal>
        )}

        {/* Modal de confirmación de eliminación */}
        <DeleteConfirmationModal
            visible={deleteModalVisible}
            onConfirm={handleConfirmDelete}
            onCancel={() => {
              setDeleteModalVisible(false);
              setRecordToDelete(null);
            }}
            itemDescription="registro"
        />
      </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}