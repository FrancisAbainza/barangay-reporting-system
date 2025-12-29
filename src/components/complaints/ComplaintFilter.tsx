import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComplaintCategory, ComplaintStatus } from '../../types/complaint';
import { colors } from '../../constants/colors';
import { Button, DateRangePicker } from '../ui';

export interface ComplaintFilters {
  status: ComplaintStatus[];
  category: ComplaintCategory[];
  priority: ('low' | 'medium' | 'high' | 'urgent')[];
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
  myComplaints: boolean;
}

interface ComplaintFilterProps {
  filters: ComplaintFilters;
  onFiltersChange: (filters: ComplaintFilters) => void;
  activeFilterCount: number;
}

const STATUS_OPTIONS: { value: ComplaintStatus; label: string }[] = [
  { value: 'under_review', label: 'Under Review' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'dismissed', label: 'Dismissed' },
];

const CATEGORY_OPTIONS: { value: ComplaintCategory; label: string }[] = [
  { value: 'noise', label: 'Noise' },
  { value: 'sanitation', label: 'Sanitation' },
  { value: 'public_safety', label: 'Public Safety' },
  { value: 'traffic', label: 'Traffic' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'water_electricity', label: 'Water & Electricity' },
  { value: 'domestic', label: 'Domestic' },
  { value: 'environment', label: 'Environment' },
  { value: 'others', label: 'Others' },
];

const PRIORITY_OPTIONS: { value: 'low' | 'medium' | 'high' | 'urgent'; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export function ComplaintFilter({ filters, onFiltersChange, activeFilterCount }: ComplaintFilterProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localFilters, setLocalFilters] = useState<ComplaintFilters>(filters);

  const toggleFilter = <K extends keyof ComplaintFilters>(
    key: K,
    value: ComplaintFilters[K] extends Array<infer T> ? T : never
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
    const emptyFilters: ComplaintFilters = {
      status: [],
      category: [],
      priority: [],
      dateRange: undefined,
      myComplaints: false,
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
                Filter Complaints
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

              {/* Priority Filter */}
              <View className="mb-6">
                <Text className="text-base font-semibold mb-3" style={{ color: colors.gray900 }}>
                  Priority
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {PRIORITY_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => toggleFilter('priority', option.value)}
                      className="px-4 py-2 rounded-full border"
                      style={{
                        backgroundColor: localFilters.priority.includes(option.value)
                          ? colors.primary
                          : colors.white,
                        borderColor: localFilters.priority.includes(option.value)
                          ? colors.primary
                          : colors.gray300,
                      }}
                    >
                      <Text
                        className="text-sm font-medium"
                        style={{
                          color: localFilters.priority.includes(option.value)
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

              {/* My Complaints Toggle */}
              <View className="mb-6">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-base font-semibold mb-1" style={{ color: colors.gray900 }}>
                      My Complaints Only
                    </Text>
                    <Text className="text-sm" style={{ color: colors.gray500 }}>
                      Show only complaints submitted by you
                    </Text>
                  </View>
                  <Switch
                    value={localFilters.myComplaints}
                    onValueChange={(value) =>
                      setLocalFilters((prev) => ({ ...prev, myComplaints: value }))
                    }
                    trackColor={{ false: colors.gray300, true: colors.primaryLight }}
                    thumbColor={localFilters.myComplaints ? colors.primary : colors.white}
                  />
                </View>
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
