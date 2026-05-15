import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function LeitorEstoque() {
  const [permissao, solicitarPermissao] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // Função disparada quando o código é lido
  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    // Aqui você faria a lógica de estoque (ex: buscar no banco de dados)
    Alert.alert(
      "Código Lido!", 
      `Tipo: ${type}\nDados: ${data}`,
      [{ text: "OK", onPress: () => setScanned(false) }]
    );
  };

  if (!permissao) return <View />;
  if (!permissao.granted) {
    return (
      <View style={styles.container}>
        <Text>Precisamos de permissão para ler os códigos das roupas.</Text>
        <Button title="Permitir Câmera" onPress={solicitarPermissao} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "code128", "qr"], // Tipos comuns em etiquetas de roupas
        }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Guia visual para o usuário */}
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer}></View>
        <View style={styles.focusedContainer}>
             {/* Aqui ficaria o quadrado da mira */}
        </View>
        <View style={styles.unfocusedContainer}></View>
      </View>

      {scanned && (
        <Button title={'Tocar para escanear novamente'} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedContainer: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
});