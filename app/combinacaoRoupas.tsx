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
    Modal,
    TextInput,
    Animated,
  } from "react-native";
  import { Ionicons } from "@expo/vector-icons";
  import { useLocalSearchParams, router } from "expo-router";
  import api from "../src/services/api";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import TabBar from "../components/TabBar";
  import * as SecureStore from "expo-secure-store";
  import QRCode from "react-native-qrcode-svg";
  const { width } = Dimensions.get("window");

  const colors = {
    dustypink: '#DFA3B2',
    Lightolivegreen: '#B8C4A5',
    Warmbeigebackground: '#F3E7DD',
  };

  interface ItemCarrinho {
    id: string;
    nome: string;
    preco_base: number;
    imagem: string;
    categoria: string;
    quantidade: number;
    variacaoSelecionada: any;
    estoqueCompleto: any[];
    codigo_barras?: string; 
    id_item_estoque?: string; 
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

    const [modalCheckoutVisible, setModalCheckoutVisible] = useState(false);
    const [localRetirada, setLocalRetirada] = useState("");
    const [formaPagamento, setFormaPagamento] = useState("");
    const [mostrarPix, setMostrarPix] = useState(false);
    const [dadosCartao, setDadosCartao] = useState({
      nome: "",
      numero: "",
      validade: "",
      cvv: "",
    });
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [simulandoPagamento, setSimulandoPagamento] = useState(false);
    const [pagamentoConcluido, setPagamentoConcluido] = useState(false);
    const scaleAnim = useState(new Animated.Value(0))[0];
    
    useEffect(() => {
      async function inicializarDados() {
        try {
          setCarregando(true);
          const nome = await SecureStore.getItemAsync("userName")||"nome";
          setNomeUsuario(nome);

          const response = await api.get("/produtos");
          const lista = response.data || [];
          setProdutosVitrine(lista);

          if (produtoInicialId) {
            const itemMatch = lista.find(
              (p: any) => String(p.id) === String(produtoInicialId),
            );
            if (itemMatch) {
              const primeiraVariacao =
                itemMatch.estoque && itemMatch.estoque.length > 0
                  ? itemMatch.estoque[0]
                  : null;

              const novoItem: ItemCarrinho = {
                id: String(itemMatch.id),
                nome: itemMatch.nome,
                preco_base: itemMatch.preco_base,
                imagem: itemMatch.imagem,
                categoria: itemMatch.categoria,
                quantidade: 1,
                variacaoSelecionada: primeiraVariacao,
                estoqueCompleto: itemMatch.estoque || [],
                id_item_estoque: primeiraVariacao?.id_variacao || undefined,
                codigo_barras: primeiraVariacao?.codigo_barras || undefined,
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
      const produtoIdStr = String(produto.id || produto.produto_id);

      const produtoRealVitrine = produtosVitrine.find(
        (p) => String(p.id) === produtoIdStr,
      );

      const estoqueConfiavel =
        produtoRealVitrine?.estoque && produtoRealVitrine.estoque.length > 0
          ? produtoRealVitrine.estoque
          : produto.estoque || [];

      const jaExiste = produtosNoPedido.some((item) => String(item.id) === produtoIdStr);

      if (jaExiste) {
        setProdutoFocoId(produtoIdStr);
        await buscarRecomendacoesML(produtoIdStr);
      } else {
        const variacaoValida =
          estoqueConfiavel.find((e: any) => e.id_variacao) ||
          estoqueConfiavel[0] ||
          null;

        const novoItem: ItemCarrinho = {
          id: produtoIdStr,
          nome: produtoRealVitrine?.nome || produto.nome,
          preco_base: Number(
            produtoRealVitrine?.preco_base || produto.preco_base || produto.preco,
          ),
          imagem: produtoRealVitrine?.imagem || produto.imagem,
          categoria:
            produtoRealVitrine?.categoria || produto.categoria || "Geral",
          quantidade: 1,
          variacaoSelecionada: variacaoValida,
          estoqueCompleto: estoqueConfiavel,
          id_item_estoque: variacaoValida?.id_variacao || undefined,
          codigo_barras:
            variacaoValida?.codigo_barras || produto.codigo_barras || undefined,
        };

        setProdutosNoPedido((prev) => [...prev, novoItem]);
        setProdutoFocoId(produtoIdStr);
        await buscarRecomendacoesML(produtoIdStr);
      }
    };

    const jaAdicionadoAoPedido = (idStr: string) => {
      return produtosNoPedido.some((item) => String(item.id) === idStr);
    };

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
            return { ...item, quantity: novaQtd, quantidade: novaQtd };
          }
          return item;
        }),
      );
    };

    const mudarVariacaoItem = (id: string, variacao: any) => {
      const idStr = String(id);
      setProdutosNoPedido((prev) =>
        prev.map((item) => {
          if (String(item.id) === idStr) {
            return {
              ...item,
              variacaoSelecionada: variacao,
              quantidade: 1,
              codigo_barras: variacao?.codigo_barras || item.codigo_barras,
            };
          }
          return item;
        }),
      );
    };

    const calcularTotalPedido = () => {
      return produtosNoPedido.reduce(
        (soma, item) => soma + item.preco_base * item.quantidade,
        0,
      );
    };

const simularPagamentoPix = async () => {
  setSimulandoPagamento(true);

  setTimeout(async () => {
    setSimulandoPagamento(false);
    setPagamentoConcluido(true);

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    await finalizarPedidoLookSugerido();

    setTimeout(() => {
      setModalCheckoutVisible(false);

      router.push("/MeusPedidos");
    }, 2500);

  }, 15000);
};


  const finalizarPedidoLookSugerido = async () => {
    if (!localRetirada) {
      Alert.alert("Selecione um endereço de retirada");
      return;
    }

    if (!formaPagamento) {
      Alert.alert("Selecione uma forma de pagamento");
      return;
    }

    try {
      setCarregando(true);

      const itensFormatados = await Promise.all(
        produtosNoPedido.map(async (item) => {
          let idItemEstoqueReal =
            item.variacaoSelecionada?.id_variacao ||
            item.id_item_estoque;

          return {
            id_item_estoque: String(idItemEstoqueReal),
            quantidade: item.quantidade || 1,
            preco_unitario_venda: Number(item.preco_base) || 0,
            categoria: item.categoria || "Geral",
          };
        }),
      );

      const token = await AsyncStorage.getItem("token");

      const payloadVenda = {
        meio_venda: "Aplicativo",
        status_venda: "Pendente",
        nome_comprador: nomeUsuario,
        telefone_comprador: "",
        dados_pagamento: formaPagamento,
        local_retirada: localRetirada,
        itens: itensFormatados,
      };

      const response = await api.post("/vendas", payloadVenda, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        setModalCheckoutVisible(false);

        console.log("Pedido criado com sucesso");
      }
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Erro ao finalizar pedido",
      );
    } finally {
      setCarregando(false);
    }
  };

    const itemFocado = produtosNoPedido.find(
      (item) => String(item.id) === String(produtoFocoId),
    );

    if (carregando) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.dustypink} />
          <Text style={styles.loadingText}>Atualizando provador integrado...</Text>
        </View>
      );
    }

    const enderecosRetirada = [
    {
      id: 1,
      titulo: "Feira de Sexta",
      endereco:
        "Av. Nove de Julho - Jardim Praia Grande, Mongaguá - SP, 11730-000",
      icon: "storefront-outline",
    },
    {
      id: 2,
      titulo: "Feira de Domingo",
      endereco:
        "R. Caraguatatuba, 596 - Balneario Regina Maria, Mongaguá - SP, 11730-000",
      icon: "calendar-outline",
    },
    {
      id: 3,
      titulo: "Feira de Quarta",
      endereco:
        "R. Etelvina Simões Salomão, 119 - Balneario Umurama, Mongaguá - SP, 11730-000",
      icon: "location-outline",
    },
    {
      id: 4,
      titulo: "Feira de Sábado",
      endereco:
        "R. Pôrto Alegre, 15 - Centro, Mongaguá - SP, 11730-000",
      icon: "business-outline",
    },
  ];

    return (
      <View style={styles.container}>
        {/* HEADER INTEGRADO */}
        <View style={styles.heroSection}>
          <View style={styles.heroBlob} />
          <View style={styles.heroBlob2} />

          <View style={styles.heroTopRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.btnVoltar}>
              <Ionicons name="arrow-back" size={24} color="#7D7D7D" />
            </TouchableOpacity>
            
            <View style={styles.headerTextGroup}>
              <Text style={styles.heroGreeting}>Pedido Inteligente</Text>
              <Text style={styles.heroSubtitle}>Provador integrado e combinações</Text>
            </View>

            <View style={styles.heroIconContainer}>
              <Ionicons name="shirt-outline" size={24} color="white" />
            </View>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 16 }}
        >
          <Text style={styles.sectionTitle}>
            Peças no seu Pedido ({produtosNoPedido.length}):
          </Text>
          
          {/* CARDS DO PEDIDO */}
          {produtosNoPedido.length === 0 ? (
            <View style={styles.semProdutoCard}>
              <Ionicons name="cart-outline" size={32} color="#AAA" />
              <Text style={styles.semProdutoTexto}>Nenhum produto adicionado ainda.</Text>
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

                    <Image source={{ uri: item.imagem }} style={styles.itemCarrinhoImagem} />
                    <Text style={styles.itemCarrinhoNome} numberOfLines={1}>{item.nome}</Text>
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
                      <Text style={styles.miniContadorTexto}>{item.quantidade}</Text>
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

          {/* SELETOR DE VARIAÇÃO */}
          {itemFocado && (
            <View style={styles.variacaoContainer}>
              <View style={styles.seletorHeader}>
                <Text style={styles.seletorTitulo}>
                  Grade disponível para <Text style={{ fontWeight: "700", color: "#333" }}>{itemFocado.nome}</Text>
                </Text>
              </View>
              
              <View style={styles.variacaoGrid}>
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
                        {grade.cor} • {grade.tamanho}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* COMBINAÇÕES GERADAS PELA IA */}
          <View style={styles.sugestoesSection}>
            <Text style={styles.sectionTitle}>
              {itemFocado ? `Combina com ${itemFocado.nome}` : "Sugestões de Combinação"}
            </Text>

            {carregandoSugestoes ? (
              <ActivityIndicator size="small" color={colors.dustypink} style={{ marginVertical: 20 }} />
            ) : !itemFocado ? (
              <Text style={styles.semSugestaoTexto}>
                Selecione um produto acima para ver sugestões de looks.
              </Text>
            ) : sugestoesML.length === 0 ? (
              <Text style={styles.semSugestaoTexto}>Nenhum par ideal listado.</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {sugestoesML.map((sugestao) => {
                  const adicionado = jaAdicionadoAoPedido(String(sugestao.produto_id));
                  return (
                    <View key={sugestao.produto_id} style={styles.cardSugestao}>
                      <Image source={{ uri: sugestao.imagem }} style={styles.imagemSugestao} />
                      <Text style={styles.nomeSugestao} numberOfLines={1}>{sugestao.nome}</Text>
                      <Text style={styles.precoSugestao}>R$ {sugestao.preco?.toFixed(2)}</Text>

                      <TouchableOpacity
                        style={[
                          styles.btnAdicionarExtra,
                          adicionado && styles.btnAdicionarExtraAtivo,
                        ]}
                        onPress={() => {
                          adicionarOuFocarProduto({
                            id: String(sugestao.produto_id),
                            nome: sugestao.nome,
                            preco_base: Number(sugestao.preco),
                            imagem: sugestao.imagem,
                            categoria: sugestao.categoria,
                            codigo_barras: sugestao.codigo_barras,
                            estoque: sugestao.estoque || [],
                          });
                        }}
                      >
                        <Ionicons
                          name={adicionado ? "checkmark-circle" : "add"}
                          size={14}
                          color={adicionado ? "white" : colors.dustypink}
                        />
                        <Text style={[styles.btnExtraTexto, adicionado && styles.btnExtraTextoAtivo]}>
                          {adicionado ? "Na Sacola" : "Adicionar"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* NAVEGAÇÃO VITRINE */}
          <Text style={styles.sectionTitle}>Navegar por outras peças da loja:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
            {produtosVitrine.map((prod) => {
              const noCarrinho = jaAdicionadoAoPedido(String(prod.id));
              return (
                <TouchableOpacity
                  key={prod.id}
                  style={[styles.cardVitrine, noCarrinho && styles.cardVitrineAtivo]}
                  onPress={() => adicionarOuFocarProduto(prod)}
                >
                  <Image source={{ uri: prod.imagem }} style={styles.imagemVitrine} />
                  <Text style={styles.nomeVitrine} numberOfLines={1}>{prod.nome}</Text>
                  <Text style={styles.categoriaVitrine}>R$ {prod.preco_base}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </ScrollView>

        {/* FOOTER CHECKOUT */}
        <View style={styles.footerCheckout}>
          <View style={styles.checkoutPrecoContainer}>
            <Text style={styles.checkoutTotalLabel}>Total do seu Pedido:</Text>
            <Text style={styles.checkoutTotalPreco}>R$ {calcularTotalPedido().toFixed(2)}</Text>
          </View>

              <TouchableOpacity
                style={styles.btnFinalizar}
                onPress={() => {
                setPagamentoConcluido(false);
                setSimulandoPagamento(false);
                scaleAnim.setValue(0);

                setModalCheckoutVisible(true);
              }}
                            >
              <Text style={styles.btnFinalizarTexto}>Fechar Venda</Text>
            <Ionicons name="chevron-forward" size={18} color="white" />
          </TouchableOpacity>
        </View>



            <Modal
  visible={modalCheckoutVisible}
  animationType="slide"
  transparent
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>

      <View style={styles.modalHeader}>
        <Text style={styles.modalTitulo}>
          Finalizar Compra
        </Text>

        <TouchableOpacity
          onPress={() => setModalCheckoutVisible(false)}
        >
          <Ionicons
            name="close"
            size={24}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ENDEREÇOS */}

        <Text style={styles.modalSubtitulo}>
          Escolha o local de retirada
        </Text>

        {enderecosRetirada.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.cardEndereco,
              localRetirada === item.endereco &&
                styles.cardEnderecoAtivo,
            ]}
            onPress={() =>
              setLocalRetirada(item.endereco)
            }
          >
            <Ionicons
              name={item.icon as any}
              size={24}
              color={colors.dustypink}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.enderecoTitulo}>
                {item.titulo}
              </Text>

              <Text style={styles.enderecoTexto}>
                {item.endereco}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* PAGAMENTO */}

        <Text style={styles.modalSubtitulo}>
          Forma de pagamento
        </Text>

        <View style={styles.pagamentoRow}>

          <TouchableOpacity
            style={[
              styles.btnPagamento,
              formaPagamento === "Pix" &&
                styles.btnPagamentoAtivo,
            ]}
            onPress={() => {
              setFormaPagamento("Pix");
              setMostrarPix(true);
            }}
          >
            <Ionicons
              name="qr-code-outline"
              size={22}
              color="#333"
            />

            <Text style={styles.pagamentoTexto}>
              Pix
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btnPagamento,
              formaPagamento === "Crédito" &&
                styles.btnPagamentoAtivo,
            ]}
            onPress={() => {
              setFormaPagamento("Crédito");
              setMostrarPix(false);
            }}
          >
            <Ionicons
              name="card-outline"
              size={22}
              color="#333"
            />

            <Text style={styles.pagamentoTexto}>
              Crédito
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btnPagamento,
              formaPagamento === "Débito" &&
                styles.btnPagamentoAtivo,
            ]}
            onPress={() => {
              setFormaPagamento("Débito");
              setMostrarPix(false);
            }}
          >
            <Ionicons
              name="wallet-outline"
              size={22}
              color="#333"
            />

            <Text style={styles.pagamentoTexto}>
              Débito
            </Text>
          </TouchableOpacity>
        </View>

        {/* PIX */}

        {mostrarPix && (
          <View style={styles.pixContainer}>

            {!simulandoPagamento && !pagamentoConcluido && (
              <>
                <Text style={styles.pixTitulo}>
                  Escaneie o QR Code
                </Text>

                <QRCode
                  value="PIX-MAGNOLIA-MODAS-123"
                  size={180}
                />

                <View style={styles.pixInfoBox}>
                  <Text style={styles.pixLabel}>
                    Chave Pix:
                  </Text>

                  <Text style={styles.pixKey}>
                    magnoliamodas@pix.com
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.btnConfirmarPagamento}
                  onPress={simularPagamentoPix}
                >
                  <Ionicons
                    name="scan-circle-outline"
                    size={20}
                    color="#FFF"
                  />

                  <Text style={styles.btnConfirmarTexto}>
                    Simular Pagamento
                  </Text>
                </TouchableOpacity>
              </>
            )}

        {simulandoPagamento && (
          <View style={styles.loadingPagamentoContainer}>

            <ActivityIndicator
              size="large"
              color={colors.dustypink}
            />

            <Text style={styles.processandoTexto}>
              Aguardando confirmação do Pix...
            </Text>

            <Text style={styles.processandoSubtexto}>
              Isso pode levar alguns segundos
            </Text>
          </View>
        )}

        {pagamentoConcluido && (
          <Animated.View
            style={[
              styles.sucessoContainer,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Ionicons
              name="checkmark-circle"
              size={120}
              color="#6BBF73"
            />

            <Text style={styles.sucessoTitulo}>
              Pagamento Confirmado!
            </Text>

            <Text style={styles.sucessoTexto}>
              Seu pedido foi enviado com sucesso.
            </Text>
          </Animated.View>
        )}
      </View>
    )}

        {/* CARTÃO */}

        {!mostrarPix && formaPagamento !== "" && (
          <View style={styles.cartaoContainer}>

            <TextInput
              placeholder="Nome no cartão"
              style={styles.input}
              placeholderTextColor="#999"
              onChangeText={(text) =>
                setDadosCartao({
                  ...dadosCartao,
                  nome: text,
                })
              }
            />

            <TextInput
              placeholder="Número do cartão"
              style={styles.input}
              placeholderTextColor="#999"
              keyboardType="numeric"
            />

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TextInput
                placeholder="Validade"
                style={[styles.input, { flex: 1 }]}
                placeholderTextColor="#999"
              />

              <TextInput
                placeholder="CVV"
                style={[styles.input, { flex: 1 }]}
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={styles.btnConfirmarPagamento}
              onPress={finalizarPedidoLookSugerido}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#FFF"
              />

              <Text style={styles.btnConfirmarTexto}>
                Confirmar Pagamento
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  </View>
</Modal>



              <TabBar />
        
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FBFBFB' },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { marginTop: 10, color: "#666" },
    
    heroSection: {
      marginBottom: 10,
      backgroundColor: colors.Warmbeigebackground,
      paddingTop: 45,
      paddingHorizontal: 24,
      paddingBottom: 25,
      borderBottomLeftRadius: 36,
      borderBottomRightRadius: 36,
      overflow: 'hidden',
    },
    heroBlob: {
      position: 'absolute',
      width: 220,
      height: 200,
      borderRadius: 140,
      backgroundColor: '#b8c4a542',
      top: -90,
      right: -60,
    },
    heroBlob2: {
      position: 'absolute',
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: '#dfa3b222',
      bottom: -60,
      left: -40,
    },
    heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    btnVoltar: { padding: 4 },
    headerTextGroup: { flex: 1, marginLeft: 12 },
    heroGreeting: { fontSize: 20, color: '#7D7D7D', fontWeight: '600' },
    heroSubtitle: { marginTop: 2, fontSize: 12, color: '#9A9A9A' },
    heroIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.dustypink,
      justifyContent: 'center',
      alignItems: 'center',
    },

    sectionTitle: { fontSize: 15, fontWeight: "700", color: "#444", marginTop: 15, marginBottom: 10 },
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
    itemCarrinhoFocado: { borderColor: colors.Lightolivegreen, backgroundColor: "#FFFBFB", borderWidth: 2 },
    itemCarrinhoImagem: { width: "100%", height: 110, borderRadius: 8, resizeMode: "cover" },
    itemCarrinhoNome: { fontSize: 12, fontWeight: "600", color: "#333", marginTop: 6, textAlign: "center" },
    itemCarrinhoPreco: { fontSize: 12, fontWeight: "700", color: '#4E5B48', marginTop: 2 },
    btnRemoverItem: { position: "absolute", top: -4, right: -4, zIndex: 10 },
    miniContador: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F5F5F5",
      borderRadius: 12,
      padding: 2,
      marginTop: 6,
      width: "100%",
      justifyContent: "space-between",
    },
    miniContadorBtn: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#FFF", alignItems: "center", justifyContent: "center" },
    miniContadorTexto: { fontSize: 11, fontWeight: "700" },

    variacaoContainer: {
      backgroundColor: "#FFF",
      padding: 16,
      borderRadius: 16,
      marginTop: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 2,
      borderWidth: 1,
      borderColor: "#F0F0F0",
    },
    seletorHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    seletorTitulo: { fontSize: 13, color: "#666", fontWeight: "500" },
    variacaoGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    variacaoPill: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: "#F8F8F8",
      borderWidth: 1,
      borderColor: "#EAEAEA",
    },
    variacaoPillAtiva: { 
      backgroundColor: colors.dustypink,
      borderColor: colors.dustypink,
    },
    variacaoTexto: { fontSize: 12, color: "#555", fontWeight: "500" },
    variacaoTextoAtiva: { color: "#FFF", fontWeight: "600" },

    semProdutoCard: { padding: 30, alignItems: "center", backgroundColor: "#FFF", borderRadius: 12 },
    semProdutoTexto: { color: "#999", fontSize: 12, marginTop: 6 },
    sugestoesSection: { marginVertical: 10 },
    semSugestaoTexto: { color: "#999", fontSize: 12, paddingLeft: 4 },
    cardSugestao: { width: 110, marginRight: 10, backgroundColor: "#FFF", borderRadius: 10, padding: 8, borderWidth: 1, borderColor: "#EEE" },
    imagemSugestao: { width: "100%", height: 100, borderRadius: 6, resizeMode: "cover" },
    nomeSugestao: { fontSize: 11, color: "#444", marginTop: 4 },
    precoSugestao: { fontSize: 11, color: '#4E5B48', fontWeight: "700" },
    btnAdicionarExtra: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      marginTop: 6,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.dustypink,
    },
    btnAdicionarExtraAtivo: { backgroundColor: colors.dustypink },
    btnExtraTexto: { fontSize: 10, color: colors.dustypink, fontWeight: "600" },
    btnExtraTextoAtivo: { color: "#FFF" },
    cardVitrine: { width: 105, marginRight: 10, backgroundColor: "#FFF", borderRadius: 10, padding: 8, borderWidth: 1, borderColor: "#EAEAEA" },
    cardVitrineAtivo: { borderColor: colors.dustypink, borderWidth: 1.5 },
    imagemVitrine: { width: "100%", height: 100, borderRadius: 6, resizeMode: "cover" },
    nomeVitrine: { fontSize: 11, fontWeight: "600", color: "#333", marginTop: 4 },
    categoriaVitrine: { fontSize: 11, color: '#4E5B48', fontWeight: "600" },
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
      paddingBottom: 125,
    },
    checkoutPrecoContainer: { flexDirection: "column" },
    checkoutTotalLabel: { fontSize: 11, color: "#666" },
    checkoutTotalPreco: { fontSize: 18, fontWeight: "bold", color: "'#4E5B48'" },
    btnFinalizar: {
      backgroundColor: '#4E5B48',
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      gap: 4,
    },
    btnFinalizarTexto: { color: "#FFF", fontWeight: "bold", fontSize: 14 },

    modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "flex-end",
},

modalContainer: {
  backgroundColor: "#FFF",
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  padding: 20,
  maxHeight: "90%",
},

modalHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
},

modalTitulo: {
  fontSize: 22,
  fontWeight: "700",
  color: "#333",
},

modalSubtitulo: {
  fontSize: 15,
  fontWeight: "700",
  marginBottom: 12,
  marginTop: 15,
  color: "#444",
},

cardEndereco: {
  flexDirection: "row",
  gap: 12,
  backgroundColor: "#FAFAFA",
  padding: 14,
  borderRadius: 14,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: "#EEE",
},

cardEnderecoAtivo: {
  borderColor: colors.dustypink,
  backgroundColor: "#FFF5F7",
},

enderecoTitulo: {
  fontWeight: "700",
  color: "#333",
  marginBottom: 4,
},

enderecoTexto: {
  fontSize: 12,
  color: "#666",
},

pagamentoRow: {
  flexDirection: "row",
  gap: 10,
  marginBottom: 20,
},

btnPagamento: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 14,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#EEE",
  backgroundColor: "#FAFAFA",
},

btnPagamentoAtivo: {
  borderColor: colors.dustypink,
  backgroundColor: "#FFF5F7",
},

pagamentoTexto: {
  marginTop: 6,
  fontWeight: "600",
  color: "#444",
},

pixContainer: {
  alignItems: "center",
  marginTop: 20,
},

pixTitulo: {
  fontSize: 15,
  fontWeight: "700",
  marginBottom: 20,
},

btnConfirmarPagamento: {
  marginTop: 25,
  backgroundColor: "#4E5B48",
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderRadius: 14,
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},

btnConfirmarTexto: {
  color: "#FFF",
  fontWeight: "700",
},

cartaoContainer: {
  marginTop: 20,
},

input: {
  backgroundColor: "#FAFAFA",
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 14,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: "#EEE",
  color: "#333",
},
pixInfoBox: {
  width: "100%",
  backgroundColor: "#F8F8F8",
  padding: 14,
  borderRadius: 14,
  marginTop: 18,
  alignItems: "center",
},

pixLabel: {
  fontSize: 12,
  color: "#777",
  marginBottom: 6,
},

pixKey: {
  fontSize: 15,
  fontWeight: "700",
  color: "#333",
},

loadingPagamentoContainer: {
  alignItems: "center",
  justifyContent: "center",
  marginTop: 40,
},

processandoTexto: {
  marginTop: 20,
  fontSize: 18,
  fontWeight: "700",
  color: "#333",
},

processandoSubtexto: {
  marginTop: 8,
  color: "#777",
  fontSize: 13,
},

sucessoContainer: {
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 40,
},

sucessoTitulo: {
  fontSize: 26,
  fontWeight: "800",
  color: "#333",
  marginTop: 20,
},

sucessoTexto: {
  marginTop: 10,
  color: "#666",
  fontSize: 14,
  textAlign: "center",
},
  });