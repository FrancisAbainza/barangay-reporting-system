import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui';
import { 
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from 'expo-location';
import { colors } from '../constants/colors';
import { useNavigation, useRoute, RouteProp, CompositeNavigationProp, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CreateStackParamList, ComplaintsStackParamList, MapStackParamList } from '../navigation/AuthenticatedTabs';
import { fetchAddress } from '../utils/mapUtils';

type MapPickerNavigationProp = CompositeNavigationProp<
  CompositeNavigationProp<
    NativeStackNavigationProp<CreateStackParamList, 'MapPicker'>,
    NativeStackNavigationProp<ComplaintsStackParamList, 'MapPicker'>
  >,
  NativeStackNavigationProp<MapStackParamList, 'MapPicker'>
>;

type MapPickerRouteProp =
  | RouteProp<CreateStackParamList, 'MapPicker'>
  | RouteProp<ComplaintsStackParamList, 'MapPicker'>
  | RouteProp<MapStackParamList, 'MapPicker'>;

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

  const [address, setAddress] = useState<string>('');

  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  useEffect(() => {
    async function loadInitialAddress() {
      const address = await fetchAddress(markerPosition.latitude, markerPosition.longitude);
      setAddress(address);
    }
    loadInitialAddress();
  }, []);

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
      const address = await fetchAddress(newPosition.latitude, newPosition.longitude);
      setAddress(address);
    } catch (error) {
      Alert.alert('Error', 'Failed to get your location. Please try again.');
    }
  }

  async function handleMapPress(event: any) {
    const coordinate = event.nativeEvent.coordinate;
    const newPosition = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    };
    setMarkerPosition(newPosition);
    const address = await fetchAddress(newPosition.latitude, newPosition.longitude);
    setAddress(address);
  }

  function handleConfirm() {
    const state = navigation.getState();
    const previousRoute = state.routes[state.index - 1];

    if (previousRoute) {
      navigation.dispatch({
        ...CommonActions.setParams({
          pickedLatitude: markerPosition.latitude,
          pickedLongitude: markerPosition.longitude,
        }),
        // Ensure we target the correct navigator + route
        target: state.key,
        source: previousRoute.key,
      });
    }

    navigation.goBack();
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
          onDragEnd={async (e) => {
            const newPosition = {
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            };
            setMarkerPosition(newPosition);
            const address = await fetchAddress(newPosition.latitude, newPosition.longitude);
            setAddress(address);
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
          className="p-2 rounded-lg active:opacity-70"
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
            {address || `${markerPosition.latitude.toFixed(6)}, ${markerPosition.longitude.toFixed(6)}`}
          </Text>
        </View>

        <Button
          onPress={handleConfirm}
          title="Confirm Location"
          variant="primary"
        />
      </View>
    </View>
  );
}
