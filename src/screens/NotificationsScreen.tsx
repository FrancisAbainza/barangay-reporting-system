import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ui';
import { colors } from '../constants/colors';
import { AccountStackParamList } from '../navigation/AuthenticatedTabs';

export default function NotificationsScreen() {
  const navigation = useNavigation<NavigationProp<AccountStackParamList>>();

  return (
    <ScreenContainer>
      <View className="px-6 py-4 border-b" style={{ borderBottomColor: colors.border }}>
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.navigate('AccountHome')}
            className="mr-3"
          >
            <Ionicons name="arrow-back" size={24} color={colors.gray900} />
          </TouchableOpacity>
          <Text className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
            Notifications
          </Text>
        </View>
      </View>
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-center text-gray-500">
            No notifications yet
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
