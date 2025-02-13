// app/(main)/(home)/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Importer les icônes

export default function MealGroupsScreen() {
  const [mealGroups, setMealGroups] = useState<any[]>([]); // État pour stocker les groupes de repas
  const router = useRouter();

  // Charger les groupes de repas sauvegardés depuis AsyncStorage
  useEffect(() => {
    const loadGroupsFromStorage = async () => {
      try {
        const savedGroups = await AsyncStorage.getItem('mealGroups');
        if (savedGroups) {
          setMealGroups(JSON.parse(savedGroups)); // Charger les groupes sauvegardés
        }
      } catch (error) {
        console.error('Erreur lors du chargement des groupes', error);
      }
    };

    loadGroupsFromStorage();
  }, []);

  // Naviguer vers la page de détail du groupe
  const handleGroupPress = (group: any) => {
    router.push(`/main/home/${group.name}`); // Utiliser le nom du groupe comme ID dans l'URL
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Groupes de repas :</Text>

      {/* Affichage des groupes de repas sauvegardés */}
      <FlatList
        data={mealGroups}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleGroupPress(item)}>
            <View style={styles.savedMealItem}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text>{item.meals.length} repas dans ce groupe</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Aucun groupe enregistré</Text>} // Message si la liste est vide
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  savedMealItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  navbar: {
    paddingTop: 40,  // Espace en haut pour la navbar
    paddingBottom: 10,
    backgroundColor: '#007BFF',  // Couleur de fond de la navbar
    alignItems: 'center',
  },
  navbarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
