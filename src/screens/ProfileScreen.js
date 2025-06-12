import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>
      
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Имя: {user?.name}</Text>
        <Text style={styles.label}>Email: {user?.email}</Text>
      </View>

      <View style={styles.settingItem}>
        <Text>Темная тема</Text>
        <Switch
          value={isDarkTheme}
          onValueChange={setIsDarkTheme}
        />
      </View>

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={logout}
      >
        <Text style={styles.buttonText}>Выйти</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  profileInfo: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;