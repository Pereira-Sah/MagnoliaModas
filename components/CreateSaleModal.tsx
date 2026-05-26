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
  categoria: string;
}

interface ItemCarrinho {
  id_item_estoque: string;
  nome: string;
  quantidade: number;
  preco_unitario_venda: number;
  categoria: string;
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

  const [alertVisible, setAlertVisible] = useState(false);

  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    type: "success",
  });

  const [nomeComprador, setNomeComprador] = useState("");
  const [telefoneComprador, setTelefoneComprador] = useState("");
  const [dadosPagamento, setDadosPagamento] = useState("Pix");
  const [meioVenda, setMeioVenda] = useState("Loja Física");

  function mostrarAlerta(
    title:string,
    message:string,
    type:"success"|"error"|"warning"|"info"
  ){
    setAlertData({
      title,
      message,
      type
    });

    setAlertVisible(true);
  }

  async function buscarProdutoPorCodigo(codigo: string) {
    try {
      const response = await api.get(
        `/produtos/buscar-por-codigo/${codigo.trim()}`,
      );

      const produto = response.data;
      const variacao = produto.variacao_encontrada;

      if (!variacao) {
        mostrarAlerta(
          "Produto não encontrado",
          "A variação escaneada não foi localizada.",
          "warning"
        );
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
            categoria: produto.categoria || "Geral", 
          },
        ];
      });

      mostrarAlerta(
        "Produto adicionado",
        "O item foi adicionado ao carrinho.",
        "success"
      );
    } catch (error: any) {
      console.log("Erro ao buscar produto:", error.response?.data || error);
      mostrarAlerta(
        "Erro",
        error.response?.data?.detail ||
        "Produto não encontrado.",
        "error"
      );
    }
  }

  function alterarQuantidade(id: string, quantity: number) {
    if (quantity <= 0) {
      setCarrinho((prev) => prev.filter((item) => item.id_item_estoque !== id));
      return;
    }

    setCarrinho((prev) =>
      prev.map((item) =>
        item.id_item_estoque === id ? { ...item, quantidade: quantity } : item,
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
      mostrarAlerta(
        "Carrinho vazio",
        "Adicione ao menos um produto antes de finalizar.",
        "warning"
      );
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
          categoria: item.categoria, 
        })),
      };

      await api.post("/vendas", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCarrinho([]);
      setNomeComprador("");
      setTelefoneComprador("");

      setAlertData({
        title: "Venda concluída",
        message: "Venda realizada com sucesso.",
        type: "success",
      });

      setAlertVisible(true);
    } catch (error: any) {
      console.log("Erro ao processar venda:", error.response?.data || error);
      mostrarAlerta(
        "Erro",
        error.response?.data?.detail ||
        "Erro ao processar venda.",
        "error"
      );
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
                <Text style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                  Categoria: {item.categoria}
                </Text>

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
          {alertVisible && (
          <View
            style={[
              s.alertOverlay,
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
                elevation: 999,
              },
            ]}
          >
            <View style={s.alertContainer}>
              
              <View
                style={[
                  s.alertIconContainer,
                  {
                    borderColor:
                      alertData.type === "success"
                        ? colors.green
                        : colors.pink,
                  },
                ]}
              >
                <Ionicons
                  name={
                    alertData.type === "success"
                      ? "checkmark"
                      : alertData.type === "warning"
                      ? "warning-outline"
                      : "close"
                  }
                  size={30}
                  color={
                    alertData.type === "success"
                      ? colors.green
                      : colors.pink
                  }
                />
              </View>

              <Text style={s.alertTitle}>
                {alertData.title}
              </Text>

              <Text style={s.alertMessage}>
                {alertData.message}
              </Text>

              <TouchableOpacity
                style={s.alertConfirmButton}
                onPress={() => {
                  setAlertVisible(false);
                  if (alertData.title === "Venda concluída") {
                    onSuccess?.();
                    onClose();
                  }
                }}
              >
                <Text style={s.alertConfirmText}>
                  Entendi
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}