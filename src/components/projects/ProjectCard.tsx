import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Project } from '../../types/dummyDb';
import { colors } from '../../constants/colors';

interface ProjectCardProps {
  project: Project;
  onPress: (project: Project) => void;
}

const getStatusColor = (status: Project['status']) => {
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

const getStatusLabel = (status: Project['status']) => {
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

const getCategoryIcon = (category: Project['category']) => {
  switch (category) {
    case 'infrastructure':
      return 'construct';
    case 'health':
      return 'medical';
    case 'education':
      return 'school';
    case 'environment':
      return 'leaf';
    case 'livelihood':
      return 'briefcase';
    case 'disaster_preparedness':
      return 'shield-checkmark';
    case 'social_services':
      return 'people';
    case 'sports_culture':
      return 'football';
    case 'others':
      return 'ellipsis-horizontal-circle';
    default:
      return 'document';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  }).format(amount);
};

export function ProjectCard({ project, onPress }: ProjectCardProps) {
  const statusColor = getStatusColor(project.status);
  const statusLabel = getStatusLabel(project.status);
  const categoryIcon = getCategoryIcon(project.category);

  return (
    <Pressable
      onPress={() => onPress(project)}
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
            {project.title}
          </Text>
        </View>
      </View>

      <Text className="text-sm mb-3 ml-13" style={{ color: colors.gray600 }} numberOfLines={2}>
        {project.description}
      </Text>

      <View className="flex-row items-center justify-between ml-13">
        <View className="flex-row items-center">
          <View
            className="px-2 py-1 rounded-md"
            style={{ backgroundColor: statusColor }}
          >
            <Text className="text-xs font-medium" style={{ color: colors.white }}>
              {statusLabel}
            </Text>
          </View>
          {project.budget && (
            <Text className="text-xs ml-2 font-medium" style={{ color: colors.primary }}>
              {formatCurrency(project.budget)}
            </Text>
          )}
        </View>

        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={14} color={colors.gray500} />
          <Text className="text-xs ml-1" style={{ color: colors.gray500 }}>
            {project.startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
