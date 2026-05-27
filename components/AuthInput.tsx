import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../styles/authStyles';
import { useState } from 'react';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
};

export default function AuthInput({
  icon,
  placeholder,
  secureTextEntry,
  onChangeText,
}: Props) {

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const ehSenha = secureTextEntry;

  return (
    <View style={styles.container}>
      <Ionicons
        name={icon}
        size={18}
        color={colors.Lightolivegreen}
      />

      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={ehSenha && !mostrarSenha}        
        style={styles.input}
        onChangeText={onChangeText}
      />


        {ehSenha && (
        <TouchableOpacity
          onPress={() => setMostrarSenha(!mostrarSenha)}
        >
          <Ionicons
            name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.Lightolivegreen}
          />
        </TouchableOpacity>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 5,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(184,196,165,0.25)',
    gap: 10,
  },

  input: {
    flex: 1,
    fontFamily: fonts.regular,
    color: '#444',
  },
});