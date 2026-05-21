import React, { useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  visible: boolean;
  onClose: () => void;
  onPhotoCaptured: (uri: string) => Promise<void>;
}

export default function CameraModal({
  visible,
  onClose,
  onPhotoCaptured,
}: Props) {
  const [permissaoCamera, solicitarPermissaoCamera] =
    useCameraPermissions();

  const [foto, setFoto] = useState('');
  const cameraRef = useRef<CameraView | null>(null);
  const insets = useSafeAreaInsets();
  const [loadingIA, setLoadingIA] = useState(false);

  async function tirarFoto() {
    if (!cameraRef.current) return;

    const imagem = await cameraRef.current.takePictureAsync();

    if (!imagem?.uri) return;

    setFoto(imagem.uri);
  }

  async function enviar() {
    try {
      setLoadingIA(true);

      await onPhotoCaptured(foto);

      onClose();
    } finally {
      setLoadingIA(false);
    }
  }

return (
  <Modal
    visible={visible}
    animationType="slide"
    statusBarTranslucent
  >
    <View style={styles.container}>

      <View style={styles.heroSection}>
        <View style={styles.heroBlob} />
        <View style={styles.heroBlob2} />

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>
              Capturar Foto
            </Text>

            <Text style={styles.subtitle}>
              Adicione uma imagem ao catálogo
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons
              name="close"
              size={20}
              color="#555"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>

        {!permissaoCamera ? (

          <Text style={styles.permissionText}>
            Verificando permissões...
          </Text>

        ) : !permissaoCamera.granted ? (

          <View style={styles.permissionContainer}>

            <View style={styles.iconCircle}>
              <Ionicons
                name="camera-outline"
                size={38}
                color="#FFF"
              />
            </View>

            <Text style={styles.permissionTitle}>
              Permissão necessária
            </Text>

            <Text style={styles.permissionSubtitle}>
              Precisamos acessar sua câmera para capturar fotos dos produtos.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={solicitarPermissaoCamera}
            >
              <Text style={styles.primaryButtonText}>
                Permitir câmera
              </Text>
            </TouchableOpacity>
          </View>

        ) : loadingIA ? (

          <View style={styles.loadingContainer}>

            <Image
              source={{ uri: foto }}
              style={styles.loadingImage}
            />

            <View style={styles.loadingOverlay} />

            <View style={styles.loadingContent}>

              <View style={styles.loadingIcon}>
                <Ionicons
                  name="sparkles"
                  size={34}
                  color="#FFF"
                />
              </View>

              <Text style={styles.loadingTitle}>
                Magnolia AI analisando peça
              </Text>

              <Text style={styles.loadingSubtitle}>
                Identificando categoria, estilo,
                cores e detalhes da roupa...
              </Text>

              <ActivityIndicator
                size="large"
                color={colors.Lightolivegreen}
                style={{ marginTop: 28 }}
              />


            </View>
          </View>

        ) : foto === '' ? (

          <React.Fragment>

            <View style={styles.cameraContainer}>
              <CameraView
                ref={cameraRef}
                style={styles.camera}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.captureButton,
                {
                  marginBottom: insets.bottom + 12,
                },
              ]}
              onPress={tirarFoto}
            >
              <View style={styles.captureInner} />
            </TouchableOpacity>

          </React.Fragment>

        ) : (

          <React.Fragment>

            <Image
              source={{ uri: foto }}
              style={styles.imagePreview}
            />

            <View style={styles.actionsRow}>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setFoto('')}
              >
                <Ionicons
                  name="refresh-outline"
                  size={18}
                  color="#888"
                />

                <Text style={styles.secondaryButtonText}>
                  Refazer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={enviar}
              >
                <Ionicons
                  name="checkmark-outline"
                  size={18}
                  color="#FFF"
                />

                <Text style={styles.primaryButtonText}>
                  Usar foto
                </Text>
              </TouchableOpacity>

            </View>

          </React.Fragment>
        )}

      </View>
    </View>
  </Modal>
);
}

const colors = {
  dustypink: '#DFA3B2',
  Lightolivegreen: '#B8C4A5',
  Warmbeigebackground: '#F3E7DD',
  white: '#FFFFFF',
  background: '#FBFBFB',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  heroSection: {
    backgroundColor: colors.Warmbeigebackground,

    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 28,

    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,

    overflow: 'hidden',
  },

  heroBlob: {
    position: 'absolute',
    width: 220,
    height: 200,
    borderRadius: 140,
    backgroundColor: 'rgba(223,163,178,0.16)',
    top: -90,
    right: -60,
  },

  heroBlob2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    bottom: -40,
    left: -20,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    color: '#6D625B',
    fontFamily: 'Poppins_600SemiBold',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#9A8E86',
    fontFamily: 'Poppins_400Regular',
  },

  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 16,

    backgroundColor: 'rgba(255,255,255,0.65)',

    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    padding: 20,
  },

  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconCircle: {
    width: 86,
    height: 86,
    borderRadius: 30,

    backgroundColor: colors.Lightolivegreen,

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 24,
  },

  permissionTitle: {
    fontSize: 22,
    color: '#333',
    fontFamily: 'Poppins_600SemiBold',
  },

  permissionSubtitle: {
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 24,
    color: '#888',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',

    paddingHorizontal: 20,
  },

  permissionText: {
    marginTop: 30,
    textAlign: 'center',
    color: '#777',
    fontFamily: 'Poppins_400Regular',
  },

  cameraContainer: {
    flex: 1,

    borderRadius: 28,
    overflow: 'hidden',

    backgroundColor: '#EEE',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  camera: {
    flex: 1,
  },

  captureButton: {
    width: 82,
    height: 82,
    borderRadius: 41,

    backgroundColor: '#FFF',

    alignSelf: 'center',

    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 24,

    borderWidth: 5,
    borderColor: 'rgba(223,163,178,0.25)',
  },

  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.dustypink,
  },

  imagePreview: {
    flex: 1,
    borderRadius: 28,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 35,
    marginTop: 22,
  },

  primaryButton: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.Lightolivegreen,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  primaryButtonText: {
    color: '#FFF',
    marginLeft: 8,
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
  },

  secondaryButton: {
    flex: 1,
    height: 56,

    borderRadius: 18,

    backgroundColor: '#F4F4F4',

    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',
  },

  secondaryButtonText: {
    marginLeft: 8,
    color: '#777',
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
  },
  loadingContainer: {
  flex: 1,
  borderRadius: 28,
  overflow: 'hidden',
},

loadingImage: {
  width: '100%',
  height: '100%',
  position: 'absolute',
},

loadingOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(255,255,255,0.82)',
},

loadingContent: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 32,
},

loadingIcon: {
  width: 82,
  height: 82,
  borderRadius: 28,

  backgroundColor: colors.dustypink,

  justifyContent: 'center',
  alignItems: 'center',

  marginBottom: 24,
},

loadingTitle: {
  fontSize: 22,
  color: '#5C524D',
  textAlign: 'center',
  fontFamily: 'Poppins_600SemiBold',
},

loadingSubtitle: {
  marginTop: 10,
  textAlign: 'center',
  lineHeight: 24,
  color: '#8D817A',
  fontSize: 14,
  fontFamily: 'Poppins_400Regular',
},

loadingSteps: {
  marginTop: 34,
  width: '100%',
  gap: 12,
},

loadingStepText: {
  fontSize: 14,
  color: '#6F6F6F',
  fontFamily: 'Poppins_400Regular',
},
});