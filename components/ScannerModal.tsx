import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/produtosStyles';

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
              onCodeScanned(data);
              onClose();
            }}
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "code128", "qr"], 
            }}
          />
          
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
overlay: { 
    flex: 1, 
    backgroundColor: 'black', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  cameraContainer: { 
    width: '100%', 
    height: '100%',
  },
  camera: { 
    flex: 1 
  },
  scannerFrame: {
    position: 'absolute',
    top: '35%',
    left: '15%',
    width: '70%',
    height: '30%',
    borderWidth: 3,
    borderColor: colors.Lightolivegreen,
    borderRadius: 16, 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  laser: { width: '90%', height: 2, backgroundColor: colors.dustypink, },
  closeBtn: { position: 'absolute', top: 20, right: 20 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: colors.dustypink, padding: 15, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' }
});