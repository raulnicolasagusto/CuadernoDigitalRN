import { Tabs } from 'expo-router';
import { Book, FileText, TrendingUp, BookOpen, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2D3748',
          borderTopColor: '#4A5568',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#A0AEC0',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Cuadernos',
          tabBarIcon: ({ size, color }) => (
            <Book size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notas',
          tabBarIcon: ({ size, color }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="productivity"
        options={{
          title: 'Productividad',
          tabBarIcon: ({ size, color }) => (
            <TrendingUp size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reading"
        options={{
          title: 'Lecturas',
          tabBarIcon: ({ size, color }) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configuración',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}