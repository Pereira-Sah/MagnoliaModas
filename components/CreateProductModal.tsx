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
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  createProductStyles as s,
  colors,
  fonts,
} from "../styles/createProductStyles";
import CameraModal from "./CameraModal";
import api from "../src/services/api";
import * as ImagePicker from "expo-image-picker";
import QRCode from "react-native-qrcode-svg";
import ScannerModal from "./ScannerModal";
import * as Print from "expo-print";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function CreateProductModal({ visible, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [codigoBarras, setCodigoBarras] = useState("");
  const [scannerVisible, setScannerVisible] = useState(false);
  const tags = ["floral", "festa", "casual", "alfaiataria", "linho"];
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [estacao, setEstacao] = useState("");
  const [categoria, setCategoria] = useState("");
const [variacoes, setVariacoes] = useState([
  {
    tamanho: "U",
    cor: "N/A",
    quantidade: "1",
    codigo_barras: "",
  },
]);
const [scannerVariacaoIndex, setScannerVariacaoIndex] =
  useState<number | null>(null);

function adicionarVariacao() {
  setVariacoes((prev) => [
    ...prev,
    {
      tamanho: "",
      cor: "",
      quantidade: "1",
      codigo_barras: "",
    },
  ]);
}

function removerVariacao(index: number) {
    setVariacoes((prev) => prev.filter((_, i) => i !== index));
  }

  function atualizarVariacao(
    index: number,
    campo: "tamanho" | "cor" | "quantidade" | "codigo_barras",
    valor: string,
  ) {
    setVariacoes((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [campo]: valor } : item)),
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
    setStep(2);
  }

  async function IAProductModal(uri: string) {
    try {
      const formData = new FormData();
      formData.append("imagem", {
        uri,
        name: "produto.jpg",
        type: "image/jpeg",
      } as any);

      const response = await api.post("/ml/sugerir-dados-produto", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });

      const bundles = response.data.sugestao;
      setNome(bundles.nome ?? "");
      setDescricao(bundles.descricao ?? "");
      setPreco(bundles.preco_base != null ? String(bundles.preco_base) : "");
      setEstacao(bundles.estacao ?? "");
      setCategoria(bundles.categoria ?? "");
      setImageUrl(bundles.imagem ?? "");
      setStep(2);
    } catch (error: any) {
      console.log(
        "Erro ao processar imagem com IA:",
        error.response?.data || error,
      );
      alert("Não foi possível analisar a imagem.");
    }
  }

  async function handlePhotoCaptured(uri: string) {
    setImageUrl(uri);

    await IAProductModal(uri);

    setCameraVisible(false);
  }

  const handleTagPress = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const [cameraVisible, setCameraVisible] = useState(false);

  async function openCamera() {
    setCameraVisible(true);
  }

  const handleClose = () => {
    setStep(1);
    setImageUrl("");
    setNome("");
    setDescricao("");
    setPreco("");
    setEstacao("");
    setCategoria("");
    setSelectedTags([]);
    setVariacoes([
      { tamanho: "U", cor: "N/A", quantidade: "1", codigo_barras: "" },
    ]);
    onClose();
  };

  async function puxarEImprimirEtiqueta(idProdutoCriado: string) {
    try {
      const response = await api.get(
        `/produtos/gerar-etiquetas-html?id_produto=${idProdutoCriado}`,
      );
      const htmlString = response.data;

      await Print.printAsync({ html: htmlString });
    } catch (e) {
      console.log("Erro na impressão:", e);
      Alert.alert(
        "Erro na Impressão",
        "O produto foi salvo, mas não conseguimos gerar o arquivo de impressão.",
      );
    }
  }

  async function handleCadastrar() {
    if (!nome.trim()) {
      alert("Informe o nome do produto.");
      return;
    }

    setSalvando(true);

    const formData = new FormData();
    formData.append("nome", nome.trim());
    formData.append("descricao", descricao.trim());
    formData.append("categoria", categoria.trim());
    formData.append("estacao", estacao.trim());

    const precoFormatado = preco.replace(",", ".").trim();
    formData.append("preco_base", precoFormatado !== "" ? precoFormatado : "0");
    formData.append("tags", JSON.stringify(selectedTags));

    const estoqueInicial = variacoes.map((item) => ({
      tamanho: item.tamanho.trim() || "U",
      cor: item.cor.trim() || "N/A",
      quantidade: parseInt(item.quantidade || "0", 10),
      codigo_barras: item.codigo_barras.trim() || null,
    }));
    formData.append("estoque_inicial", JSON.stringify(estoqueInicial));

    if (imageUrl && imageUrl.startsWith("file://")) {
      formData.append("imagem", {
        uri: imageUrl,
        name: "produto.jpg",
        type: "image/jpeg",
      } as any);
    } else if (imageUrl && imageUrl.startsWith("http")) {
      formData.append("imagem_url", imageUrl);
    }

    try {
      const response = await api.post("/produtos/adicionar-produto", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const idProdutoCriado = response.data?.id || response.data?.id_produto;

      setSalvando(false);

      Alert.alert(
        "Sucesso!",
        "Produto cadastrado com sucesso. Deseja imprimir as etiquetas de código de barras agora?",
        [
          {
            text: "Não, fechar",
            onPress: () => handleClose(),
            style: "cancel",
          },
          {
            text: "Sim, Imprimir",
            onPress: async () => {
              if (idProdutoCriado) {
                await puxarEImprimirEtiqueta(idProdutoCriado);
              } else {
                Alert.alert(
                  "Aviso",
                  "ID do produto não retornado. Use a listagem geral para imprimir.",
                );
              }
              handleClose();
            },
          },
        ],
        { cancelable: false },
      );
    } catch (error: any) {
      setSalvando(false);
      console.log(
        "Erro ao salvar produto:",
        error.response?.data || error.message,
      );
      alert(
        error.response?.data?.detail
          ? `Erro: ${JSON.stringify(error.response.data.detail)}`
          : "Não foi possível salvar o produto.",
      );
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={s.overlay}
      >
        <View style={s.modalContent}>
          <View style={s.dragIndicator} />

          <View style={s.header}>
            <Text style={s.headerTitle}>
              {step === 1 ? "Novo Produto" : "Detalhes do Produto"}
            </Text>
            <TouchableOpacity onPress={handleClose} style={s.closeButton}>
              <Ionicons name="close-circle" size={28} color={colors.pink} />
            </TouchableOpacity>
          </View>

          {step === 1 ? (
            <View style={{ paddingBottom: 20 }}>
              <Text style={s.instructionText}>
                Como deseja cadastrar seu produto?
              </Text>

              <TouchableOpacity style={s.optionCard} onPress={() => setStep(2)}>
                <View style={[s.iconBg, { backgroundColor: "#F0F7F0" }]}>
                  <Ionicons
                    name="document-text-outline"
                    size={26}
                    color={colors.green}
                  />
                </View>
                <View style={s.optionInfo}>
                  <Text style={s.optionTitle}>Entrada Manual</Text>
                  <Text style={s.optionDesc}>
                    Você preenche todos os campos do seu jeito.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.optionCard]}
                onPress={() => openCamera()}
              >
                <View style={[s.iconBg, { backgroundColor: "#FFF0F0" }]}>
                  <Ionicons
                    name="sparkles-outline"
                    size={26}
                    color={colors.pink}
                  />
                </View>
                <View style={s.optionInfo}>
                  <Text style={s.optionTitle}>Assistente IA</Text>
                  <Text style={s.optionDesc}>
                    Tire uma foto e nós preenchemos para você.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={s.formScroll}
            >
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
                <TextInput
                  style={s.input}
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Ex: Vestido Midi Seda"
                />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.label}>Descrição Detalhada</Text>
                <TextInput
                  style={[s.input, s.textArea]}
                  multiline
                  value={descricao}
                  onChangeText={setDescricao}
                  placeholder="Conte mais sobre o produto..."
                />
              </View>

              <View style={s.row}>
                <View style={[s.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={s.label}>Preço (R$)</Text>
                  <TextInput
                    style={s.input}
                    keyboardType="numeric"
                    placeholder="0,00"
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
                    placeholder="Verão 2026"
                  />
                </View>
              </View>

              <View style={s.inputGroup}>
                <Text style={s.label}>Categoria</Text>
                <TextInput
                  style={s.input}
                  value={categoria}
                  onChangeText={setCategoria}
                  placeholder="Ex: Vestidos, Acessórios..."
                />
              </View>

              <Text style={s.label}>Tags Relacionadas</Text>
              <View style={s.tagsContainer}>
                {tags.map((tag) => (
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

              <Text style={s.label}>Variações do Produto</Text>

              {variacoes.map((variacao, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: 20,
                    padding: 15,
                    borderWidth: 1,
                    borderColor: "#E5E5E5",
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
                    <Text
                      style={{
                        fontWeight: "600",
                        fontSize: 16,
                        color: colors.pink,
                      }}
                    >
                      Variação {index + 1}
                    </Text>
                    {variacoes.length > 1 && (
                      <TouchableOpacity onPress={() => removerVariacao(index)}>
                        <Ionicons name="trash-outline" size={22} color="red" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={s.row}>
                    <View style={[s.inputGroup, { flex: 1, marginRight: 10 }]}>
                      <Text style={s.label}>Tamanho</Text>
                      <TextInput
                        style={s.input}
                        value={variacao.tamanho}
                        onChangeText={(text) =>
                          atualizarVariacao(index, "tamanho", text)
                        }
                        placeholder="P, M, G, U"
                      />
                    </View>
                    <View style={[s.inputGroup, { flex: 1 }]}>
                      <Text style={s.label}>Cor</Text>
                      <TextInput
                        style={s.input}
                        value={variacao.cor}
                        onChangeText={(text) =>
                          atualizarVariacao(index, "cor", text)
                        }
                        placeholder="Rosa"
                      />
                    </View>
                  </View>

                  <View style={s.inputGroup}>
                    <Text style={s.label}>Quantidade</Text>
                    <TextInput
                      style={s.input}
                      keyboardType="numeric"
                      value={variacao.quantidade}
                      onChangeText={(text) =>
                        atualizarVariacao(index, "quantidade", text)
                      }
                      placeholder="1"
                    />
                  </View>

                  <View style={s.inputGroup}>
                    <Text style={s.label}>Código de Barras</Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TextInput
                        style={[s.input, { flex: 1, marginRight: 10 }]}
                        value={variacao.codigo_barras}
                        onChangeText={(text) =>
                          atualizarVariacao(index, "codigo_barras", text)
                        }
                        placeholder="7891234567890"
                      />
                      <TouchableOpacity
                        onPress={() => {
                          setScannerVariacaoIndex(index);
                          setScannerVisible(true);
                        }}
                        style={{
                          backgroundColor: colors.pink,
                          padding: 12,
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons
                          name="barcode-outline"
                          size={24}
                          color="white"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {variacao.codigo_barras ? (
                    <View style={{ alignItems: "center", marginTop: 10 }}>
                      <QRCode value={variacao.codigo_barras} size={120} />
                    </View>
                  ) : null}
                </View>
              ))}

              <TouchableOpacity
                onPress={adicionarVariacao}
                style={{
                  backgroundColor: colors.green,
                  padding: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Text style={{ color: "#FFF", fontWeight: "600" }}>
                  + Adicionar Variação
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  s.submitButton,
                  salvando && { backgroundColor: "#ccc" },
                ]}
                onPress={handleCadastrar}
                disabled={salvando}
              >
                {salvando ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={s.submitButtonText}>Cadastrar Produto</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          )}

          <CameraModal
            visible={cameraVisible}
            onClose={() => setCameraVisible(false)}
            onPhotoCaptured={handlePhotoCaptured}
          />

          <ScannerModal
            visible={scannerVisible}
            onClose={() => {
              setScannerVisible(false);
              setScannerVariacaoIndex(null);
            }}
            onCodeScanned={(data) => {
              if (scannerVariacaoIndex !== null) {
                atualizarVariacao(scannerVariacaoIndex, "codigo_barras", data);
              }
              setScannerVisible(false);
              setScannerVariacaoIndex(null);
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
