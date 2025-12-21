# Google Maps Setup

The location picker uses Google Maps to allow users to select and adjust their location on a map.

## Configuration Required

To use the map picker functionality, you need to add your Google Maps API keys:

### 1. Get API Keys

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
4. Create API keys for both Android and iOS

### 2. Add API Keys to app.json

Open `app.json` and replace the placeholder API keys:

```json
"ios": {
  "config": {
    "googleMapsApiKey": "YOUR_ACTUAL_IOS_API_KEY"
  }
},
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_ACTUAL_ANDROID_API_KEY"
    }
  }
}
```

### 3. Restart Expo

After adding your API keys, restart the Expo development server:

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
