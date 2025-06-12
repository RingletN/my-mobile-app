import React, { useContext } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator // Добавляем импорт
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user, logout, isLoading } = useContext(AuthContext);

  // Редирект при отсутствии пользователя
  React.useEffect(() => {
    if (!user && !isLoading) {
      navigation.replace('Login');
    }
  }, [user, isLoading]);

  // Если данные загружаются
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добро пожаловать, {user?.name}!</Text>
      <Text>Email: {user?.email}</Text>
      <TouchableOpacity style={styles.button} onPress={logout} >
          <Text style={styles.buttonText}>Выйти</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  button: {
    backgroundColor: '#5770C5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});


export default HomeScreen;