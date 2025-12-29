import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Pressable, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useComplaintDb } from '../contexts/ComplaintDbContext';
import { useProjectDb } from '../contexts/ProjectDbContext';
import { colors } from '../constants/colors';
import { Complaint } from '../types/complaint';
import { Project } from '../types/project';
import { MapStackParamList } from '../navigation/AuthenticatedTabs';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

type MapMode = 'complaints' | 'transparency';

type SelectedItem = {
  type: 'complaint';
  data: Complaint;
} | {
  type: 'project';
  data: Project;
};

const DEFAULT_REGION = {
  latitude: 14.318828,
  longitude: 121.102873,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  const [mode, setMode] = useState<MapMode>('complaints');
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const { complaints } = useComplaintDb();
  const { projects } = useProjectDb();
  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();
  const mapRef = useRef<MapView>(null);

  const handleMarkerPress = (item: SelectedItem) => {
    setSelectedItem(item);
  };

  const handleNavigateToDetail = () => {
    if (!selectedItem) return;

    setSelectedItem(null);

    if (selectedItem.type === 'complaint') {
      navigation.navigate('ComplaintDetail', {
        complaintId: selectedItem.data.id,
      });
    } else {
      navigation.navigate('ProjectDetail', {
        projectId: selectedItem.data.id,
      });
    }
  };

  const renderMarkers = useMemo(() => {
    if (mode === 'complaints') {
      return complaints
        .filter((complaint) => complaint.location)
        .map((complaint) => (
          <Marker
            key={`${complaint.id}-${selectedItem?.data.id || ''}`}
            coordinate={{
              latitude: complaint.location!.latitude,
              longitude: complaint.location!.longitude,
            }}
            onPress={() => handleMarkerPress({ type: 'complaint', data: complaint })}
            pinColor={
              selectedItem?.type === 'complaint' && selectedItem.data.id === complaint.id
                ? colors.primary
                : 'red'
            }
          />
        ));
    } else {
      return projects
        .filter((project) => project.location)
        .map((project) => (
          <Marker
            key={`${project.id}-${selectedItem?.data.id || ''}`}
            coordinate={{
              latitude: project.location!.latitude,
              longitude: project.location!.longitude,
            }}
            onPress={() => handleMarkerPress({ type: 'project', data: project })}
            pinColor={
              selectedItem?.type === 'project' && selectedItem.data.id === project.id
                ? colors.primary
                : 'red'
            }
          />
        ));
    }
  }, [mode, complaints, projects, selectedItem]);

  return (
    <View className="flex-1">
      {/* Map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={DEFAULT_REGION}
        onMapReady={() => {
          mapRef.current?.animateToRegion(
            DEFAULT_REGION,
            0
          );
        }}
      >
        {renderMarkers}
      </MapView>

      {/* Mode Toggle Button */}
      <View className="absolute top-12 left-4 right-4">
        <View className="flex-row rounded-lg overflow-hidden" style={{ backgroundColor: colors.white }}>
          <TouchableOpacity
            className="flex-1 py-3 px-4 flex-row items-center justify-center"
            style={{
              backgroundColor: mode === 'complaints' ? colors.primary : colors.white,
            }}
            onPress={() => setMode('complaints')}
          >
            <Ionicons
              name="megaphone"
              size={20}
              color={mode === 'complaints' ? colors.white : colors.gray500}
            />
            <Text
              className="ml-2 font-semibold"
              style={{
                color: mode === 'complaints' ? colors.white : colors.gray500
              }}
            >
              Complaints
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 py-3 px-4 flex-row items-center justify-center"
            style={{
              backgroundColor: mode === 'transparency' ? colors.primary : colors.white,
            }}
            onPress={() => setMode('transparency')}
          >
            <Ionicons
              name="file-tray-full"
              size={20}
              color={mode === 'transparency' ? colors.white : colors.gray500}
            />
            <Text
              className="ml-2 font-semibold"
              style={{
                color: mode === 'transparency' ? colors.white : colors.gray500
              }}
            >
              Transparency
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sliding Panel */}
      {selectedItem && (
        <>
          {/* Backdrop */}
          <Pressable
            className="absolute inset-0"
            onPress={() => setSelectedItem(null)}
          />

          {/* Panel */}
          <View
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-6 pb-8"
            style={{
              backgroundColor: colors.white,
              shadowColor: colors.black,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <ScrollView className="max-h-96">
              {/* Title */}
              <Text
                className="text-2xl font-bold mb-2"
                style={{ color: colors.gray900 }}
              >
                {selectedItem.data.title}
              </Text>

              {/* Images */}
              {selectedItem.data.images && selectedItem.data.images.length > 0 && (
                <View
                  className="mb-4"
                >
                  <Image
                    source={{ uri: selectedItem.data.images[0].uri }}
                    style={{ width: width - 48, height: 200, borderRadius: 12, marginRight: 8 }}
                    resizeMode="cover"
                  />
                </View>
              )}

              {/* View Details Button */}
              <TouchableOpacity
                className="py-3 px-6 rounded-lg items-center"
                style={{
                  backgroundColor: colors.primary,
                }}
                onPress={handleNavigateToDetail}
              >
                <Text
                  className="font-semibold text-base"
                  style={{ color: colors.white }}
                >
                  View Full Details
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
}
