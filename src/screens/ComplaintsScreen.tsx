import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ComplaintsStackParamList } from '../navigation/AuthenticatedTabs';
import { useAuth } from '../contexts/AuthContext';
import { ScreenHeader } from '../components/ui';
import { ComplaintList, ComplaintFilter, ComplaintFilters } from '../components/complaints';
import { Complaint } from '../types/complaint';
import { useComplaintDb } from '../contexts/ComplaintDbContext';

type Props = NativeStackScreenProps<ComplaintsStackParamList, 'ComplaintsList'>;

export default function ComplaintsScreen({ navigation }: Props) {
  const { complaints } = useComplaintDb();
  const { user } = useAuth();
  const [filters, setFilters] = useState<ComplaintFilters>({
    status: [],
    category: [],
    priority: [],
    dateRange: undefined,
    myComplaints: false,
  });

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      // Hide submitted complaints unless they belong to the current user
      if (complaint.status === 'submitted' && (!user || complaint.complainantId !== user.id)) {
        return false;
      }

      // Filter by my complaints
      if (filters.myComplaints && user && complaint.complainantId !== user.id) {
        return false;
      }

      // Filter by status
      if (filters.status.length > 0 && !filters.status.includes(complaint.status)) {
        return false;
      }

      // Filter by category
      if (filters.category.length > 0 && !filters.category.includes(complaint.category)) {
        return false;
      }

      // Filter by priority
      if (filters.priority.length > 0 && !filters.priority.includes(complaint.priority)) {
        return false;
      }

      // Filter by date range
      if (filters.dateRange?.start && filters.dateRange?.end) {
        const complaintDate = new Date(complaint.createdAt);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        
        // Set time to start/end of day for accurate comparison
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        
        if (complaintDate < startDate || complaintDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [complaints, filters, user]);

  const activeFilterCount = useMemo(() => {
    return (
      filters.status.length +
      filters.category.length +
      filters.priority.length +
      (filters.dateRange?.start && filters.dateRange?.end ? 1 : 0) +
      (filters.myComplaints ? 1 : 0)
    );
  }, [filters]);

  const handleComplaintPress = (complaint: Complaint) => {
    navigation.navigate('ComplaintDetail', { complaintId: complaint.id });
  };

  return (
    <View className="flex-1 bg-white">
      {/* <ScreenHeader 
        subtitle="List of user-reported complaints across the barangay."
        bordered
      /> */}
      
      <ComplaintFilter
        filters={filters}
        onFiltersChange={setFilters}
        activeFilterCount={activeFilterCount}
      />

      <ComplaintList complaints={filteredComplaints} onComplaintPress={handleComplaintPress} />
    </View>
  );
}
