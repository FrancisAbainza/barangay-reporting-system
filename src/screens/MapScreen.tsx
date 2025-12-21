import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Pressable, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useDummyDb } from '../contexts/DummyDbContext';
import { colors } from '../constants/colors';
import { Complaint, Project } from '../types/dummyDb';
import { TabParamList } from '../navigation/AuthenticatedTabs';

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
  const { complaints, projects } = useDummyDb();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const mapRef = useRef<MapView>(null);

  const handleMarkerPress = (item: SelectedItem) => {
    setSelectedItem(item);
  };

  const handleNavigateToDetail = () => {
    if (!selectedItem) return;

    setSelectedItem(null);

    if (selectedItem.type === 'complaint') {
      navigation.navigate('Complaints', {
        screen: 'ComplaintDetail',
        params: { complaintId: selectedItem.data.id },
      } as any);
    } else {
      navigation.navigate('Transparency', {
        screen: 'ProjectDetail',
        params: { projectId: selectedItem.data.id },
      } as any);
    }
  };

  const renderMarkers = () => {
    if (mode === 'complaints') {
      return complaints.map((complaint) => (
        <Marker
          key={complaint.id}
          coordinate={{
            latitude: complaint.location.latitude,
            longitude: complaint.location.longitude,
          }}
          onPress={() => handleMarkerPress({ type: 'complaint', data: complaint })}
        />
      ));
    } else {
      return projects
        .filter((project) => project.location)
        .map((project) => (
          <Marker
            key={project.id}
            coordinate={{
              latitude: project.location!.latitude,
              longitude: project.location!.longitude,
            }}
            onPress={() => handleMarkerPress({ type: 'project', data: project })}
          />
        ));
    }
  };

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
        {renderMarkers()}
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
              backgroundColor: mode === 'transparency' ? colors.secondary : colors.white,
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
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-6"
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

              {/* Description */}
              <Text
                className="text-base mb-4"
                style={{ color: colors.gray700 }}
              >
                {selectedItem.data.description}
              </Text>

              {/* Images */}
              {selectedItem.data.images && selectedItem.data.images.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4"
                >
                  {selectedItem.data.images.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image.uri }}
                      className="w-32 h-32 rounded-lg mr-2"
                      resizeMode="cover"
                    />
                  ))}
                </ScrollView>
              )}

              {/* View Details Button */}
              <TouchableOpacity
                className="py-3 px-6 rounded-lg items-center"
                style={{
                  backgroundColor: selectedItem.type === 'complaint' ? colors.primary : colors.secondary
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
