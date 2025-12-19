import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../constants/colors';

export default function ComplaintsScreen() {
  const { user } = useAuth();

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
        <Text className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
          Complaints
        </Text>
        {user && (
          <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
            Welcome, {user.name}
          </Text>
        )}
      </View>
      
      <View className="flex-1 items-center justify-center">
        <Text className="text-base" style={{ color: colors.textSecondary }}>
          Complaints content will go here
        </Text>
      </View>
    </View>
  );
}
