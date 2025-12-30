import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { Button } from './Button';

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
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
      if (selectedDate) {
        onStartDateChange(selectedDate);
      }
    } else {
      // iOS: update temp date for modal confirmation
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndPicker(false);
      if (selectedDate) {
        onEndDateChange(selectedDate);
      }
    } else {
      // iOS: update temp date for modal confirmation
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const confirmStartDate = () => {
    if (tempDate) {
      onStartDateChange(tempDate);
    }
    setShowStartPicker(false);
    setTempDate(null);
  };

  const confirmEndDate = () => {
    if (tempDate) {
      onEndDateChange(tempDate);
    }
    setShowEndPicker(false);
    setTempDate(null);
  };

  const cancelPicker = () => {
    setShowStartPicker(false);
    setShowEndPicker(false);
    setTempDate(null);
  };

  const openStartPicker = () => {
    setTempDate(startDate || new Date());
    setShowStartPicker(true);
  };

  const openEndPicker = () => {
    setTempDate(endDate || new Date());
    setShowEndPicker(true);
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
            onPress={openStartPicker}
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
            onPress={openEndPicker}
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
      {showStartPicker && Platform.OS === 'ios' && (
        <Modal visible={showStartPicker} transparent animationType="slide">
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl">
              <View className="flex-row items-center justify-between px-6 py-4 border-b" style={{ borderBottomColor: colors.gray200 }}>
                <TouchableOpacity onPress={cancelPicker}>
                  <Text className="text-base font-semibold" style={{ color: colors.error }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold" style={{ color: colors.gray900 }}>
                  Select Start Date
                </Text>
                <TouchableOpacity onPress={confirmStartDate}>
                  <Text className="text-base font-semibold" style={{ color: colors.primary }}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate || new Date()}
                mode="date"
                display="spinner"
                onChange={handleStartDateChange}
                maximumDate={endDate || new Date()}
                textColor={colors.gray900}
              />
            </View>
          </View>
        </Modal>
      )}

      {showStartPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
          maximumDate={endDate || new Date()}
        />
      )}

      {/* End Date Picker */}
      {showEndPicker && Platform.OS === 'ios' && (
        <Modal visible={showEndPicker} transparent animationType="slide">
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl">
              <View className="flex-row items-center justify-between px-6 py-4 border-b" style={{ borderBottomColor: colors.gray200 }}>
                <TouchableOpacity onPress={cancelPicker}>
                  <Text className="text-base font-semibold" style={{ color: colors.error }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold" style={{ color: colors.gray900 }}>
                  Select End Date
                </Text>
                <TouchableOpacity onPress={confirmEndDate}>
                  <Text className="text-base font-semibold" style={{ color: colors.primary }}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate || new Date()}
                mode="date"
                display="spinner"
                onChange={handleEndDateChange}
                minimumDate={startDate || undefined}
                maximumDate={new Date()}
                textColor={colors.gray900}
              />
            </View>
          </View>
        </Modal>
      )}

      {showEndPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
          minimumDate={startDate || undefined}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}
