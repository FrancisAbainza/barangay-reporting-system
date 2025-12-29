import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangePickerProps) {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      onStartDateChange(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      onEndDateChange(selectedDate);
    }
  };

  const clearDates = () => {
    onStartDateChange(null);
    onEndDateChange(null);
  };

  return (
    <View>
      <View className="flex-row gap-3 mb-3">
        {/* Start Date */}
        <View className="flex-1">
          <Text className="text-sm font-medium mb-2" style={{ color: colors.gray700 }}>
            From
          </Text>
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            className="flex-row items-center justify-between px-4 py-3 rounded-lg border"
            style={{ borderColor: colors.gray300, backgroundColor: colors.gray50 }}
          >
            <Text className="text-sm" style={{ color: startDate ? colors.gray900 : colors.gray500 }}>
              {formatDate(startDate)}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={colors.gray500} />
          </TouchableOpacity>
        </View>

        {/* End Date */}
        <View className="flex-1">
          <Text className="text-sm font-medium mb-2" style={{ color: colors.gray700 }}>
            To
          </Text>
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            className="flex-row items-center justify-between px-4 py-3 rounded-lg border"
            style={{ borderColor: colors.gray300, backgroundColor: colors.gray50 }}
          >
            <Text className="text-sm" style={{ color: endDate ? colors.gray900 : colors.gray500 }}>
              {formatDate(endDate)}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={colors.gray500} />
          </TouchableOpacity>
        </View>
      </View>

      {(startDate || endDate) && (
        <TouchableOpacity onPress={clearDates} className="flex-row items-center justify-center py-2">
          <Ionicons name="close-circle" size={16} color={colors.error} />
          <Text className="text-sm font-medium ml-1" style={{ color: colors.error }}>
            Clear dates
          </Text>
        </TouchableOpacity>
      )}

      {/* Start Date Picker */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartDateChange}
          maximumDate={endDate || new Date()}
        />
      )}

      {/* End Date Picker */}
      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndDateChange}
          minimumDate={startDate || undefined}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}
