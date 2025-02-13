import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SignedIn, SignedOut, useUser, useClerk } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router'; 

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>

      <View style={styles.content}>
        <SignedIn>
          <Text style={styles.welcomeText}>Hello, {user?.emailAddresses[0].emailAddress}!</Text>
          
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </SignedIn>

        <SignedOut>
          <Text style={styles.promptText}>You are not signed in.</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.linkText}>Sign in</Text>
          </TouchableOpacity>
        </SignedOut>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 40,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  promptText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  linkText: {
    color: '#007BFF',
    fontSize: 16,
    marginTop: 16,
  },
});
