# 📢 Ads Integration & Features Documentation

## 🎯 Advertising System

### Overview
Cleaner Pro integrates Google AdMob with multiple ad formats:
- **Banner Ads** - Persistent bottom/top ads
- **Interstitial Ads** - Full-screen ads between actions
- **Native Ads** - Custom-styled ads (optional)

### Setup Google AdMob

#### Step 1: Create AdMob Account
```
1. Visit: https://admob.google.com
2. Sign in with Google account
3. Click "Create an AdMob account"
4. Follow the setup wizard
```

#### Step 2: Create App & Ad Units
```
1. In AdMob console: "Apps" → "Add App"
2. Select "Android"
3. Create your app entry
4. Create Ad Units:
   - Banner Ad Unit ID
   - Interstitial Ad Unit ID
   - Reward Ad Unit ID (optional)
```

#### Step 3: Get IDs
```
Example IDs:
- App ID: ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy
- Banner: ca-app-pub-3940256099942544/6300978111
- Interstitial: ca-app-pub-3940256099942544/1033173712
- Rewarded: ca-app-pub-3940256099942544/5224354917
```

#### Step 4: Update Configuration

**In `app.json`:**
```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "android_app_id": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy",
          "ios_app_id": "ca-app-pub-yyyyyyyyyy~xxxxxxxxxxxxxx"
        }
      ]
    ]
  }
}
```

**Update `google-services.json`:**
```json
{
  "project_info": {
    "project_number": "123456789",
    "project_id": "cleaner-pro-xxxxx",
    "storage_bucket": "cleaner-pro-xxxxx.appspot.com"
  }
}
```

---

## 📱 Ad Implementation

### Banner Ad Component

**Location:** `components/AdBannerEnhanced.tsx`

```typescript
import { AdBanner } from "@/components/AdBannerEnhanced";

export default function HomeScreen() {
  return (
    <View>
      {/* Your content */}
      <AdBanner /> {/* Banner ad appears here */}
    </View>
  );
}
```

**Features:**
- ✅ Auto-loads on component mount
- ✅ Graceful error handling
- ✅ Dismissible ads
- ✅ Animated entrance/exit
- ✅ Responsive design

### Interstitial Ad Component

```typescript
import { InterstitialAd } from "@/components/AdBannerEnhanced";
import { useState } from "react";

export default function CleanerScreen() {
  const [showAd, setShowAd] = useState(false);

  const handleClean = () => {
    // Show ad before action
    setShowAd(true);
    
    // Close ad after timeout
    setTimeout(() => setShowAd(false), 3000);
  };

  return (
    <View>
      <TouchableOpacity onPress={handleClean}>
        <Text>Start Cleaning</Text>
      </TouchableOpacity>
      
      <InterstitialAd 
        visible={showAd} 
        onClose={() => setShowAd(false)} 
      />
    </View>
  );
}
```

### Ad Unit IDs

**Test Ad Units (Development):**
```
Google's Test Ad Unit IDs:
- Banner: ca-app-pub-3940256099942544/6300978111
- Interstitial: ca-app-pub-3940256099942544/1033173712
- Rewarded: ca-app-pub-3940256099942544/5224354917
- App Open: ca-app-pub-3940256099942544/5662855259
```

**Production Ad Units:**
```
Your Ad Unit IDs (from AdMob console):
- Banner: ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx
- Interstitial: ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx
```

---

## 💰 Ad Placements

### Current Ad Placements

| Location | Type | Format | Show When |
|----------|------|--------|-----------|
| Home Screen | Banner | 320x50 / 300x250 | Always visible |
| Features Screen | Banner | 320x50 | Always visible |
| Before Cleaning | Interstitial | Full Screen | User starts clean |
| Game Optimizer | Banner | 320x50 | Always visible |
| File Manager | Banner | 320x50 | Always visible |

### Recommended Ad Placements (Optional)
```typescript
// Before premium action
if (!isPremium) {
  showInterstitialAd();
}

// Every 3rd action
if (actionCount % 3 === 0) {
  showInterstitialAd();
}

// App open
showAppOpenAd();

// Natural breaks in content
showRewardedAd();
```

---

## 🎨 Enhanced Features (New in v2.0)

### 1. Advanced Features Screen

**File:** `app/(tabs)/features.tsx`

Features available:
- **App Cache Cleaner** - Remove cache from all apps
- **Duplicate File Finder** - Detect duplicate files
- **Large File Manager** - Find large files
- **Battery Optimizer** - Extend battery life
- **RAM Manager** - Smart memory management
- **Startup Apps Manager** - Control startup apps
- **Privacy Cleaner** - Remove browsing history
- **Auto Backup** - Cloud backup integration

**UI Features:**
- 8 advanced features with categories
- Expandable feature cards
- 3D effect cards
- Category filtering
- Daily tips & tricks

### 2. 3D Visual Components

**Card3D Component:**
```typescript
import { Card3D } from "@/components/Card3D";

<Card3D 
  colors={["#0D1B3E", "#0F2050", "#091630"]}
  intensity={1.2}
>
  {/* Content */}
</Card3D>
```

**Icon3D Component:**
```typescript
import { Icon3D } from "@/components/Icon3D";

<Icon3D 
  name="broom"
  size={48}
  color="#00D4FF"
  intensity="high"
/>
```

---

## 📊 Analytics & Monitoring

### Track Ad Events

```typescript
// Banner ad loaded
const handleAdLoaded = () => {
  console.log("Banner ad loaded");
  // Track in analytics
};

// Ad clicked
const handleAdClicked = () => {
  console.log("User clicked ad");
  // Track conversion
};

// Ad closed
const handleAdClosed = () => {
  console.log("Ad dismissed");
  // Track engagement
};
```

### Monitor Ad Revenue

In AdMob Console:
1. Navigate to "Reports" → "Overview"
2. Check:
   - Estimated Earnings
   - Ad Impressions
   - CTR (Click-Through Rate)
   - CPM (Cost Per Mille)

---

## 🔒 User Privacy & Compliance

### Privacy Policy
Add to your app description:
```
"This app uses Google AdMob to display advertisements. 
Ads are personalized based on user interests and location. 
For more information, see our Privacy Policy at [URL]"
```

### GDPR Compliance
```kotlin
// In Android code
MobileAds.setRequestConfiguration(
    RequestConfiguration.Builder()
        .setTagForChildDirectedTreatment(TAG_FOR_CHILD_DIRECTED_TREATMENT_FALSE)
        .setMaxAdContentRating(MAX_AD_CONTENT_RATING_PG)
        .build()
)
```

### Ad Choices
Disclose:
- What data is being collected
- How it's being used
- How to opt-out

---

## 🧪 Testing & QA

### Test Device Setup

**Add Test Device:**
```bash
# In App.tsx or main component
import { MobileAds } from '@react-native-google-mobile-ads/react-native-google-mobile-ads';

MobileAds()
  .initialize()
  .then(adapterStatuses => {
    console.log('Ads initialized');
  });

// Add test device
MobileAds().setRequestConfiguration({
  testDeviceIdentifiers: ['EMULATOR', 'YOUR_DEVICE_ID'],
});
```

### Check Ad Status

```bash
# In Google Play Console
1. Go to your app
2. Check "Ads" section
3. Verify ad networks are active
4. Monitor violations (if any)
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| No ads showing | Test device | Add device to test list |
| Ad unit invalid | Wrong ID | Copy exact ID from AdMob |
| Low revenue | Poor placement | Move ads to high-traffic areas |
| Violations | Misleading ads | Follow Google's ad policy |

---

## 💡 Monetization Strategies

### 1. Balanced Ad Placement
```
✓ Banner ads on all screens (low intrusion)
✓ 1-2 interstitials per session
✗ Avoid excessive ads (reduce retention)
```

### 2. Premium Option
```typescript
// Offer premium version
const Premium = () => (
  <TouchableOpacity onPress={buyPremium}>
    <Text>Remove Ads - $0.99</Text>
  </TouchableOpacity>
);
```

### 3. Reward-Based Ads
```typescript
// Offer rewards for watching ads
showRewardedAd().then(reward => {
  if (reward.type === 'ad_rewarded') {
    grantReward(); // e.g., premium feature access
  }
});
```

### 4. Progressive Ad Integration
```
Week 1: No ads (hook users)
Week 2: Light banners (5% of screen)
Week 3: Interstitials + banners (revenue)
Week 4+: Premium offer (convert)
```

---

## 📈 Revenue Expectations

Based on industry averages:

| Metric | Range |
|--------|-------|
| CPM (USA) | $5 - $15 |
| CPM (Global) | $2 - $8 |
| CTR | 1% - 3% |
| Estimated Monthly (10K users) | $100 - $500 |

**Factors affecting revenue:**
- Geographic location of users
- App category (Utilities = higher CPM)
- Ad quality & placement
- User engagement
- Device type (iOS > Android CPM)

---

## 🚀 Best Practices

### Do's ✅
- Place ads at natural breaks
- Use relevant ad types
- Monitor ad quality
- Respect user experience
- Disclose ad usage
- Follow Google's policies

### Don'ts ❌
- Hide ads or deceive users
- Incentivize ad clicks
- Cover content with ads
- Violate ad policies
- Use fake impressions
- Overload with ads

---

## 📞 Support & Resources

### Official Documentation
- [Google AdMob Docs](https://developers.google.com/admob/android)
- [React Native Google Mobile Ads](https://www.npmjs.com/package/react-native-google-mobile-ads)
- [Expo Ads Documentation](https://docs.expo.dev/)

### Help & Troubleshooting
- AdMob Support: https://support.google.com/admob
- Community: Stack Overflow (tag: admob)
- Issues: GitHub Issues

---

**Last Updated:** June 2024
**AdMob API:** Google Mobile Ads v14+
**Supported Platforms:** Android 5.0+ | iOS 12.0+
