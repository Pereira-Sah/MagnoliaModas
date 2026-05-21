import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBar,
        {
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        }
      ]}
    >
      <TouchableOpacity onPress={() => router.push('/produtos')}>
        <Ionicons
          name="home"
          size={28}
          color={pathname === '/produtos' ? '#B8C4A5' : '#DFA3B2'}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/dashboard')}>
        <Ionicons
          name="stats-chart"
          size={28}
          color={pathname === '/dashboard' ? '#B8C4A5' : '#DFA3B2'}
        />
      </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/listaVendas')}>
        <Ionicons
          name="bag-handle"
          size={28}
          color={pathname === '/listaVendas' ? '#B8C4A5' : '#DFA3B2'}
        />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/perfil')}>
        <Ionicons
          name="person"
          size={28}
          color={pathname === '/perfil' ? '#B8C4A5' : '#DFA3B2'}
        />
      </TouchableOpacity>


    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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