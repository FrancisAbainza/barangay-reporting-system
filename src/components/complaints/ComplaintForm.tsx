import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { complaintSchema, ComplaintFormData } from '../../schemas/complaints';
import { FormField, Button } from '../ui';
import { LocationPicker } from '../ui/LocationPicker';
import { ImagePickerComponent } from '../ui/ImagePicker';
import { colors } from '../../constants/colors';
import { ComplaintCategory } from '../../types/complaint';
import { useFormDraft } from '../../contexts/FormDraftContext';

interface ComplaintFormProps {
  onSubmit: (data: ComplaintFormData) => Promise<void>;
  initialData?: Partial<ComplaintFormData>;
  mode?: 'create' | 'edit';
  loading?: boolean;
}

const COMPLAINT_CATEGORIES: { value: ComplaintCategory; label: string }[] = [
  { value: 'noise', label: 'Noise Complaint' },
  { value: 'sanitation', label: 'Sanitation' },
  { value: 'public_safety', label: 'Public Safety' },
  { value: 'traffic', label: 'Traffic' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'water_electricity', label: 'Water & Electricity' },
  { value: 'domestic', label: 'Domestic Issue' },
  { value: 'environment', label: 'Environment' },
  { value: 'others', label: 'Others' },
];

export function ComplaintForm({
  onSubmit,
  initialData,
  mode = 'create',
  loading = false,
}: ComplaintFormProps) {
  const { draft, setDraft, clearDraft } = useFormDraft();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      title: '',
      description: '',
      category: undefined,
      location: undefined,
      images: [],
      ...initialData,
      ...draft,
    },
  });


  useEffect(() => {
    const sub = watch((value) => {
      setDraft(value as Partial<ComplaintFormData>);
    });

    return () => sub.unsubscribe();
  }, [watch]);

  const selectedCategory = watch('category');
  const currentLocation = watch('location');
  const currentImages = watch('images');

  const handleFormSubmit = async (data: ComplaintFormData) => {
    try {
      await onSubmit(data);

      // Clear RHF form
      reset({
        title: '',
        description: '',
        category: undefined,
        location: undefined,
        images: [],
      });

      // Clear draft context
      clearDraft();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit complaint. Please try again.');
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white pb-4"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="px-6 py-4">
        {/* Title Field */}
        <FormField
          control={control}
          name="title"
          label="Title"
          placeholder="Brief description of the issue"
          error={errors.title?.message}
          disabled={loading}
          maxLength={100}
        />

        {/* Category Field */}
        <View className="mb-4">
          <Text
            className="text-sm font-medium mb-2"
            style={{ color: colors.textPrimary }}
          >
            Category
          </Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row flex-wrap gap-2">
                {COMPLAINT_CATEGORIES.map((category) => {
                  const isSelected = value === category.value;
                  return (
                    <TouchableOpacity
                      key={category.value}
                      onPress={() => onChange(category.value)}
                      disabled={loading}
                      className="px-4 py-2 rounded-full border"
                      style={{
                        borderColor: isSelected ? colors.primary : colors.border,
                        backgroundColor: isSelected ? colors.primaryLight : colors.white,
                      }}
                    >
                      <Text
                        className="text-sm font-medium"
                        style={{
                          color: isSelected ? colors.white : colors.textSecondary,
                        }}
                      >
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />
          {errors.category && (
            <Text className="text-sm mt-1" style={{ color: colors.error }}>
              {errors.category.message}
            </Text>
          )}
        </View>

        {/* Description Field */}
        <View className="mb-4">
          <Text
            className="text-sm font-medium mb-2"
            style={{ color: colors.textPrimary }}
          >
            Description
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="border rounded-lg px-4 py-3 text-base"
                style={{
                  borderColor: errors.description ? colors.error : colors.border,
                  color: colors.textPrimary,
                  minHeight: 120,
                  textAlignVertical: 'top',
                }}
                placeholderTextColor={colors.textTertiary}
                placeholder="Provide detailed information about the complaint"
                multiline
                numberOfLines={6}
                maxLength={500}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                editable={!loading}
              />
            )}
          />
          {errors.description && (
            <Text className="text-sm mt-1" style={{ color: colors.error }}>
              {errors.description.message}
            </Text>
          )}
        </View>

        {/* Location Field */}
        <Controller
          control={control}
          name="location"
          render={({ field: { onChange, value } }) => (
            <LocationPicker
              onLocationChange={(location) => {
                if (location) {
                  onChange({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    address: location.address,
                  });
                } else {
                  onChange(undefined);
                }
              }}
              initialLocation={value}
              error={errors.location?.message}
              disabled={loading}
            />
          )}
        />

        {/* Images Field */}
        <Controller
          control={control}
          name="images"
          render={({ field: { onChange, value } }) => (
            <ImagePickerComponent
              images={value || []}
              onImagesChange={onChange}
              error={errors.images?.message}
              disabled={loading}
            />
          )}
        />

        {/* Submit Button */}
        <Button
          title={mode === 'create' ? 'Submit Complaint' : 'Update Complaint'}
          onPress={handleSubmit(handleFormSubmit)}
          loading={loading}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}
