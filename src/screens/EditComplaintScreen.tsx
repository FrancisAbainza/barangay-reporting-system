import React, { useState } from 'react';
import { Alert, View, Text, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ui';
import { ComplaintForm } from '../components/complaints';
import { ComplaintFormData } from '../schemas/complaints';
import { useComplaintDb } from '../contexts/ComplaintDbContext';
import { useAuth } from '../contexts/AuthContext';
import { ComplaintsStackParamList } from '../navigation/AuthenticatedTabs';
import { colors } from '../constants/colors';

type Props = NativeStackScreenProps<ComplaintsStackParamList, 'EditComplaint'>;

export default function EditComplaintScreen({ route, navigation }: Props) {
  const { complaintId } = route.params;
  const [loading, setLoading] = useState(false);
  const { getComplaint, updateComplaint } = useComplaintDb();
  const { user } = useAuth();
  
  const complaint = getComplaint(complaintId);

  // Check if user owns this complaint
  if (!complaint || !user || complaint.complainantId !== user.id) {
    return (
      <ScreenContainer>
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
            Edit Complaint
          </Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-center" style={{ color: colors.gray500 }}>
            {!complaint ? 'Complaint not found' : 'You are not authorized to edit this complaint'}
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const initialData: Partial<ComplaintFormData> = {
    title: complaint.title,
    description: complaint.description,
    location: complaint.location,
    images: complaint.images,
  };

  const handleSubmit = async (data: ComplaintFormData) => {
    setLoading(true);
    try {
      const updated = updateComplaint(complaintId, {
        title: data.title,
        description: data.description,
        location: data.location,
        images: data.images,
      });

      if (updated) {
        Alert.alert(
          'Success',
          'Your complaint has been updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Calculate how many screens to pop to get back to ComplaintDetail
                const state = navigation.getState();
                const currentIndex = state.index;
                const complaintDetailIndex = state.routes.findIndex(r => r.name === 'ComplaintDetail');
                
                if (complaintDetailIndex !== -1) {
                  const screensToPop = currentIndex - complaintDetailIndex;
                  navigation.pop(screensToPop);
                } else {
                  navigation.goBack();
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to update complaint. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
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
          Edit Complaint
        </Text>
      </View>
      <ComplaintForm 
        onSubmit={handleSubmit} 
        initialData={initialData}
        mode="edit"
        loading={loading}
      />
    </ScreenContainer>
  );
}
