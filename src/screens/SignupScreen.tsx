import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { AuthStackParamList } from '../navigation/AuthenticationStack';
import { SignupForm } from '../components/auth';
import { ScreenContainer } from '../components/ui';
import { SignupFormData } from '../schemas/auth';

type SignupScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

export default function SignupScreen({ navigation }: SignupScreenProps) {
  const { signup, loading } = useAuth();

  const handleSubmit = async (data: SignupFormData) => {
    try {
      await signup(data);
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleNavigateToLogin = () => {
    navigation.replace('Login');
  };

  return (
    <ScreenContainer>
      <SignupForm
        onSubmit={handleSubmit}
        onNavigateToLogin={handleNavigateToLogin}
        loading={loading}
      />
    </ScreenContainer>
  );
}
