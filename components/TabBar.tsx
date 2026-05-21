import { 
  View, 
  TouchableOpacity, 
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEffect, useState } from 'react';
import api from '../src/services/api';

export default function TabBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscarUsuario() {
      try {
        const response = await api.get('/auth/me');
        setUsuario(response.data);
      } catch (error) {
        console.log('Erro ao buscar usuário:', error);
      } finally {
        setLoading(false);
      }
    }

    buscarUsuario();
  }, []);

  const isAdmin =
    usuario?.role === 'admin' ||
    usuario?.role === 'funcionario';

  if (loading) {
    return (
      <View
        style={[
          styles.tabBar,
          {
            paddingBottom: insets.bottom,
            height: 60 + insets.bottom,
          },
        ]}
      >
        <ActivityIndicator color="#DFA3B2" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.tabBar,
        {
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        },
      ]}
    >
      <TouchableOpacity onPress={() => router.push('/produtos')}>
        <Ionicons
          name="home"
          size={28}
          color={
            pathname === '/produtos'
              ? '#B8C4A5'
              : '#DFA3B2'
          }
        />
      </TouchableOpacity>

      {isAdmin && (
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Ionicons
            name="stats-chart"
            size={28}
            color={
              pathname === '/dashboard'
                ? '#B8C4A5'
                : '#DFA3B2'
            }
          />
        </TouchableOpacity>
      )}

      {isAdmin && (
        <TouchableOpacity onPress={() => router.push('/listaVendas')}>
          <Ionicons
            name="bag-handle"
            size={28}
            color={
              pathname === '/listaVendas'
                ? '#B8C4A5'
                : '#DFA3B2'
            }
          />
        </TouchableOpacity>
      )}

      {usuario?.role === 'cliente' && (
        <TouchableOpacity onPress={() => router.push('/MeusPedidos')}>
          <Ionicons
            name="bag-handle"
            size={28}
            color={
              pathname === '/MeusPedidos'
                ? '#B8C4A5'
                : '#DFA3B2'
            }
          />
        </TouchableOpacity>
      )}


      <TouchableOpacity onPress={() => router.push('/perfil')}>
        <Ionicons
          name="person"
          size={28}
          color={
            pathname === '/perfil'
              ? '#B8C4A5'
              : '#DFA3B2'
          }
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