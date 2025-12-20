import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ComplaintsStackParamList } from '../navigation/AuthenticatedTabs';
import { colors } from '../constants/colors';
import { useDummyDb } from '../contexts/DummyDbContext';

type Props = NativeStackScreenProps<ComplaintsStackParamList, 'ComplaintDetail'>;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'submitted':
      return colors.gray500;
    case 'under_review':
      return colors.info;
    case 'scheduled':
      return colors.warning;
    case 'in_progress':
      return colors.primary;
    case 'resolved':
      return colors.success;
    case 'dismissed':
      return colors.error;
    default:
      return colors.gray500;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'submitted':
      return 'Submitted';
    case 'under_review':
      return 'Under Review';
    case 'scheduled':
      return 'Scheduled';
    case 'in_progress':
      return 'In Progress';
    case 'resolved':
      return 'Resolved';
    case 'dismissed':
      return 'Dismissed';
    default:
      return status;
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'noise':
      return 'Noise';
    case 'sanitation':
      return 'Sanitation';
    case 'public_safety':
      return 'Public Safety';
    case 'traffic':
      return 'Traffic';
    case 'infrastructure':
      return 'Infrastructure';
    case 'water_electricity':
      return 'Water & Electricity';
    case 'domestic':
      return 'Domestic';
    case 'environment':
      return 'Environment';
    case 'others':
      return 'Others';
    default:
      return category;
  }
};

export default function ComplaintDetailScreen({ route, navigation }: Props) {
  const { complaintId } = route.params;
  const { getComplaint } = useDummyDb();
  const complaint = getComplaint(complaintId);
  
  if (!complaint) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-base" style={{ color: colors.gray500 }}>
          Complaint not found
        </Text>
      </View>
    );
  }
  
  const statusColor = getStatusColor(complaint.status);

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
          Complaint Details
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
              {getStatusLabel(complaint.status)}
            </Text>
          </View>
        </View>

        {/* Title */}
        <View className="px-4 pb-4">
          <Text className="text-2xl font-bold" style={{ color: colors.gray900 }}>
            {complaint.title}
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
              {getCategoryLabel(complaint.category)}
            </Text>
          </View>

          {/* Complainant */}
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
          >
            <View className="flex-row items-center">
              <Ionicons name="person" size={20} color={colors.primary} />
              <Text className="ml-2 text-sm font-medium" style={{ color: colors.gray500 }}>
                Reported by
              </Text>
            </View>
            <Text className="text-base mt-1 ml-7" style={{ color: colors.gray900 }}>
              {complaint.complainantName}
            </Text>
          </View>

          {/* Date */}
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
          >
            <View className="flex-row items-center">
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <Text className="ml-2 text-sm font-medium" style={{ color: colors.gray500 }}>
                Date Submitted
              </Text>
            </View>
            <Text className="text-base mt-1 ml-7" style={{ color: colors.gray900 }}>
              {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {/* Location */}
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
            <Text className="text-base mt-1 ml-7" style={{ color: colors.gray900 }}>
              {complaint.location.latitude.toFixed(4)}, {complaint.location.longitude.toFixed(4)}
            </Text>
          </View>
        </View>

        {/* Images Section */}
        {complaint.images && complaint.images.length > 0 && (
          <View className="px-4 pb-4">
            <Text className="text-lg font-semibold mb-2" style={{ color: colors.gray900 }}>
              Images
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
              <View className="flex-row gap-3">
                {complaint.images.map((image, index) => (
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

        {/* Description */}
        <View className="px-4">
          <Text className="text-base font-semibold mb-2" style={{ color: colors.gray900 }}>
            Description
          </Text>
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray200 }}
          >
            <Text className="text-base leading-6" style={{ color: colors.gray700 }}>
              {complaint.description}
            </Text>
          </View>
        </View>

        {/* Last Updated */}
        <View className="px-4 mt-6">
          <Text className="text-sm text-center" style={{ color: colors.gray400 }}>
            Last updated: {new Date(complaint.updatedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
