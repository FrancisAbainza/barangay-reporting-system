import React from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ComplaintsStackParamList } from '../navigation/AuthenticatedTabs';
import { useAuth } from '../contexts/AuthContext';
import { ScreenHeader } from '../components/ui';
import { ComplaintList } from '../components/complaints/ComplaintList';
import { Complaint } from '../types/complaint';
import { useComplaintDb } from '../contexts/ComplaintDbContext';

type Props = NativeStackScreenProps<ComplaintsStackParamList, 'ComplaintsList'>;

export default function ComplaintsScreen({ navigation }: Props) {
  const { complaints } = useComplaintDb();

  const handleComplaintPress = (complaint: Complaint) => {
    navigation.navigate('ComplaintDetail', { complaintId: complaint.id });
  };

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader 
        subtitle="List of user-reported complaints across the barangay."
        bordered
      />
      
      <ComplaintList complaints={complaints} onComplaintPress={handleComplaintPress} />
    </View>
  );
}
