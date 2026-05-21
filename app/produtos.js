import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/services/api";
import { styles, colors } from "../styles/produtosStyles";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import CreateProductModal from "../components/CreateProductModal";
import TabBar from "../components/TabBar";
import { router } from "expo-router";
import ScannerModal from "../components/ScannerModal";
import CreateSaleModal from "../components/CreateSaleModal";
// import * as Print from "expo-print";

const CACHE_KEY = "@magnolia:produtos";

export default function Produtos() {
  const [todosProdutos, setTodosProdutos] = useState([]);
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [scannerBuscaVisible, setScannerBuscaVisible] = useState(false);
  const [saleModalVisible, setSaleModalVisible] = useState(false);

  const [termoBusca, setTermoBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Tudo");

  const categorias = [
    "Tudo",
    "Camisetas",
    "Casacos",
    "Vestidos",
    "Calças",
    "Acessórios",
    "Sapatos",
    "Outros",
  ];
  const [nome, setNome] = useState("Usuária");

  const [isCliente, setIsCliente] = useState(false);


  useEffect(() => {
    const obterDadosUsuario = async () => {
      let nomeSalvo;
      let roleSalva;

      if (Platform.OS === "web") {
        nomeSalvo = localStorage.getItem("userName");
        roleSalva = localStorage.getItem("userRole");
      } else {
        nomeSalvo = await SecureStore.getItemAsync("userName");
        roleSalva = await SecureStore.getItemAsync("userRole");
      }

      if (nomeSalvo) setNome(nomeSalvo);
      if (roleSalva === "cliente") {
        setIsCliente(true);
      }
    };

    obterDadosUsuario();
  }, []);

  async function carregarProdutos(forcarAtualizacao = false) {
    try {
      setCarregando(true);
      if (!forcarAtualizacao) {
        const cacheLocal = await AsyncStorage.getItem(CACHE_KEY);
        if (cacheLocal) {
          const produtosSalvos = JSON.parse(cacheLocal);
          setTodosProdutos(produtosSalvos);
          filtrarLocalmente(produtosSalvos, termoBusca, categoriaSelecionada);
          setCarregando(false);
          return;
        }
      }
      await sincronizarComBackend();
    } catch (error) {
      console.error("Erro no fluxo de carregar produtos:", error);
    } finally {
      setCarregando(false);
    }
  }

  async function sincronizarComBackend() {
    try {
      const response = await api.get("/produtos/");
      if (Array.isArray(response.data)) {
        setTodosProdutos(response.data);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
        filtrarLocalmente(response.data, termoBusca, categoriaSelecionada);
      }
    } catch (e) {
      console.error("Erro ao sincronizar com backend, mantendo local.", e);
    }
  }

  function filtrarLocalmente(produtos, busca, categoria) {
    let resultado = [...produtos];
    if (busca.trim() !== "") {
      const termo = busca.toLowerCase().trim();
      resultado = resultado.filter((p) => p.nome.toLowerCase().includes(termo));
    }
    if (categoria !== "Tudo") {
      resultado = resultado.filter((p) => p.categoria === categoria);
    }
    setListaFiltrada(resultado);
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  useEffect(() => {
    filtrarLocalmente(todosProdutos, termoBusca, categoriaSelecionada);
  }, [termoBusca, categoriaSelecionada, todosProdutos]);

  const handleScanSearch = async (codigo) => {
    try {
      const response = await api.get(`/produtos/buscar-por-codigo/${codigo}`);
      setProdutoSelecionado(response.data);
      setModalVisible(true);
    } catch (error) {
      alert("Produto não encontrado na sincronização direta.");
    }
  };

  const abrirModal = (item) => {
    setProdutoSelecionado(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>

      <View style={styles.headerContainer}>

          <View style={styles.heroSection}>
            
            <View style={styles.heroBlob} />
            <View style={styles.heroBlob2} />

          <View style={styles.heroTopRow}>

            <View>
              <Text style={styles.heroGreeting}>
                Olá, {nome}!
              </Text>

              <Text style={styles.heroSubtitle}>
               Controle total das peças
              </Text>
            </View>

            <View style={styles.heroIconContainer}>
              <Ionicons
                name="shirt-outline"
                size={24}
                color='white'
              />
            </View>

          </View>
          </View>
        

        

        <View style={styles.searchSection}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={
              isCliente ? "Procurar aquele look..." : "Pesquisar no estoque..."
            }
            placeholderTextColor="#999"
            value={termoBusca}
            onChangeText={setTermoBusca}
          />
          <TouchableOpacity onPress={() => setScannerBuscaVisible(true)}>
            <Ionicons
              name="barcode-outline"
              size={24}
              color={colors.dustypink}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        </View>

        {/* Carrossel de Categorias */}
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

      {carregando && listaFiltrada.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.pink} />
        </View>
      ) : (
        <FlatList
          data={listaFiltrada}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProductCard item={item} onPress={abrirModal} />
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: "#999", marginTop: 40 }}>
              Nenhum produto encontrado nesta seção.
            </Text>
          }
        />
      )}

      {/* BOTOES FLUTUANTES PROTEGIDOS: Ocultos para o Cliente */}
      {!isCliente && (
        <>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setCreateModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.fab,
              { bottom: 230, backgroundColor: colors.Lightolivegreen },
            ]}
            onPress={() => setSaleModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="cart-outline" size={30} color="white" />
          </TouchableOpacity>
        </>
      )}

      <ProductModal
        visible={modalVisible}
        produto={produtoSelecionado}
        isCliente={isCliente}
        onClose={() => setModalVisible(false)}
        onAdicionarAoLook={(prod) => {
          setModalVisible(false);

          router.push({
            pathname: "/combinacaoRoupas",
            params: { produtoInicialId: prod.id },
          });
        }}
      />

      <CreateProductModal
        visible={createModalVisible}
        onClose={() => {
          setCreateModalVisible(false);
          carregarProdutos(true);
        }}
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
          carregarProdutos(true);
        }}
      />
    </View>
  );
}
