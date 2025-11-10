# ScanQR

Una aplicación móvil de React Native para escaneo de códigos QR y gestión de asistentes.

## Características

- **Escaneo de QR**: Escaneo en tiempo real con validación instantánea
- **Gestión de Asistentes**: Visualización y administración de asistentes con tarjetas interactivas
- **Gestión de Operadores**: Panel de administración para gestionar operadores del sistema
- **Indicador de Conexión**: Monitoreo del estado de conexión con el servidor
- **Búsqueda Avanzada**: Búsqueda de asistentes por nombre o DNI
- **Estadísticas**: Contadores en tiempo real de asistentes y eventos
- **Temas Personalizables**: Soporte para temas claros y oscuros
- **Feedback de Audio**: Sonidos de confirmación y error para acciones

## Tecnologías

- **React Native** - Framework de desarrollo móvil
- **Expo** - Plataforma de desarrollo y construcción
- **TypeScript** - Tipado estático
- **Expo Camera** - Acceso a la cámara para escaneo QR
- **Expo AV** - Reproducción de audio
- **AsyncStorage** - Almacenamiento local persistente

## Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Expo CLI
- Android Studio (para Android) o Xcode (para iOS)

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/Hugo0507/ScanQR.git
cd ScanQR
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo de configuración con la URL de tu API backend en `src/services/apiService.ts`

## Ejecución

### Modo desarrollo con Expo

```bash
npm start
```

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

## Estructura del Proyecto

```
ScanQR/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── AttendeeCard.tsx
│   │   ├── AttendeeSearch.tsx
│   │   ├── ConnectionStatus.tsx
│   │   ├── DeleteConfirmationModal.tsx
│   │   ├── PersonInfoModal.tsx
│   │   ├── QRScanner.tsx
│   │   ├── RoleBadge.tsx
│   │   └── StatsCounter.tsx
│   ├── screens/         # Pantallas de la aplicación
│   │   ├── AttendeeDetailScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── MainScreen.tsx
│   │   ├── OperatorManagementScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/        # Servicios de API
│   │   ├── apiService.ts
│   │   ├── authService.ts
│   │   └── settingsService.ts
│   ├── context/         # Context API
│   │   └── ThemeContext.tsx
│   ├── utils/           # Utilidades
│   │   └── validation.ts
│   ├── types/           # Definiciones de TypeScript
│   │   └── index.ts
│   └── styles/          # Estilos y temas
│       └── theme.ts
├── assets/              # Recursos estáticos
│   ├── icon.png
│   ├── splash.png
│   └── sounds/
├── android/             # Configuración Android
└── App.tsx              # Punto de entrada
```

## Pantallas Principales

### LoginScreen
Pantalla de autenticación para operadores con validación de credenciales.

### MainScreen
Pantalla principal con:
- Escáner QR
- Lista de asistentes
- Búsqueda
- Estadísticas

### AttendeeDetailScreen
Vista detallada de información del asistente.

### OperatorManagementScreen
Panel de administración para gestionar operadores.

### SettingsScreen
Configuración de la aplicación y preferencias de usuario.

## Configuración

### Permisos de Cámara

La aplicación requiere permisos de cámara para el escaneo de códigos QR. Los permisos están configurados en `app.json`:

```json
"permissions": [
  "android.permission.CAMERA"
]
```

### Configuración de Red

Para desarrollo local, asegúrate de configurar `network_security_config.xml` para permitir tráfico HTTP cleartext a tu servidor de desarrollo.

## API Backend

La aplicación se conecta a un backend REST API. Configura la URL base en `src/services/apiService.ts`:

```typescript
const API_URL = 'http://tu-servidor:puerto';
```

### Endpoints principales:
- `POST /api/login` - Autenticación
- `GET /api/attendees` - Obtener asistentes
- `POST /api/scan` - Registrar escaneo QR
- `GET /api/operators` - Gestión de operadores

## Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es privado y de uso personal.

## Contacto

Hugo - [@Hugo0507](https://github.com/Hugo0507)

Link del Proyecto: [https://github.com/Hugo0507/ScanQR](https://github.com/Hugo0507/ScanQR)
