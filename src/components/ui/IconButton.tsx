import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface IconButtonProps {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
  iconSize?: number;
}

export function IconButton({ 
  onPress, 
  icon,
  title, 
  variant = 'primary', 
  disabled = false,
  className = '',
  iconSize = 24
}: IconButtonProps) {
  const getBackgroundColor = () => {
    if (variant === 'primary') return colors.primary;
    if (variant === 'danger') return colors.error;
    return colors.white;
  };

  const getTextColor = () => {
    if (variant === 'secondary') return colors.primary;
    return colors.white;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center justify-center py-4 px-6 rounded-lg ${className}`}
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <Ionicons name={icon} size={iconSize} color={getTextColor()} />
      <Text 
        className="ml-2 text-base font-semibold"
        style={{ color: getTextColor() }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
