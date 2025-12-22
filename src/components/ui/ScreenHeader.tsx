import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../../constants/colors';

interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  bordered?: boolean;
}

export function ScreenHeader({ title, subtitle, bordered = false }: ScreenHeaderProps) {
  return (
    <View
      className={`px-6 py-4 ${bordered ? 'border-b' : ''}`}
      style={bordered ? { borderBottomColor: colors.border } : {}}
    >
      {title && (
        <Text className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
          {title}
        </Text>
      )}
      {subtitle && (
        <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
