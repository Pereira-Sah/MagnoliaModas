import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/produtosStyles';

interface Estoque {
  cor: string;
  tamanho: string;
  quantidade: number;
}

interface Produto {
  id: string;
  imagem: string;
  nome: string;
  preco_base: number;
  categoria: string;
  estacao: string;
  descricao: string;
  estoque: Estoque[];
}

interface ProductModalProps {
  visible: boolean;
  produto: Produto | null;
  onClose: () => void;
  onEdit: (produto: Produto) => void;
  onDelete: (id: string) => void;
}

export default function ProductModal({ visible, produto, onClose }: ProductModalProps) {
  if (!produto) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>

        <View style={styles.modalContent}>
          <View style={styles.modalHeaderRow}>

            <TouchableOpacity onPress={onClose} >
              <Ionicons name="close" size={24} color="#e6aeac" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalTopSection}>
              <Image source={{ uri: produto.imagem }} style={styles.modalImageLarge} />
              <View style={styles.modalMainInfo}>
                <Text style={styles.modalNome}>{produto.nome}</Text>
                <Text style={styles.modalPriceText}>R$ {produto.preco_base}</Text>

                <View style={{ flexDirection: 'row', marginTop: 8}}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{produto.categoria}</Text>
                </View>
                <View style={styles.categoryBadge}>
                 <Text style={styles.categoryBadgeText}>{produto.estacao}</Text>
                </View>
              </View>




              </View>
            </View>

            <View style={styles.divider} />
            <View style={styles.modalDetailsSection}>
              <Text style={styles.sectionLabel}>Descrição</Text>
              <Text style={styles.modalDescricaoText}>{produto.descricao}</Text>
              
              <Text style={styles.sectionLabel}>Estoque por Variação</Text>
              {produto.estoque && produto.estoque.length > 0 ? (
                <View style={styles.modernTable}>

                  {produto.estoque.map((variacao, index) => (
                    <View key={index} style={styles.modernTableRow}>
                      <Text style={styles.tableCellMain}>{variacao.cor} • {variacao.tamanho}</Text>
                      <Text style={styles.tableCellSide}>{variacao.quantidade} unid.</Text>


                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.semEstoque}>Nenhum item em estoque</Text>
              )}
            </View>

              <View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.iconBtn} >
                <Ionicons name="pencil-outline" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconBtn, { marginLeft: 12 }]}>
                <Ionicons name="archive" size={20} color="#E57373" />
              </TouchableOpacity>
            </View>
              </View>

          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}