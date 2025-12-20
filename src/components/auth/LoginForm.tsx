import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField, Button } from '../ui';
import { loginSchema, LoginFormData } from '../../schemas/auth';
import { colors } from '../../constants/colors';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onNavigateToSignup: () => void;
  loading?: boolean;
}

export function LoginForm({ onSubmit, onNavigateToSignup, loading = false }: LoginFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <View className="flex-1 justify-center px-6">
      <Text className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
        Welcome Back
      </Text>
      <Text className="text-base mb-8" style={{ color: colors.textSecondary }}>
        Sign in to continue
      </Text>

      <FormField
        control={control}
        name="email"
        label="Email"
        error={errors.email?.message}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        disabled={loading}
      />

      <FormField
        control={control}
        name="password"
        label="Password"
        error={errors.password?.message}
        placeholder="Enter your password"
        secureTextEntry
        disabled={loading}
      />

      <Button
        title="Sign In"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={loading}
      />

      <View className="flex-row items-center justify-center mt-6">
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity onPress={onNavigateToSignup} disabled={loading}>
          <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
