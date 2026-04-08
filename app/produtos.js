import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../src/services/api';
import { styles } from '../styles/produtosStyles';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import TabBar from '../components/TabBar';

export default function Produtos() {
  const [listaProdutos, setListaProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
      <View style={styles.header}>
        <Image source={require('../assets/images/magnoliaModas_logo.png')} style={styles.logo} />
        <Ionicons name="search" size={24} color="#333" />
      </View>

      <View style={styles.filtros}>
        {["Camisetas", "Vestidos", "Calças"].map((tipo) => (
          <TouchableOpacity key={tipo} style={styles.filtroButton}>
            <Text style={styles.filtroText}>{tipo}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={listaProdutos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ProductCard item={item} onPress={abrirModal} />}
        
        
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <ProductModal
        visible={modalVisible}
        produto={produtoSelecionado}
        onClose={() => setModalVisible(false)}
      />

      <TabBar />
    </View>
  );
}
