import React, { useState } from 'react';
import { Alert } from 'react-native';
import { ScreenContainer, ScreenHeader } from '../components/ui';
import { ComplaintForm } from '../components/complaints';
import { ComplaintFormData } from '../schemas/complaints';
import { useDummyDb } from '../contexts/DummyDbContext';
import { useAuth } from '../contexts/AuthContext';

export default function CreateScreen() {
  const [loading, setLoading] = useState(false);
  const { createComplaint } = useDummyDb();
  const { user } = useAuth();

  const handleSubmit = async (data: ComplaintFormData) => {
    setLoading(true);
    try {
      const newComplaint = createComplaint({
        title: data.title,
        description: data.description,
        category: data.category,
        location: {
          latitude: data.location.latitude,
          longitude: data.location.longitude,
        },
        images: data.images,
      });

      Alert.alert(
        'Success',
        'Your complaint has been submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Optionally navigate to complaints list or detail screen
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Report a Complaint" />
      <ComplaintForm onSubmit={handleSubmit} loading={loading} />
    </ScreenContainer>
  );
}
