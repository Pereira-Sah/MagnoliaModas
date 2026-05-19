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

  useEffect(() => {
    if (!produto) return;

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

    const primeiroCodigo = produto.estoque?.[0]?.codigo_barras ?? "";

    setCodigoBarras(primeiroCodigo);
  }, [produto, visible]);

  function handleTagPress(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
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

      const payload = {
        nome,
        descricao,
        categoria,
        estacao,
        preco_base: parseFloat(preco.replace(",", ".")) || 0,
        tags: selectedTags,
        imagem: imageUrl,
      };

      await api.put(`/produtos/${produto.id}`, payload);

      alert("Produto atualizado com sucesso!");
      onUpdated?.();
      onClose();
    } catch (error: any) {
      console.log("Erro ao atualizar produto:", error.response?.data || error);
      alert("Não foi possível atualizar o produto.");
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
            {/* IMAGEM */}
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
