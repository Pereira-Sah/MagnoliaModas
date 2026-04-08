import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../src/services/api'; 
import { router } from 'expo-router';

export default function login() {
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    try {
        const response = await api.post('/auth/login', null, {
            params: { email, senha }
        });

        const token = response.data.token;

        if (token) {
            if (Platform.OS === 'web') {
                localStorage.setItem('userToken', token);
            } else {
                await SecureStore.setItemAsync('userToken', token);
            }
            
            alert("Sucesso!", "Login realizado!");
        }
    } catch (error) {
        alert(error);
    }
};

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>Login</Text>
      
      <TextInput 
        style={styles.input}
        placeholder="E-mail" 
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      <TextInput 
        style={styles.input}
        placeholder="Senha" 
        secureTextEntry 
        onChangeText={setSenha}
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
      >
        <Text style={{color: '#fff'}}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/cadastro')}
      >Não tem conta? Cadastre-se</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 20
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center'
  }
});