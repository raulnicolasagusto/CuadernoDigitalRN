import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Menu, Plus, ArrowLeft } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  interpolate 
} from 'react-native-reanimated';
import { NotebookGrid } from '@/components/NotebookGrid';
import { Sidebar } from '@/components/Sidebar';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

export default function HomeScreen() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useSharedValue(0);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    sidebarAnimation.value = withTiming(newState ? 1 : 0, { duration: 300 });
  };

  const sidebarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            sidebarAnimation.value,
            [0, 1],
            [-SIDEBAR_WIDTH, 0]
          ),
        },
      ],
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: sidebarAnimation.value,
      pointerEvents: sidebarAnimation.value > 0 ? 'auto' : 'none',
    };
  });

  const mainContentStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            sidebarAnimation.value,
            [0, 1],
            [0, SIDEBAR_WIDTH * 0.3]
          ),
        },
      ],
      opacity: interpolate(
        sidebarAnimation.value,
        [0, 1],
        [1, 0.7]
      ),
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content */}
      <Animated.View style={[styles.mainContent, mainContentStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
            <Menu size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Cuadernos</Text>
        </View>

        {/* Create Button */}
        <View style={styles.createButtonContainer}>
          <TouchableOpacity style={styles.createButton}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.createButtonText}>Crear Cuaderno</Text>
          </TouchableOpacity>
        </View>

        {/* Notebooks Grid */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <NotebookGrid />
        </ScrollView>
      </Animated.View>

      {/* Overlay */}
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          onPress={toggleSidebar}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, sidebarStyle]}>
        <Sidebar onClose={toggleSidebar} />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D3748',
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#2D3748',
  },
  menuButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  createButtonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  createButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 2,
  },
});