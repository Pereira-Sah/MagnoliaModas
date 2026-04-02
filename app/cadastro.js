import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
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
    <View style={styles.container}>
      <Text>Criar Conta - Magnólia</Text>
      <TextInput 
        style={styles.input}
        placeholder="Nome Completo" 
        onChangeText={setNome}
      />

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
        onPress={handleCadastro} 
      >
        <Text>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => router.push('/')}
      >Já tem conta? Faça Login</TouchableOpacity>
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