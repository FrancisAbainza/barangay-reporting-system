import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComplaintCategory, ComplaintStatus } from '../../types/complaint';
import { ProjectCategory, ProjectStatus } from '../../types/project';
import { colors } from '../../constants/colors';
import { Button, DateRangePicker } from '../ui';

export interface MapComplaintFilters {
  status: ComplaintStatus[];
  category: ComplaintCategory[];
  priority: ('low' | 'medium' | 'high' | 'urgent')[];
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
  myComplaints: boolean;
}

export interface MapProjectFilters {
  status: ProjectStatus[];
  category: ProjectCategory[];
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
}

interface MapFilterProps {
  mode: 'complaints' | 'transparency';
  complaintFilters: MapComplaintFilters;
  projectFilters: MapProjectFilters;
  onComplaintFiltersChange: (filters: MapComplaintFilters) => void;
  onProjectFiltersChange: (filters: MapProjectFilters) => void;
  activeFilterCount: number;
}

const COMPLAINT_STATUS_OPTIONS: { value: ComplaintStatus; label: string }[] = [
  { value: 'under_review', label: 'Under Review' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'dismissed', label: 'Dismissed' },
];

const COMPLAINT_CATEGORY_OPTIONS: { value: ComplaintCategory; label: string }[] = [
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

const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'planned', label: 'Planned' },
  { value: 'approved', label: 'Approved' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PROJECT_CATEGORY_OPTIONS: { value: ProjectCategory; label: string }[] = [
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

export function MapFilter({
  mode,
  complaintFilters,
  projectFilters,
  onComplaintFiltersChange,
  onProjectFiltersChange,
  activeFilterCount,
}: MapFilterProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localComplaintFilters, setLocalComplaintFilters] = useState<MapComplaintFilters>(complaintFilters);
  const [localProjectFilters, setLocalProjectFilters] = useState<MapProjectFilters>(projectFilters);

  const toggleComplaintFilter = <K extends keyof MapComplaintFilters>(
    key: K,
    value: MapComplaintFilters[K] extends Array<infer T> ? T : never
  ) => {
    setLocalComplaintFilters((prev) => {
      const currentArray = prev[key] as any[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  };

  const toggleProjectFilter = <K extends keyof MapProjectFilters>(
    key: K,
    value: MapProjectFilters[K] extends Array<infer T> ? T : never
  ) => {
    setLocalProjectFilters((prev) => {
      const currentArray = prev[key] as any[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  };

  const applyFilters = () => {
    onComplaintFiltersChange(localComplaintFilters);
    onProjectFiltersChange(localProjectFilters);
    setIsModalVisible(false);
  };

  const clearFilters = () => {
    const emptyComplaintFilters: MapComplaintFilters = {
      status: [],
      category: [],
      priority: [],
      dateRange: undefined,
      myComplaints: false,
    };
    const emptyProjectFilters: MapProjectFilters = {
      status: [],
      category: [],
      dateRange: undefined,
    };
    setLocalComplaintFilters(emptyComplaintFilters);
    setLocalProjectFilters(emptyProjectFilters);
    onComplaintFiltersChange(emptyComplaintFilters);
    onProjectFiltersChange(emptyProjectFilters);
    setIsModalVisible(false);
  };

  const openModal = () => {
    setLocalComplaintFilters(complaintFilters);
    setLocalProjectFilters(projectFilters);
    setIsModalVisible(true);
  };

  return (
    <>
      <TouchableOpacity
        onPress={openModal}
        className="rounded-full p-3"
        style={{
          backgroundColor: colors.white,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View className="relative">
          <Ionicons name="filter" size={24} color={colors.primary} />
          {activeFilterCount > 0 && (
            <View
              className="absolute -top-1 -right-1 rounded-full w-5 h-5 items-center justify-center"
              style={{ backgroundColor: colors.error }}
            >
              <Text className="text-xs font-bold text-white">{activeFilterCount}</Text>
            </View>
          )}
        </View>
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
                Filter {mode === 'complaints' ? 'Complaints' : 'Projects'}
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.gray900} />
              </TouchableOpacity>
            </View>

            {/* Filter Options */}
            <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
              {mode === 'complaints' ? (
                <>
                  {/* Complaint Status Filter */}
                  <View className="mb-6">
                    <Text className="text-base font-semibold mb-3" style={{ color: colors.gray900 }}>
                      Status
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {COMPLAINT_STATUS_OPTIONS.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          onPress={() => toggleComplaintFilter('status', option.value)}
                          className="px-4 py-2 rounded-full border"
                          style={{
                            backgroundColor: localComplaintFilters.status.includes(option.value)
                              ? colors.primary
                              : colors.white,
                            borderColor: localComplaintFilters.status.includes(option.value)
                              ? colors.primary
                              : colors.gray300,
                          }}
                        >
                          <Text
                            className="text-sm font-medium"
                            style={{
                              color: localComplaintFilters.status.includes(option.value)
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

                  {/* Complaint Category Filter */}
                  <View className="mb-6">
                    <Text className="text-base font-semibold mb-3" style={{ color: colors.gray900 }}>
                      Category
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {COMPLAINT_CATEGORY_OPTIONS.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          onPress={() => toggleComplaintFilter('category', option.value)}
                          className="px-4 py-2 rounded-full border"
                          style={{
                            backgroundColor: localComplaintFilters.category.includes(option.value)
                              ? colors.primary
                              : colors.white,
                            borderColor: localComplaintFilters.category.includes(option.value)
                              ? colors.primary
                              : colors.gray300,
                          }}
                        >
                          <Text
                            className="text-sm font-medium"
                            style={{
                              color: localComplaintFilters.category.includes(option.value)
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
                          onPress={() => toggleComplaintFilter('priority', option.value)}
                          className="px-4 py-2 rounded-full border"
                          style={{
                            backgroundColor: localComplaintFilters.priority.includes(option.value)
                              ? colors.primary
                              : colors.white,
                            borderColor: localComplaintFilters.priority.includes(option.value)
                              ? colors.primary
                              : colors.gray300,
                          }}
                        >
                          <Text
                            className="text-sm font-medium"
                            style={{
                              color: localComplaintFilters.priority.includes(option.value)
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

                  {/* Complaint Date Range */}
                  <View className="mb-6">
                    <Text className="text-base font-semibold mb-3" style={{ color: colors.gray900 }}>
                      Date Range
                    </Text>
                    <DateRangePicker
                      startDate={localComplaintFilters.dateRange?.start || null}
                      endDate={localComplaintFilters.dateRange?.end || null}
                      onStartDateChange={(date) =>
                        setLocalComplaintFilters((prev) => ({
                          ...prev,
                          dateRange: { start: date, end: prev.dateRange?.end || null },
                        }))
                      }
                      onEndDateChange={(date) =>
                        setLocalComplaintFilters((prev) => ({
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
                        value={localComplaintFilters.myComplaints}
                        onValueChange={(value) =>
                          setLocalComplaintFilters((prev) => ({ ...prev, myComplaints: value }))
                        }
                        trackColor={{ false: colors.gray300, true: colors.primaryLight }}
                        thumbColor={localComplaintFilters.myComplaints ? colors.primary : colors.white}
                      />
                    </View>
                  </View>
                </>
              ) : (
                <>
                  {/* Project Status Filter */}
                  <View className="mb-6">
                    <Text className="text-base font-semibold mb-3" style={{ color: colors.gray900 }}>
                      Status
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {PROJECT_STATUS_OPTIONS.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          onPress={() => toggleProjectFilter('status', option.value)}
                          className="px-4 py-2 rounded-full border"
                          style={{
                            backgroundColor: localProjectFilters.status.includes(option.value)
                              ? colors.primary
                              : colors.white,
                            borderColor: localProjectFilters.status.includes(option.value)
                              ? colors.primary
                              : colors.gray300,
                          }}
                        >
                          <Text
                            className="text-sm font-medium"
                            style={{
                              color: localProjectFilters.status.includes(option.value)
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

                  {/* Project Category Filter */}
                  <View className="mb-6">
                    <Text className="text-base font-semibold mb-3" style={{ color: colors.gray900 }}>
                      Category
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {PROJECT_CATEGORY_OPTIONS.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          onPress={() => toggleProjectFilter('category', option.value)}
                          className="px-4 py-2 rounded-full border"
                          style={{
                            backgroundColor: localProjectFilters.category.includes(option.value)
                              ? colors.primary
                              : colors.white,
                            borderColor: localProjectFilters.category.includes(option.value)
                              ? colors.primary
                              : colors.gray300,
                          }}
                        >
                          <Text
                            className="text-sm font-medium"
                            style={{
                              color: localProjectFilters.category.includes(option.value)
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

                  {/* Project Date Range */}
                  <View className="mb-6">
                    <Text className="text-base font-semibold mb-3" style={{ color: colors.gray900 }}>
                      Date Range
                    </Text>
                    <DateRangePicker
                      startDate={localProjectFilters.dateRange?.start || null}
                      endDate={localProjectFilters.dateRange?.end || null}
                      onStartDateChange={(date) =>
                        setLocalProjectFilters((prev) => ({
                          ...prev,
                          dateRange: { start: date, end: prev.dateRange?.end || null },
                        }))
                      }
                      onEndDateChange={(date) =>
                        setLocalProjectFilters((prev) => ({
                          ...prev,
                          dateRange: { start: prev.dateRange?.start || null, end: date },
                        }))
                      }
                    />
                  </View>
                </>
              )}
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
