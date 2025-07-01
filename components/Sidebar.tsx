import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { ArrowLeft, Book, FileText, TrendingUp, BookOpen, Settings, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface SidebarProps {
  onClose: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  route: string;
  isActive?: boolean;
}

export function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      id: 'notebooks',
      title: 'Mis Cuadernos',
      icon: <Book size={20} color="#FFFFFF" />,
      route: '/',
      isActive: true,
    },
    {
      id: 'notes',
      title: 'Mis Notas',
      icon: <FileText size={20} color="#A0AEC0" />,
      route: '/notes',
    },
    {
      id: 'productivity',
      title: 'Productividad',
      icon: <TrendingUp size={20} color="#A0AEC0" />,
      route: '/productivity',
    },
    {
      id: 'reading',
      title: 'Lecturas',
      icon: <BookOpen size={20} color="#A0AEC0" />,
      route: '/reading',
    },
    {
      id: 'settings',
      title: 'Configuración',
      icon: <Settings size={20} color="#A0AEC0" />,
      route: '/settings',
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route);
    onClose();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* User Profile */}
        <View style={styles.userProfile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>NU</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Nombre de Usuario</Text>
            <Text style={styles.userRole}>@usuario</Text>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cuaderno Digital</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                item.isActive && styles.menuItemActive,
              ]}
              onPress={() => handleNavigation(item.route)}
            >
              <View style={styles.menuIcon}>
                {item.icon}
              </View>
              <Text style={[
                styles.menuText,
                item.isActive && styles.menuTextActive,
              ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A202C',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  menuItemActive: {
    backgroundColor: '#8B5CF6',
  },
  menuIcon: {
    marginRight: 12,
    width: 20,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  menuTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  logoutContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
    paddingTop: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '500',
    marginLeft: 12,
  },
});