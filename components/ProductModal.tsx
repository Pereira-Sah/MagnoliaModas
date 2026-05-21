import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles, colors } from "../styles/produtosStyles"; // 🌟 Importado colors caso use para o novo botão
import EditProductModal from "./EditProductModal";

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
  tags?: string[];
  estoque: Estoque[];
}

interface ProductModalProps {
  visible: boolean;
  produto: Produto | null;
  onClose: () => void;
  onEdit?: (produto: Produto) => void;
  onDelete: (id: string) => void;
  isCliente?: boolean; // 🌟 Controla se a visão é a do Cliente
  onAdicionarAoLook?: (produto: Produto) => void; // 🌟 Ação do botão do cliente
}

export default function ProductModal({
  visible,
  produto,
  onClose,
  onEdit,
  onDelete,
  isCliente = false, // 🌟 Padrão falso para não quebrar onde já é usado no ADM
  onAdicionarAoLook,
}: ProductModalProps) {
  const [editVisible, setEditVisible] = useState(false);

  if (!produto) return null;

  function editarProduto() {
    setEditVisible(true);
  }

  function handleEditSuccess() {
    setEditVisible(false);
    onClose();
    onEdit?.(produto!);
  }

  return (
    <>
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <Pressable onPress={onClose} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#e6aeac" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalTopSection}>
                <Image
                  source={{ uri: produto.imagem }}
                  style={styles.modalImageLarge}
                />

                <View style={styles.modalMainInfo}>
                  <Text style={styles.modalNome}>{produto.nome}</Text>

                  <Text style={styles.modalPriceText}>
                    R$ {produto.preco_base}
                  </Text>

                  <View style={{ flexDirection: "row", marginTop: 8 }}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {produto.categoria}
                      </Text>
                    </View>

                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {produto.estacao}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.modalDetailsSection}>
                <Text style={styles.sectionLabel}>Descrição</Text>

                <Text style={styles.modalDescricaoText}>
                  {produto.descricao}
                </Text>

                <Text style={styles.sectionLabel}>Estoque por Variação</Text>

                {produto.estoque && produto.estoque.length > 0 ? (
                  <View style={styles.modernTable}>
                    {produto.estoque.map((variacao, index) => (
                      <View key={index} style={styles.modernTableRow}>
                        <Text style={styles.tableCellMain}>
                          {variacao.cor} • {variacao.tamanho}
                        </Text>

                        <Text style={styles.tableCellSide}>
                          {variacao.quantidade} unid.
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.semEstoque}>Nenhum item em estoque</Text>
                )}
              </View>

              {/* 🌟 RENDERIZAÇÃO CONDICIONAL DE BOTÕES */}
              {isCliente ? (
                /* INTERFACE DO CLIENTE: Botão Call-To-Action chamando o Provador */
                <TouchableOpacity
                  style={{
                    backgroundColor: colors?.Lightolivegreen || "#808000",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 16,
                    borderRadius: 12,
                    marginTop: 10,
                    marginBottom: 20,
                    gap: 8,
                  }}
                  onPress={() => onAdicionarAoLook?.(produto)}
                >
                  <Ionicons name="sparkles-outline" size={20} color="white" />
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                  >
                    Adicionar ao Look & Combinar
                  </Text>
                </TouchableOpacity>
              ) : (
                /* INTERFACE ADMINISTRATIVA: Lápis e Lixeira originais */
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={editarProduto}
                  >
                    <Ionicons name="pencil-outline" size={20} color="#666" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.iconBtn, { marginLeft: 12 }]}
                    onPress={() => onDelete(produto.id)}
                  >
                    <Ionicons name="archive" size={20} color="#E57373" />
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <EditProductModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        onUpdated={handleEditSuccess}
        produto={produto}
      />
    </>
  );
}
