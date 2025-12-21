import Constants from 'expo-constants';
import { reverseGeocodeAsync } from 'expo-location';

const GOOGLE_API_KEY = Constants.expoConfig?.ios?.config?.googleMapsApiKey || 
                       Constants.expoConfig?.android?.config?.googleMaps?.apiKey;

export function getMapPreview(lat: number, lng: number): string {
  const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${GOOGLE_API_KEY}`;
  return imagePreviewUrl;
}

export async function fetchAddress(latitude: number, longitude: number): Promise<string> {
  try {
    const addresses = await reverseGeocodeAsync({ latitude, longitude });
    const address = addresses[0];
    const formattedAddress = address
      ? [address.street, address.district, address.city, address.region]
          .filter(Boolean)
          .join(', ') || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      : `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    return formattedAddress;
  } catch {
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
}
