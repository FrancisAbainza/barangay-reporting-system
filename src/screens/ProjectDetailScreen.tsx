import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TransparencyStackParamList } from '../navigation/AuthenticatedTabs';
import { colors } from '../constants/colors';
import { useDummyDb } from '../contexts/DummyDbContext';

type Props = NativeStackScreenProps<TransparencyStackParamList, 'ProjectDetail'>;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planned':
      return colors.gray500;
    case 'approved':
      return colors.info;
    case 'ongoing':
      return colors.primary;
    case 'on_hold':
      return colors.warning;
    case 'completed':
      return colors.success;
    case 'cancelled':
      return colors.error;
    default:
      return colors.gray500;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'planned':
      return 'Planned';
    case 'approved':
      return 'Approved';
    case 'ongoing':
      return 'Ongoing';
    case 'on_hold':
      return 'On Hold';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'infrastructure':
      return 'Infrastructure';
    case 'health':
      return 'Health';
    case 'education':
      return 'Education';
    case 'environment':
      return 'Environment';
    case 'livelihood':
      return 'Livelihood';
    case 'disaster_preparedness':
      return 'Disaster Preparedness';
    case 'social_services':
      return 'Social Services';
    case 'sports_culture':
      return 'Sports & Culture';
    case 'others':
      return 'Others';
    default:
      return category;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function ProjectDetailScreen({ route, navigation }: Props) {
  const { projectId } = route.params;
  const { getProject } = useDummyDb();
  const project = getProject(projectId);
  
  if (!project) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-base" style={{ color: colors.gray500 }}>
          Project not found
        </Text>
      </View>
    );
  }
  
  const statusColor = getStatusColor(project.status);

  return (
    <View className="flex-1 bg-white">
      {/* Custom Header with Back Button */}
      <View 
        className="px-4 py-4 flex-row items-center border-b"
        style={{ borderBottomColor: colors.gray200 }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          className="mr-3 active:opacity-70"
        >
          <Ionicons name="arrow-back" size={24} color={colors.gray700} />
        </Pressable>
        <Text className="text-xl font-semibold flex-1" style={{ color: colors.gray900 }}>
          Project Details
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Status Badge */}
        <View className="px-4 pt-4 pb-3">
          <View
            className="self-start px-4 py-2 rounded-full"
            style={{ backgroundColor: `${statusColor}15` }}
          >
            <Text className="text-sm font-semibold" style={{ color: statusColor }}>
              {getStatusLabel(project.status)}
            </Text>
          </View>
        </View>

        {/* Title */}
        <View className="px-4 pb-4">
          <Text className="text-2xl font-bold" style={{ color: colors.gray900 }}>
            {project.title}
          </Text>
        </View>

        {/* Info Cards */}
        <View className="px-4 pb-4 gap-3">
          {/* Category */}
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
          >
            <View className="flex-row items-center">
              <Ionicons name="pricetag" size={20} color={colors.primary} />
              <Text className="ml-2 text-sm font-medium" style={{ color: colors.gray500 }}>
                Category
              </Text>
            </View>
            <Text className="text-base mt-1 ml-7" style={{ color: colors.gray900 }}>
              {getCategoryLabel(project.category)}
            </Text>
          </View>

          {/* Budget */}
          {project.budget && (
            <View
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
            >
              <View className="flex-row items-center">
                <Ionicons name="cash" size={20} color={colors.primary} />
                <Text className="ml-2 text-sm font-medium" style={{ color: colors.gray500 }}>
                  Budget
                </Text>
              </View>
              <Text className="text-base mt-1 ml-7 font-semibold" style={{ color: colors.primary }}>
                {formatCurrency(project.budget)}
              </Text>
            </View>
          )}

          {/* Timeline */}
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
          >
            <View className="flex-row items-center mb-3">
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <Text className="ml-2 text-sm font-medium" style={{ color: colors.gray500 }}>
                Timeline
              </Text>
            </View>
            <View className="ml-7">
              <View className="flex-row items-center mb-2">
                <Text className="text-sm font-medium mr-2" style={{ color: colors.gray600 }}>
                  Start Date:
                </Text>
                <Text className="text-base" style={{ color: colors.gray900 }}>
                  {formatDate(project.startDate)}
                </Text>
              </View>
              {project.endDate && (
                <View className="flex-row items-center">
                  <Text className="text-sm font-medium mr-2" style={{ color: colors.gray600 }}>
                    End Date:
                  </Text>
                  <Text className="text-base" style={{ color: colors.gray900 }}>
                    {formatDate(project.endDate)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Location */}
          {project.location && (
            <View
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
            >
              <View className="flex-row items-center">
                <Ionicons name="location" size={20} color={colors.primary} />
                <Text className="ml-2 text-sm font-medium" style={{ color: colors.gray500 }}>
                  Location
                </Text>
              </View>
              {project.location.address ? (
                <Text className="text-base mt-1 ml-7" style={{ color: colors.gray900 }}>
                  {project.location.address}
                </Text>
              ) : (
                <Text className="text-sm mt-1 ml-7" style={{ color: colors.gray600 }}>
                  Lat: {project.location.latitude.toFixed(4)}, Long: {project.location.longitude.toFixed(4)}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Images Section */}
        {project.images && project.images.length > 0 && (
          <View className="px-4 pb-4">
            <Text className="text-lg font-semibold mb-2" style={{ color: colors.gray900 }}>
              Images
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
              <View className="flex-row gap-3">
                {project.images.map((image, index) => (
                  <View
                    key={index}
                    className="rounded-lg overflow-hidden"
                    style={{ width: 200, height: 150, backgroundColor: colors.gray200 }}
                  >
                    <Image
                      source={{ uri: image.uri }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Description Section */}
        <View className="px-4 pb-4">
          <Text className="text-lg font-semibold mb-2" style={{ color: colors.gray900 }}>
            Description
          </Text>
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
          >
            <Text className="text-base leading-6" style={{ color: colors.gray700 }}>
              {project.description}
            </Text>
          </View>
        </View>

        {/* Timestamps */}
        <View className="px-4">
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
          >
            <View className="flex-row items-center mb-2">
              <Ionicons name="time" size={16} color={colors.gray400} />
              <Text className="text-xs ml-2" style={{ color: colors.gray500 }}>
                Created: {formatDate(project.createdAt)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="refresh" size={16} color={colors.gray400} />
              <Text className="text-xs ml-2" style={{ color: colors.gray500 }}>
                Last Updated: {formatDate(project.updatedAt)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
