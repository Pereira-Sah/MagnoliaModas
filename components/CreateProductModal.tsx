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

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function CreateProductModal({ visible, onClose }: Props) {
  const [step, setStep] = useState(1); 
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState(''); 

  const tags = ['floral', 'festa', 'casual', 'alfaiataria', 'linho'];

  const handleTagPress = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

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

              <TouchableOpacity style={[s.optionCard]}>
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
                <TouchableOpacity style={s.imagePreviewContainer} activeOpacity={0.7}>
                    <Ionicons name="cloud-upload-outline" size={30} color={colors.green} />
                    <Text style={s.uploadText}>Upload</Text>
                </TouchableOpacity>
                
                <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={s.label}>Foto do Produto</Text>
                    <View style={s.fakeInput}>
                    <Text style={s.fakeInputText}>Selecionar arquivo...</Text>
                    <Ionicons name="attach" size={20} color="#999" />
                    </View>
                </View>
                </View>

              <View style={s.inputGroup}>
                <Text style={s.label}>Nome da Peça</Text>
                <TextInput style={s.input} placeholder="Ex: Vestido Midi Seda" />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.label}>Descrição Detalhada</Text>
                <TextInput 
                  style={[s.input, s.textArea]} 
                  multiline 
                  placeholder="Conte mais sobre o produto..." 
                />
              </View>

              <View style={s.row}>
                <View style={[s.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={s.label}>Preço (R$)</Text>
                  <TextInput style={s.input} keyboardType="numeric" placeholder="0,00" />
                </View>
                <View style={[s.inputGroup, { flex: 1 }]}>
                  <Text style={s.label}>Estação / Coleção</Text>
                  <TextInput style={s.input} placeholder="Verão 2026" />
                </View>
              </View>

              <View style={s.inputGroup}>
                <Text style={s.label}>Categoria</Text>
                <TextInput style={s.input} placeholder="Ex: Vestidos, Acessórios..." />
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
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}