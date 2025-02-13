import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';  // Importer expo-crypto pour générer l'UUID

// Remplace par ta clé API Edamam
const EDAMAM_API_KEY = '0c4dc8d1e11eb19f0ecf50e173af8a1e';
const EDAMAM_API_ID = '29ddd3d2';

export default function AddMealScreen() {
  const [query, setQuery] = useState('');
  const [foodResults, setFoodResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<any[]>([]);
  const [groupName, setGroupName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const generateUUID = async () => {
    const randomBytes = await Crypto.getRandomBytesAsync(16);
    const uuid = [...randomBytes].map((b, i) => (i === 6 ? (b & 0x0f) | 0x40 : i === 8 ? (b & 0x3f) | 0x80 : b).toString(16).padStart(2, '0')).join('');
    return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
  };

  const saveGroupToStorage = async (group: any) => {
    try {
      const currentGroups = await AsyncStorage.getItem('mealGroups');
      const groups = currentGroups ? JSON.parse(currentGroups) : [];
      groups.push(group);
      await AsyncStorage.setItem('mealGroups', JSON.stringify(groups));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du groupe', error);
    }
  };

  const searchFood = async (query: string) => {
    if (!query) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('https://api.edamam.com/api/food-database/v2/parser', {
        params: {
          app_id: EDAMAM_API_ID,
          app_key: EDAMAM_API_KEY,
          ingr: query,
        },
      });
      setFoodResults(response.data.hints || []);
    } catch (error) {
      setError('Erreur lors de la récupération des données.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMeal = (food: any) => {
    setSelectedMeals((prev) => {
      if (prev.some((item) => item.foodId === food.food.foodId)) {
        return prev.filter((item) => item.foodId !== food.food.foodId);
      }
      return [...prev, food.food];
    });
  };

  const handleGroupMeals = () => {
    if (selectedMeals.length > 0) {
      setModalVisible(true);
    } else {
      alert('Aucun repas sélectionné');
    }
  };

  const handleSaveGroup = async () => {
    if (groupName.trim() === '') {
      alert('Veuillez saisir un nom pour le groupe');
      return;
    }

    const id = await generateUUID();  // Génère un UUID
    const newGroup = {
      id,
      name: groupName,
      meals: selectedMeals,
    };

    saveGroupToStorage(newGroup);
    setSelectedMeals([]);
    setGroupName('');
    setModalVisible(false);
    alert(`Groupe "${groupName}" (ID: ${id}) créé avec ${selectedMeals.length} repas`);
  };

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      searchFood(query);
    }, 1000);

    setDebounceTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [query]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ajouter un repas</Text>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Rechercher un aliment"
      />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={foodResults}
        keyExtractor={(item) => item.food.foodId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.foodItem, selectedMeals.some((meal) => meal.foodId === item.food.foodId) && styles.selectedItem]}
            onPress={() => handleSelectMeal(item)}
          >
            <Text style={styles.foodName}>{item.food.label}</Text>
            <Text>{item.food.nutrients.ENERC_KCAL} kcal</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Aucun aliment trouvé</Text>}
      />
      <Button title="Regrouper les repas sélectionnés" onPress={handleGroupMeals} />
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Nom du groupe</Text>
            <TextInput
              style={styles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Nom du groupe"
            />
            <Button title="Sauvegarder le groupe" onPress={handleSaveGroup} />
            <Button title="Annuler" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <Button title="Retour à l'écran principal" onPress={() => router.push('/(home)')} />
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  foodItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedItem: {
    backgroundColor: '#c0e4ff',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: 300,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
