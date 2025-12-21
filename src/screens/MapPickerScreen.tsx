import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { 
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus 
} from 'expo-location';
import { colors } from '../constants/colors';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CreateStackParamList } from '../navigation/AuthenticatedTabs';

type MapPickerRouteProp = RouteProp<CreateStackParamList, 'MapPicker'>;
type MapPickerNavigationProp = NativeStackNavigationProp<CreateStackParamList, 'MapPicker'>;

export default function MapPickerScreen() {
  const navigation = useNavigation<MapPickerNavigationProp>();
  const route = useRoute<MapPickerRouteProp>();

  const [region, setRegion] = useState<Region>({
    latitude: route.params?.initialLatitude || 14.318828,
    longitude: route.params?.initialLongitude || 121.102873,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [markerPosition, setMarkerPosition] = useState({
    latitude: route.params?.initialLatitude || 14.318828,
    longitude: route.params?.initialLongitude || 121.102873,
  });

  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

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

  async function getCurrentLocation() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    try {
      const location = await getCurrentPositionAsync({
        accuracy: 6,
      });

      const newPosition = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setMarkerPosition(newPosition);
      setRegion({
        ...newPosition,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to get your location. Please try again.');
    }
  }

  function handleMapPress(event: any) {
    const coordinate = event.nativeEvent.coordinate;
    setMarkerPosition({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  }

  function handleConfirm() {
    navigation.navigate('CreateForm', {
      pickedLatitude: markerPosition.latitude,
      pickedLongitude: markerPosition.longitude,
    });
  }

  return (
    <View className="flex-1">
      {/* Map View */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        region={region}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
      >
        <Marker
          coordinate={markerPosition}
          draggable
          onDragEnd={(e) => {
            setMarkerPosition({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            });
          }}
        />
      </MapView>

      {/* Header */}
      <View
        className="absolute top-0 left-0 right-0 px-4 py-3 flex-row items-center justify-between"
        style={{ backgroundColor: colors.white }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex-row items-center"
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
          <Text className="text-base font-semibold ml-2" style={{ color: colors.primary }}>
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={getCurrentLocation}
          className="p-2 rounded-lg"
          style={{ backgroundColor: colors.primaryLight }}
        >
          <Ionicons name="locate" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Bottom Instruction Card */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 py-4 pb-8 rounded-t-3xl"
        style={{ backgroundColor: colors.white }}
      >
        <Text className="text-base font-semibold mb-2" style={{ color: colors.textPrimary }}>
          Select Location
        </Text>
        <Text className="text-sm mb-4" style={{ color: colors.textSecondary }}>
          Tap on the map to adjust your location
        </Text>

        <View className="flex-row items-center mb-4">
          <Ionicons
            name="location"
            size={20}
            color={colors.primary}
            style={{ marginRight: 8 }}
          />
          <Text className="text-sm flex-1" style={{ color: colors.textSecondary }}>
            {markerPosition.latitude.toFixed(6)}, {markerPosition.longitude.toFixed(6)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleConfirm}
          className="py-4 rounded-lg items-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-base font-semibold" style={{ color: colors.white }}>
            Confirm Location
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
