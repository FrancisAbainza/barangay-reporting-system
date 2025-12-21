import React, { useEffect, useState } from 'react';
import { Alert, View, Text, TouchableOpacity } from 'react-native';
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from 'expo-location';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { CreateStackParamList } from '../../navigation/AuthenticatedTabs';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationPickerProps {
  onLocationChange: (location: Location | null) => void;
  initialLocation?: Location | null;
  error?: string;
  disabled?: boolean;
}

type CreateFormNavigationProp = NativeStackNavigationProp<CreateStackParamList, 'CreateForm'>;
type CreateFormRouteProp = RouteProp<CreateStackParamList, 'CreateForm'>;

export function LocationPicker({
  onLocationChange,
  initialLocation = null,
  error,
  disabled = false,
}: LocationPickerProps) {
  const [pickedLocation, setPickedLocation] = useState<Location | null>(
    initialLocation
  );
  const navigation = useNavigation<CreateFormNavigationProp>();
  const route = useRoute<CreateFormRouteProp>();
  const isFocused = useIsFocused();

  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  // Handle location from map picker
  useEffect(() => {
    if (isFocused && route.params?.pickedLatitude && route.params?.pickedLongitude) {
      const mapPickedLocation: Location = {
        latitude: route.params.pickedLatitude,
        longitude: route.params.pickedLongitude,
        address: `${route.params.pickedLatitude.toFixed(4)}, ${route.params.pickedLongitude.toFixed(4)}`,
      };
      setPickedLocation(mapPickedLocation);
    }
  }, [route.params, isFocused]);

  useEffect(() => {
    if (pickedLocation) {
      onLocationChange(pickedLocation);
    }
  }, [pickedLocation]);

  async function verifyPermissions() {
    if (!locationPermissionInformation) {
      return false;
    }

    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Permission Required',
        'You need to grant location permissions to use this feature.'
      );
      return false;
    }

    return true;
  }

  async function getLocationHandler() {
    if (disabled) return;

    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    try {
      const location = await getCurrentPositionAsync({
        accuracy: 6,
      });

      const newLocation: Location = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: 'Current Location',
      };

      setPickedLocation(newLocation);
    } catch (err) {
      Alert.alert(
        'Error',
        'Failed to get your location. Please try again.'
      );
    }
  }

  function pickOnMapHandler() {
    if (disabled) return;
    navigation.navigate('MapPicker', {
      initialLatitude: pickedLocation?.latitude,
      initialLongitude: pickedLocation?.longitude,
    });
  }

  function clearLocationHandler() {
    if (disabled) return;
    setPickedLocation(null);
    onLocationChange(null);
  }

  return (
    <View className="mb-4">
      <Text
        className="text-sm font-medium mb-2"
        style={{ color: colors.textPrimary }}
      >
        Location
      </Text>

      {pickedLocation ? (
        <View
          className="border rounded-lg p-4 mb-2"
          style={{ borderColor: error ? colors.error : colors.border }}
        >
          <View className="flex-row items-center mb-3">
            <Ionicons
              name="location"
              size={20}
              color={colors.primary}
              style={{ marginRight: 8 }}
            />
            <Text
              className="flex-1 text-base"
              style={{ color: colors.textPrimary }}
            >
              {pickedLocation.address || `${pickedLocation.latitude.toFixed(4)}, ${pickedLocation.longitude.toFixed(4)}`}
            </Text>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={pickOnMapHandler}
              disabled={disabled}
              className="flex-1 flex-row items-center justify-center py-2 px-4 rounded-lg"
              style={{ backgroundColor: colors.primaryLight }}
            >
              <Ionicons
                name="map-outline"
                size={18}
                color={colors.white}
                style={{ marginRight: 6 }}
              />
              <Text className="text-sm font-medium" style={{ color: colors.white }}>
                Adjust
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={clearLocationHandler}
              disabled={disabled}
              className="flex-1 flex-row items-center justify-center py-2 px-4 rounded-lg"
              style={{ backgroundColor: colors.gray100 }}
            >
              <Ionicons
                name="close-circle-outline"
                size={18}
                color={colors.error}
                style={{ marginRight: 6 }}
              />
              <Text className="text-sm font-medium" style={{ color: colors.error }}>
                Clear
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="gap-2">
          <TouchableOpacity
            onPress={pickOnMapHandler}
            disabled={disabled}
            className="flex-row items-center justify-center border-2 border-dashed rounded-lg py-4"
            style={{
              borderColor: error ? colors.error : colors.primary,
              backgroundColor: colors.gray50,
            }}
          >
            <Ionicons
              name="map-outline"
              size={24}
              color={colors.primary}
              style={{ marginRight: 8 }}
            />
            <Text className="text-base font-medium" style={{ color: colors.primary }}>
              Pick Location on Map
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={getLocationHandler}
            disabled={disabled}
            className="flex-row items-center justify-center border rounded-lg py-3"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.white,
            }}
          >
            <Ionicons
              name="locate-outline"
              size={20}
              color={colors.textSecondary}
              style={{ marginRight: 8 }}
            />
            <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
              Use Current Location
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <Text className="text-sm mt-1" style={{ color: colors.error }}>
          {error}
        </Text>
      )}
    </View>
  );
}
