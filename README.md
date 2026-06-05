# Cleaner Pro 🚀

تطبيق Android احترافي لتنظيف وتحسين أداء الهاتف مع إعدادات Free Fire.

## المميزات

- 🧹 **منظف الهاتف** — حذف ملفات الكاش والملفات المؤقتة وتوفير المساحة
- 🎮 **إعدادات Free Fire** — حساسية ودقة DPI محسوبة تلقائياً حسب جهازك
- 📁 **مدير الملفات** — تصفح، فتح، ومشاركة جميع أنواع الملفات
- 📱 **معلومات الجهاز** — مواصفات كاملة وأدوات إدارة الهاتف
- 💰 **إعلانات AdMob** — بانر + إعلان بيني + مكافأة

## الإعلانات

| النوع | الـ ID |
|-------|--------|
| App ID | `ca-app-pub-6718038985057828~3801271527` |
| مكافأة (Rewarded) | `ca-app-pub-6718038985057828/7252441697` |
| بيني (Interstitial) | `ca-app-pub-6718038985057828/4460277306` |
| بانر (Banner) | `ca-app-pub-6718038985057828/5364644957` |

## بناء APK عبر GitHub Actions

### الخطوات

1. **إنشاء حساب Expo** على [expo.dev](https://expo.dev)
2. **الحصول على EXPO_TOKEN**:
   - اذهب إلى expo.dev → Account Settings → Access Tokens
   - أنشئ token جديد
3. **إضافة الـ Secret في GitHub**:
   - اذهب إلى Repository → Settings → Secrets → Actions
   - أضف `EXPO_TOKEN` بالقيمة التي حصلت عليها
4. **رفع الكود إلى GitHub**
5. **تشغيل الـ Workflow**:
   - اذهب إلى Actions → Build Android APK → Run workflow
   - اختر نوع البناء: `preview` للاختبار أو `production` للنشر
6. **تحميل الـ APK** من قسم Artifacts بعد اكتمال البناء

### إعداد EAS

قبل البناء الأول، شغّل:

```bash
npm install -g eas-cli
eas login
eas build:configure
```

## التشغيل المحلي

```bash
npm install
npx expo start
```

## المتطلبات

- Node.js 20+
- Expo CLI
- EAS CLI (للبناء)
- حساب Expo مجاني

---

صُنع بـ ❤️ باستخدام React Native + Expo
