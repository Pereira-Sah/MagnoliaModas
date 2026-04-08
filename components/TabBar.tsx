import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/produtosStyles';
import { router } from 'expo-router';

export default function TabBar() {
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity onPress={() => router.push('/produtos')}>
        <Ionicons name="home" size={28} color="#89c489" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Ionicons name="stats-chart" size={28} color="#e6aeac" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Ionicons name="person" size={28} color="#e6aeac" />
      </TouchableOpacity>
    </View>
  );
}
