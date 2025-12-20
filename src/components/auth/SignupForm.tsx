import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField, Button } from '../ui';
import { signupSchema, SignupFormData } from '../../schemas/auth';
import { colors } from '../../constants/colors';

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
  onNavigateToLogin: () => void;
  loading?: boolean;
}

export function SignupForm({ onSubmit, onNavigateToLogin, loading = false }: SignupFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      password: '',
    },
  });

  return (
    <View className="flex-1 px-6 py-8">
      <Text className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
        Create Account
      </Text>
      <Text className="text-base mb-6" style={{ color: colors.textSecondary }}>
        Sign up to get started
      </Text>

      <FormField
        control={control}
        name="firstName"
        label="First Name"
        error={errors.firstName?.message}
        placeholder="Enter your first name"
        disabled={loading}
      />

      <FormField
        control={control}
        name="middleName"
        label="Middle Name"
        error={errors.middleName?.message}
        placeholder="Enter your middle name"
        optional
        disabled={loading}
      />

      <FormField
        control={control}
        name="lastName"
        label="Last Name"
        error={errors.lastName?.message}
        placeholder="Enter your last name"
        disabled={loading}
      />

      <FormField
        control={control}
        name="phoneNumber"
        label="Phone Number"
        error={errors.phoneNumber?.message}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        disabled={loading}
      />

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
        title="Create Account"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={loading}
        className="mb-6"
      />

      <View className="flex-row items-center justify-center">
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          Already have an account?{' '}
        </Text>
        <TouchableOpacity onPress={onNavigateToLogin} disabled={loading}>
          <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
