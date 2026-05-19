import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/services/api";
import ScannerModal from "./ScannerModal";
import {
  createProductStyles as s,
  colors,
} from "../styles/createProductStyles";

interface Produto {
  id: string;
  nome: string;
  preco_base: number;
  imagem?: string;
}

interface ItemCarrinho {
  id_item_estoque: string;
  nome: string;
  quantidade: number;
  preco_unitario_venda: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateSaleModal({
  visible,
  onClose,
  onSuccess,
}: Props) {
  const [scannerVisible, setScannerVisible] = useState(false);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [carregando, setCarregando] = useState(false);

  const [nomeComprador, setNomeComprador] = useState("");
  const [telefoneComprador, setTelefoneComprador] = useState("");
  const [dadosPagamento, setDadosPagamento] = useState("Pix");
  const [meioVenda, setMeioVenda] = useState("Loja Física");

  async function buscarProdutoPorCodigo(codigo: string) {
    try {
      const response = await api.get(
        `/produtos/buscar-por-codigo/${codigo.trim()}`,
      );

      const produto = response.data;
      const variacao = produto.variacao_encontrada;

      if (!variacao) {
        alert("Variação não encontrada.");
        return;
      }

      setCarrinho((prev) => {
        const existente = prev.find(
          (item) => item.id_item_estoque === variacao.id_variacao,
        );

        if (existente) {
          return prev.map((item) =>
            item.id_item_estoque === variacao.id_variacao
              ? {
                  ...item,
                  quantidade: item.quantidade + 1,
                }
              : item,
          );
        }

        return [
          ...prev,
          {
            id_item_estoque: variacao.id_variacao,
            nome: `${produto.nome} (${variacao.cor} ${variacao.tamanho})`,
            quantidade: 1,
            preco_unitario_venda: Number(produto.preco_base) || 0,
          },
        ];
      });

      alert("Produto adicionado ao carrinho!");
    } catch (error: any) {
      console.log("Erro ao buscar produto:", error.response?.data || error);

      alert(error.response?.data?.detail || "Produto não encontrado.");
    }
  }

  function alterarQuantidade(id: string, quantidade: number) {
    if (quantidade <= 0) {
      setCarrinho((prev) => prev.filter((item) => item.id_item_estoque !== id));
      return;
    }

    setCarrinho((prev) =>
      prev.map((item) =>
        item.id_item_estoque === id ? { ...item, quantidade } : item,
      ),
    );
  }

  function calcularTotal() {
    return carrinho.reduce(
      (total, item) => total + item.quantidade * item.preco_unitario_venda,
      0,
    );
  }

  async function finalizarVenda() {
    if (carrinho.length === 0) {
      alert("Adicione ao menos um produto.");
      return;
    }

    try {
      setCarregando(true);

      const token = await AsyncStorage.getItem("token");

      const payload = {
        meio_venda: meioVenda,
        status_venda: "Finalizada",
        nome_comprador: nomeComprador,
        telefone_comprador: telefoneComprador,
        dados_pagamento: dadosPagamento,
        itens: carrinho.map((item) => ({
          id_item_estoque: item.id_item_estoque,
          quantidade: item.quantidade,
          preco_unitario_venda: item.preco_unitario_venda,
        })),
      };

      await api.post("/vendas", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Venda realizada com sucesso!");

      setCarrinho([]);
      setNomeComprador("");
      setTelefoneComprador("");

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.log("Erro ao processar venda:", error.response?.data || error);

      alert(error.response?.data?.detail || "Erro ao processar venda.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={s.overlay}
      >
        <View style={s.modalContent}>
          <View style={s.header}>
            <Text style={s.headerTitle}>Nova Venda</Text>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color={colors.pink} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.formScroll}
          >
            <TouchableOpacity
              style={s.submitButton}
              onPress={() => setScannerVisible(true)}
            >
              <Text style={s.submitButtonText}>Escanear Produto</Text>
            </TouchableOpacity>

            <Text style={s.label}>Carrinho</Text>

            {carrinho.map((item) => (
              <View
                key={item.id_item_estoque}
                style={{
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#EEE",
                  borderRadius: 12,
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontWeight: "600" }}>{item.nome}</Text>

                <Text>R$ {item.preco_unitario_venda.toFixed(2)}</Text>

                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 8,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      alterarQuantidade(
                        item.id_item_estoque,
                        item.quantidade - 1,
                      )
                    }
                  >
                    <Ionicons
                      name="remove-circle-outline"
                      size={24}
                      color={colors.pink}
                    />
                  </TouchableOpacity>

                  <Text style={{ marginHorizontal: 12 }}>
                    {item.quantidade}
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      alterarQuantidade(
                        item.id_item_estoque,
                        item.quantidade + 1,
                      )
                    }
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={24}
                      color={colors.green}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <Text style={s.label}>Nome do Comprador</Text>
            <TextInput
              style={s.input}
              value={nomeComprador}
              onChangeText={setNomeComprador}
            />

            <Text style={s.label}>Telefone</Text>
            <TextInput
              style={s.input}
              value={telefoneComprador}
              onChangeText={setTelefoneComprador}
              keyboardType="phone-pad"
            />

            <Text style={s.label}>Forma de Pagamento</Text>
            <TextInput
              style={s.input}
              value={dadosPagamento}
              onChangeText={setDadosPagamento}
            />

            <Text style={s.label}>Meio da Venda</Text>
            <TextInput
              style={s.input}
              value={meioVenda}
              onChangeText={setMeioVenda}
            />

            <View
              style={{
                marginVertical: 20,
                padding: 16,
                backgroundColor: "#FFF5F6",
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: colors.pink,
                }}
              >
                Total: R$ {calcularTotal().toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={[s.submitButton, carregando && { opacity: 0.7 }]}
              onPress={finalizarVenda}
              disabled={carregando}
            >
              <Text style={s.submitButtonText}>
                {carregando ? "Processando..." : "Finalizar Venda"}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <ScannerModal
            visible={scannerVisible}
            onClose={() => setScannerVisible(false)}
            onCodeScanned={(codigo) => {
              setScannerVisible(false);
              buscarProdutoPorCodigo(codigo);
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
