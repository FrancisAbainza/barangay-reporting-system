import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ComplaintsScreen from '../screens/ComplaintsScreen';
import ForumScreen from '../screens/ForumScreen';
import CreateScreen from '../screens/CreateScreen';
import TransparencyScreen from '../screens/TransparencyScreen';
import AccountScreen from '../screens/AccountScreen';

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
    <Tab.Navigator>
      <Tab.Screen name="Complaints" component={ComplaintsScreen} />
      <Tab.Screen name="Forum" component={ForumScreen} />
      <Tab.Screen name="Create" component={CreateScreen} />
      <Tab.Screen name="Transparency" component={TransparencyScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}
