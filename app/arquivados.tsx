import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import TabBar from "../components/TabBar";
import { dashboardStyles, colors } from "../styles/dashboardStyles";

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
  estoque?: Estoque[];
  arquivado?: boolean;
}

const CACHE_KEY = "@magnolia:produtos";

export default function Arquivados() {

const [produtosArquivados, setProdutosArquivados] = useState<Produto[]>([]);  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarArquivados();
  }, []);

  async function carregarArquivados() {
    try {
      const cache = await AsyncStorage.getItem(CACHE_KEY);

      if (!cache) return;

      const produtos: Produto[] = JSON.parse(cache);

      const somenteArquivados = produtos.filter(
        (p: Produto) => p.arquivado === true
      );

      setProdutosArquivados(somenteArquivados);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

async function desarquivarProduto(id: string) {
      try {
      const cache = await AsyncStorage.getItem(CACHE_KEY);

      if (!cache) return;

      const produtos = JSON.parse(cache);

const atualizados = produtos.map((produto: Produto) => {
          if (produto.id === id) {
          return {
            ...produto,
            arquivado: false,
          };
        }

        return produto;
      });

      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify(atualizados)
      );

      carregarArquivados();

    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <View
        style={[
          dashboardStyles.container,
          {
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.dustypink}
        />
      </View>
    );
  }

  return (
    <View style={dashboardStyles.container}>

      {/* HERO */}
      <View style={dashboardStyles.heroSection}>

        <View style={dashboardStyles.heroBlob} />
        <View style={dashboardStyles.heroBlob2} />

        <View style={dashboardStyles.heroTopRow}>

          <View>
            <Text style={dashboardStyles.heroGreeting}>
              Produtos Arquivados
            </Text>

            <Text
              style={{
                color: "#777",
                marginTop: 8,
              }}
            >
              Gerencie peças ocultas da loja
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            style={dashboardStyles.heroIconCircle}
          >
            <Ionicons
              name="arrow-back-outline"
              size={22}
              color="#FFF"
            />
          </TouchableOpacity>

        </View>
      </View>

      <FlatList
        data={produtosArquivados}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: "center",
              marginTop: 50,
              color: "#999",
            }}
          >
            Nenhum produto arquivado.
          </Text>
        }
        renderItem={({ item }) => (

          <View
            style={{
              backgroundColor: "#FFF",
              borderRadius: 24,
              padding: 16,
              marginBottom: 16,

              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 4,
            }}
          >

            <View
              style={{
                flexDirection: "row",
              }}
            >

              <Image
                source={{ uri: item.imagem }}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 18,
                  backgroundColor: "#EEE",
                }}
              />

              <View
                style={{
                  flex: 1,
                  marginLeft: 14,
                  justifyContent: "center",
                }}
              >

                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    color: "#333",
                  }}
                >
                  {item.nome}
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    color: "#777",
                  }}
                  numberOfLines={2}
                >
                  {item.descricao}
                </Text>

                <Text
                  style={{
                    marginTop: 10,
                    color: colors.Lightolivegreen,
                    fontWeight: "700",
                    fontSize: 16,
                  }}
                >
                  R$ {item.preco_base}
                </Text>

              </View>
            </View>

            {/* BADGES */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 16,
                gap: 10,
              }}
            >

              <View
                style={{
                  backgroundColor: "#F5F5F5",
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 999,
                }}
              >
                <Text style={{ color: "#666" }}>
                  {item.categoria}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: "#F5F5F5",
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 999,
                }}
              >
                <Text style={{ color: "#666" }}>
                  {item.estacao}
                </Text>
              </View>

            </View>

            <TouchableOpacity
              onPress={() => desarquivarProduto(item.id)}
              activeOpacity={0.85}
              style={{
                marginTop: 18,
                backgroundColor: colors.Lightolivegreen,

                height: 52,
                borderRadius: 18,

                justifyContent: "center",
                alignItems: "center",

                flexDirection: "row",
                gap: 8,
              }}
            >

              <Ionicons
                name="refresh-outline"
                size={20}
                color="#FFF"
              />

              <Text
                style={{
                  color: "#FFF",
                  fontWeight: "700",
                  fontSize: 15,
                }}
              >
                Desarquivar Produto
              </Text>

            </TouchableOpacity>

          </View>
        )}
      />

    <TabBar />
    </View>

  );
}
