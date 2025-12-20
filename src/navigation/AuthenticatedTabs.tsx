import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ComplaintsScreen from '../screens/ComplaintsScreen';
import ComplaintDetailScreen from '../screens/ComplaintDetailScreen';
import ForumScreen from '../screens/ForumScreen';
import CreateScreen from '../screens/CreateScreen';
import TransparencyScreen from '../screens/TransparencyScreen';
import ProjectDetailScreen from '../screens/ProjectDetailScreen';
import AccountScreen from '../screens/AccountScreen';
import { colors } from '../constants/colors';

export type ComplaintsStackParamList = {
  ComplaintsList: undefined;
  ComplaintDetail: { complaintId: string };
};

export type TransparencyStackParamList = {
  ProjectsList: undefined;
  ProjectDetail: { projectId: string };
};

export type TabParamList = {
  Complaints: undefined;
  Forum: undefined;
  Create: undefined;
  Transparency: undefined;
  Account: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const ComplaintsStack = createNativeStackNavigator<ComplaintsStackParamList>();
const TransparencyStack = createNativeStackNavigator<TransparencyStackParamList>();

function ComplaintsNavigator() {
  return (
    <ComplaintsStack.Navigator screenOptions={{ headerShown: false }}>
      <ComplaintsStack.Screen name="ComplaintsList" component={ComplaintsScreen} />
      <ComplaintsStack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} />
    </ComplaintsStack.Navigator>
  );
}

function TransparencyNavigator() {
  return (
    <TransparencyStack.Navigator screenOptions={{ headerShown: false }}>
      <TransparencyStack.Screen name="ProjectsList" component={TransparencyScreen} />
      <TransparencyStack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
    </TransparencyStack.Navigator>
  );
}

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
        component={ComplaintsNavigator}
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
        component={TransparencyNavigator}
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
