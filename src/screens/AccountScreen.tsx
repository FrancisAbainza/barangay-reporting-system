import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../constants/colors';

export default function AccountScreen() {
  const { logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-semibold">Account Screen</Text>
      </View>
      
      <View className="p-6 pb-8">
        <TouchableOpacity
          onPress={handleLogout}
          disabled={loading}
          className="flex-row items-center justify-center py-4 px-6 rounded-lg"
          style={{ backgroundColor: colors.error }}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.white} />
          <Text className="ml-2 text-white text-base font-semibold">
            {loading ? 'Logging out...' : 'Logout'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
