import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { authStyles } from '../styles/authStyles';
import AuthLayout from './AuthLayout';
import api from '../src/services/api'; 
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export default function login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  // const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !senha) {
      alert("Erro: Preencha todos os campos");
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

        alert("Login realizado com sucesso!");
        router.push("/produtos");  // Navega direto aqui
      }
    } catch (error) {
      alert("Erro: " + String(error));
    }
  };

  return (
    <AuthLayout>
              <Image source={require('../assets/images/magnoliaModas_logo.svg')} style={authStyles.logo} />

      <View style={authStyles.card}>
        <Text style={authStyles.title}>Login</Text>

        <TextInput 
          style={authStyles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
        />

        <TextInput 
          style={authStyles.input}
          placeholder="Senha"
          secureTextEntry
          onChangeText={setSenha}
        />

        <TouchableOpacity style={authStyles.button} onPress={handleLogin}>
          <Text style={authStyles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/cadastro')}>
          <Text style={authStyles.link}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}

