import React, { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import * as Print from 'expo-print';
import api from "../src/services/api";
import { styles } from "../styles/produtosStyles";

export default function BotaoImprimirEtiquetas() {
  const [loading, setLoading] = useState(false);

  const handlePrint = async () => {
    setLoading(true);
    try {
      const response = await api.get("/produtos/gerar-etiquetas-html");
      const htmlGerado = response.data;
      await Print.printAsync({
        html: htmlGerado,
      });

    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível gerar a folha de etiquetas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.fab, { bottom: 280 }]}
      onPress={handlePrint}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12, textAlign: 'center' }}>
          Imprimir Etiquetas
        </Text>
      )}
    </TouchableOpacity>
  );
}