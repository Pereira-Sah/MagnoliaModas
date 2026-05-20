import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import { authStyles } from '../styles/authStyles';
import AuthLayout from './AuthLayout';
import api from '../src/services/api'; 
import { router } from 'expo-router';
import AuthInput from '../components/AuthInput';

export default function cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastro = async () => {

    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    try {
      const response = await api.post('/auth/cadastro', { nome_usuario: nome, email: email, senha: senha, role: "cliente" });
      if (response.status === 200 || response.status === 201) {        
        if (Platform.OS === 'web') alert("Conta criada com sucesso!");
        Alert.alert("Sucesso!", "Conta criada! Agora você pode fazer login.");
        router.push('/');
      }
    } catch (error) {
      let erroMsg = "Erro ao conectar com o servidor";

      if (typeof error === 'object' && error !== null && 'response' in error) {
        erroMsg = (error as any).response?.data?.detail || erroMsg;
      }

      Alert.alert("Erro no Cadastro", erroMsg);
    } 
  };

  return (
  <AuthLayout
    title="Criar conta"
    subtitle="Faça parte do universo Magnolia"
  >

    <View style={authStyles.formContainer}>

          <Text style={authStyles.description}>
          Sua beleza merece florescer.
          </Text>

      <AuthInput
        icon="person-outline"
        placeholder="Nome completo"
        onChangeText={setNome}
      />

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
        onPress={handleCadastro}
      >
        <Text style={authStyles.buttonText}>
          Criar conta
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/')}
      >
        <Text style={authStyles.link}>
          Já possui conta? Entrar
        </Text>
      </TouchableOpacity>

    </View>

  </AuthLayout>
  );
}

