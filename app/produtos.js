import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import api from '../src/services/api'; 
import { router } from 'expo-router';

export default function produtos() {
  const [listaProdutos, setListaProdutos] = useState([]);

  const carregarProdutos = async () => {
    try {
      const response = await api.get('/produtos/');
      setListaProdutos(response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } 
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 24, fontWeight: 'bold'}}>Lista de Produtos</Text>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/cadastroProduto')}
      >
        <Text style={{color: '#fff'}}>+ Cadastrar novo produto</Text>
      </TouchableOpacity>

      <FlatList
        data={listaProdutos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text style={{fontWeight: 'bold'}}>Nome: {item.nome}</Text>
            <Text>imagem_link: {item.imagem}</Text>

            <Image style={{width : 120, height : 80}} source={{uri: item.imagem}} />
            <Text>Descrição: {item.descricao}</Text>
            <Text>Categoria: {item.categoria} | Estação: {item.estacao}</Text>
            <Text>Preço: R$ {item.preco_base}</Text>

            <Text style={{ fontWeight: 'bold'}}>VARIAÇÕES EM ESTOQUE:</Text>

            {item.estoque && item.estoque.length > 0 ? (
                item.estoque.map((variacao, index) => (
                <Text key={index}>
                    • {variacao.tamanho} | {variacao.cor} | Qtd: {variacao.quantidade} | CB: {variacao.codigo_barras}
                </Text>
                ))
            ) : (
                <Text style={{ color: 'red' }}>Sem estoque cadastrado</Text>
            )}
            
            <br/>
            
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20
  }
});