# 🚀 Cleaner Pro - Premium Device Cleaner & Optimizer

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS%20%7C%20Web-lightgrey)

> **Professional Mobile Device Cleaner with 3D UI, Advanced Features, and Integrated Ads**

## ✨ Key Features

### 🎯 Main Features
- 🧹 **Quick Cleaner** - Remove junk files and cache instantly
- ⚡ **RAM Booster** - Free up memory for better performance
- 🎮 **Free Fire Settings** - Optimize game performance
- 📁 **File Manager** - Browse and manage device files
- 📊 **Device Analytics** - Real-time device statistics

### 🆕 Advanced Features
- **🗑️ App Cache Cleaner** - Deep clean app caches
- **🔀 Duplicate File Finder** - Find and remove duplicate files
- **📦 Large File Manager** - Identify and manage large files
- **🔋 Battery Optimizer** - Extend battery life
- **💾 RAM Manager** - Intelligent memory management
- **🚀 Startup Apps Manager** - Speed up device boot
- **🔒 Privacy Cleaner** - Remove browsing history & logs
- **☁️ Auto Backup** - Cloud backup of important data

### 🎨 UI/UX
- 3D Card Effects with depth perception
- 3D Rotating Icons
- Animated Gradients
- Smooth Transitions
- Dark Theme (AMOLED optimized)
- Arabic Language Support

### 📢 Monetization
- Google AdMob Integration
- Banner Ads
- Interstitial Ads
- Native Ads Support

---

## 📋 Requirements

### System Requirements
- **Node.js**: v20.x or higher
- **npm/pnpm**: Latest version
- **Java**: JDK 17 (for Android builds)
- **Android SDK**: API 34+ with NDK 27.1.12297006
- **Gradle**: 8.14.3

### Development Tools
```bash
# Global installations
npm install -g @expo/cli@latest
npm install -g eas-cli@latest
npm install -g pnpm@9
```

---

## 🛠️ Installation & Setup

### 1️⃣ Clone & Install Dependencies
```bash
# Clone repository
git clone https://github.com/yourusername/cleaner-pro.git
cd cleaner-pro

# Install dependencies
pnpm install

# Or with npm
npm install
```

### 2️⃣ Configure Google Services
Create `google-services.json` for Firebase/AdMob:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "xxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "your-email@your-project-id.iam.gserviceaccount.com",
  "client_id": "xxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
}
```

### 3️⃣ Update AdMob IDs
In `app.json`, update:
```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "android_app_id": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
        }
      ]
    ]
  }
}
```

### 4️⃣ Configure EAS (Expo Application Services)
```bash
# Initialize EAS
eas init --id cleaner-pro-2024

# Create eas.json if needed
eas login
```

---

## 🚀 Building & Running

### Development Mode
```bash
# Start dev server
pnpm dev
# or
npm run dev
```

### Android Build

#### Local Build (Gradlew)
```bash
cd android
./gradlew clean
./gradlew assembleDebug --no-daemon
# APK will be at: app/build/outputs/apk/debug/app-debug.apk
```

#### Cloud Build with EAS
```bash
# Preview build
eas build --platform android --profile preview --non-interactive

# Production build
eas build --platform android --profile production --non-interactive

# Wait for build to complete
eas build --platform android --profile production --wait
```

#### With GitHub Actions
```bash
# Push to trigger workflow
git push origin main

# Or manually trigger
gh workflow run build-android.yml
```

### iOS Build
```bash
# Preview
eas build --platform ios --profile preview

# Production
eas build --platform ios --profile production
```

---

## 📱 Testing

### On Physical Device
```bash
# Android
adb devices
adb install app-debug.apk

# Or use Expo Go
eas build --platform android --profile development --wait
```

### Testing Ads
1. Use Test Ad Unit IDs during development
2. Ads appear in:
   - Home screen (banner)
   - Before cleaner action (interstitial)
   - Features screen (banner)

### Device Permissions
Ensure these permissions are granted:
- ✅ Storage Access (Read/Write)
- ✅ Internet
- ✅ Get Accounts (for analytics)

---

## 🎛️ Configuration

### Build Profiles (eas.json)
```json
{
  "build": {
    "preview": {
      "android": {
        "gradleCommand": ":app:assembleRelease",
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "gradleCommand": ":app:bundleRelease",
        "buildType": "aab"
      }
    }
  }
}
```

### Environment Variables
Create `.env.production`:
```
EXPO_PUBLIC_API_URL=https://api.cleanerpro.com
EXPO_PUBLIC_ADMOB_APP_ID=ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy
```

---

## 📂 Project Structure
```
cleaner-pro/
├── app/                    # Expo Router
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── cleaner.tsx    # Cleaner screen
│   │   ├── features.tsx   # Advanced features ✨ NEW
│   │   ├── freefire.tsx   # Game optimizer
│   │   └── files.tsx      # File manager
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── Card3D.tsx         # 3D card component ✨ NEW
│   ├── Icon3D.tsx         # 3D icon component ✨ NEW
│   ├── AdBannerEnhanced.tsx # Enhanced ads ✨ NEW
│   ├── CircularProgress.tsx
│   └── GradientCard.tsx
├── hooks/                 # Custom hooks
├── constants/             # App constants
├── assets/                # Images and icons
├── android/               # Android native code
├── .github/workflows/     # CI/CD workflows
├── eas.json               # EAS configuration
├── app.json               # Expo configuration
├── app.production.json    # Production config
└── package.json           # Dependencies
```

---

## 🐛 Troubleshooting

### Build Issues

#### ❌ react-native-reanimated errors
```bash
# Solution: Update dependencies
pnpm update react-native-reanimated

# Clean and rebuild
cd android && ./gradlew clean
```

#### ❌ Gradle wrapper issues
```bash
# Update Gradle
cd android
./gradlew wrapper --gradle-version=8.14.3
```

#### ❌ Node modules issues
```bash
# Clear and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### AdMob Not Showing
1. Check Ad Unit IDs are correct
2. Ensure internet permission is granted
3. Test with real IDs (test IDs won't show on device)
4. Check Google AdMob account is active

### Performance Issues
1. Use Hermes engine (enabled in app.json)
2. Enable production mode for builds
3. Optimize images in assets folder
4. Use lazy loading for screens

---

## 📦 Dependencies

### Core
- `expo`: ^54.0.27
- `react-native`: 0.81.5
- `react`: Latest

### Navigation
- `expo-router`: ~6.0.17

### UI
- `expo-linear-gradient`: ~15.0.8
- `expo-blur`: ~15.0.8
- `react-native-reanimated`: ~4.1.1
- `@expo/vector-icons`: ^15.0.3

### Ads & Analytics
- `react-native-google-mobile-ads`: ^14.11.0

### State Management
- `@tanstack/react-query`: Latest
- `zustand`: (optional)

---

## 🔐 Security

- ✅ No sensitive data in code
- ✅ HTTPS only for API calls
- ✅ Privacy policy compliance
- ✅ GDPR compliant (if EU users)

**Remember**: Add your `google-services.json` to `.gitignore` before pushing!

---

## 📊 Analytics

Integrated analytics track:
- App opens
- Feature usage
- Ad impressions
- Cleaning statistics

---

## 🚀 Deployment

### Play Store
```bash
# Generate signed APK/AAB
eas build --platform android --profile production

# Upload to Play Store Console
# https://play.google.com/console
```

### App Store (iOS)
```bash
# Generate signed IPA
eas build --platform ios --profile production

# Upload with Transporter or TestFlight
# https://appstoreconnect.apple.com
```

---

## 📄 License
MIT License - See LICENSE file

## 👨‍💻 Contributing
Contributions are welcome! Please follow:
1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## 📞 Support & Contact
- 📧 Email: support@cleanerpro.com
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

---

## 🎉 Changelog

### v2.0.0 (Latest)
- ✨ Added advanced features screen
- 🎨 3D card and icon components
- 📢 Enhanced AdMob integration
- 🚀 Improved build workflow
- 🔧 Performance optimizations

### v1.0.0
- Initial release

---

**Happy Cleaning! 🧹✨**
