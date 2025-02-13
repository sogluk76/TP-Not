import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Utiliser useLocalSearchParams
import AsyncStorage from '@react-native-async-storage/async-storage';

type MealGroup = {
  id: string;
  name: string;
  meals: {
    name: string;
    calories: number;
  }[];
};

const MealGroupDetailScreen = () => {
  const { id } = useLocalSearchParams(); // Récupérer l'ID du groupe depuis l'URL
  const [mealGroup, setMealGroup] = useState<MealGroup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMealGroupDetails = async () => {
      try {
        const savedGroups = await AsyncStorage.getItem('mealGroups');
        if (savedGroups) {
          const groups = JSON.parse(savedGroups);
          const group = groups.find((g: MealGroup) => g.id === id);
          setMealGroup(group || null);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du groupe de repas :', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMealGroupDetails();
    }
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="green" />;
  }

  if (!mealGroup) {
    return <Text>Groupe de repas non trouvé.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mealGroup.name}</Text>
      <FlatList
        data={mealGroup.meals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Text style={styles.mealName}>{item.name}</Text>
            <Text>{item.calories} Calories</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  mealName: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default MealGroupDetailScreen;
