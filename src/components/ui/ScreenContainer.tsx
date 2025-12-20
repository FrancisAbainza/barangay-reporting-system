import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, ViewProps } from 'react-native';

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
}

export function ScreenContainer({ 
  children, 
  scrollable = true, 
  keyboardAvoiding = true,
  ...props 
}: ScreenContainerProps) {
  if (!keyboardAvoiding && !scrollable) {
    return <View className="flex-1 bg-white" {...props}>{children}</View>;
  }

  if (!keyboardAvoiding && scrollable) {
    return (
      <ScrollView 
        contentContainerClassName="flex-grow"
        className="flex-1 bg-white"
        keyboardShouldPersistTaps="handled"
        {...props}
      >
        {children}
      </ScrollView>
    );
  }

  if (keyboardAvoiding && !scrollable) {
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        className="flex-1 bg-white"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        {...props}
      >
        {children}
      </KeyboardAvoidingView>
    );
  }

  // Both keyboardAvoiding and scrollable
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      {...props}
    >
      <ScrollView 
        contentContainerClassName="flex-grow"
        className="flex-1 bg-white"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
