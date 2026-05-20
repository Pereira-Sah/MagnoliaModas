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
import AuthInput from '../components/AuthInput';

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
    <AuthLayout
    title="Bem-vinda de volta"
    subtitle='Sentimos sua Falta!'
  >

    <View style={authStyles.formContainer}>

      <Text style={authStyles.description}>
        Entre com sua conta para acessar
      </Text>

      <AuthInput
        icon="mail-outline"
        placeholder="E-mail"
        onChangeText={setEmail}
      />

      <AuthInput
        icon="lock-closed-outline"
        placeholder="Senha"
        secureTextEntry
        onChangeText={setSenha}
      />

      <TouchableOpacity
        style={authStyles.button}
        onPress={handleLogin}
      >
        <Text style={authStyles.buttonText}>
          Entrar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/cadastro')}
      >
        <Text style={authStyles.link}>
          Não possui conta? Cadastre-se
        </Text>
      </TouchableOpacity>

    </View>

  </AuthLayout>
  );
}