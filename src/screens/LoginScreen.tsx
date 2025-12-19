import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../constants/colors';
import { AuthStackParamList } from '../navigation/AuthenticationStack';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login, loading } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView 
        contentContainerClassName="flex-grow justify-center"
        className="flex-1 bg-white"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6">
          <Text className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
            Welcome Back
          </Text>
          <Text className="text-base mb-8" style={{ color: colors.textSecondary }}>
            Sign in to continue
          </Text>

          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
              Email
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border rounded-lg px-4 py-3 text-base"
                  style={{ 
                    borderColor: errors.email ? colors.error : colors.border,
                    color: colors.textPrimary,
                  }}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textTertiary}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              )}
            />
            {errors.email && (
              <Text className="text-sm mt-1" style={{ color: colors.error }}>
                {errors.email.message}
              </Text>
            )}
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
              Password
            </Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border rounded-lg px-4 py-3 text-base"
                  style={{ 
                    borderColor: errors.password ? colors.error : colors.border,
                    color: colors.textPrimary,
                  }}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textTertiary}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                  editable={!loading}
                />
              )}
            />
            {errors.password && (
              <Text className="text-sm mt-1" style={{ color: colors.error }}>
                {errors.password.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            className="rounded-lg py-4 items-center justify-center"
            style={{ backgroundColor: colors.primary }}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text className="text-base font-semibold" style={{ color: colors.white }}>
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center justify-center mt-6">
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.replace('Signup')} disabled={loading}>
              <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
