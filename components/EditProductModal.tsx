import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  createProductStyles as s,
  colors,
} from "../styles/createProductStyles";
import api from "../src/services/api";
import * as ImagePicker from "expo-image-picker";
import QRCode from "react-native-qrcode-svg";
import ScannerModal from "./ScannerModal";

interface Estoque {
  id?: string;
  id_variacao?: string;
  cor: string;
  tamanho: string;
  quantidade: number;
  codigo_barras?: string;
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
  estoque?: Estoque[];
}

interface Props {
  visible: boolean;
  produto: Produto | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export default function EditProductModal({
  visible,
  produto,
  onClose,
  onUpdated,
}: Props) {
  const tagsDisponiveis = ["floral", "festa", "casual", "alfaiataria", "linho"];

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [estacao, setEstacao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [codigoBarras, setCodigoBarras] = useState("");

  const [scannerVisible, setScannerVisible] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [estoque, setEstoque] = useState<Estoque[]>([]);

  useEffect(() => {
    if (!produto || !visible) return;

    setNome(produto.nome ?? "");
    setDescricao(produto.descricao ?? "");
    setPreco(
      produto.preco_base != null
        ? String(produto.preco_base).replace(".", ",")
        : "",
    );
    setEstacao(produto.estacao ?? "");
    setCategoria(produto.categoria ?? "");
    setImageUrl(produto.imagem ?? "");
    setSelectedTags(produto.tags ?? []);

    // Mantém e carrega as variações de estoque originais do produto na tela
    if (produto.estoque) {
      setEstoque([...produto.estoque]);
    } else {
      setEstoque([]);
    }

    const primeiroCodigo = produto.estoque?.[0]?.codigo_barras ?? "";
    setCodigoBarras(primeiroCodigo);
  }, [produto, visible]);

  function handleTagPress(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function atualizarVariacao(
    index: number,
    campo: keyof Estoque,
    valor: string,
  ) {
    setEstoque((prev) => {
      const novoEstoque = [...prev];

      if (campo === "quantidade") {
        novoEstoque[index][campo] = Number(valor) || 0;
      } else {
        novoEstoque[index][campo] = valor as any;
      }

      return novoEstoque;
    });
  }

  function adicionarVariacao() {
    setEstoque((prev) => [
      ...prev,
      {
        cor: "",
        tamanho: "",
        quantidade: 0,
        codigo_barras: "",
      },
    ]);
  }

  async function removerVariacao(index: number, variacao: Estoque) {
    const idVariacao = variacao.id_variacao || variacao.id;

    if (idVariacao) {
      Alert.alert(
        "Remover Variação",
        "Deseja realmente excluir esta variação do banco de dados?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: async () => {
              try {
                await api.delete(`/estoque/${idVariacao}`);
                setEstoque((prev) => prev.filter((_, i) => i !== index));
              } catch (err) {
                Alert.alert("Erro", "Não foi possível remover a variação.");
              }
            },
          },
        ]
      );
    } else {
      setEstoque((prev) => prev.filter((_, i) => i !== index));
    }
  }

  async function selecionarArquivo() {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (resultado.canceled) return;

    const uri = resultado.assets[0].uri;
    setImageUrl(uri);
  }

  async function handleSalvar() {
    if (!produto) return;

    try {
      setSalvando(true);

      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("descricao", descricao);
      formData.append("categoria", categoria);
      formData.append("estacao", estacao);
      formData.append(
        "preco_base",
        String(parseFloat(preco.replace(",", ".")) || 0),
      );
      formData.append("tags", JSON.stringify(selectedTags));

      if (
        imageUrl &&
        (imageUrl.startsWith("file://") || imageUrl.startsWith("content://"))
      ) {
        const uriParts = imageUrl.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const fileName = imageUrl.split("/").pop();

        formData.append("imagem", {
          uri: imageUrl,
          name: fileName || `photo.${fileType}`,
          type: `image/${fileType === "jpg" ? "jpeg" : fileType}`,
        } as any);
      } else {
        formData.append("imagem_url", imageUrl);
      }

      // 1. Atualiza os dados principais do produto
      await api.put(`/produtos/${produto.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 2. Salva as atualizações ou novas inserções do estoque de uma vez só
      for (const variacao of estoque) {
        const payloadEstoque = {
          tamanho: variacao.tamanho,
          cor: variacao.cor,
          quantidade: Number(variacao.quantidade) || 0,
          codigo_barras: variacao.codigo_barras || "",
        };

        const idVariacaoAtual = variacao.id_variacao || variacao.id;

        if (idVariacaoAtual) {
          // Rota PUT adicionada no backend para salvar tudo unificado
          await api.put(`/estoque/${idVariacaoAtual}`, payloadEstoque);
        } else {
          await api.post(
            `/estoque/adicionar-variacao?id_produto=${produto.id}`,
            payloadEstoque,
          );
        }
      }

      Alert.alert("Sucesso", "Produto atualizado com sucesso!");
      onUpdated?.();
      onClose();
    } catch (error: any) {
      console.log("Erro ao atualizar produto:", error.response?.data || error);
      Alert.alert("Erro", "Não foi possível atualizar o produto.");
    } finally {
      setSalvando(false);
    }
  }

  if (!produto) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={s.overlay}
      >
        <View style={s.modalContent}>
          <View style={s.dragIndicator} />

          <View style={s.header}>
            <Text style={s.headerTitle}>Editar Produto</Text>

            <TouchableOpacity onPress={onClose} style={s.closeButton}>
              <Ionicons name="close-circle" size={28} color={colors.pink} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.formScroll}
          >
            {/* DESIGN ORIGINAL: SEÇÃO DE IMAGEM LADO A LADO */}
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
                      width: "100%",
                      height: "100%",
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

            {/* DESIGN ORIGINAL: CAMPOS PRINCIPAIS */}
            <View style={s.inputGroup}>
              <Text style={s.label}>Nome da Peça</Text>
              <TextInput style={s.input} value={nome} onChangeText={setNome} />
            </View>

            <View style={s.inputGroup}>
              <Text style={s.label}>Descrição Detalhada</Text>
              <TextInput
                style={[s.input, s.textArea]}
                multiline
                value={descricao}
                onChangeText={setDescricao}
              />
            </View>

            <View style={s.row}>
              <View style={[s.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={s.label}>Preço (R$)</Text>
                <TextInput
                  style={s.input}
                  keyboardType="numeric"
                  value={preco}
                  onChangeText={setPreco}
                />
              </View>

              <View style={[s.inputGroup, { flex: 1 }]}>
                <Text style={s.label}>Estação / Coleção</Text>
                <TextInput
                  style={s.input}
                  value={estacao}
                  onChangeText={setEstacao}
                />
              </View>
            </View>

            <View style={s.inputGroup}>
              <Text style={s.label}>Categoria</Text>
              <TextInput
                style={s.input}
                value={categoria}
                onChangeText={setCategoria}
              />
            </View>

            {/* DESIGN ORIGINAL: CONTAINER DE TAGS */}
            <Text style={s.label}>Tags Relacionadas</Text>
            <View style={s.tagsContainer}>
              {tagsDisponiveis.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => handleTagPress(tag)}
                  style={[
                    s.tagItem,
                    selectedTags.includes(tag) && s.tagItemSelected,
                  ]}
                >
                  <Text
                    style={[
                      s.tagText,
                      selectedTags.includes(tag) && s.tagTextSelected,
                    ]}
                  >
                    #{tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* DESIGN ORIGINAL: CONTAINER DO GRUPO DE ESTOQUE */}
            <Text style={s.label}>Variações de Estoque</Text>

            {estoque.map((variacao, index) => {
              const existeNoBanco = !!(variacao.id_variacao || variacao.id);
              
              return (
                <View
                  key={index}
                  style={{
                    marginBottom: 16,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: "#E8E8E8",
                    borderRadius: 12,
                    backgroundColor: "#FFF",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Text style={{ fontWeight: "600" }}>
                      {existeNoBanco ? `Variação ${index + 1}` : `Nova Variação ${index + 1}`}
                    </Text>

                    <TouchableOpacity onPress={() => removerVariacao(index, variacao)}>
                      <Ionicons name={existeNoBanco ? "archive-outline" : "trash-outline"} size={20} color="#E57373" />
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={[s.input, { marginBottom: 8 }]}
                    placeholder="Cor"
                    value={variacao.cor}
                    onChangeText={(text) => atualizarVariacao(index, "cor", text)}
                  />

                  <TextInput
                    style={[s.input, { marginBottom: 8 }]}
                    placeholder="Tamanho"
                    value={variacao.tamanho}
                    onChangeText={(text) =>
                      atualizarVariacao(index, "tamanho", text)
                    }
                  />

                  <TextInput
                    style={[s.input, { marginBottom: 8 }]}
                    placeholder="Quantidade"
                    keyboardType="numeric"
                    value={String(variacao.quantidade)}
                    onChangeText={(text) =>
                      atualizarVariacao(index, "quantidade", text)
                    }
                  />

                  <TextInput
                    style={s.input}
                    placeholder="Código de barras"
                    value={variacao.codigo_barras ?? ""}
                    onChangeText={(text) =>
                      atualizarVariacao(index, "codigo_barras", text)
                    }
                  />
                </View>
              );
            })}

            <TouchableOpacity
              onPress={adicionarVariacao}
              style={{
                borderWidth: 1,
                borderColor: colors.pink,
                borderStyle: "dashed",
                borderRadius: 12,
                padding: 14,
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: colors.pink,
                  fontWeight: "600",
                }}
              >
                + Adicionar Nova Variação
              </Text>
            </TouchableOpacity>

            {/* DESIGN ORIGINAL: CÓDIGO DE BARRAS DA ETIQUETA E QR CODE */}
            <View style={s.inputGroup}>
              <Text style={s.label}>Código de Barras da Etiqueta</Text>

              <View style={{ flexDirection: "row" }}>
                <TextInput
                  style={[s.input, { flex: 1, marginRight: 10 }]}
                  value={codigoBarras}
                  onChangeText={setCodigoBarras}
                  placeholder="Aguardando bip..."
                />

                <TouchableOpacity
                  onPress={() => setScannerVisible(true)}
                  style={{
                    backgroundColor: colors.pink,
                    padding: 12,
                    borderRadius: 10,
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="barcode-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {codigoBarras ? (
              <View
                style={{
                  alignItems: "center",
                  marginVertical: 20,
                }}
              >
                <QRCode value={codigoBarras} size={150} />
                <Text style={{ marginTop: 10 }}>QR Code para etiqueta</Text>
              </View>
            ) : null}

            {/* DESIGN ORIGINAL: SUBMIT BUTTON */}
            <TouchableOpacity
              style={[s.submitButton, salvando && { opacity: 0.7 }]}
              onPress={handleSalvar}
              disabled={salvando}
            >
              <Text style={s.submitButtonText}>
                {salvando ? "Salvando..." : "Salvar Alterações"}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <ScannerModal
            visible={scannerVisible}
            onClose={() => setScannerVisible(false)}
            onCodeScanned={(data) => {
              setCodigoBarras(data);
              setScannerVisible(false);
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}