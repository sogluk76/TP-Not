import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSearchParams } from 'expo-router';

export default function GroupDetailScreen() {
  const [groupDetails, setGroupDetails] = useState<any>(null);
  const { id } = useSearchParams();  // Récupérer l'ID passé dans l'URL

  useEffect(() => {
    const loadGroupDetails = async () => {
      try {
        const savedGroups = await AsyncStorage.getItem('mealGroups');
        if (savedGroups) {
          const groups = JSON.parse(savedGroups);
          const group = groups.find((g: any) => g.id === id);  // Trouver le groupe avec le bon ID
          setGroupDetails(group);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des détails du groupe', error);
      }
    };

    if (id) {
      loadGroupDetails();
    }
  }, [id]);

  if (!groupDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Chargement du groupe...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Détails du groupe : {groupDetails.name}</Text>
      <Text style={styles.subHeader}>Nombre de repas : {groupDetails.meals.length}</Text>

      <FlatList
        data={groupDetails.meals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Text style={styles.foodName}>{item.label}</Text>
            <Text>{item.nutrients.ENERC_KCAL} kcal</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Aucun repas trouvé</Text>}
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
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 20,
  },
  mealItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
