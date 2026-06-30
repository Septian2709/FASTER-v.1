import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Credential default untuk demo
  const VALID_USERNAME = 'admin';
  const VALID_PASSWORD = 'p3k123';

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Mohon isi username dan password');
      return;
    }

    setLoading(true);

    // Simulasi proses login
    setTimeout(async () => {
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        try {
          await AsyncStorage.setItem('userLoggedIn', 'true');
          await AsyncStorage.setItem('username', username);
          navigation.replace('Home');
        } catch (error) {
          Alert.alert('Error', 'Gagal menyimpan data login');
        }
      } else {
        Alert.alert('Error', 'Username atau password salah');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3106/3106806.png' }}
          style={styles.logo}
        />
        <Text style={styles.title}>Aplikasi Stok P3K</Text>
        <Text style={styles.subtitle}>Manajemen Perlengkapan P3K</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Lupa Password?</Text>
        </TouchableOpacity>

        <View style={styles.demoInfo}>
          <Text style={styles.demoText}>Demo Account:</Text>
          <Text style={styles.demoText}>Username: admin</Text>
          <Text style={styles.demoText}>Password: p3k123</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f4511e',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  formContainer: {
    paddingHorizontal: 30,
    flex: 1,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#f4511e',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#f4511e',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
  demoInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    alignItems: 'center',
  },
  demoText: {
    color: '#2e7d32',
    fontSize: 14,
    marginVertical: 2,
  },
});

export default LoginScreen;
