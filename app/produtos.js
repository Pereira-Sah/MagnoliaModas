import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../src/services/api";
import { styles, colors } from "../styles/produtosStyles";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import CreateProductModal from "../components/CreateProductModal";
import TabBar from "../components/TabBar";
import { router } from "expo-router";
import ScannerModal from "../components/ScannerModal";
import CreateSaleModal from "../components/CreateSaleModal";

export default function Produtos() {
  const [listaProdutos, setListaProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [scannerBuscaVisible, setScannerBuscaVisible] = useState(false);
  const [saleModalVisible, setSaleModalVisible] = useState(false);

  const [termoBusca, setTermoBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Tudo");

  const categorias = ["Tudo", "Camisetas", "Vestidos", "Calças", "Acessórios"];

  async function carregarProdutos() {
    try {
      let url = "/produtos/filtrar";
      const params = new URLSearchParams();

      if (termoBusca.trim() !== "") {
        params.append("nome", termoBusca.trim());
      }

      if (categoriaSelecionada !== "Tudo") {
        params.append("categoria", categoriaSelecionada);
      }

      const queryString = params.toString();

      if (!queryString) {
        url = "/produtos/";
      } else {
        url = `${url}?${queryString}`;
      }

      console.log("Buscando produtos em:", url);

      const response = await api.get(url);
      setListaProdutos(response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, [termoBusca, categoriaSelecionada]);

  const handleScanSearch = async (codigo) => {
    try {
      const response = await api.get(`/produtos/buscar-por-codigo/${codigo}`);
      setProdutoSelecionado(response.data);
      setModalVisible(true);
    } catch (error) {
      alert("Produto não encontrado no estoque.");
    }
  };

  const abrirModal = (item) => {
    setProdutoSelecionado(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.logoWrapper}>
          <Image
            source={require("../assets/images/magnoliaModas_logo.svg")}
            style={styles.logo}
          />
        </View>
        <TouchableOpacity onPress={() => router.push("/listaVendas")}>
          <Text>Ver Vendas</Text>
        </TouchableOpacity>
        <View style={styles.searchSection}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar..."
            placeholderTextColor="#999"
            value={termoBusca}
            onChangeText={setTermoBusca}
          />

          <TouchableOpacity onPress={() => setScannerBuscaVisible(true)}>
            <Ionicons
              name="barcode-outline"
              size={24}
              color={colors.pink}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {categorias.map((tipo) => (
            <TouchableOpacity
              key={tipo}
              onPress={() => setCategoriaSelecionada(tipo)}
              style={[
                styles.filterPill,
                categoriaSelecionada === tipo && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  categoriaSelecionada === tipo && styles.filterPillTextActive,
                ]}
              >
                {tipo}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={listaProdutos}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ProductCard item={item} onPress={abrirModal} />
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setCreateModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color={colors.white} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.fab, { bottom: 200, backgroundColor: colors.green }]}
        onPress={() => setSaleModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="cart-outline" size={28} color="white" />
      </TouchableOpacity>

      <ProductModal
        visible={modalVisible}
        produto={produtoSelecionado}
        onClose={() => setModalVisible(false)}
      />

      <CreateProductModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />

      <TabBar />

      <ScannerModal
        visible={scannerBuscaVisible}
        onClose={() => setScannerBuscaVisible(false)}
        onCodeScanned={(data) => {
          setScannerBuscaVisible(false);
          handleScanSearch(data);
        }}
      />

      <CreateSaleModal
        visible={saleModalVisible}
        onClose={() => setSaleModalVisible(false)}
        onSuccess={async () => {
          setSaleModalVisible(false);
          carregarProdutos();
        }}
      />
    </View>
  );
}
