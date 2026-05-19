import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import api from "../src/services/api";

interface ItemVenda {
  nome_produto?: string;
  produto_nome?: string;
  quantidade: number;
  preco_unitario: number;
  subtotal?: number;
}

interface Venda {
  id: string;
  data_venda?: string;
  data?: string;
  total?: number;
  forma_pagamento?: string;
  cliente_nome?: string;
  itens?: ItemVenda[];
}

export default function ListaVendas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  function renderItem({ item }: { item: Venda }) {
    const data =
      item.data_venda || item.data
        ? new Date(item.data_venda || item.data!).toLocaleString("pt-BR")
        : "Data não informada";

    return (
      <View>
        <Text>ID: {item.id}</Text>
        <Text>Data: {data}</Text>

        {item.cliente_nome ? (
          <Text>Cliente: {item.cliente_nome}</Text>
        ) : null}

        {item.forma_pagamento ? (
          <Text>Pagamento: {item.forma_pagamento}</Text>
        ) : null}

        <Text>Total: R$ {(item.total ?? 0).toFixed(2)}</Text>

        <Text>Itens:</Text>

        {item.itens && item.itens.length > 0 ? (
          item.itens.map((produto, index) => (
            <View key={index}>
              <Text>
                • {produto.nome_produto || produto.produto_nome || "Produto"}
              </Text>
              <Text>Quantidade: {produto.quantidade}</Text>
              <Text>
                Preço Unitário: R$ {produto.preco_unitario.toFixed(2)}
              </Text>
              <Text>
                Subtotal: R${" "}
                {(
                  produto.subtotal ??
                  produto.quantidade * produto.preco_unitario
                ).toFixed(2)}
              </Text>
            </View>
          ))
        ) : (
          <Text>Nenhum item informado.</Text>
        )}

        <Text>-----------------------------------</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
        <Text>Carregando vendas...</Text>
      </View>
    );
  }

  if (vendas.length === 0) {
    return (
      <View>
        <Text>Nenhuma venda encontrada.</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Lista de Vendas</Text>

      <FlatList
        data={vendas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
}