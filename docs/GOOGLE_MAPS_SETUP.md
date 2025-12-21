# Google Maps Setup

The location picker uses Google Maps to allow users to select and adjust their location on a map.

## Configuration Required

To use the map picker functionality, you need to add your Google Maps API key securely using environment variables.

### 1. Get API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
4. Create an API key (can be used for both Android and iOS)

### 2. Add API Key to .env

**✅ Secure Method (Recommended)**

Create or update the `.env` file in the root directory:

```bash
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Important:** The `.env` file is already gitignored and will NOT be committed to version control.

For other developers, copy `.env.example` to `.env` and add your own key.

### 3. Restrict Your API Key (CRITICAL)

⚠️ **This step is mandatory to prevent unauthorized usage and unexpected billing:**

1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Select your API key
3. Add **API restrictions:**
   - Maps SDK for Android
   - Maps SDK for iOS
4. Add **Application restrictions:**
   - Android: Add your package name + SHA-1 certificate fingerprint
   - iOS: Add your bundle identifier

### 4. Restart Expo

After adding your API key, restart the Expo development server:

```bash
npm start
```

## Features

- **Pick Location on Map**: Opens an interactive Google Map where users can tap to select a location
- **Draggable Marker**: Users can drag the marker to fine-tune the exact position
- **Current Location**: Button to quickly jump to the user's current GPS location
- **Location Preview**: Shows selected coordinates before confirming

## Usage

The LocationPicker component is already integrated into the ComplaintForm and will automatically handle:
- Navigating to the map picker screen
- Receiving the selected coordinates
- Displaying the selected location
- Allowing users to adjust or clear the location

## Notes

- For development/testing without real API keys, the map will show a default location (Manila, Philippines)
- Location permissions are required to use the "Current Location" feature
- The map picker is part of the Create navigation stack for a seamless user experience

## Security

✅ **This setup is secure:**
- API keys are stored in `.env` (not committed to Git)
- Keys are injected at build time via `app.config.ts`
- No hardcoded keys in the codebase

❌ **Never commit:**
- `.env` file
- API keys directly in code files
