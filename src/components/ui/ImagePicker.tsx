import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

interface ImageData {
  uri: string;
}

interface ImagePickerComponentProps {
  images: ImageData[];
  onImagesChange: (images: ImageData[]) => void;
  disabled?: boolean;
  error?: string;
}

export function ImagePickerComponent({
  images,
  onImagesChange,
  disabled = false,
  error,
}: ImagePickerComponentProps) {
  const pickFromGallery = async () => {
    if (disabled) return;

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri,
      }));

      onImagesChange([...images, ...newImages]);
    }
  };

  const pickFromCamera = async () => {
    if (disabled) return;

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri,
      }));

      onImagesChange([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    if (disabled) return;
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  return (
    <View className="mb-4">
      <Text
        className="text-sm font-medium mb-2"
        style={{ color: colors.textPrimary }}
      >
        Images <Text style={{ color: colors.textTertiary }}>(Optional)</Text>
      </Text>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3"
          contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 2 }}
        >
          <View className="flex-row gap-2">
            {images.map((image, index) => (
              <View key={index} className="relative" style={{ overflow: 'visible' }}>
                <Image
                  source={{ uri: image.uri }}
                  className="w-24 h-24 rounded-lg"
                />
                <TouchableOpacity
                  className="absolute -top-2 -right-2 rounded-full"
                  style={{ backgroundColor: colors.white, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2 }}
                  onPress={() => removeImage(index)}
                  disabled={disabled}
                >
                  <Ionicons name="close-circle" size={24} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Action Buttons */}
      <View className="flex-row gap-2">
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center border-2 border-dashed rounded-lg py-3"
          style={{
            borderColor: error ? colors.error : colors.primary,
            backgroundColor: colors.gray50,
          }}
          onPress={pickFromGallery}
          disabled={disabled}
        >
          <Ionicons
            name="images-outline"
            size={20}
            color={colors.primary}
            style={{ marginRight: 6 }}
          />
          <Text className="text-sm font-medium" style={{ color: colors.primary }}>
            Gallery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center border-2 border-dashed rounded-lg py-3"
          style={{
            borderColor: error ? colors.error : colors.primary,
            backgroundColor: colors.gray50,
          }}
          onPress={pickFromCamera}
          disabled={disabled}
        >
          <Ionicons
            name="camera-outline"
            size={20}
            color={colors.primary}
            style={{ marginRight: 6 }}
          />
          <Text className="text-sm font-medium" style={{ color: colors.primary }}>
            Camera
          </Text>
        </TouchableOpacity>
      </View>

      {error && (
        <Text className="text-sm mt-1" style={{ color: colors.error }}>
          {error}
        </Text>
      )}
    </View>
  );
}

