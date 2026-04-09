import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/produtosStyles';
import { Ionicons } from '@expo/vector-icons';

interface ProductCardProps {
  item: {
    imagem: string;
    nome: string;
    preco_base: number | string;
    descricao: string;
  };
  onPress: (item: any) => void;
}

export default function ProductCard({ item, onPress }: ProductCardProps) {
  return (
<TouchableOpacity 
      activeOpacity={0.8} 
      style={styles.gridCard} 
      onPress={() => onPress(item)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imagem }} style={styles.gridImage} />
                <Text style={styles.gridPrice}>R$ {item.preco_base}</Text>

      </View>

      <View style={styles.gridInfo}>

        <Text style={styles.gridTitle} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.gridDescription} numberOfLines={2}>{item.descricao}</Text>

      </View>
    </TouchableOpacity>
  );
}
