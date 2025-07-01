import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 16px padding on each side + 16px gap between cards

interface NotebookCard {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

const notebooks: NotebookCard[] = [
  {
    id: '1',
    title: 'Ideas Iniciales',
    subtitle: 'Primeras notas y bocetos para...',
    imageUrl: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    title: 'Recetas de Co...',
    subtitle: 'Mis recetas favoritas y por...',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    title: 'Proyectos Per...',
    subtitle: 'Ideas y planificación de...',
    imageUrl: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '4',
    title: 'Viajes y Avent...',
    subtitle: 'Planificación y recuerdos de...',
    imageUrl: 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export function NotebookGrid() {
  const router = useRouter();

  const handleNotebookPress = (notebookId: string) => {
    router.push(`/notebook/${notebookId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {notebooks.map((notebook) => (
          <TouchableOpacity 
            key={notebook.id} 
            style={styles.card}
            onPress={() => handleNotebookPress(notebook.id)}
          >
            <ImageBackground
              source={{ uri: notebook.imageUrl }}
              style={styles.cardBackground}
              imageStyle={styles.cardImage}
            >
              <View style={styles.cardOverlay}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{notebook.title}</Text>
                  <Text style={styles.cardSubtitle}>{notebook.subtitle}</Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    height: cardWidth * 1.2,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardImage: {
    borderRadius: 12,
  },
  cardOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#E2E8F0',
    opacity: 0.9,
  },
});