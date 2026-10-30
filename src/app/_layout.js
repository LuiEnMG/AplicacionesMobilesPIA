import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AppProvider } from '../context/AppContext';

export default function Layout() {
  return (
    <AppProvider>
      <PaperProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </PaperProvider>
    </AppProvider>
  );
}
