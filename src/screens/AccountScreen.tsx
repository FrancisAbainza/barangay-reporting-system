import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { IconButton } from '../components/ui';
import { colors } from '../constants/colors';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
}

function MenuItem({ icon, title, subtitle, onPress, showChevron = true }: MenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-4 px-4 border-b border-gray-100"
      activeOpacity={0.7}
    >
      <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
        <Ionicons name={icon} size={20} color={colors.gray700} />
      </View>
      
      <View className="flex-1 ml-3">
        <Text className="text-base font-medium text-gray-900">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
        )}
      </View>
      
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
      )}
    </TouchableOpacity>
  );
}

interface SectionHeaderProps {
  title: string;
}

function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 bg-gray-50">
      {title}
    </Text>
  );
}

export default function AccountScreen() {
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
    console.log('Edit profile pressed');
  };

  const handleChangePassword = () => {
    // TODO: Navigate to change password screen
    console.log('Change password pressed');
  };

  const handleUpdateEmail = () => {
    // TODO: Navigate to update email screen
    console.log('Update email pressed');
  };

  const handleUpdatePhone = () => {
    // TODO: Navigate to update phone screen
    console.log('Update phone pressed');
  };

  const handleNotifications = () => {
    // TODO: Navigate to notifications settings screen
    console.log('Notifications pressed');
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView>
        {/* Profile Info Section */}
        <View className="bg-white pb-4">
          <View className="items-center pt-8 pb-4">
            {/* Profile Photo */}
            <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center mb-4">
              <Ionicons name="person" size={48} color={colors.gray400} />
            </View>
            
            {/* User Name */}
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              {user?.name || 'Guest User'}
            </Text>
            
            {/* User Email */}
            <Text className="text-base text-gray-500 mb-1">
              {user?.email || 'guest@example.com'}
            </Text>
            
            {/* User Role Badge */}
            <View className="mt-2 px-3 py-1 rounded-full bg-blue-100">
              <Text className="text-sm font-medium text-blue-800 capitalize">
                {user?.role || 'Resident'}
              </Text>
            </View>
          </View>
          
          {/* Edit Profile Button */}
          <View className="px-6 pt-2">
            <TouchableOpacity
              onPress={handleEditProfile}
              className="flex-row items-center justify-center py-3 px-4 rounded-lg border-2 border-gray-300"
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={20} color={colors.gray700} />
              <Text className="ml-2 text-base font-semibold text-gray-700">
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Settings Section */}
        <View className="mt-6">
          <SectionHeader title="Account Settings" />
          <View className="bg-white">
            <MenuItem
              icon="lock-closed-outline"
              title="Change Password"
              subtitle="Update your password"
              onPress={handleChangePassword}
            />
            <MenuItem
              icon="mail-outline"
              title="Update Email"
              subtitle={user?.email}
              onPress={handleUpdateEmail}
            />
            <MenuItem
              icon="call-outline"
              title="Update Phone Number"
              subtitle="Manage your phone number"
              onPress={handleUpdatePhone}
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View className="mt-6">
          <SectionHeader title="Notifications" />
          <View className="bg-white">
            <MenuItem
              icon="notifications-outline"
              title="Notification Settings"
              subtitle="Manage your notification preferences"
              onPress={handleNotifications}
            />
          </View>
        </View>

        {/* Logout Section */}
        <View className="mt-6 mb-8 px-6">
          <IconButton
            icon="log-out-outline"
            title={loading ? 'Logging out...' : 'Logout'}
            variant="danger"
            onPress={handleLogout}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
}
