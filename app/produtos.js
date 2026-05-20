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

  const [isSearching, setIsSearching] = useState(false);
  const [scannerBuscaVisible, setScannerBuscaVisible] = useState(false);
  const [saleModalVisible, setSaleModalVisible] = useState(false);
  const handleScanSearch = async (codigo) => {
    try {
      setIsSearching(true);
      const response = await api.get(`/produtos/buscar-por-codigo/${codigo}`);

      setProdutoSelecionado(response.data);
      setModalVisible(true);
    } catch (error) {
      alert("Produto não encontrado no estoque.");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await api.get("produtos/");
        setListaProdutos(response.data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };
    carregarProdutos();
  }, []);

  const abrirModal = (item) => {
    setProdutoSelecionado(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
<View style={styles.headerContainer}>

  <View style={styles.heroSection}>

    <View style={styles.heroBlob} />

    <View style={styles.heroTopRow}>

      <View>

        <Text style={styles.heroGreeting}>
          Olá, "usuario" ! 
        </Text>
      </View>
{/* 
      <View style={styles.logoCircle}>
        <Image
          source={require('../assets/images/logo_fundo.png')}
          style={styles.logo}
        />
      </View> */}

    </View>

  </View>

  {/* SEARCH */}
  <View style={styles.searchSection}>

    <Ionicons
      name="search-outline"
      size={20}
      color="#8E8E8E"
      style={styles.searchIcon}
    />

    <TextInput
      style={styles.searchInput}
      placeholder="Pesquisar peças..."
      placeholderTextColor="#999"
    />

    <TouchableOpacity
      onPress={() => setScannerBuscaVisible(true)}
    >
      <Ionicons
        name="barcode-outline"
        size={24}
        color={colors.dustypink}
      />
    </TouchableOpacity>

  </View>

  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.filterScroll}
  >

    {["Tudo", "Vestidos", "Blusas", "Calças", "Acessórios"].map(
      (tipo, index) => (
        <TouchableOpacity
          key={tipo}
          style={[
            styles.filterPill,
            index === 0 && styles.filterPillActive,
          ]}
        >

          <Text
            style={[
              styles.filterPillText,
              index === 0 &&
                styles.filterPillTextActive,
            ]}
          >
            {tipo}
          </Text>

        </TouchableOpacity>
      ),
    )}

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
        <Ionicons name="add" size={30} color='white' />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.fab, { bottom: 230, backgroundColor: colors.Lightolivegreen }]}
        onPress={() => setSaleModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="cart-outline" size={30} color="white" />
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

          try {
            const response = await api.get("/produtos/");
            setListaProdutos(response.data);
          } catch (error) {
            console.log("Erro ao recarregar produtos:", error);
          }
        }}
      />
    </View>
  );
}
