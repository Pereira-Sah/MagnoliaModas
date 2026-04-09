import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function TabBar() {
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity onPress={() => router.push('/produtos')}>
        <Ionicons name="home" size={28} color="#60875b" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/dasboard')}>
        <Ionicons name="stats-chart" size={28} color="#e5aeab" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Ionicons name="person" size={28} color="#e5aeab" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create ({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },

 });
