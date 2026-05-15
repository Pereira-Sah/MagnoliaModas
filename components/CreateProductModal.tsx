import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createProductStyles as s, colors, fonts } from '../styles/createProductStyles';
import CameraModal from './CameraModal';
import api from '../src/services/api';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function CreateProductModal({ visible, onClose }: Props) {
  const [step, setStep] = useState(1); 
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState(''); 

  const tags = ['floral', 'festa', 'casual', 'alfaiataria', 'linho'];
const [nome, setNome] = useState('');
const [descricao, setDescricao] = useState('');
const [preco, setPreco] = useState('');
const [estacao, setEstacao] = useState('');
const [categoria, setCategoria] = useState('');

async function selecionarArquivo() {
  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.8,
  });

  if (resultado.canceled) return;

  const uri = resultado.assets[0].uri;

  // Mostra a imagem imediatamente no formulário
  setImageUrl(uri);

  // Se quiser apenas selecionar manualmente, abre o formulário
  setStep(2);
}

async function IAProductModal(uri: string) {
  try {
    const formData = new FormData();

    // Adiciona a imagem no formato multipart/form-data
    formData.append('imagem', {
      uri,
      name: 'produto.jpg',
      type: 'image/jpeg',
    } as any);

    // Chama o endpoint da IA
    const response = await api.post(
      '/ml/sugerir-dados-produto',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // IA pode levar alguns segundos para pensar na roupa
      }
    );

    const sugestao = response.data.sugestao;

    // Preenche os estados do formulário
    setNome(sugestao.nome ?? '');
    setDescricao(sugestao.descricao ?? '');
    setPreco(
      sugestao.preco_base != null
        ? String(sugestao.preco_base)
        : ''
    );
    setEstacao(sugestao.estacao ?? '');
    setCategoria(sugestao.categoria ?? '');
    setImageUrl(sugestao.imagem ?? '');

    // Abre a etapa do formulário com os dados preenchidos
    setStep(2);
  } catch (error: any) {
    console.log(
      'Erro ao processar imagem com IA:',
      error.response?.data || error
    );
    alert('Não foi possível analisar a imagem.');
  }
}

async function handlePhotoCaptured(uri: string) {
  setCameraVisible(false);

  // Exibe imediatamente a foto tirada
  setImageUrl(uri);

  // Envia para IA
  await IAProductModal(uri);
}
  const handleTagPress = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const [cameraVisible, setCameraVisible] = useState(false);

  async function openCamera() {
    setCameraVisible(true);
  }
  const handleClose = () => {
    setStep(1);
    setImageUrl('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={s.overlay}
      >
        <View style={s.modalContent}>
          <View style={s.dragIndicator} />

          <View style={s.header}>
            <Text style={s.headerTitle}>
              {step === 1 ? 'Novo Produto' : 'Detalhes do Produto'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={s.closeButton}>
              <Ionicons name="close-circle" size={28} color={colors.pink} />
            </TouchableOpacity>
          </View>

          {step === 1 ? (
            <View style={{ paddingBottom: 20 }}>
              <Text style={s.instructionText}>Como deseja cadastrar seu produto?</Text>
              
              <TouchableOpacity style={s.optionCard} onPress={() => setStep(2)}>
                <View style={[s.iconBg, { backgroundColor: '#F0F7F0' }]}>
                  <Ionicons name="document-text-outline" size={26} color={colors.green} />
                </View>
                <View style={s.optionInfo}>
                  <Text style={s.optionTitle}>Entrada Manual</Text>
                  <Text style={s.optionDesc}>Você preenche todos os campos do seu jeito.</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>

              <TouchableOpacity style={[s.optionCard]} onPress={() => openCamera()}>
                <View style={[s.iconBg, { backgroundColor: '#FFF0F0' }]}>
                  <Ionicons name="sparkles-outline" size={26} color={colors.pink} />
                </View>
                <View style={s.optionInfo}>
                  <Text style={s.optionTitle}>Assistente IA</Text>
                  <Text style={s.optionDesc}>Tire uma foto e nós preenchemos para você.</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />

              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.formScroll}>
              
                <View style={s.imageUploadSection}>
                <TouchableOpacity
  style={s.imagePreviewContainer}
  activeOpacity={0.7}
  onPress={selecionarArquivo}
>
  {imageUrl ? (
    <Image
      source={{ uri: imageUrl }}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 12,
      }}
      resizeMode="cover"
    />
  ) : (
    <>
      <Ionicons
        name="cloud-upload-outline"
        size={30}
        color={colors.green}
      />
      <Text style={s.uploadText}>Upload</Text>
    </>
  )}
</TouchableOpacity>
                
                <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={s.label}>Foto do Produto</Text>
                    <TouchableOpacity
  style={s.fakeInput}
  onPress={selecionarArquivo}
>
                    <Text style={s.fakeInputText}>Selecionar arquivo...</Text>
                    <Ionicons name="attach" size={20} color="#999" />
                    </TouchableOpacity>
                </View>
                </View>

              <View style={s.inputGroup}>
                <Text style={s.label}>Nome da Peça</Text>
                <TextInput style={s.input}  value={nome}
  onChangeText={setNome} placeholder="Ex: Vestido Midi Seda" />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.label}>Descrição Detalhada</Text>
                <TextInput 
                  style={[s.input, s.textArea]} 
                  multiline value={descricao}
  onChangeText={setDescricao}
                  placeholder="Conte mais sobre o produto..." 
                />
              </View>

              <View style={s.row}>
                <View style={[s.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={s.label}>Preço (R$)</Text>
                  <TextInput style={s.input} keyboardType="numeric" placeholder="0,00"  value={preco}
  onChangeText={setPreco}/>
                </View>
                <View style={[s.inputGroup, { flex: 1 }]}>
                  <Text style={s.label}>Estação / Coleção</Text>
                  <TextInput style={s.input} value={estacao}
  onChangeText={setEstacao} placeholder="Verão 2026" />
                </View>
              </View>

              <View style={s.inputGroup}>
                <Text style={s.label}>Categoria</Text>
                <TextInput style={s.input} value={categoria}
  onChangeText={setCategoria} placeholder="Ex: Vestidos, Acessórios..." />
              </View>

              <Text style={s.label}>Tags Relacionadas</Text>
              <View style={s.tagsContainer}>
                {tags.map(tag => (
                  <TouchableOpacity 
                    key={tag} 
                    onPress={() => handleTagPress(tag)}
                    style={[s.tagItem, selectedTags.includes(tag) && s.tagItemSelected]}
                  >
                    <Text style={[s.tagText, selectedTags.includes(tag) && s.tagTextSelected]}>
                      #{tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={s.submitButton} onPress={handleClose}>
                <Text style={s.submitButtonText}>Cadastrar Produto</Text>
              </TouchableOpacity>

            </ScrollView>
          )}
<CameraModal
  visible={cameraVisible}
  onClose={() => setCameraVisible(false)}
  onPhotoCaptured={handlePhotoCaptured}
/>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}