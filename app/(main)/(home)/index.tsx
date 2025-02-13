import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Importer les icônes
import { SignedIn, SignedOut } from '@clerk/clerk-expo';

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
    const groupId = group.id ? group.id.toString() : group.name; // Vérifier si 'id' existe, sinon utiliser 'name'
    router.push(`/(main)/(home)/${groupId}`); // Utiliser l'ID ou le nom du groupe dans l'URL
  };

  // Supprimer un groupe de repas
  const handleDeleteGroup = async (groupId: string) => {
    Alert.alert(
      'Supprimer le groupe',
      'Êtes-vous sûr de vouloir supprimer ce groupe de repas ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              // Filtrer le groupe supprimé de la liste des groupes
              const updatedGroups = mealGroups.filter((group) => group.id !== groupId);
              setMealGroups(updatedGroups);

              // Sauvegarder les groupes modifiés dans AsyncStorage
              await AsyncStorage.setItem('mealGroups', JSON.stringify(updatedGroups));
            } catch (error) {
              console.error('Erreur lors de la suppression du groupe', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <SignedOut>
        <Text style={styles.promptText}>You are not signed in.</Text>
        <View style={styles.linkContainer}>
          <Link href="/(auth)/login" style={styles.link}>
            <Text style={styles.linkText}>Sign in</Text>
          </Link>
          <Link href="/(auth)/signup" style={styles.link}>
            <Text style={styles.linkText}>Sign up</Text>
          </Link>
        </View>
      </SignedOut>
      <SignedIn>
        <Text style={styles.header}>Groupes de repas :</Text>

        {/* Affichage des groupes de repas sauvegardés */}
        <FlatList
          data={mealGroups}
          keyExtractor={(item) => (item.id ? item.id.toString() : item.name)} // Utiliser 'id' ou 'name' si 'id' n'est pas défini
          renderItem={({ item }) => (
            <View style={styles.savedMealItem}>
              <TouchableOpacity onPress={() => handleGroupPress(item)}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text>{item.meals.length} repas dans ce groupe</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => handleDeleteGroup(item.id ? item.id.toString() : item.name)} style={styles.deleteButton}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text>Aucun groupe enregistré</Text>} // Message si la liste est vide
        />
      </SignedIn>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  promptText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  link: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  linkText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  deleteButton: {
    padding: 10,
  },
});
