import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

interface ScannerProps {
  visible: boolean;
  onClose: () => void;
  onCodeScanned: (data: string) => void;
}

export default function ScannerModal({ visible, onClose, onCodeScanned }: ScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();

  if (!visible) return null;

  if (!permission?.granted) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.text}>Precisamos de permissão para usar a câmera</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Dar Permissão</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 20 }}>
            <Text style={{ color: 'red' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            onBarcodeScanned={({ data }) => {
              onCodeScanned(data); // Envia o código para o formulário
              onClose(); // Fecha o scanner
            }}
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "code128", "qr"], 
            }}
          />
          
          {/* Mira do Scanner */}
          <View style={styles.scannerFrame}>
            <View style={styles.laser} />
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  cameraContainer: { width: '90%', height: '70%', borderRadius: 20, overflow: 'hidden', backgroundColor: 'black' },
  camera: { flex: 1 },
  scannerFrame: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    width: '80%',
    height: '40%',
    borderWidth: 2,
    borderColor: '#FF1493', // Cor rosa do seu tema
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  laser: { width: '90%', height: 2, backgroundColor: 'red', shadowColor: 'red', shadowOffset: {width: 0, height: 0}, shadowOpacity: 1, shadowRadius: 5 },
  closeBtn: { position: 'absolute', top: 20, right: 20 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#FF1493', padding: 15, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' }
});