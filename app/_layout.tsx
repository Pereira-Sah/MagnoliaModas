import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_600SemiBold
} from '@expo-google-fonts/poppins';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{headerShown: false,}}
      />
    </SafeAreaProvider>
  );
}