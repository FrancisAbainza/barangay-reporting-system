import "./global.css"
import { View } from "react-native";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { DummyDbProvider } from './src/contexts/DummyDbContext';
import { ComplaintDbProvider } from './src/contexts/ComplaintDbContext';
import { ProjectDbProvider } from './src/contexts/ProjectDbContext';
import { FormDraftProvider } from './src/contexts/FormDraftContext';
import AuthenticationStack from './src/navigation/AuthenticationStack';
import AuthenticatedTabs from './src/navigation/AuthenticatedTabs';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { user } = useAuth();
  
  return (
    <NavigationContainer>
      {user ? <AuthenticatedTabs /> : <AuthenticationStack />}
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <DummyDbProvider>
        <ComplaintDbProvider>
          <ProjectDbProvider>
            <FormDraftProvider>
              <AppContent />
            </FormDraftProvider>
          </ProjectDbProvider>
        </ComplaintDbProvider>
      </DummyDbProvider>
    </AuthProvider>
  );
}
