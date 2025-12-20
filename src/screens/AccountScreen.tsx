import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { IconButton } from '../components/ui';

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
        <IconButton
          icon="log-out-outline"
          title={loading ? 'Logging out...' : 'Logout'}
          variant="danger"
          onPress={handleLogout}
          disabled={loading}
        />
      </View>
    </View>
  );
}
