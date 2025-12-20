import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { AuthStackParamList } from '../navigation/AuthenticationStack';
import { LoginForm } from '../components/auth';
import { ScreenContainer } from '../components/ui';
import { LoginFormData } from '../schemas/auth';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login, loading } = useAuth();

  const handleSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleNavigateToSignup = () => {
    navigation.replace('Signup');
  };

  return (
    <ScreenContainer>
      <LoginForm
        onSubmit={handleSubmit}
        onNavigateToSignup={handleNavigateToSignup}
        loading={loading}
      />
    </ScreenContainer>
  );
}
