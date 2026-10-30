import { Tabs } from 'expo-router';
import { router } from 'expo-router';
import { IconButton } from 'react-native-paper';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: true,
      headerRight: () => <IconButton icon="cog-outline" onPress={() => router.push('/settings')} />,
      tabBarActiveTintColor: '#1565c0',
      tabBarLabelStyle: { fontWeight: '600' },
      headerTitleStyle: { fontWeight: '700' },
    }}>
      <Tabs.Screen name="products" options={{ title: 'Productos', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>P</Text> }} />
      <Tabs.Screen name="orders" options={{ title: 'Pedidos', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>O</Text> }} />
      <Tabs.Screen name="map" options={{ title: 'Mapa', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>M</Text> }} />
    </Tabs>
  );
}
