import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
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

const CACHE_KEY = "@magnolia:produtos";
import * as Print from "expo-print";

async function imprimirRelatorioEstoque() {
  try {
    const cacheLocal = await AsyncStorage.getItem(CACHE_KEY);

    if (!cacheLocal) {
      alert(
        "Nenhum produto encontrado no cache para imprimir. Carregue a lista primeiro.",
      );
      return;
    }

    const produtos = JSON.parse(cacheLocal);

    if (produtos.length === 0) {
      alert("A sua lista de produtos está vazia.");
      return;
    }

    const produtosOrdenados = [...produtos].sort((a, b) => {
      const nomeA = a.nome || "";
      const nomeB = b.nome || "";
      return nomeA.localeCompare(nomeB, "pt-BR", { sensitivity: "base" });
    });

    const linhasTabela = produtosOrdenados
      .map((p, index) => {
        const estoqueTexto =
          p.estoque && Array.isArray(p.estoque)
            ? p.estoque
                .map((e) => `${e.tamanho}: ${e.quantidade}un`)
                .join(" | ")
            : "Verificar no app";

        return `
        <tr style="background-color: ${index % 2 === 0 ? "#ffffff" : "#f9f9f9"};">
          <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">${p.nome}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #555;">${p.categoria || "Geral"}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">R$ ${Number(p.preco_base).toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 12px;">${estoqueTexto}</td>
        </tr>
      `;
      })
      .join("");

    const htmlDaImpressao = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #FFC0CB; padding-bottom: 10px; }
            .header h1 { margin: 0; color: #FFC0CB; font-size: 28px; }
            .header p { margin: 5px 0 0 0; color: #666; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #FFC0CB; color: white; padding: 12px; text-align: left; font-size: 14px; }
            .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Magnólia Modas</h1>
            <p>Relatório de Estoque para Feira — Gerado em ${new Date().toLocaleDateString("pt-BR")}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th style="width: 35%;">Produto</th>
                <th style="width: 20%;">Categoria</th>
                <th style="width: 15%; text-align: center;">Preço</th>
                <th style="width: 30%;">Grade de Estoque</th>
              </tr>
            </thead>
            <tbody>
              ${linhasTabela}
            </tbody>
          </table>

          <div class="footer">
            <p>Magnólia Modas App — Controle de Estoque Inteligente</p>
          </div>
        </body>
      </html>
    `;

    await Print.printAsync({
      html: htmlDaImpressao,
    });
  } catch (error) {
    console.error("Erro ao gerar impressão:", error);
    alert("Não foi possível abrir a tela de impressão.");
  }
}

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

  const categorias = ["Tudo", "Camisetas","Casacos", "Vestidos", "Calças", "Acessórios","Sapatos", "Outros"];

  async function carregarProdutos(forcarAtualizacao = false) {
  try {
    setCarregando(true)

    if (!forcarAtualizacao) {
      const cacheLocal = await AsyncStorage.getItem(CACHE_KEY)
      if (cacheLocal) {
        const produtosSalvos = JSON.parse(cacheLocal)
        setTodosProdutos(produtosSalvos)
        filtrarLocalmente(produtosSalvos, termoBusca, categoriaSelecionada)
        setCarregando(false)
        return
      }
    }

    await sincronizarComBackend()
  } catch (error) {
    console.error("Erro no fluxo de carregar produtos:", error)
  } finally {
    setCarregando(false)
  }
}

  async function sincronizarComBackend() {
    try {
      console.log(
        "Buscando lista mestre de produtos na API para atualizar cache...",
      );
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
        <View style={styles.logoWrapper}>
          <Image
            source={require("../assets/images/magnoliaModas_logo.png")} // Ajustado fallback de extensão se necessário
            style={styles.logo}
          />
        </View>
        <TouchableOpacity onPress={() => router.push("/listaVendas")}>
          <Text style={{ fontWeight: "600", color: colors.pink }}>
            Ver Vendas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/botaoImprimirEtiquetas")}
        >
          <Text style={{ color: "#666", marginTop: 4 }}>
            Imprimir Etiquetas
          </Text>
        </TouchableOpacity>
<TouchableOpacity onPress={imprimirRelatorioEstoque}>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
        >
          <Ionicons
            name="print-outline"
            size={16}
            color={colors.pink}
            style={{ marginRight: 4 }}
          />
          <Text style={{ color: "#666" }}>Imprimir para a Feira</Text>
        </View>
      </TouchableOpacity>
        {/* Barra de Pesquisa */}
        <View style={styles.searchSection}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar no estoque..."
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
<View style={styles.headerContainer}>

  <View style={styles.heroSection}>

    <View style={styles.heroBlob} />

    <View style={styles.heroTopRow}>

      <View>

        <Text style={styles.heroGreeting}>
          Olá, "usuario" ! 
        </Text>
      </View>

    </View>

  </View>

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

      {/* Botões Flutuantes */}
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
      
      {/* Modais */}
      <ProductModal
        visible={modalVisible}
        produto={produtoSelecionado}
        onClose={() => setModalVisible(false)}
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
