import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import { authStyles } from '../styles/authStyles';
import AuthLayout from './AuthLayout';
import api from '../src/services/api'; 
import { router } from 'expo-router';

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
      const response = await api.post('/auth/cadastro', { nome_usuario: nome, email: email, senha: senha, role: "admin" });
      if (response.status === 200 || response.status === 201) {        
        if (Platform.OS === 'web') alert("Conta criada com sucesso!");
        Alert.alert("Sucesso!", "Conta criada! Agora você pode fazer login.");
        router.push('/');
      }
    } catch (error) {
      const erroMsg = error.response?.data?.detail || "Erro ao conectar com o servidor";
      Alert.alert("Erro no Cadastro", erroMsg);
    } 
  };

  return (
    <AuthLayout>
    <Image source={require('../assets/images/magnoliaModas_logo.svg')} style={authStyles.logo} />

      <View style={authStyles.card}>
        <Text style={authStyles.title}>Criar Conta</Text>

        <TextInput style={authStyles.input} placeholder="Nome Completo" onChangeText={setNome} />
        <TextInput style={authStyles.input} placeholder="E-mail" keyboardType="email-address" onChangeText={setEmail} />
        <TextInput style={authStyles.input} placeholder="Senha" secureTextEntry onChangeText={setSenha} />

        <TouchableOpacity style={authStyles.button} onPress={handleCadastro}>
          <Text style={authStyles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={authStyles.link}>Já tem conta? Faça Login</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}

