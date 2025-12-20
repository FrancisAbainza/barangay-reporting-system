import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { colors } from '../../constants/colors';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({ 
  onPress, 
  title, 
  variant = 'primary', 
  disabled = false,
  loading = false,
  className = ''
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (variant === 'primary') return colors.primary;
    if (variant === 'danger') return colors.error;
    return colors.white;
  };

  const getTextColor = () => {
    if (variant === 'secondary') return colors.primary;
    return colors.white;
  };

  const getBorderStyle = () => {
    if (variant === 'secondary') {
      return { borderWidth: 2, borderColor: colors.primary };
    }
    return {};
  };

  return (
    <TouchableOpacity
      className={`rounded-lg py-4 items-center justify-center ${className}`}
      style={{ backgroundColor: getBackgroundColor(), ...getBorderStyle() }}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text 
          className="text-base font-semibold" 
          style={{ color: getTextColor() }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
