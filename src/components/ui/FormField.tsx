import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { colors } from '../../constants/colors';

interface FormFieldProps<T extends FieldValues> extends Omit<TextInputProps, 'onBlur' | 'onChangeText' | 'value'> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  optional?: boolean;
  disabled?: boolean;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  error,
  optional = false,
  disabled = false,
  ...textInputProps
}: FormFieldProps<T>) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
        {label}
        {optional && (
          <Text style={{ color: colors.textTertiary }}> (Optional)</Text>
        )}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="border rounded-lg px-4 py-3 text-base"
            style={{ 
              borderColor: error ? colors.error : colors.border,
              color: colors.textPrimary,
            }}
            placeholderTextColor={colors.textTertiary}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value as string}
            editable={!disabled}
            {...textInputProps}
          />
        )}
      />
      {error && (
        <Text className="text-sm mt-1" style={{ color: colors.error }}>
          {error}
        </Text>
      )}
    </View>
  );
}
