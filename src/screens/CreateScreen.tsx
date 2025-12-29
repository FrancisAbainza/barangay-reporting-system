import React, { useState } from 'react';
import { Alert } from 'react-native';
import { ScreenContainer, ScreenHeader } from '../components/ui';
import { ComplaintForm } from '../components/complaints';
import { ComplaintFormData } from '../schemas/complaints';
import { useComplaintDb } from '../contexts/ComplaintDbContext';
import { useAuth } from '../contexts/AuthContext';

export default function CreateScreen() {
  const [loading, setLoading] = useState(false);
  const { createComplaint } = useComplaintDb();
  const { user } = useAuth();

  const handleSubmit = async (data: ComplaintFormData) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to submit a complaint.');
      return;
    }

    setLoading(true);
    try {
      const newComplaint = createComplaint(data, user.id, user.name);

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
