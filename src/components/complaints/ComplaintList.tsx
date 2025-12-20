import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { Complaint } from '../../types/dummyDb';
import { ComplaintCard } from './ComplaintCard';
import { colors } from '../../constants/colors';

interface ComplaintListProps {
  complaints: Complaint[];
  onComplaintPress: (complaint: Complaint) => void;
}

export function ComplaintList({ complaints, onComplaintPress }: ComplaintListProps) {
  if (complaints.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-base text-center" style={{ color: colors.gray500 }}>
          No complaints yet
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={complaints}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ComplaintCard complaint={item} onPress={onComplaintPress} />
      )}
      contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
      showsVerticalScrollIndicator={false}
    />
  );
}
