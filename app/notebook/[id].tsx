import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { ArrowLeft, Plus, Type, Pen, MousePointer, Square, Circle, Triangle } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSpring 
} from 'react-native-reanimated';
import DrawingCanvas from '../../components/DrawingCanvas';

const { width, height } = Dimensions.get('window');

interface Tool {
  id: string;
  icon: React.ReactNode;
  label: string;
}

const tools: Tool[] = [
  {
    id: 'text',
    icon: <Type size={20} color="#FFFFFF" />,
    label: 'Texto'
  },
  {
    id: 'draw',
    icon: <Pen size={20} color="#FFFFFF" />,
    label: 'Dibujo'
  },
  {
    id: 'select',
    icon: <MousePointer size={20} color="#FFFFFF" />,
    label: 'Seleccionar'
  },
  {
    id: 'shapes',
    icon: <Square size={20} color="#FFFFFF" />,
    label: 'Figuras'
  }
];

export default function NotebookScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [showDrawingCanvas, setShowDrawingCanvas] = useState(false);
  
  const toolsAnimation = useSharedValue(0);
  const plusRotation = useSharedValue(0);

  // Obtener el título del cuaderno basado en el ID
  const getNotebookTitle = (notebookId: string) => {
    const notebooks = {
      '1': 'Ideas Iniciales',
      '2': 'Recetas de Cocina',
      '3': 'Proyectos Personales',
      '4': 'Viajes y Aventuras'
    };
    return notebooks[notebookId as keyof typeof notebooks] || 'Cuaderno';
  };

  const toggleTools = () => {
    const newState = !isToolsOpen;
    setIsToolsOpen(newState);
    
    toolsAnimation.value = withSpring(newState ? 1 : 0, {
      damping: 15,
      stiffness: 150
    });
    
    plusRotation.value = withTiming(newState ? 45 : 0, { duration: 200 });
  };

  const selectTool = (toolId: string) => {
    setSelectedTool(toolId);
    setIsToolsOpen(false);
    toolsAnimation.value = withSpring(0);
    plusRotation.value = withTiming(0);
    
    // Activar el canvas de dibujo si se selecciona la herramienta de dibujo
    if (toolId === 'draw') {
      setShowDrawingCanvas(true);
    } else {
      setShowDrawingCanvas(false);
    }
  };

  const closeDrawingCanvas = () => {
    setShowDrawingCanvas(false);
    setSelectedTool(null);
  };

  const plusButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${plusRotation.value}deg`,
        },
      ],
    };
  });

  const getToolButtonStyle = (index: number) => {
    return useAnimatedStyle(() => {
      const translateY = toolsAnimation.value * (-60 * (index + 1));
      
      return {
        transform: [
          {
            translateY: translateY,
          },
        ],
        opacity: toolsAnimation.value,
        pointerEvents: toolsAnimation.value > 0 ? 'auto' : 'none',
      };
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getNotebookTitle(id as string)}</Text>
      </View>

      {/* Canvas Area */}
      <View style={styles.canvasContainer}>
        {showDrawingCanvas ? (
          <DrawingCanvas 
            isVisible={showDrawingCanvas} 
            onClose={closeDrawingCanvas} 
          />
        ) : (
          <View style={styles.canvas}>
            {/* Aquí irá el canvas de dibujo */}
            <Text style={styles.canvasPlaceholder}>Canvas de dibujo</Text>
          </View>
        )}
      </View>

      {/* Tools Container */}
      <View style={styles.toolsContainer}>
        {/* Tool Buttons */}
        {tools.map((tool, index) => (
          <Animated.View
            key={tool.id}
            style={[styles.toolButtonContainer, getToolButtonStyle(index)]}
          >
            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => selectTool(tool.id)}
            >
              {tool.icon}
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Plus Button */}
        <TouchableOpacity
          style={styles.plusButton}
          onPress={toggleTools}
          activeOpacity={0.8}
        >
          <Animated.View style={plusButtonStyle}>
            <Plus size={24} color="#FFFFFF" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Selected Tool Indicator */}
      {selectedTool && (
        <View style={styles.selectedToolIndicator}>
          <Text style={styles.selectedToolText}>
            Herramienta: {tools.find(t => t.id === selectedTool)?.label}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D3748',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#2D3748',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  canvasContainer: {
    flex: 1,
    padding: 16,
  },
  canvas: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasPlaceholder: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '500',
  },
  toolsContainer: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    alignItems: 'center',
  },
  toolButtonContainer: {
    position: 'absolute',
    bottom: 68, // Posición base desde donde salen los botones
  },
  toolButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4A5568',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  plusButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  selectedToolIndicator: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectedToolText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});