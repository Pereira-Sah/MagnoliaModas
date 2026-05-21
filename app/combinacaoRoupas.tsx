import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import api from "../src/services/api";

const { width } = Dimensions.get("window");

interface ItemCarrinho {
  id: string;
  nome: string;
  preco_base: number;
  imagem: string;
  categoria: string;
  quantidade: number;
  variacaoSelecionada: any;
  estoqueCompleto: any[];
}

export default function CombinacaoRoupas() {
  const params = useLocalSearchParams();
  const produtoInicialId = params?.produtoInicialId as string;

  const [produtosVitrine, setProdutosVitrine] = useState<any[]>([]);
  const [sugestoesML, setSugestoesML] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);

  const [produtosNoPedido, setProdutosNoPedido] = useState<ItemCarrinho[]>([]);

  const [produtoFocoId, setProdutoFocoId] = useState<string | null>(null);

  // Carrega a vitrine e adiciona o primeiro produto vindo do catálogo
  useEffect(() => {
    async function inicializarDados() {
      try {
        setCarregando(true);
        const response = await api.get("/produtos");
        const lista = response.data || [];
        setProdutosVitrine(lista);

        if (produtoInicialId) {
          const itemMatch = lista.find(
            (p: any) => String(p.id) === String(produtoInicialId),
          );
          if (itemMatch) {
            const novoItem: ItemCarrinho = {
              id: String(itemMatch.id),
              nome: itemMatch.nome,
              preco_base: itemMatch.preco_base,
              imagem: itemMatch.imagem,
              categoria: itemMatch.categoria,
              quantidade: 1,
              variacaoSelecionada:
                itemMatch.estoque && itemMatch.estoque.length > 0
                  ? itemMatch.estoque[0]
                  : null,
              estoqueCompleto: itemMatch.estoque || [],
            };
            setProdutosNoPedido([novoItem]);
            setProdutoFocoId(String(itemMatch.id));
            await buscarRecomendacoesML(String(itemMatch.id));
          }
        }
      } catch (error) {
        console.error("Erro ao inicializar:", error);
        Alert.alert(
          "Erro",
          "Não foi possível carregar a estrutura do provador.",
        );
      } finally {
        setCarregando(false);
      }
    }
    inicializarDados();
  }, [produtoInicialId]);

  // Busca recomendações na IA baseando-se no produto focado
  const buscarRecomendacoesML = async (id: string) => {
    try {
      setCarregandoSugestoes(true);
      const response = await api.get(`/ml/sugerir-look/${id}`);
      if (response.data && response.data.combinacoes) {
        setSugestoesML(response.data.combinacoes);
      }
    } catch (error) {
      console.error("Erro no ML:", error);
      setSugestoesML([]);
    } finally {
      setCarregandoSugestoes(false);
    }
  };

  const adicionarOuFocarProduto = async (produto: any) => {
    const produtoIdStr = String(produto.id);
    const jaExiste = produtosNoPedido.find(
      (item) => String(item.id) === produtoIdStr,
    );

    if (jaExiste) {
      // Se já está no topo, apenas foca nele para atualizar as sugestões do ML
      setProdutoFocoId(produtoIdStr);
      await buscarRecomendacoesML(produtoIdStr);
    } else {
      // Se é um produto novo, adiciona mantendo os anteriores intactos
      const novoItem: ItemCarrinho = {
        id: produtoIdStr,
        nome: produto.nome,
        preco_base: Number(produto.preco_base || produto.preco),
        imagem: produto.imagem,
        categoria: produto.categoria,
        quantidade: 1,
        variacaoSelecionada:
          produto.estoque && produto.estoque.length > 0
            ? produto.estoque[0]
            : null,
        estoqueCompleto: produto.estoque || [],
      };

      setProdutosNoPedido((prev) => [...prev, novoItem]);
      setProdutoFocoId(produtoIdStr);
      await buscarRecomendacoesML(produtoIdStr);
    }
  };

  // Remove um produto específico da lista do topo
  const removerProdutoDoTopo = (id: string) => {
    const idStr = String(id);
    const novaLista = produtosNoPedido.filter(
      (item) => String(item.id) !== idStr,
    );
    setProdutosNoPedido(novaLista);

    if (produtoFocoId === idStr) {
      if (novaLista.length > 0) {
        setProdutoFocoId(String(novaLista[0].id));
        buscarRecomendacoesML(String(novaLista[0].id));
      } else {
        setProdutoFocoId(null);
        setSugestoesML([]);
      }
    }
  };

  // Gerenciadores de Quantidade por Item
  const mudarQuantidade = (id: string, operacao: "somar" | "subtrair") => {
    const idStr = String(id);
    setProdutosNoPedido((prev) =>
      prev.map((item) => {
        if (String(item.id) === idStr) {
          let novaQtd = item.quantidade;
          if (operacao === "somar") {
            if (
              item.variacaoSelecionada &&
              novaQtd >= item.variacaoSelecionada.quantidade
            ) {
              Alert.alert("Limite", "Estoque máximo desta variação atingido.");
              return item;
            }
            novaQtd++;
          } else {
            if (novaQtd > 1) novaQtd--;
          }
          return { ...item, quantidade: novaQtd };
        }
        return item;
      }),
    );
  };

  // Altera a variação (Tamanho/Cor) de um item específico do topo
  const mudarVariacaoItem = (id: string, variacao: any) => {
    const idStr = String(id);
    setProdutosNoPedido((prev) =>
      prev.map((item) => {
        if (String(item.id) === idStr) {
          return { ...item, variacaoSelecionada: variacao, quantidade: 1 };
        }
        return item;
      }),
    );
  };

  // Calcula o valor somado de todas as peças
  const calcularTotalPedido = () => {
    return produtosNoPedido.reduce(
      (soma, item) => soma + item.preco_base * item.quantidade,
      0,
    );
  };

  const finalizarPedido = () => {
    if (produtosNoPedido.length === 0) {
      Alert.alert(
        "Sacola Vazia",
        "Adicione pelo menos um produto ao seu pedido.",
      );
      return;
    }
    console.log("Enviando lista completa de produtos:", produtosNoPedido);
    Alert.alert("Pedido Confirmado!", "Suas peças e combinações foram salvas.");
    router.push("/produtos");
  };

  const itemFocado = produtosNoPedido.find(
    (item) => String(item.id) === String(produtoFocoId),
  );

  if (carregando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#808000" />
        <Text style={styles.loadingText}>
          Atualizando provador integrado...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerNav}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Seu Pedido Inteligente 🌟</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* PRODUTOS ADICIONADOS NO TOPO */}
        <Text style={styles.sectionTitle}>
          Peças no seu Pedido ({produtosNoPedido.length}):
        </Text>
        {produtosNoPedido.length === 0 ? (
          <View style={styles.semProdutoCard}>
            <Ionicons name="cart-outline" size={32} color="#AAA" />
            <Text style={styles.semProdutoTexto}>
              Nenhum produto adicionado ainda.
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carrinhoScrollContainer}
          >
            {produtosNoPedido.map((item) => {
              const isFocado = String(item.id) === String(produtoFocoId);
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  style={[
                    styles.itemCarrinhoCard,
                    isFocado && styles.itemCarrinhoFocado,
                  ]}
                  onPress={() => {
                    setProdutoFocoId(String(item.id));
                    buscarRecomendacoesML(String(item.id));
                  }}
                >
                  <TouchableOpacity
                    style={styles.btnRemoverItem}
                    onPress={() => removerProdutoDoTopo(item.id)}
                  >
                    <Ionicons name="close-circle" size={22} color="#E57373" />
                  </TouchableOpacity>

                  <Image
                    source={{ uri: item.imagem }}
                    style={styles.itemCarrinhoImagem}
                  />
                  <Text style={styles.itemCarrinhoNome} numberOfLines={1}>
                    {item.nome}
                  </Text>
                  <Text style={styles.itemCarrinhoPreco}>
                    R$ {(item.preco_base * item.quantidade).toFixed(2)}
                  </Text>

                  <View style={styles.miniContador}>
                    <TouchableOpacity
                      style={styles.miniContadorBtn}
                      onPress={() => mudarQuantidade(item.id, "subtrair")}
                    >
                      <Ionicons name="remove" size={12} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.miniContadorTexto}>
                      {item.quantidade}
                    </Text>
                    <TouchableOpacity
                      style={styles.miniContadorBtn}
                      onPress={() => mudarQuantidade(item.id, "somar")}
                    >
                      <Ionicons name="add" size={12} color="#333" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* SELETOR DE VARIAÇÃO DO ITEM QUE ESTÁ SELECIONADO/FOCADO */}
        {itemFocado && (
          <View style={styles.variacaoContainer}>
            <Text style={styles.seletorTitulo}>
              Grade para{" "}
              <Text style={{ fontWeight: "700" }}>{itemFocado.nome}</Text>:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {itemFocado.estoqueCompleto?.map((grade: any, idx: number) => {
                const isSelected =
                  itemFocado.variacaoSelecionada?.cor === grade.cor &&
                  itemFocado.variacaoSelecionada?.tamanho === grade.tamanho;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.variacaoPill,
                      isSelected && styles.variacaoPillAtiva,
                    ]}
                    onPress={() => mudarVariacaoItem(itemFocado.id, grade)}
                  >
                    <Text
                      style={[
                        styles.variacaoTexto,
                        isSelected && styles.variacaoTextoAtiva,
                      ]}
                    >
                      {grade.cor} ({grade.tamanho})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* COMBINAÇÕES GERADAS PELA IA BASEADO NO ITEM FOCADO */}
        <View style={styles.sugestoesSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="sparkles" size={18} color="#808000" />
            {itemFocado
              ? `Combina com ${itemFocado.nome}`
              : "Sugestões de Combinação"}
          </Text>

          {carregandoSugestoes ? (
            <ActivityIndicator
              size="small"
              color="#808000"
              style={{ marginVertical: 20 }}
            />
          ) : !itemFocado ? (
            <Text style={styles.semSugestaoTexto}>
              Selecione ou adicione um produto acima para ver sugestões de
              looks.
            </Text>
          ) : { sugestoesML }.sugestoesML.length === 0 ? (
            <Text style={styles.semSugestaoTexto}>
              Nenhum par ideal listado para este item.
            </Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {sugestoesML.map((sugestao) => {
                const jaAdicionadoAoPedido = produtosNoPedido.some(
                  (p) => String(p.id) === String(sugestao.produto_id),
                );
                return (
                  <View key={sugestao.produto_id} style={styles.cardSugestao}>
                    <Image
                      source={{ uri: sugestao.imagem }}
                      style={styles.imagemSugestao}
                    />
                    <Text style={styles.nomeSugestao} numberOfLines={1}>
                      {sugestao.nome}
                    </Text>
                    <Text style={styles.precoSugestao}>
                      R$ {sugestao.preco?.toFixed(2)}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.btnAdicionarExtra,
                        jaAdicionadoAoPedido && styles.btnAdicionarExtraAtivo,
                      ]}
                      onPress={() => {
                        adicionarOuFocarProduto({
                          id: String(sugestao.produto_id),
                          nome: sugestao.nome,
                          preco_base: Number(sugestao.preco),
                          imagem: sugestao.imagem,
                          categoria: sugestao.categoria,
                          estoque: AppConfig.normalizarEstoque
                            ? sugestao.estoque || []
                            : sugestao.estoque || [],
                        });
                      }}
                    >
                      <Ionicons
                        name={jaAdicionadoAoPedido ? "checkmark-circle" : "add"}
                        size={14}
                        color={jaAdicionadoAoPedido ? "white" : "#808000"}
                      />
                      <Text
                        style={[
                          styles.btnExtraTexto,
                          jaAdicionadoAoPedido && styles.btnExtraTextoAtivo,
                        ]}
                      >
                        {jaAdicionadoAoPedido ? "Na Sacola" : "Adicionar"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* NAVEGAÇÃO PELAS OUTRAS ROUPAS */}
        <Text style={styles.sectionTitle}>
          Navegar por outras peças da loja:
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {produtosVitrine.map((prod) => {
            const noCarrinho = produtosNoPedido.some(
              (p) => String(p.id) === String(prod.id),
            );
            return (
              <TouchableOpacity
                key={prod.id}
                style={[
                  styles.cardVitrine,
                  noCarrinho && styles.cardVitrineAtivo,
                ]}
                onPress={() => adicionarOuFocarProduto(prod)}
              >
                <Image
                  source={{ uri: prod.imagem }}
                  style={styles.imagemVitrine}
                />
                <Text style={styles.nomeVitrine} numberOfLines={1}>
                  {prod.nome}
                </Text>
                <Text style={styles.categoriaVitrine}>
                  R$ {prod.preco_base}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </ScrollView>

      {/* CARD FIXO DE TOTAL INFERIOR */}
      <View style={styles.footerCheckout}>
        <View style={styles.checkoutPrecoContainer}>
          <Text style={styles.checkoutTotalLabel}>Total do seu Pedido:</Text>
          <Text style={styles.checkoutTotalPreco}>
            R$ {calcularTotalPedido().toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity style={styles.btnFinalizar} onPress={finalizarPedido}>
          <Text style={styles.btnFinalizarTexto}>Fechar Venda</Text>
          <Ionicons name="chevron-forward" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const AppConfig = { normalizarEstoque: true };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F5",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#666" },
  headerNav: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 12,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#2C2C2C" },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
  },
  carrinhoScrollContainer: { paddingVertical: 5, gap: 12 },
  itemCarrinhoCard: {
    width: width * 0.36,
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    alignItems: "center",
    position: "relative",
  },
  itemCarrinhoFocado: {
    borderColor: "#808000",
    backgroundColor: "#F9F9F2",
    borderWidth: 2,
  },
  itemCarrinhoImagem: {
    width: "100%",
    height: 110,
    borderRadius: 8,
    resizeMode: "cover",
  },
  itemCarrinhoNome: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginTop: 6,
    textAlign: "center",
  },
  itemCarrinhoPreco: {
    fontSize: 12,
    fontWeight: "700",
    color: "#808000",
    marginTop: 2,
  },
  btnRemoverItem: { position: "absolute", top: -4, right: -4, zIndex: 10 },
  miniContador: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F0",
    borderRadius: 12,
    padding: 2,
    marginTop: 6,
    width: "100%",
    justifyContent: "space-between",
  },
  miniContadorBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  miniContadorTexto: { fontSize: 11, fontWeight: "700" },
  variacaoContainer: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderColor: "#808000",
  },
  seletorTitulo: { fontSize: 12, color: "#555", marginBottom: 6 },
  variacaoPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "#F3F3F0",
    marginRight: 6,
  },
  variacaoPillAtiva: { backgroundColor: "#808000" },
  variacaoTexto: { fontSize: 11, color: "#666" },
  variacaoTextoAtiva: { color: "#FFF", fontWeight: "600" },
  semProdutoCard: {
    padding: 30,
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
  },
  semProdutoTexto: { color: "#999", fontSize: 12, marginTop: 6 },
  sugestoesSection: { marginVertical: 10 },
  semSugestaoTexto: { color: "#999", fontSize: 12, paddingLeft: 4 },
  cardSugestao: {
    width: 110,
    marginRight: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  imagemSugestao: {
    width: "100%",
    height: 100,
    borderRadius: 6,
    resizeMode: "cover",
  },
  nomeSugestao: { fontSize: 11, color: "#444", marginTop: 4 },
  precoSugestao: { fontSize: 11, color: "#808000", fontWeight: "700" },
  btnAdicionarExtra: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    marginTop: 6,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#808000",
  },
  btnAdicionarExtraAtivo: { backgroundColor: "#808000" },
  btnExtraTexto: { fontSize: 10, color: "#808000", fontWeight: "600" },
  btnExtraTextoAtivo: { color: "#FFF" },
  cardVitrine: {
    width: 105,
    marginRight: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  cardVitrineAtivo: { borderColor: "#808000", borderWidth: 1.5 },
  imagemVitrine: {
    width: "100%",
    height: 100,
    borderRadius: 6,
    resizeMode: "cover",
  },
  nomeVitrine: { fontSize: 11, fontWeight: "600", color: "#333", marginTop: 4 },
  categoriaVitrine: { fontSize: 11, color: "#808000", fontWeight: "600" },
  footerCheckout: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#EAEAEA",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkoutPrecoContainer: { flexDirection: "column" },
  checkoutTotalLabel: { fontSize: 11, color: "#666" },
  checkoutTotalPreco: { fontSize: 18, fontWeight: "bold", color: "#2C2C2C" },
  btnFinalizar: {
    backgroundColor: "#808000",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 4,
  },
  btnFinalizarTexto: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
});
