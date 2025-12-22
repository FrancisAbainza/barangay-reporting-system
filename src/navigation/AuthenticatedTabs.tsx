import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ComplaintsScreen from '../screens/ComplaintsScreen';
import ComplaintDetailScreen from '../screens/ComplaintDetailScreen';
import MapViewScreen from '../screens/MapViewScreen';
import CreateScreen from '../screens/CreateScreen';
import MapPickerScreen from '../screens/MapPickerScreen';
import TransparencyScreen from '../screens/TransparencyScreen';
import ProjectDetailScreen from '../screens/ProjectDetailScreen';
import AccountScreen from '../screens/AccountScreen';
import MapScreen from '../screens/MapScreen';
import { colors } from '../constants/colors';
import { View } from 'react-native';
import { FormDraftProvider } from '../contexts/FormDraftContext';

export type ComplaintsStackParamList = {
  ComplaintsList: undefined;
  ComplaintDetail: { complaintId: string };
  MapView: {
    latitude: number;
    longitude: number;
    title?: string;
    address?: string;
  };
};

export type TransparencyStackParamList = {
  ProjectsList: undefined;
  ProjectDetail: { projectId: string };
  MapView: {
    latitude: number;
    longitude: number;
    title?: string;
    address?: string;
  };
};

export type CreateStackParamList = {
  CreateForm: {
    pickedLatitude?: number;
    pickedLongitude?: number;
  };
  MapPicker: {
    initialLatitude?: number;
    initialLongitude?: number;
  };
};

export type TabParamList = {
  Complaints: undefined;
  Transparency: undefined;
  Create: undefined;
  Map: undefined;
  Account: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const ComplaintsStack = createNativeStackNavigator<ComplaintsStackParamList>();
const TransparencyStack = createNativeStackNavigator<TransparencyStackParamList>();
const CreateStack = createNativeStackNavigator<CreateStackParamList>();

function ComplaintsNavigator() {
  return (
    <ComplaintsStack.Navigator screenOptions={{ headerShown: false }}>
      <ComplaintsStack.Screen name="ComplaintsList" component={ComplaintsScreen} />
      <ComplaintsStack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} />
      <ComplaintsStack.Screen name="MapView" component={MapViewScreen} />
    </ComplaintsStack.Navigator>
  );
}

function TransparencyNavigator() {
  return (
    <TransparencyStack.Navigator screenOptions={{ headerShown: false }}>
      <TransparencyStack.Screen name="ProjectsList" component={TransparencyScreen} />
      <TransparencyStack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
      <TransparencyStack.Screen name="MapView" component={MapViewScreen} />
    </TransparencyStack.Navigator>
  );
}

function CreateNavigator() {
  return (
    <FormDraftProvider>
      <CreateStack.Navigator screenOptions={{ headerShown: false }}>
        <CreateStack.Screen name="CreateForm" component={CreateScreen} />
        <CreateStack.Screen name="MapPicker" component={MapPickerScreen} />
      </CreateStack.Navigator>
    </FormDraftProvider>
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
        name="Transparency"
        component={TransparencyNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="file-tray-full" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateNavigator}
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
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
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
