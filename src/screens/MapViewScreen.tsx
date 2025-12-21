import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ComplaintsStackParamList, TransparencyStackParamList } from '../navigation/AuthenticatedTabs';

type ComplaintMapViewRouteProp = RouteProp<ComplaintsStackParamList, 'MapView'>;
type ProjectMapViewRouteProp = RouteProp<TransparencyStackParamList, 'MapView'>;
type MapViewRouteProp = ComplaintMapViewRouteProp | ProjectMapViewRouteProp;

type ComplaintMapViewNavigationProp = NativeStackNavigationProp<ComplaintsStackParamList, 'MapView'>;
type ProjectMapViewNavigationProp = NativeStackNavigationProp<TransparencyStackParamList, 'MapView'>;
type MapViewNavigationProp = ComplaintMapViewNavigationProp | ProjectMapViewNavigationProp;

export default function MapViewScreen() {
  const navigation = useNavigation<MapViewNavigationProp>();
  const route = useRoute<MapViewRouteProp>();
  const mapRef = useRef<MapView>(null);

  const { latitude, longitude, title, address } = route.params;

  return (
    <View className="flex-1">
      {/* Map View */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onMapReady={() => {
          mapRef.current?.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            0
          );
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={title}
          description={address}
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
      </View>

      {/* Bottom Info Card */}
      {(title || address) && (
        <View
          className="absolute bottom-0 left-0 right-0 px-6 py-4 pb-8 rounded-t-3xl"
          style={{ backgroundColor: colors.white }}
        >
          {title && (
            <Text className="text-lg font-semibold mb-2" style={{ color: colors.gray900 }}>
              {title}
            </Text>
          )}
          {address && (
            <View className="flex-row items-start">
              <Ionicons
                name="location"
                size={20}
                color={colors.primary}
                style={{ marginRight: 8, marginTop: 2 }}
              />
              <Text className="text-sm flex-1" style={{ color: colors.gray600 }}>
                {address}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
