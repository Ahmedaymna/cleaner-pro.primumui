# 🔧 Build Optimization & Troubleshooting Guide

## ✅ Pre-Build Checklist

### 1. Dependencies & Compatibility
```bash
# ✓ Check Node version (v20+)
node --version

# ✓ Check npm/pnpm version
npm --version
pnpm --version

# ✓ Check Java version (JDK 17)
java -version

# ✓ Verify Android SDK
$ANDROID_HOME/cmdline-tools/tools/bin/sdkmanager --list_installed
```

### 2. Clean Previous Builds
```bash
# Clear npm cache
npm cache clean --force
pnpm store prune

# Remove node_modules
rm -rf node_modules
rm -rf pnpm-lock.yaml

# Clean Android builds
cd android && ./gradlew clean
cd .. && rm -rf android/build

# Clear Expo cache
rm -rf .expo
```

### 3. Fresh Install
```bash
pnpm install --force
# or
npm ci
```

---

## 🚀 Build Commands

### Local Android APK (Fastest)
```bash
# Debug APK
cd android
./gradlew assembleDebug --no-daemon

# Release APK (Optimized)
./gradlew assembleRelease --no-daemon

# Building with warnings shown
./gradlew assembleRelease --no-daemon --warning-mode all
```

### EAS Build (Recommended)
```bash
# Preview (Smaller, faster)
eas build --platform android --profile preview --non-interactive

# Production (Optimized, obfuscated)
eas build --platform android --profile production --non-interactive --wait

# With logs
eas build --platform android --profile production --non-interactive --wait --verbose
```

### GitHub Actions Workflow
```bash
# Trigger workflow
git push origin main

# Or manually
gh workflow run build-android.yml \
  --ref main \
  -f profile=production
```

---

## ⚠️ Common Build Errors & Solutions

### 1. ❌ react-native-reanimated Deprecated Features

**Error:**
```
FAILURE: Build failed with an exception.
* What went wrong:
A problem occurred evaluating project ':react-native-reanimated'.
Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.
```

**Solution:**
```bash
# Update to latest reanimated
pnpm add react-native-reanimated@latest

# Update gradle version
cd android
./gradlew wrapper --gradle-version=8.14.3
cd ..
```

### 2. ❌ kotlinOptions Deprecated

**Error:**
```
'kotlinOptions(...) is deprecated. Please migrate to the compilerOptions DSL.
```

**Solution:**
Update `build.gradle.kts` files:
```kotlin
// ❌ Old way
kotlinOptions {
    jvmTarget = "17"
}

// ✓ New way
compilerOptions {
    jvmTarget.set(JvmTarget.JVM_17)
}
```

### 3. ❌ Gradle Daemon Issues

**Error:**
```
Daemon is in an unexpected state. Stopping it.
```

**Solution:**
```bash
# Kill daemon
./gradlew --stop

# Build with no-daemon
./gradlew assembleDebug --no-daemon
```

### 4. ❌ NDK Version Mismatch

**Error:**
```
NDK not found at ndk/27.1.12297006
```

**Solution:**
```bash
# Install NDK via SDK Manager
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "ndk;27.1.12297006"

# Or update in build.gradle
ndkVersion = "27.1.12297006"
```

### 5. ❌ JavaScript Process Finished with Error

**Error:**
```
> Process 'command 'node'' finished with non-zero exit value 1
```

**Solution:**
```bash
# Update Expo CLI
npm install -g @expo/cli@latest

# Clear Expo cache
rm -rf .expo

# Reinstall dependencies
pnpm install --force
```

### 6. ❌ Java Version Issues

**Error:**
```
java.lang.UnsupportedClassVersionError
```

**Solution:**
```bash
# Check Java version
java -version

# Ensure JDK 17 is set
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

# Verify
echo $JAVA_HOME
```

### 7. ❌ Memory Issues

**Error:**
```
java.lang.OutOfMemoryError: Java heap space
```

**Solution:**
```bash
# Increase Gradle heap
export GRADLE_OPTS="-Xmx4096m -Xms2048m"

# Or in gradle.properties
cd android
echo 'org.gradle.jvmargs=-Xmx4096m -Xms2048m' >> gradle.properties
```

### 8. ❌ Plugin Compatibility Issues

**Error:**
```
Could not resolve dependency for ':app@debug/compileClasspath'
```

**Solution:**
```bash
# Update all plugins
cd android
./gradlew wrapper --gradle-version=8.14.3

# Check for conflicts
./gradlew dependencies

# Or rebuild gradle lock file
./gradlew --refresh-dependencies
```

---

## 🎯 Optimization Tips

### 1. Use Hermes Engine
```json
{
  "expo": {
    "jsEngine": "hermes"
  }
}
```
Benefits: Smaller APK, faster startup, lower memory

### 2. Enable Proguard/R8 (Release Builds)
```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### 3. Use App Bundles (AAB) for Play Store
```bash
# Instead of APK
./gradlew bundleRelease
```
Benefits: Smaller download size, dynamic delivery

### 4. Optimize Images
```bash
# Use WebP format for images
# Reduce resolution where possible
# Use expo-image for lazy loading
```

### 5. Code Splitting
```bash
# Enable in app.json
"experiments": {
  "typedRoutes": true,
  "reactCompiler": true
}
```

---

## 📊 Build Performance Monitoring

### Measure Build Time
```bash
# Gradle build scan
./gradlew build --scan

# Profile build
./gradlew build --profile
```

### Check APK Size
```bash
# Get apk size
ls -lh app/build/outputs/apk/release/*.apk

# Analyze APK contents
./gradlew bundleReleaseAnalyzeBundle
```

### Monitor Gradle Daemon
```bash
# Check daemon status
./gradlew --status

# Daemon info
./gradlew --info
```

---

## 🔐 Build Security

### Sign APK/AAB
```bash
# Create keystore (one time)
keytool -genkey -v -keystore my-release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias

# Update build.gradle
signingConfigs {
    release {
        storeFile file('my-release-key.keystore')
        storePassword 'password'
        keyAlias 'my-key-alias'
        keyPassword 'password'
    }
}
```

### Enable ProGuard Rules
Create `proguard-rules.pro`:
```proguard
# Preserve native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Preserve enum values
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Preserve custom exceptions
-keep public class * extends java.lang.Throwable
```

---

## 🚀 CI/CD Best Practices

### GitHub Actions Workflow
```yaml
- name: Cache Gradle
  uses: gradle/gradle-build-action@v2
  with:
    cache-read-only: false

- name: Cache Node
  uses: actions/setup-node@v4
  with:
    cache: 'npm'

- name: Build with timeout
  timeout-minutes: 120
  run: eas build --non-interactive --wait
```

### Environment Variables
```bash
# .env.production
NODE_ENV=production
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_TOKEN=your-token-here
```

---

## ✅ Final Checklist

Before release build:
- [ ] All dependencies updated
- [ ] No console errors or warnings
- [ ] Ads configured with real IDs
- [ ] Permissions in app.json
- [ ] google-services.json present
- [ ] Version bumped (app.json)
- [ ] Signing key configured
- [ ] ProGuard rules set
- [ ] Privacy policy linked
- [ ] Screenshots prepared

---

## 📝 Build Log Examples

### ✅ Successful Build Output
```
BUILD SUCCESSFUL in 2m 34s
234 actionable tasks: 234 executed
APK built: app/build/outputs/apk/release/app-release.apk
Size: 45.2 MB
```

### ❌ Failed Build Output
```
FAILURE: Build failed with an exception.
* Where:
Build file '/path/to/build.gradle' line: 53
* What went wrong:
A problem occurred evaluating project ':react-native-reanimated'.
```

---

## 🔗 Useful Resources

- [Gradle Docs](https://docs.gradle.org/)
- [EAS Build Docs](https://docs.expo.dev/build/)
- [React Native Docs](https://reactnative.dev/)
- [Android Dev Docs](https://developer.android.com/)

---

**Last Updated:** June 2024
**Build System:** Gradle 8.14.3 + EAS Build
**Target SDK:** 34 | Min SDK:** 24
