import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthenticationStack';
import { colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui';

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
        <Button
          title="Login"
          onPress={() => navigation.navigate('Login')}
        />

        <Button
          title="Create Account"
          variant="secondary"
          onPress={() => navigation.navigate('Signup')}
        />
      </View>
    </View>
  );
}
