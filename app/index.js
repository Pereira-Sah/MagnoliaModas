import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../src/config/firebaseConfig';
// 1. Importe as funções do Firestore
import { collection, addDoc } from "firebase/firestore"; 

export default function App() {
  console.log("Firebase Auth carregado:", auth.app.name);

  // 2. Função para salvar o usuário de teste
  const testarConexao = async () => {
    try {
      const docRef = await addDoc(collection(db, "usuarios"), {
        nome: "Usuário Teste",
        email: "teste@exemplo.com",
        data: new Date()
      });
      Alert.alert("Sucesso!", `Conectado! ID do documento: ${docRef.id}`);
      console.log("Documento salvo com ID: ", docRef.id);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Falha ao salvar. Verifique as Regras de Segurança no Console do Firebase.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
      <Text>Firebase conectado: {auth.app.name}</Text>
      
      {/* 3. Botão para disparar o teste */}
      <TouchableOpacity 
        onPress={testarConexao}
        style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8 }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Salvar Usuário de Teste</Text>
      </TouchableOpacity>
    </View>
  );
}
