# Firebase-Only Storage Implementation

## Overview
The authentication system has been updated to store **all user data exclusively in Firebase**, with no persistent credential storage in browser password managers or passkey systems.

## What Changed

### Previous Implementation
- Used WebAuthn to create persistent passkeys
- Credentials were stored in browser's credential manager (Google Password Manager, iCloud Keychain, etc.)
- Credential data was also stored in Firebase

### New Implementation
- Uses biometric verification (Touch ID) for identity confirmation only
- Stores **only user profile data** in Firebase (no WebAuthn credentials)
- Uses a device identifier instead of persistent passkeys
- No data appears in password managers or passkey systems

## Technical Details

### Data Storage

**Firebase Collections:**

1. **`users` collection** - User profiles stored in Firebase:
   ```javascript
   {
     id: "auto-generated-firebase-id",
     name: "User Name",
     deviceId: "device_timestamp_randomstring",
     lastSeen: "ISO timestamp",
     createdAt: "ISO timestamp",
     authMethod: "biometric-device",
     deviceInfo: {
       userAgent: "browser info",
       platform: "device platform"
     }
   }
   ```

2. **`activeSessions` collection** - Active sessions:
   ```javascript
   {
     userId: "user-firebase-id",
     userName: "User Name",
     startTime: "ISO timestamp",
     station: "start",
     createdAt: "ISO timestamp"
   }
   ```

3. **`taps` collection** - Session records:
   ```javascript
   {
     userId: "user-firebase-id",
     userName: "User Name",
     station: "start" or "stop",
     timestamp: "ISO timestamp",
     duration: seconds,
     authMethod: "biometric-device",
     createdAt: "ISO timestamp"
   }
   ```

### Device Identification
- Each device gets a unique identifier stored in `localStorage`
- Format: `device_[timestamp]_[random-string]`
- Stored as: `stairStreak_deviceId`

### Biometric Verification
- Uses Touch ID/Face ID for identity verification
- Does NOT create persistent passkeys
- Uses `residentKey: "discouraged"` flag
- Uses `attestation: "none"` to avoid credential storage
- Falls back to device verification if biometric unavailable

## User Experience

### Registration Flow
1. User clicks "Register New User"
2. Enters their name
3. System requests Touch ID verification
4. User profile is saved to Firebase (no passkey created)
5. Device identifier is stored in localStorage

### Authentication Flow
1. User touches fingerprint sensor
2. System verifies biometric (or uses device check)
3. Looks up user in Firebase by device ID
4. Returns user profile from Firebase
5. No passkey lookup in password managers

## Benefits

✅ **No Passkey Clutter** - Nothing saved in Google Password Manager or iCloud Keychain  
✅ **Firebase-Only Storage** - All data centralized in one place  
✅ **Still Secure** - Uses biometric verification when available  
✅ **Device-Specific** - Each device maintains its own user associations  
✅ **Privacy-Friendly** - Minimal data stored, no credential proliferation  

## Limitations

⚠️ **Device-Specific** - Users are tied to the device they registered on  
⚠️ **No Cross-Device Sync** - Registration on one device doesn't carry to others  
⚠️ **LocalStorage Dependency** - Clearing browser data removes device association  

## Files Modified

1. **`src/js/modules/fingerprint-auth.js`** - Complete rewrite to use device-based auth
2. **`src/js/modules/start-station.js`** - Added registration modal and button
3. **`src/js/config/firebase-config.js`** - Added necessary Firebase imports

## Testing

To test the new system:

1. **Register a new user:**
   - Open the start station page
   - Click "➕ Register New User"
   - Enter a name
   - Verify with Touch ID
   - Check Firebase console - should see user in `users` collection

2. **Authenticate:**
   - Touch fingerprint sensor or click the Touch ID area
   - System should authenticate without creating passkey
   - Check that no new entries appear in password manager

3. **Complete a session:**
   - Authenticate at start station
   - Go to stop station and authenticate
   - Check Firebase for session data in `taps` collection

## Migration Notes

If you have existing users with WebAuthn credentials, they will need to re-register using the new system. The old WebAuthn credentials will remain in their password managers but won't be used by the new system.

To clean up old credentials, users can manually delete them from their password manager settings.

---

**Last Updated:** October 8, 2025  
**Version:** 2.0 (Firebase-Only Storage)
