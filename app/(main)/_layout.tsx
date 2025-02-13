import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, Slot } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';

const MainLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <Slot /> 

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/(main)/(home)')}>
          <Ionicons name="home" size={30}/>
          <Text style={[styles.tabText, { color: 'black' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/(main)/add')}>
          <Ionicons name="add-circle" size={30} color="black" />
          <Text style={styles.tabText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/(main)/profile')}>
          <Ionicons name="person" size={30} color="black" />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        backgroundColor: '#f1f1f1',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
      },
      tabButton: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      tabText: {
        fontSize: 12,
        color: 'black',
      },
});

export default MainLayout;