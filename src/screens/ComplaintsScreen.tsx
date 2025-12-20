import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../constants/colors';
import { ScreenHeader } from '../components/ui';

export default function ComplaintsScreen() {
  const { user } = useAuth();

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader 
        title="Complaints" 
        subtitle={user ? `Welcome, ${user.name}` : undefined}
        bordered
      />
      
      <View className="flex-1 items-center justify-center">
        <Text className="text-base" style={{ color: colors.textSecondary }}>
          Complaints content will go here
        </Text>
      </View>
    </View>
  );
}
