import React, { useState } from 'react';
import { Alert } from 'react-native';
import { ScreenContainer, ScreenHeader } from '../components/ui';
import { ComplaintForm } from '../components/complaints';
import { ComplaintFormData } from '../schemas/complaints';
import { useDummyDb } from '../contexts/DummyDbContext';

export default function CreateScreen() {
  const [loading, setLoading] = useState(false);
  const { createComplaint } = useDummyDb();

  const handleSubmit = async (data: ComplaintFormData) => {
    setLoading(true);
    try {
      const newComplaint = createComplaint(data);

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
