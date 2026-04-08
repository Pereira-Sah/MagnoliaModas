import { View, Text, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { styles } from '../styles/produtosStyles';

export default function ProductModal({ visible, produto, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {produto && (
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
              <Image source={{ uri: produto.imagem }} style={styles.modalImage} />
              <Text style={styles.modalNome}>{produto.nome}</Text>
              <Text style={styles.modalPreco}>R$ {produto.preco_base}</Text>
              <Text style={styles.modalDescricao}>{produto.descricao}</Text>

              <View style={styles.modalInfoBox}>
                <Text style={styles.modalInfoText}>
                  Categoria: <Text style={styles.modalInfoHighlight}>{produto.categoria}</Text>
                </Text>
                <Text style={styles.modalInfoText}>
                  Estação: <Text style={styles.modalInfoHighlight}>{produto.estacao}</Text>
                </Text>
              </View>

              <Text style={styles.modalSectionTitle}>Variações em estoque:</Text>
              {produto.estoque && produto.estoque.length > 0 ? (
                <View style={styles.estoqueTable}>
                  <View style={styles.estoqueHeader}>
                    <Text style={styles.estoqueHeaderText}>Tamanho</Text>
                    <Text style={styles.estoqueHeaderText}>Cor</Text>
                    <Text style={styles.estoqueHeaderText}>Qtd</Text>
                    {/* <Text style={styles.estoqueHeaderText}>CB</Text> */}
                  </View>
                  {produto.estoque.map((variacao, index) => (
                    <View key={index} style={styles.estoqueRow}>
                      <Text style={styles.estoqueCell}>{variacao.tamanho}</Text>
                      <Text style={styles.estoqueCell}>{variacao.cor}</Text>
                      <Text style={styles.estoqueCell}>{variacao.quantidade}</Text>
                      {/* <Text style={styles.estoqueCell}>{variacao.codigo_barras}</Text> */}
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.semEstoque}>Sem estoque cadastrado</Text>
              )}

              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
