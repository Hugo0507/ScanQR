# ScanQR Theme Implementation Guide

## Overview
The ScanQR app now supports full **Light** and **Dark** theme functionality with persistent storage. Users can toggle between themes, and their preference is saved locally and restored when the app restarts.

## Implementation Details

### 1. Theme Architecture

#### ThemeContext (`src/context/ThemeContext.tsx`)
A React Context that provides:
- Current theme mode (`light` or `dark`)
- Dynamic color palette based on theme
- `toggleTheme()` function to switch themes
- `setTheme(mode)` function to set specific theme
- Automatic persistence using AsyncStorage

#### Theme Colors (`src/styles/theme.ts`)
Two complete color palettes:
- **lightColors**: Modern light theme with Indigo primary (#6366F1)
- **darkColors**: Dark theme with adjusted colors for readability

### 2. How Theme Switching Works

1. **User Action**: User toggles theme in Settings screen
2. **Context Update**: `ThemeContext` updates the current theme
3. **Persistence**: Theme preference saved to AsyncStorage (`@app_theme` key)
4. **Re-render**: All components using `useTheme()` hook receive new colors
5. **Restoration**: On app restart, saved theme is loaded from AsyncStorage

### 3. Color Palettes

#### Light Theme Colors
```javascript
Primary: #6366F1 (Indigo)
Background: #F9FAFB
Card Background: #FFFFFF
Text: #111827
Border: #E5E7EB
Success: #10B981
Danger: #EF4444
Warning: #F59E0B
```

#### Dark Theme Colors
```javascript
Primary: #818CF8 (Lighter Indigo)
Background: #111827
Card Background: #1F2937
Text: #F9FAFB
Border: #374151
Success: #34D399
Danger: #F87171
Warning: #FBBF24
```

### 4. Using Themes in Your Components

#### For Functional Components

```typescript
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { theme, colors, toggleTheme } = useTheme();

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Current theme: {theme}</Text>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  text: {
    color: colors.text,
  },
});
```

#### Key Points:
1. Import `useTheme` hook
2. Destructure `colors` from the hook
3. Create styles as a function that accepts `colors`
4. Call the style function inside your component

### 5. Updated Components

The following components have been updated to support dynamic theming:

✅ **SettingsScreen**: Theme toggle + dynamic styles
✅ **App.tsx**: Wrapped with ThemeProvider
✅ **ThemeContext**: Created for global theme management

### 6. Remaining Components to Update

To complete full theme support across the entire app, update these files:

#### Screens
- [ ] `src/screens/LoginScreen.tsx`
- [ ] `src/screens/ForgotPasswordScreen.tsx`
- [ ] `src/screens/MainScreen.tsx`
- [ ] `src/screens/AttendeeDetailScreen.tsx`
- [ ] `src/screens/OperatorManagementScreen.tsx`

#### Components
- [ ] `src/components/AttendeeCard.tsx`
- [ ] `src/components/AttendeeSearch.tsx`
- [ ] `src/components/ConnectionStatus.tsx`
- [ ] `src/components/DeleteConfirmationModal.tsx`
- [ ] `src/components/QRScanner.tsx`
- [ ] `src/components/RoleBadge.tsx`
- [ ] `src/components/StatsCounter.tsx`

### 7. How to Update a Component for Theming

#### Step 1: Import useTheme
```typescript
import { useTheme } from '../context/ThemeContext';
```

#### Step 2: Remove static color import
```typescript
// Remove this:
import { colors } from '../styles/theme';
```

#### Step 3: Use the hook
```typescript
function MyComponent() {
  const { colors } = useTheme();
  // ... rest of component
}
```

#### Step 4: Convert styles to function
```typescript
// Before:
const styles = StyleSheet.create({
  container: { backgroundColor: colors.background },
});

// After:
const createStyles = (colors: any) => StyleSheet.create({
  container: { backgroundColor: colors.background },
});
```

#### Step 5: Call styles function
```typescript
function MyComponent() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return <View style={styles.container}>...</View>;
}
```

### 8. Testing Theme Changes

1. **Start the app**: `npm start`
2. **Navigate to Settings**: Tap the gear icon (⚙️)
3. **Toggle theme**: Tap on "Tema" / "Theme" option
4. **Observe changes**: All screens should update immediately
5. **Restart app**: Close and reopen - theme should persist

### 9. Storage Details

- **Storage Key**: `@app_theme`
- **Values**: `'light'` or `'dark'`
- **Storage Method**: AsyncStorage (React Native)
- **Fallback**: Defaults to `'light'` if no saved preference

### 10. Compatibility

✅ Works with EAS Build
✅ Android compatible
✅ Persistent across app restarts
✅ Automatic system theme support via `userInterfaceStyle: "automatic"` in app.json

### 11. Advanced Features

#### System Theme Detection
The app.json is configured with:
```json
"userInterfaceStyle": "automatic"
```

This allows the app to respond to system-wide theme preferences.

#### Custom Theme Colors
To customize theme colors, edit:
- `src/styles/theme.ts` → `lightColors` and `darkColors` objects

### 12. Performance Considerations

- Theme changes trigger re-render of components using `useTheme()`
- Styles are recreated when theme changes (minimal performance impact)
- AsyncStorage operations are async and non-blocking

### 13. Troubleshooting

**Theme not persisting?**
- Check AsyncStorage permissions
- Verify `@app_theme` key is being saved
- Check ThemeContext is wrapping the app correctly

**Colors not updating?**
- Ensure component uses `useTheme()` hook
- Verify styles are created with dynamic `colors` parameter
- Check component is inside ThemeProvider

**Build errors?**
- Import `useTheme` from correct path
- Ensure ThemeContext.tsx exists
- Verify no circular dependencies

---

## Quick Reference

### Toggle Theme Programmatically
```typescript
const { toggleTheme } = useTheme();
toggleTheme(); // Switches between light and dark
```

### Set Specific Theme
```typescript
const { setTheme } = useTheme();
setTheme('dark'); // Force dark theme
setTheme('light'); // Force light theme
```

### Get Current Theme
```typescript
const { theme } = useTheme();
console.log(theme); // 'light' or 'dark'
```

### Access Theme Colors
```typescript
const { colors } = useTheme();
console.log(colors.primary); // Current theme's primary color
```

---

**Implementation Status**: ✅ Core theming complete, ready for full app integration
