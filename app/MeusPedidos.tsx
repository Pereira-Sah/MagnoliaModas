import React, { useState, useCallback } from "react"; 
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import api from "../src/services/api";
import { useFocusEffect } from "expo-router"; 
import TabBar from "../components/TabBar";

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
  nome_comprador?: string;
  id_comprador?: string;
  itens?: ItemVenda[];
}

export default function MeusPedidos() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [clienteNome, setClienteNome] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

async function carregarDados() {
  try {
    if (!refreshing) setLoading(true);

    const perfilResponse = await api.get("/auth/me");
    const usuario = perfilResponse.data;
    const nomeUsuario = usuario?.nome;
    const idUsuario = usuario?.id;

    if (!nomeUsuario) {
      setClienteNome("");
      setVendas([]);
      return;
    }

    setClienteNome(nomeUsuario);

    const response = await api.get("/vendas/");
    const todasVendas = response.data || [];

  const minhasVendas = todasVendas.filter((v: Venda) => {
    console.log("VENDA:", v.nome_comprador);
    console.log("USUARIO:", nomeUsuario);

    if (!v.nome_comprador) return false;

    return (
      v.nome_comprador.trim().toLowerCase() ===
      nomeUsuario.trim().toLowerCase()
    );
  });

    minhasVendas.sort((a: Venda, b: Venda) => b.id.localeCompare(a.id));

    setVendas(minhasVendas);
  } catch (error: any) {
  console.log("ERRO COMPLETO:", error);
  console.log("RESPONSE:", error?.response?.data);
  console.log("MESSAGE:", error?.message);
} finally {
    setLoading(false);
    setRefreshing(false);
  }
}

  async function onRefresh() {
    setRefreshing(true);
    await carregarDados();
  }

  function renderItem({ item }: { item: Venda }) {
    const primeiraImagem =
      item.itens?.[0]?.imagem_produto || "https://via.placeholder.com/300";

    const data = item.data_venda || item.data
      ? new Date(item.data_venda || item.data!).toLocaleDateString("pt-BR")
      : "Data não informada";

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Image source={{ uri: primeiraImagem }} style={styles.image} />

          <View style={styles.info}>
            <Text style={styles.title}>Pedido #{item.id.slice(-6).toUpperCase()}</Text>

            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={14} color="#888" />
              <Text style={styles.subtitle}>{data}</Text>
            </View>

            <Text style={styles.items}>
              {item.itens?.length || 0} {item.itens?.length === 1 ? "item" : "itens"}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.total}>
            R$ {(item.total ?? 0).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.dustypink} />
        <Text style={{ marginTop: 10, color: "#666" }}>Carregando seus pedidos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HERO */}
      <View style={styles.hero}>
        <View style={styles.heroBlob} />

        <View style={styles.heroContent}>
          <View>
            <Text style={styles.heroTitle}>Meus Pedidos</Text>
            <Text style={styles.heroSub}>{clienteNome || "Cliente"}</Text>

            <Text style={styles.heroStats}>
              {vendas.length} {vendas.length === 1 ? "pedido" : "pedidos"} • R${" "}
              {vendas.reduce((sum, v) => sum + (v.total ?? 0), 0).toFixed(2)}
            </Text>
          </View>

          <View style={styles.heroIcon}>
            <Ionicons name="bag-handle-outline" size={28} color="#fff" />
          </View>
        </View>
      </View>

      {/* LISTA */}
      <FlatList
        data={vendas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.dustypink}
          />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bag-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>
              Você ainda não tem pedidos finalizados.
            </Text>
          </View>
        }
      />
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBFBFB" },
  hero: { backgroundColor: colors.Warmbeigebackground, paddingTop: 60, paddingHorizontal: 20, paddingBottom: 30, borderBottomLeftRadius: 35, borderBottomRightRadius: 35, overflow: "hidden" },
  heroBlob: { position: "absolute", width: 200, height: 200, borderRadius: 999, backgroundColor: "rgba(223,163,178,0.2)", top: -80, right: -60 },
  heroContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  heroTitle: { fontSize: 26, fontWeight: "800", color: "#333" },
  heroSub: { fontSize: 14, color: "#777", marginTop: 4 },
  heroStats: { marginTop: 8, fontSize: 13, color: "#666", fontWeight: "600" },
  heroIcon: { width: 60, height: 60, borderRadius: 999, backgroundColor: colors.Lightolivegreen, justifyContent: "center", alignItems: "center" },
  card: { backgroundColor: "#fff", borderRadius: 22, padding: 16, marginBottom: 14, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardTop: { flexDirection: "row" },
  image: { width: 70, height: 85, borderRadius: 18, marginRight: 12, backgroundColor: "#eee" },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "700", color: "#333" },
  subtitle: { fontSize: 13, color: "#888", marginLeft: 6 },
  dateRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  items: { marginTop: 6, fontSize: 12, color: "#666" },
  footer: { marginTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "#f2f2f2", paddingTop: 10 },
  total: { fontSize: 15, fontWeight: "800", color: colors.Lightolivegreen },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { marginTop: 80, alignItems: "center" },
  emptyText: { marginTop: 10, color: "#999" },
});