import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "../styles/produtosStyles";
import { Ionicons } from "@expo/vector-icons";

interface ProductCardProps {
  item: {
    imagem: string;
    nome: string;
    preco_base: number | string;
    descricao: string;
  };
  onPress: (item: any) => void;

  semEstoque?: boolean;
  isCliente?: boolean;
}

export default function ProductCard({
  item,
  onPress,
  semEstoque = false,
  isCliente = false,
}: ProductCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.gridCard,
        semEstoque &&
          !isCliente && {
            backgroundColor: "#ffe5e5",
            borderWidth: 1,
            borderColor: "#ff4d4d",
          },
      ]}
      onPress={() => onPress(item)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imagem }} style={styles.gridImage} />

        {semEstoque && !isCliente ? (
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "#ff4d4d",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 11,
                fontWeight: "bold",
              }}
            >
              ESGOTADO
            </Text>
          </View>
        ) : (
          <Text style={styles.gridPrice}>R$ {item.preco_base}</Text>
        )}
      </View>

      <View style={styles.gridInfo}>
        <Text style={styles.gridTitle} numberOfLines={1}>
          {item.nome}
        </Text>
        <Text style={styles.gridDescription} numberOfLines={2}>
          {item.descricao}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
