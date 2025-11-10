# ScanQR App Icon Setup Guide

## Overview
This guide explains how to add your custom brand logo as the app icon for your ScanQR application.

## Icon Requirements

### For Android (EAS Build Compatible)

You need to provide the following icon files in the `assets/` folder:

1. **icon.png** (1024x1024px)
   - Main app icon
   - Should be a square PNG file
   - Recommended: 1024x1024 pixels
   - Format: PNG with transparency support

2. **adaptive-icon.png** (1024x1024px)
   - Android adaptive icon foreground
   - Should contain your logo centered
   - Background will be the color specified in app.json (#6366F1)
   - Keep important content in the center (safe zone: ~66% of the icon)
   - Format: PNG with transparency

3. **splash.png** (1284x2778px or similar)
   - Splash screen image
   - Shown when app is launching
   - Recommended dimensions for various devices
   - Format: PNG

## How to Add Your Logo

### Step 1: Prepare Your Logo Files

Create three PNG files from your brand logo:

1. **Standard Icon (icon.png)**
   - 1024x1024 pixels
   - Your logo should fill most of the space
   - Include background if desired

2. **Adaptive Icon (adaptive-icon.png)**
   - 1024x1024 pixels
   - Logo centered in the safe zone (682x682px in the center)
   - Use transparency for background
   - The #6366F1 color will show as background

3. **Splash Screen (splash.png)**
   - Minimum 1284x2778 pixels
   - Your logo centered
   - Can include app name or tagline

### Step 2: Add Files to Project

Place the three files in the `assets/` folder:

```
ScanQR/
├── assets/
│   ├── icon.png
│   ├── adaptive-icon.png
│   └── splash.png
├── src/
├── app.json
└── ...
```

### Step 3: Configuration (Already Done)

The `app.json` file has been configured with the correct paths:

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#6366F1"
    },
    "android": {
      "icon": "./assets/icon.png",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#6366F1"
      }
    }
  }
}
```

### Step 4: Build with EAS

After adding your icon files, build your app:

```bash
# For Android
eas build --platform android

# For development build
eas build --profile development --platform android
```

## Icon Design Tips

### Android Adaptive Icons
- Keep your logo in the center 66% of the image (safe zone)
- Outer 33% may be cropped on some devices
- Use transparency for non-logo areas
- The background color (#6366F1) will show through transparent areas

### Best Practices
- Use vector graphics converted to high-resolution PNG
- Avoid fine details that won't be visible at small sizes
- Test on different Android versions and launchers
- Ensure good contrast between logo and background

## Color Scheme

The app uses the following primary color:
- **Primary Brand Color**: #6366F1 (Indigo)
- This color is used for splash screen and adaptive icon background

You can change this in `app.json` if needed.

## Troubleshooting

### Icons not updating?
1. Clear the build cache: `eas build --clear-cache`
2. Verify file names match exactly (case-sensitive)
3. Check file formats are PNG
4. Ensure files are in the `assets/` folder

### Icon looks cropped on device?
- Reduce logo size to fit within the safe zone (66% center area)
- Test with different Android launchers (Samsung, Google, etc.)

### Build fails?
- Check file paths in app.json are correct
- Ensure all required icon files exist
- Verify PNG files are not corrupted

## Quick Start Checklist

- [ ] Create icon.png (1024x1024px)
- [ ] Create adaptive-icon.png (1024x1024px with safe zone)
- [ ] Create splash.png (1284x2778px)
- [ ] Place all files in `assets/` folder
- [ ] Verify app.json configuration (already set up)
- [ ] Run `eas build --platform android`
- [ ] Test on actual Android device

## Resources

- [Expo Icon Guidelines](https://docs.expo.dev/guides/app-icons/)
- [Android Adaptive Icons](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

---

**Note**: The app.json configuration is already complete. You only need to add your custom icon image files to start using your brand logo!
