import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera'; // Assurez-vous que c'est bien importé depuis 'expo-camera'

export default function BarcodeScannerScreen({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  // Demander les permissions de caméra
  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getPermissions();
  }, []);

  // Fonction de gestion du scan du code-barres
  const handleBarCodeScanned = async ({ type, data }: any) => {
    setScanned(true);
    Alert.alert('Détecté', `Code: ${data}`);

    // Appel à une fonction fictive pour récupérer les nutriments
    const nutrients = await fetchNutriments(data);
    if (nutrients) {
      navigation.navigate('Results', { nutrients });
    } else {
      Alert.alert('Erreur', 'Aucun nutriment trouvé pour cet ingrédient.');
    }
  };

  // Gérer le cas où l'utilisateur n'a pas encore donné sa permission ou l'a refusée
  if (hasPermission === null) {
    return <Text style={styles.permissionText}>Demande de permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text style={styles.permissionText}>Aucune permission pour utiliser l'appareil photo.</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} // Assurez-vous d'utiliser correctement l'event handler
      >
        <View
          style={styles.overlay}
        >
          <Text style={styles.text}>Scannez un code-barres</Text>
        </View>
      </Camera>
    </View>
  );
}

// Implémentation d'une fonction fictive pour récupérer les nutriments
async function fetchNutriments(barcode: string) {
  // Cette fonction doit être implémentée pour récupérer les données nutritionnelles via une API
  // Exemple de retour pour la démonstration
  return {
    calories: 200,
    protein: 5,
    fat: 10,
  };
}

// Styles pour les composants
const styles = StyleSheet.create({
  permissionText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
});
