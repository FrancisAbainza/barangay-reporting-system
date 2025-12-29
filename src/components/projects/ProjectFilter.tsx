import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProjectCategory, ProjectStatus } from '../../types/project';
import { colors } from '../../constants/colors';
import { Button, DateRangePicker } from '../ui';

export interface ProjectFilters {
  status: ProjectStatus[];
  category: ProjectCategory[];
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
}

interface ProjectFilterProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
  activeFilterCount: number;
}

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'planned', label: 'Planned' },
  { value: 'approved', label: 'Approved' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const CATEGORY_OPTIONS: { value: ProjectCategory; label: string }[] = [
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'health', label: 'Health' },
  { value: 'education', label: 'Education' },
  { value: 'environment', label: 'Environment' },
  { value: 'livelihood', label: 'Livelihood' },
  { value: 'disaster_preparedness', label: 'Disaster Preparedness' },
  { value: 'social_services', label: 'Social Services' },
  { value: 'sports_culture', label: 'Sports & Culture' },
  { value: 'others', label: 'Others' },
];

export function ProjectFilter({ filters, onFiltersChange, activeFilterCount }: ProjectFilterProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localFilters, setLocalFilters] = useState<ProjectFilters>(filters);

  const toggleFilter = <K extends keyof ProjectFilters>(
    key: K,
    value: ProjectFilters[K] extends Array<infer T> ? T : never
  ) => {
    setLocalFilters((prev) => {
      const currentArray = prev[key] as any[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setIsModalVisible(false);
  };

  const clearFilters = () => {
    const emptyFilters: ProjectFilters = {
      status: [],
      category: [],
      dateRange: undefined,
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    setIsModalVisible(false);
  };

  const openModal = () => {
    setLocalFilters(filters);
    setIsModalVisible(true);
  };

  return (
    <>
      <TouchableOpacity
        onPress={openModal}
        className="flex-row items-center px-4 py-3 border-b"
        style={{ borderBottomColor: colors.gray200 }}
      >
        <Ionicons name="filter" size={20} color={colors.primary} />
        <Text className="ml-2 text-base font-medium" style={{ color: colors.gray900 }}>
          Filter
        </Text>
        {activeFilterCount > 0 && (
          <View
            className="ml-2 rounded-full w-5 h-5 items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-xs font-semibold text-white">{activeFilterCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/50">
          <View className="flex-1 mt-20 bg-white rounded-t-3xl">
            {/* Header */}
            <View
              className="flex-row items-center justify-between px-6 py-4 border-b"
              style={{ borderBottomColor: colors.gray200 }}
            >
              <Text className="text-xl font-bold" style={{ color: colors.gray900 }}>
                Filter Projects
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.gray900} />
              </TouchableOpacity>
            </View>

            {/* Filter Options */}
            <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
              {/* Status Filter */}
              <View className="mb-6">
                <Text className="text-base font-semibold mb-3" style={{ color: colors.gray900 }}>
                  Status
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {STATUS_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => toggleFilter('status', option.value)}
                      className="px-4 py-2 rounded-full border"
                      style={{
                        backgroundColor: localFilters.status.includes(option.value)
                          ? colors.primary
                          : colors.white,
                        borderColor: localFilters.status.includes(option.value)
                          ? colors.primary
                          : colors.gray300,
                      }}
                    >
                      <Text
                        className="text-sm font-medium"
                        style={{
                          color: localFilters.status.includes(option.value)
                            ? colors.white
                            : colors.gray700,
                        }}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Category Filter */}
              <View className="mb-6">
                <Text className="text-base font-semibold mb-3" style={{ color: colors.gray900 }}>
                  Category
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => toggleFilter('category', option.value)}
                      className="px-4 py-2 rounded-full border"
                      style={{
                        backgroundColor: localFilters.category.includes(option.value)
                          ? colors.primary
                          : colors.white,
                        borderColor: localFilters.category.includes(option.value)
                          ? colors.primary
                          : colors.gray300,
                      }}
                    >
                      <Text
                        className="text-sm font-medium"
                        style={{
                          color: localFilters.category.includes(option.value)
                            ? colors.white
                            : colors.gray700,
                        }}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Date Range */}
              <View className="mb-6">
                <Text className="text-base font-semibold mb-3" style={{ color: colors.gray900 }}>
                  Date Range
                </Text>
                <DateRangePicker
                  startDate={localFilters.dateRange?.start || null}
                  endDate={localFilters.dateRange?.end || null}
                  onStartDateChange={(date) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      dateRange: { start: date, end: prev.dateRange?.end || null },
                    }))
                  }
                  onEndDateChange={(date) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      dateRange: { start: prev.dateRange?.start || null, end: date },
                    }))
                  }
                />
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View
              className="px-6 py-4 border-t"
              style={{ borderTopColor: colors.gray200 }}
            >
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Button variant="secondary" onPress={clearFilters} title="Clear All" />
                </View>
                <View className="flex-1">
                  <Button onPress={applyFilters} title="Apply Filters" />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
