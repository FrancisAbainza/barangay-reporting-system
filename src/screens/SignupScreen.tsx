import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../constants/colors';
import { AuthStackParamList } from '../navigation/AuthenticationStack';

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

type SignupScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

export default function SignupScreen({ navigation }: SignupScreenProps) {
  const { signup, loading } = useAuth();
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

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup(data);
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView 
        contentContainerClassName="flex-grow"
        className="flex-1 bg-white"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 py-8">
          <Text className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
            Create Account
          </Text>
          <Text className="text-base mb-6" style={{ color: colors.textSecondary }}>
            Sign up to get started
          </Text>

          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
              First Name
            </Text>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border rounded-lg px-4 py-3 text-base"
                  style={{ 
                    borderColor: errors.firstName ? colors.error : colors.border,
                    color: colors.textPrimary,
                  }}
                  placeholder="Enter your first name"
                  placeholderTextColor={colors.textTertiary}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={!loading}
                />
              )}
            />
            {errors.firstName && (
              <Text className="text-sm mt-1" style={{ color: colors.error }}>
                {errors.firstName.message}
              </Text>
            )}
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
              Middle Name <Text style={{ color: colors.textTertiary }}>(Optional)</Text>
            </Text>
            <Controller
              control={control}
              name="middleName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border rounded-lg px-4 py-3 text-base"
                  style={{ 
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                  placeholder="Enter your middle name"
                  placeholderTextColor={colors.textTertiary}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={!loading}
                />
              )}
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
              Last Name
            </Text>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border rounded-lg px-4 py-3 text-base"
                  style={{ 
                    borderColor: errors.lastName ? colors.error : colors.border,
                    color: colors.textPrimary,
                  }}
                  placeholder="Enter your last name"
                  placeholderTextColor={colors.textTertiary}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={!loading}
                />
              )}
            />
            {errors.lastName && (
              <Text className="text-sm mt-1" style={{ color: colors.error }}>
                {errors.lastName.message}
              </Text>
            )}
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
              Phone Number
            </Text>
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border rounded-lg px-4 py-3 text-base"
                  style={{ 
                    borderColor: errors.phoneNumber ? colors.error : colors.border,
                    color: colors.textPrimary,
                  }}
                  placeholder="Enter your phone number"
                  placeholderTextColor={colors.textTertiary}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="phone-pad"
                  editable={!loading}
                />
              )}
            />
            {errors.phoneNumber && (
              <Text className="text-sm mt-1" style={{ color: colors.error }}>
                {errors.phoneNumber.message}
              </Text>
            )}
          </View>

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
            className="rounded-lg py-4 items-center justify-center mb-6"
            style={{ backgroundColor: colors.primary }}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text className="text-base font-semibold" style={{ color: colors.white }}>
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center justify-center">
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.replace('Login')} disabled={loading}>
              <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
