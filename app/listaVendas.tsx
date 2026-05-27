import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import api from "../src/services/api";
import TabBar from "../components/TabBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const colors = {
  dustypink: "#DFA3B2",
  Lightolivegreen: "#B8C4A5",
  Warmbeigebackground: "#F3E7DD",
};

interface ItemVenda {
  nome_produto?: string;
  produto_nome?: string;
  quantidade: number;
  preco_unitario: number;
  subtotal?: number;
  imagem_produto?: string;
}

interface Venda {
  id: string;
  data_venda?: string;
  data?: string;
  total?: number;
  dados_pagamento?: string;
  cliente_nome?: string;
  itens?: ItemVenda[];
}

export default function ListaVendas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [filtro, setFiltro] = useState<"todas" | "hoje" | "semana" | "mes">("todas");

  async function carregarVendas() {
    try {
      const response = await api.get("/vendas");
      setVendas(response.data || []);
    } catch (error) {
      console.log("Erro ao carregar vendas:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await carregarVendas();
  }

  useEffect(() => {
    carregarVendas();
  }, []);

  function filtrarVendas() {
    const agora = new Date();

    return vendas.filter((venda) => {
      const dataVenda = new Date(venda.data_venda || venda.data || "");

      if (filtro === "todas") return true;

      if (filtro === "hoje") {
        return (
          dataVenda.getDate() === agora.getDate() &&
          dataVenda.getMonth() === agora.getMonth() &&
          dataVenda.getFullYear() === agora.getFullYear()
        );
      }

      if (filtro === "semana") {
        const diff = (agora.getTime() - dataVenda.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      }

      if (filtro === "mes") {
        return (
          dataVenda.getMonth() === agora.getMonth() &&
          dataVenda.getFullYear() === agora.getFullYear()
        );
      }

      return true;
    });
  }

  const vendasFiltradas = filtrarVendas();

  const totalHoje = vendasFiltradas.reduce((acc, venda) => acc + (venda.total ?? 0), 0);

  function renderItem({ item }: { item: Venda }) {
    const data =
      item.data_venda || item.data
        ? new Date(item.data_venda || item.data!).toLocaleDateString("pt-BR")
        : "Data não informada";

    const primeiraImagem = item.itens?.[0]?.imagem_produto || "https://via.placeholder.com/300";
    const dados_pagamento = item.dados_pagamento || (item as any).dados_pagamento;

    return (
      <TouchableOpacity activeOpacity={0.92} style={styles.saleCard}>
        <View style={styles.saleTop}>
          <Image source={{ uri: primeiraImagem }} style={styles.saleImage} />

          <View style={styles.saleContent}>
            <View>
              <View style={styles.cardHeader}>
                <Text style={styles.clientName} numberOfLines={1}>
                  {item.cliente_nome || "Cliente"}
                </Text>

                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => {
                    const vendaOriginal = vendas.find((v) => v.id === item.id);
                    setSelectedVenda(vendaOriginal || item);
                    setModalVisible(true);
                  }}
                >
                  <Ionicons name="eye-outline" size={18} color="#FFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={14} color="#888" />
                <Text style={styles.saleDate}>{data}</Text>
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              <View style={styles.paymentBadge}>
                <Ionicons name="card-outline" size={13} color={colors.dustypink} />
                <Text style={styles.paymentText}>{dados_pagamento}</Text>
              </View>
            </View>
          </View>
        </View>

<View style={styles.productsPreview}>
          <View style={styles.productRow}>
            <Ionicons
              name="sparkles-outline"
              size={14}
              color={colors.Lightolivegreen}
            />
            
            <Text style={styles.productText} numberOfLines={1} ellipsizeMode="tail">
        {item.itens && item.itens.length > 0
          ? (() => {
              const nome =
                item.itens[0].nome_produto ||
                item.itens[0].produto_nome ||
                "Produto";

              const palavras = nome.split(" ");

              const nomeLimitado =
                palavras.length > 4
                  ? palavras.slice(0, 3).join(" ") + "..."
                  : nome;

              return nomeLimitado;
            })()
          : "Nenhum produto"}
            </Text>
          </View>

          <View style={styles.totalBubble}>
            <Text style={styles.totalText}>
              R$ {(item.total ?? 0).toFixed(2)}
            </Text>
          </View>

        </View>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.dustypink} />
        <Text style={styles.loadingText}>Carregando vendas...</Text>
      </View>
    );
  }

  if (vendas.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bag-handle-outline" size={60} color="#CCC" />
        <Text style={styles.emptyTitle}>Nenhuma venda encontrada</Text>
        <Text style={styles.emptySubtitle}>As vendas aparecerão aqui.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heroSection}>
        <View style={styles.heroBlob} />

        <View style={styles.heroContent}>
          <View>
            <Text style={styles.heroLabel}>Resumo de Vendas</Text>
            <Text style={styles.heroTotal}>R$ {totalHoje.toFixed(2)}</Text>
            <Text style={styles.heroSub}>{vendas.length} vendas realizadas</Text>
          </View>

          <View style={styles.heroIcon}>
            <Ionicons name="bag-handle-outline" size={32} color="#FFF" />
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {[
          { label: "Todas", value: "todas" },
          { label: "Hoje", value: "hoje" },
          { label: "Semana", value: "semana" },
          { label: "Mês", value: "mes" },
        ].map((itemFiltro) => (
          <TouchableOpacity
            key={itemFiltro.value}
            style={[
              styles.filterButton,
              filtro === itemFiltro.value && styles.filterButtonActive,
            ]}
            onPress={() => setFiltro(itemFiltro.value as any)}
          >
            <Text style={[styles.filterText, filtro === itemFiltro.value && styles.filterTextActive]}>
              {itemFiltro.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={vendasFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 140 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dustypink} />
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalCloseOverlay} 
            activeOpacity={1} 
            onPress={() => setModalVisible(false)} 
          />
          
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.modalDragHandle} />
            
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Detalhes do Pedido</Text>
                <Text style={styles.modalSubtitle}>ID: #{selectedVenda?.id.substring(0, 8).toUpperCase()}</Text>
              </View>

              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              {/* Seção do Cliente & Info */}
              <View style={styles.modalOverviewBox}>
                <View style={styles.modalInfoRow}>
                  <View style={styles.modalIconWrapper}>
                    <Ionicons name="person-outline" size={18} color={colors.dustypink} />
                  </View>
                  <View style={styles.modalInfoTextContainer}>
                    <Text style={styles.modalInfoLabel}>Cliente</Text>
                    <Text style={styles.modalInfoValue}>{selectedVenda?.cliente_nome || "Não informado"}</Text>
                  </View>
                </View>

                <View style={styles.modalInfoRow}>
                  <View style={styles.modalIconWrapper}>
                    <Ionicons name="wallet-outline" size={18} color={colors.Lightolivegreen} />
                  </View>
                  <View style={styles.modalInfoTextContainer}>
                    <Text style={styles.modalInfoLabel}>Forma de Pagamento</Text>
                    <Text style={[styles.modalInfoValue, { textTransform: 'capitalize' }]}>
                      {selectedVenda?.dados_pagamento || "Não informado"}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.modalSectionTitle}>Itens Comprados</Text>

              {selectedVenda?.itens?.map((produto, index) => {
                const imgProd = produto.imagem_produto || "https://via.placeholder.com/300";
                return (
                  <View key={index} style={styles.modalProductCard}>
                    <Image source={{ uri: imgProd }} style={styles.modalProductImage} />
                    
                    <View style={styles.modalProductDetails}>
                      <Text style={styles.modalProductName}>
                        {produto.nome_produto || produto.produto_nome || "Produto"}
                      </Text>
                      
                      <View style={styles.modalProductSubRow}>
                        <Text style={styles.modalProductQty}>
                          {produto.quantidade}x <Text style={styles.modalProductPrice}>R$ {produto.preco_unitario.toFixed(2)}</Text>
                        </Text>
                        <Text style={styles.modalProductSubtotal}>
                          R$ {(produto.subtotal ?? produto.quantidade * produto.preco_unitario).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            {/* Totalizador de Destaque no Rodapé */}
            <View style={styles.modalFooter}>
              <Text style={styles.modalFooterLabel}>Total da Venda</Text>
              <Text style={styles.modalFooterTotal}>R$ {(selectedVenda?.total ?? 0).toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </Modal>

      <TabBar/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBFB",
  },
  heroSection: {
    backgroundColor: colors.Warmbeigebackground,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 30,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: "hidden",
    marginBottom: 10,
  },
  heroBlob: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(223,163,178,0.18)",
    top: -90,
    right: -60,
  },
  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLabel: {
    fontSize: 15,
    color: "#777",
    marginBottom: 8,
  },
  heroTotal: {
    fontSize: 34,
    fontWeight: "700",
    color: "#333",
  },
  heroSub: {
    marginTop: 6,
    color: "#777",
    fontSize: 14,
  },
  heroIcon: {
    width: 68,
    height: 68,
    borderRadius: 999,
    backgroundColor: colors.Lightolivegreen,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 18,
  },
  saleCard: {
    backgroundColor: "#FFF",
    marginBottom: 18,
    borderRadius: 28,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  saleTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  saleContent: {
    flex: 1,
    justifyContent: "space-between",
    minHeight: 100,
  },
  saleImage: {
    width: 82,
    height: 100,
    borderRadius: 22,
    marginRight: 16,
    backgroundColor: "#F2F2F2",
  },
  clientName: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
    marginRight: 10,
  },
  saleDate: {
    marginLeft: 6,
    color: "#888",
    fontSize: 13,
  },
  paymentBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 10,
    backgroundColor: "#FCECEF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  paymentText: {
    marginLeft: 6,
    color: colors.dustypink,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  totalBubble: {
    alignSelf: "flex-end",
    right: 0,
    marginTop: 12,
    backgroundColor: colors.Lightolivegreen,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 18,
  },
  totalText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
  productsPreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F2",
    paddingTop: 14,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productText: {
    marginLeft: 6,
    color: "#666",
    fontSize: 12,
  },

  moreItems: {
    color: "#999",
    marginTop: 4,
    fontStyle: "italic",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#777",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#444",
    marginTop: 18,
  },
  emptySubtitle: {
    marginTop: 8,
    color: "#999",
    textAlign: "center",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  filtersContainer: {
    paddingHorizontal: 18,
    paddingBottom: 16,
    paddingTop: 13,
    flexDirection: "row",
    alignItems: "center",
  },
  filterButton: {
    backgroundColor: "#FFF",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  filterButtonActive: {
    backgroundColor: colors.dustypink,
  },
  filterText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 14,
  },
  filterTextActive: {
    color: "#FFF",
  },
  detailsButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: colors.Lightolivegreen,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(51, 43, 45, 0.45)",
    justifyContent: "flex-end",
  },
  modalCloseOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingTop: 16,
    maxHeight: "88%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 20,
  },
  modalDragHandle: {
    width: 48,
    height: 5,
    borderRadius: 99,
    backgroundColor: "#E5E5E5",
    alignSelf: "center",
    marginBottom: 18,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C2C2C",
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
    fontWeight: "500",
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 99,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverviewBox: {
    backgroundColor: colors.Warmbeigebackground,
    opacity: 0.95,
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
    gap: 16,
  },
  modalInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  modalInfoTextContainer: {
    marginLeft: 14,
  },
  modalInfoLabel: {
    fontSize: 11,
    color: "#7A706B",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalInfoValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#3D3431",
    marginTop: 1,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
    color: "#2C2C2C",
    letterSpacing: -0.3,
  },
  modalProductCard: {
    flexDirection: "row",
    backgroundColor: "#FBFBFB",
    borderWidth: 1,
    borderColor: "#F1F1F1",
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  modalProductImage: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
  },
  modalProductDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  modalProductName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  modalProductSubRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalProductQty: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.dustypink,
  },
  modalProductPrice: {
    color: "#888",
    fontWeight: "400",
  },
  modalProductSubtotal: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#F1F1F1",
    marginTop: 10,
  },
  modalFooterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  modalFooterTotal: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.Lightolivegreen,
  },
});