import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, PanResponder } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { X, Palette, Eraser, Minus, Plus } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface Point {
  x: number;
  y: number;
}

interface DrawingPath {
  points: Point[];
  color: string;
  strokeWidth: number;
  isEraser: boolean;
}

interface DrawingCanvasProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function DrawingCanvas({ isVisible, onClose }: DrawingCanvasProps) {
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const currentPointsRef = useRef<Point[]>([]);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  const [showOptions, setShowOptions] = useState(true);

  // Referencias para color, grosor y borrador
  const colorRef = useRef(currentColor);
  const strokeWidthRef = useRef(strokeWidth);
  const isEraserRef = useRef(isEraser);

  useEffect(() => {
    if (isVisible) setShowOptions(true);
  }, [isVisible]);

  useEffect(() => {
    currentPointsRef.current = currentPoints;
  }, [currentPoints]);

  useEffect(() => {
    colorRef.current = currentColor;
  }, [currentColor]);
  useEffect(() => {
    strokeWidthRef.current = strokeWidth;
  }, [strokeWidth]);
  useEffect(() => {
    isEraserRef.current = isEraser;
  }, [isEraser]);

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#008000', '#800000', '#000080'
  ];

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPoints([{ x: locationX, y: locationY }]);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPoints((prev) => [...prev, { x: locationX, y: locationY }]);
      },
      onPanResponderRelease: () => {
        const pointsToSave = currentPointsRef.current;
        if (pointsToSave.length > 0) {
          setPaths((prev) => [
            ...prev,
            {
              points: pointsToSave,
              color: colorRef.current,
              strokeWidth: strokeWidthRef.current,
              isEraser: isEraserRef.current,
            },
          ]);
        }
        setCurrentPoints([]);
      },
    })
  ).current;

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPoints([]);
  };

  const undo = () => {
    setPaths((prev) => prev.slice(0, -1));
  };

  const getSvgPath = (points: Point[]) => {
    if (points.length === 0) return '';
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    return d;
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity 
        style={styles.closeCanvasButton} 
        onPress={onClose}
      >
        <X size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Canvas */}
      <View style={styles.canvasContainer} {...panResponder.panHandlers}>
        <Svg style={styles.svg} width="100%" height="100%">
          {/* Render existing paths */}
          {paths.map((pathData, idx) => (
            <Path
              key={idx}
              d={getSvgPath(pathData.points)}
              stroke={pathData.isEraser ? '#E2E8F0' : pathData.color}
              strokeWidth={pathData.strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {/* Render current path */}
          {currentPoints.length > 0 && (
            <Path
              d={getSvgPath(currentPoints)}
              stroke={isEraser ? '#E2E8F0' : currentColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </Svg>
      </View>

      {/* Drawing Options Menu */}
      {showOptions && (
        <View style={styles.optionsMenu}>
          {/* Header */}
          <View style={styles.optionsHeader}>
            <Text style={styles.optionsTitle}>Opciones de dibujo</Text>
            <TouchableOpacity onPress={() => setShowOptions(false)} style={styles.closeButton}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Color Palette */}
          <View style={styles.colorSection}>
            <Text style={styles.sectionTitle}>Color</Text>
            <View style={styles.colorGrid}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    currentColor === color && styles.selectedColor
                  ]}
                  onPress={() => setCurrentColor(color)}
                />
              ))}
            </View>
          </View>

          {/* Stroke Width */}
          <View style={styles.strokeSection}>
            <Text style={styles.sectionTitle}>Grosor del trazo</Text>
            <View style={styles.strokeControls}>
              <TouchableOpacity
                style={styles.strokeButton}
                onPress={() => setStrokeWidth(prev => Math.max(1, prev - 1))}
              >
                <Minus size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.strokeWidthDisplay}>
                <View 
                  style={[
                    styles.strokePreview, 
                    { 
                      width: strokeWidth * 2, 
                      height: strokeWidth * 2,
                      backgroundColor: currentColor 
                    }
                  ]} 
                />
              </View>
              <TouchableOpacity
                style={styles.strokeButton}
                onPress={() => setStrokeWidth(prev => Math.min(20, prev + 1))}
              >
                <Plus size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tool Toggle */}
          <View style={styles.toolSection}>
            <TouchableOpacity
              style={[
                styles.toolButton,
                !isEraser && styles.activeTool
              ]}
              onPress={() => setIsEraser(false)}
            >
              <Palette size={20} color={!isEraser ? "#FFFFFF" : "#8B5CF6"} />
              <Text style={[styles.toolText, !isEraser && styles.activeToolText]}>
                Lápiz
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toolButton,
                isEraser && styles.activeTool
              ]}
              onPress={() => setIsEraser(true)}
            >
              <Eraser size={20} color={isEraser ? "#FFFFFF" : "#8B5CF6"} />
              <Text style={[styles.toolText, isEraser && styles.activeToolText]}>
                Borrador
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={undo}>
              <Text style={styles.actionButtonText}>Deshacer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={clearCanvas}>
              <Text style={styles.actionButtonText}>Limpiar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Botón flotante para abrir el menú de opciones si está cerrado */}
      {!showOptions && (
        <TouchableOpacity style={styles.fab} onPress={() => setShowOptions(true)}>
          <Palette size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  closeCanvasButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(45, 55, 72, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  svg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  optionsMenu: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  optionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  colorSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  strokeSection: {
    marginBottom: 16,
  },
  strokeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  strokeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A5568',
    justifyContent: 'center',
    alignItems: 'center',
  },
  strokeWidthDisplay: {
    width: 60,
    height: 32,
    backgroundColor: '#4A5568',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  strokePreview: {
    borderRadius: 50,
  },
  toolSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  toolButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#4A5568',
    borderRadius: 8,
    gap: 8,
  },
  activeTool: {
    backgroundColor: '#8B5CF6',
  },
  toolText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B5CF6',
  },
  activeToolText: {
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#4A5568',
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
}); 