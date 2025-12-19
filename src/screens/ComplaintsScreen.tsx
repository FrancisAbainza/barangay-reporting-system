import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../constants/colors';

export default function ComplaintsScreen() {
  const { logout, loading, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 py-4 flex-row items-center justify-between border-b" style={{ borderBottomColor: colors.border }}>
        <View>
          <Text className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
            Complaints
          </Text>
          {user && (
            <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              Welcome, {user.name}
            </Text>
          )}
        </View>
        <TouchableOpacity
          className="flex-row items-center px-4 py-2 rounded-lg"
          style={{ backgroundColor: colors.error }}
          onPress={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={20} color={colors.white} />
              <Text className="text-sm font-medium ml-2" style={{ color: colors.white }}>
                Logout
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      <View className="flex-1 items-center justify-center">
        <Text className="text-base" style={{ color: colors.textSecondary }}>
          Complaints content will go here
        </Text>
      </View>
    </View>
  );
}
