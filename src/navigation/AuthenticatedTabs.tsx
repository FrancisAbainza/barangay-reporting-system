import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import ComplaintsScreen from '../screens/ComplaintsScreen';
import ComplaintDetailScreen from '../screens/ComplaintDetailScreen';
import EditComplaintScreen from '../screens/EditComplaintScreen';
import MapViewScreen from '../screens/MapViewScreen';
import MapPickerScreen from '../screens/MapPickerScreen';
import CreateScreen from '../screens/CreateScreen';
import TransparencyScreen from '../screens/TransparencyScreen';
import ProjectDetailScreen from '../screens/ProjectDetailScreen';
import AccountScreen from '../screens/AccountScreen';
import MapScreen from '../screens/MapScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import { colors } from '../constants/colors';
import { View } from 'react-native';
import { FormDraftProvider } from '../contexts/FormDraftContext';

export type ComplaintsStackParamList = {
  ComplaintsList: undefined;
  ComplaintDetail: { complaintId: string };
  EditComplaint: {
    complaintId: string;
    pickedLatitude?: number;
    pickedLongitude?: number;
  };
  MapPicker: {
    initialLatitude?: number;
    initialLongitude?: number;
  };
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

export type MapStackParamList = {
  MapMain: undefined;
  ComplaintDetail: { complaintId: string };
  ProjectDetail: { projectId: string };
  MapView: {
    latitude: number;
    longitude: number;
    title?: string;
    address?: string;
  };
  EditComplaint: {
    complaintId: string;
    pickedLatitude?: number;
    pickedLongitude?: number;
  };
  MapPicker: {
    initialLatitude?: number;
    initialLongitude?: number;
  };
};

export type AccountStackParamList = {
  AccountHome: undefined;
  Notifications: undefined;
};

export type TabParamList = {
  Complaints: NavigatorScreenParams<ComplaintsStackParamList>;
  Transparency: NavigatorScreenParams<TransparencyStackParamList>;
  Create: NavigatorScreenParams<CreateStackParamList>;
  Map: NavigatorScreenParams<MapStackParamList>;
  Account: NavigatorScreenParams<AccountStackParamList>;
};

const Tab = createBottomTabNavigator<TabParamList>();
const ComplaintsStack = createNativeStackNavigator<ComplaintsStackParamList>();
const TransparencyStack = createNativeStackNavigator<TransparencyStackParamList>();
const CreateStack = createNativeStackNavigator<CreateStackParamList>();
const MapStack = createNativeStackNavigator<MapStackParamList>();
const AccountStack = createNativeStackNavigator<AccountStackParamList>();

function ComplaintsNavigator() {
  return (
    <FormDraftProvider>
      <ComplaintsStack.Navigator screenOptions={{ headerShown: false }}>
        <ComplaintsStack.Screen name="ComplaintsList" component={ComplaintsScreen} />
        <ComplaintsStack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} />
        <ComplaintsStack.Screen name="EditComplaint" component={EditComplaintScreen} />
        <ComplaintsStack.Screen name="MapPicker" component={MapPickerScreen} />
        <ComplaintsStack.Screen name="MapView" component={MapViewScreen} />
      </ComplaintsStack.Navigator>
    </FormDraftProvider>
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

function MapNavigator() {
  return (
    <FormDraftProvider>
      <MapStack.Navigator screenOptions={{ headerShown: false }}>
        <MapStack.Screen name="MapMain" component={MapScreen} />
        <MapStack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} />
        <MapStack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
        <MapStack.Screen name="MapView" component={MapViewScreen} />
        <MapStack.Screen name="EditComplaint" component={EditComplaintScreen} />
        <MapStack.Screen name="MapPicker" component={MapPickerScreen} />
      </MapStack.Navigator>
    </FormDraftProvider>
  );
}

function AccountNavigator() {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen 
        name="AccountHome" 
        component={AccountScreen}
        options={{ headerShown: false }}
      />
      <AccountStack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ 
          headerShown: false,
          presentation: 'card'
        }}
      />
    </AccountStack.Navigator>
  );
}

function NotificationButton() {
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Account', { screen: 'Notifications' } as any)}
      className="mr-4"
    >
      <Ionicons name="notifications-outline" size={24} color={colors.gray900} />
    </TouchableOpacity>
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
          headerRight: () => <NotificationButton />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="megaphone" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Transparency"
        component={TransparencyNavigator}
        options={{
          headerRight: () => <NotificationButton />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="file-tray-full" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateNavigator}
        options={{
          headerRight: () => <NotificationButton />,
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
        component={MapNavigator}
        options={{
          headerRight: () => <NotificationButton />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountNavigator}
        options={{
          headerRight: () => <NotificationButton />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
