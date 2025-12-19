import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ComplaintsScreen from '../screens/ComplaintsScreen';
import ForumScreen from '../screens/ForumScreen';
import CreateScreen from '../screens/CreateScreen';
import TransparencyScreen from '../screens/TransparencyScreen';
import AccountScreen from '../screens/AccountScreen';
import { colors } from '../constants/colors';

export type TabParamList = {
  Complaints: undefined;
  Forum: undefined;
  Create: undefined;
  Transparency: undefined;
  Account: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function AuthenticatedTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray500,
      }}
    >
      <Tab.Screen 
        name="Complaints" 
        component={ComplaintsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="megaphone" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Forum" 
        component={ForumScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Create" 
        component={CreateScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              className="items-center justify-center rounded-full mb-8"
              style={{
                width: 56,
                height: 56,
                backgroundColor: colors.primary,
              }}
            >
              <Ionicons 
                name={focused ? "add-circle" : "add-circle-outline"} 
                size={32} 
                color={colors.white} 
              />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Transparency" 
        component={TransparencyScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="file-tray-full" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
