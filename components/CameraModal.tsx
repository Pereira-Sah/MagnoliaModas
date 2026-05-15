import React, { useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  Image,
  StyleSheet,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

interface Props {
  visible: boolean;
  onClose: () => void;
  onPhotoCaptured: (uri: string) => void;
}

export default function CameraModal({ visible, onClose,onPhotoCaptured}: Props) {
  const [permissaoCamera, solicitarPermissaoCamera] =
    useCameraPermissions();

  const [foto, setFoto] = useState('');
  const cameraRef = useRef<CameraView | null>(null);


async function tirarFoto() {
  if (!cameraRef.current) return;

  const imagem = await cameraRef.current.takePictureAsync();

  if (!imagem?.uri) return;

  setFoto(imagem.uri);
}
function enviar(){
    onPhotoCaptured(foto);
}
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Button title="Fechar" onPress={onClose} />

        {!permissaoCamera ? (
          <Text>Verificando permissões...</Text>
        ) : !permissaoCamera.granted ? (
          <>
            <Text>Permissão da câmera necessária</Text>
            <Button
              title="Permitir câmera"
              onPress={solicitarPermissaoCamera}
            />
          </>
        ) : foto === '' ? (
          <>
            <Button
              title="Tirar Foto"
              onPress={tirarFoto}
            />

            <CameraView
              ref={cameraRef}
              style={styles.camera}
            />
          </>
        ) : (
          <>
            <Button
              title="Tirar Outra Foto"
              onPress={() => setFoto('')}
            />

            <Button
              title="enviar Foto"
              onPress={() => enviar()}
            />

            <Image
              source={{ uri: foto }}
              style={styles.imagem}
            />
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  camera: {
    flex: 1,
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imagem: {
    flex: 1,
    marginTop: 20,
    borderRadius: 10,
  },
});