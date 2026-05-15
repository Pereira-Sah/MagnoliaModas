import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { authStyles } from '../styles/authStyles';
import AuthLayout from './AuthLayout';
import api from '../src/services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarToken = async () => {
      let token;

      if (Platform.OS === 'web') {
        token = localStorage.getItem('userToken');
      } else {
        token = await SecureStore.getItemAsync('userToken');
      }

      if (token) {
        router.replace('/produtos');
      } else {
        setLoading(false);
      }
    };

    verificarToken();
  }, []);

  const handleLogin = async () => {
    if (!email || !senha) {
      alert('Erro: Preencha todos os campos');
      return;
    }

    try {
      const response = await api.post('/auth/login', null, {
        params: {
          email,
          senha,
        },
      });

      const token = response.data.token;

      if (token) {
        if (Platform.OS === 'web') {
          localStorage.setItem('userToken', token);
        } else {
          await SecureStore.setItemAsync('userToken', token);
        }

        router.replace('/produtos');
      }
    } catch (error) {
      alert('Erro ao fazer login');
      console.log(error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <AuthLayout>
      <Image
        source={require('../assets/images/magnoliaModas_logo.png')}
        style={authStyles.logo}
      />

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

        <TouchableOpacity
          style={authStyles.button}
          onPress={handleLogin}
        >
          <Text style={authStyles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/cadastro')}>
          <Text style={authStyles.link}>
            Não tem conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}