import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Complaint } from '../../types/dummyDb';
import { colors } from '../../constants/colors';

interface ComplaintCardProps {
  complaint: Complaint;
  onPress: (complaint: Complaint) => void;
}

const getStatusColor = (status: Complaint['status']) => {
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

const getStatusLabel = (status: Complaint['status']) => {
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

const getCategoryIcon = (category: Complaint['category']) => {
  switch (category) {
    case 'noise':
      return 'volume-high';
    case 'sanitation':
      return 'trash';
    case 'public_safety':
      return 'shield-checkmark';
    case 'traffic':
      return 'car';
    case 'infrastructure':
      return 'construct';
    case 'water_electricity':
      return 'water';
    case 'domestic':
      return 'home';
    case 'environment':
      return 'leaf';
    case 'others':
      return 'ellipsis-horizontal-circle';
    default:
      return 'alert-circle';
  }
};

export function ComplaintCard({ complaint, onPress }: ComplaintCardProps) {
  const statusColor = getStatusColor(complaint.status);
  const statusLabel = getStatusLabel(complaint.status);
  const categoryIcon = getCategoryIcon(complaint.category);

  return (
    <Pressable
      onPress={() => onPress(complaint)}
      className="mx-4 mb-3 rounded-lg p-4 active:opacity-70"
      style={{ backgroundColor: colors.gray50, borderColor: colors.gray200, borderWidth: 1 }}
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-row items-center flex-1">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: colors.gray200 }}
          >
            <Ionicons name={categoryIcon as any} size={20} color={colors.primary} />
          </View>
          <Text className="text-base font-semibold flex-1" style={{ color: colors.gray900 }} numberOfLines={2}>
            {complaint.title}
          </Text>
        </View>
      </View>

      <Text className="text-sm mb-3 ml-13" style={{ color: colors.gray600 }} numberOfLines={2}>
        {complaint.description}
      </Text>

      <View className="flex-row items-center justify-between ml-13 mb-2">
        <View className="flex-row items-center gap-2">
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: `${statusColor}15` }}
          >
            <Text className="text-xs font-medium" style={{ color: statusColor }}>
              {statusLabel}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={14} color={colors.gray500} />
            <Text className="text-xs ml-1" style={{ color: colors.gray500 }}>
              {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>
        </View>
      </View>

      {/* Engagement Stats */}
      <View 
        className="flex-row items-center ml-13 pt-2 gap-4"
        style={{ borderTopWidth: 1, borderTopColor: colors.gray200 }}
      >
        <View className="flex-row items-center">
          <Ionicons name="thumbs-up" size={14} color={colors.success} />
          <Text className="text-xs ml-1" style={{ color: colors.gray600 }}>
            {complaint.likes?.length || 0}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="thumbs-down" size={14} color={colors.error} />
          <Text className="text-xs ml-1" style={{ color: colors.gray600 }}>
            {complaint.dislikes?.length || 0}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="chatbubble-outline" size={14} color={colors.info} />
          <Text className="text-xs ml-1" style={{ color: colors.gray600 }}>
            {complaint.comments?.length || 0}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
