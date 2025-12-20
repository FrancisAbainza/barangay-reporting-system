import React from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ComplaintsStackParamList } from '../navigation/AuthenticatedTabs';
import { useAuth } from '../contexts/AuthContext';
import { useDummyDb } from '../contexts/DummyDbContext';
import { ScreenHeader } from '../components/ui';
import { ComplaintList } from '../components/complaints/ComplaintList';
import { Complaint } from '../types/dummyDb';

type Props = NativeStackScreenProps<ComplaintsStackParamList, 'ComplaintsList'>;

export default function ComplaintsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { complaints } = useDummyDb();

  const handleComplaintPress = (complaint: Complaint) => {
    navigation.navigate('ComplaintDetail', { complaintId: complaint.id });
  };

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader 
        title="Complaints" 
        subtitle={user ? `Welcome, ${user.name}` : undefined}
        bordered
      />
      
      <ComplaintList complaints={complaints} onComplaintPress={handleComplaintPress} />
    </View>
  );
}
