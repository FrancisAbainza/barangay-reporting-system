import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthenticationStack';
import { colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="items-center mb-12">
        <Ionicons name="shield-checkmark" size={80} color={colors.primary} />
        <Text className="text-3xl font-bold text-center mt-6" style={{ color: colors.primary }}>
          Barangay Reporting and{'\n'}Transparency System
        </Text>
        <Text className="text-base text-center mt-4" style={{ color: colors.textSecondary }}>
          Your voice matters. Report issues and stay informed about your barangay.
        </Text>
      </View>

      <View className="gap-4">
        <TouchableOpacity
          className="rounded-lg py-4 items-center justify-center"
          style={{ backgroundColor: colors.primary }}
          onPress={() => navigation.navigate('Login')}
        >
          <Text className="text-base font-semibold" style={{ color: colors.white }}>
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-lg py-4 items-center justify-center border-2"
          style={{ borderColor: colors.primary, backgroundColor: colors.white }}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text className="text-base font-semibold" style={{ color: colors.primary }}>
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
