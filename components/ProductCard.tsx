import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/produtosStyles';

export default function ProductCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.cardHorizontal} onPress={() => onPress(item)}>
      <Image source={{ uri: item.imagem }} style={styles.imageHorizontal} />

      <View style={styles.cardContentHorizontal}>
        <View style={styles.cardHeader}>
          <Text style={styles.nomeHorizontal} numberOfLines={1} ellipsizeMode="tail">
            {item.nome}
          </Text>
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>R$ {item.preco_base}</Text>
          </View>
        </View>

        <Text style={styles.descricaoHorizontal} numberOfLines={2} ellipsizeMode="tail">
          {item.descricao}
        </Text>

        <TouchableOpacity style={styles.buttonHorizontal} onPress={() => onPress(item)}>
          <Text style={styles.buttonTextHorizontal}>Ver mais</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
