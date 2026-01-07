import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Pressable, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useComplaintDb } from '../contexts/ComplaintDbContext';
import { useProjectDb } from '../contexts/ProjectDbContext';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../constants/colors';
import { Complaint } from '../types/complaint';
import { Project } from '../types/project';
import { MapStackParamList } from '../navigation/AuthenticatedTabs';
import { MapFilter, MapComplaintFilters, MapProjectFilters } from '../components/map';
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
  latitude: 14.307030,
  longitude: 121.046630,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  const [mode, setMode] = useState<MapMode>('complaints');
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const { complaints } = useComplaintDb();
  const { projects } = useProjectDb();
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();
  const mapRef = useRef<MapView>(null);

  const [complaintFilters, setComplaintFilters] = useState<MapComplaintFilters>({
    status: [],
    category: [],
    priority: [],
    dateRange: undefined,
    myComplaints: false,
  });

  const [projectFilters, setProjectFilters] = useState<MapProjectFilters>({
    status: [],
    category: [],
    dateRange: undefined,
  });

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      if (!complaint.location) return false;

      // Hide submitted complaints unless they belong to the current user
      if (complaint.status === 'submitted' && (!user || complaint.complainantId !== user.id)) {
        return false;
      }

      // Hide dismissed complaints unless they belong to the current user
      if (complaint.status === 'dismissed' && (!user || complaint.complainantId !== user.id)) {
        return false;
      }

      if (complaintFilters.myComplaints && user && complaint.complainantId !== user.id) {
        return false;
      }

      if (complaintFilters.status.length > 0 && !complaintFilters.status.includes(complaint.status)) {
        return false;
      }

      if (complaintFilters.category.length > 0 && !complaintFilters.category.includes(complaint.category)) {
        return false;
      }

      if (complaintFilters.priority.length > 0 && !complaintFilters.priority.includes(complaint.priority)) {
        return false;
      }

      if (complaintFilters.dateRange?.start && complaintFilters.dateRange?.end) {
        const complaintDate = new Date(complaint.createdAt);
        const startDate = new Date(complaintFilters.dateRange.start);
        const endDate = new Date(complaintFilters.dateRange.end);
        
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        
        if (complaintDate < startDate || complaintDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [complaints, complaintFilters, user]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (!project.location) return false;

      if (projectFilters.status.length > 0 && !projectFilters.status.includes(project.status)) {
        return false;
      }

      if (projectFilters.category.length > 0 && !projectFilters.category.includes(project.category)) {
        return false;
      }

      if (projectFilters.dateRange?.start && projectFilters.dateRange?.end) {
        const projectDate = new Date(project.startDate);
        const startDate = new Date(projectFilters.dateRange.start);
        const endDate = new Date(projectFilters.dateRange.end);
        
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        
        if (projectDate < startDate || projectDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [projects, projectFilters]);

  const activeFilterCount = useMemo(() => {
    if (mode === 'complaints') {
      return (
        complaintFilters.status.length +
        complaintFilters.category.length +
        complaintFilters.priority.length +
        (complaintFilters.dateRange?.start && complaintFilters.dateRange?.end ? 1 : 0) +
        (complaintFilters.myComplaints ? 1 : 0)
      );
    } else {
      return (
        projectFilters.status.length +
        projectFilters.category.length +
        (projectFilters.dateRange?.start && projectFilters.dateRange?.end ? 1 : 0)
      );
    }
  }, [mode, complaintFilters, projectFilters]);

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
      return filteredComplaints.map((complaint) => (
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
      return filteredProjects.map((project) => (
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
  }, [mode, filteredComplaints, filteredProjects, selectedItem]);

  const renderBottomPanel = () => {
    if (!selectedItem) return null;

    return (
      <>
        <Pressable
          className="absolute inset-0"
          onPress={() => setSelectedItem(null)}
        />
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
            <Text
              className="text-2xl font-bold mb-2"
              style={{ color: colors.gray900 }}
            >
              {selectedItem.data.title}
            </Text>
            {selectedItem.data.images && selectedItem.data.images.length > 0 && (
              <View className="mb-4">
                <Image
                  source={{ uri: selectedItem.data.images[0].uri }}
                  style={{ width: width - 48, height: 200, borderRadius: 12, marginRight: 8 }}
                  resizeMode="cover"
                />
              </View>
            )}
            <TouchableOpacity
              className="py-3 px-6 rounded-lg items-center"
              style={{ backgroundColor: colors.primary }}
              onPress={handleNavigateToDetail}
            >
              <Text className="font-semibold text-base" style={{ color: colors.white }}>
                View Full Details
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </>
    );
  };

  return (
    <View className="flex-1">
      {/* Map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={DEFAULT_REGION}
        onMapReady={() => {
          mapRef.current?.animateToRegion(DEFAULT_REGION, 0);
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

      {/* Filter Button */}
      <View className="absolute top-32 right-4">
        <MapFilter
          mode={mode}
          complaintFilters={complaintFilters}
          projectFilters={projectFilters}
          onComplaintFiltersChange={setComplaintFilters}
          onProjectFiltersChange={setProjectFilters}
          activeFilterCount={activeFilterCount}
        />
      </View>


      {renderBottomPanel()}
    </View>
  );
}
