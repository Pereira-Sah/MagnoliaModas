import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../src/services/api';
import { styles, colors } from '../styles/produtosStyles';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import CreateProductModal from '../components/CreateProductModal';
import TabBar from '../components/TabBar';

export default function Produtos() {
  const [listaProdutos, setListaProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false); 
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await api.get('/produtos/');
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

  <View style={styles.logoWrapper}>
    <Image 
      source={require('../assets/images/magnoliaModas_logo.svg')} 
      style={styles.logo} 
    />
  </View>


  <View style={styles.searchSection}>
    <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
    <TextInput 
      style={styles.searchInput}
      placeholder="Pesquisar..."
      placeholderTextColor="#999"
    />
  </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterScroll}
        >
          {["Tudo", "Camisetas", "Vestidos", "Calças", "Acessórios"].map((tipo, index) => (
            <TouchableOpacity 
              key={tipo} 
              style={[
                styles.filterPill, 
                index === 0 && styles.filterPillActive 
              ]}
            >
              <Text style={[
                styles.filterPillText, 
                index === 0 && styles.filterPillTextActive
              ]}>
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
          renderItem={({ item }) => <ProductCard item={item} onPress={abrirModal} />}
        />

        <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setCreateModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color={colors.white} />
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
    </View>
  );
}
