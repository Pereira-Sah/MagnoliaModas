import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { perfilStyles, colors } from '../styles/perfilStyles';

export default function EditarPerfil() {

  const [nome, setNome] = useState(
    'Fernanda Magnolia'
  );

  const [email, setEmail] = useState(
    'fernanda@magnoliamodas.com'
  );

  const [telefone, setTelefone] = useState(
    '(11) 98888-7777'
  );

  const [senha, setSenha] = useState('');

  const [foto, setFoto] = useState(
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'
  );

  async function alterarFoto() {

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1,1],
        quality:1,
      });

    if (!result.canceled) {
      setFoto(
        result.assets[0].uri
      );
    }
  }

  function salvar() {

    Alert.alert(
      'Sucesso',
      'Perfil atualizado!'
    );

    router.back();
  }

  return (

    <View style={perfilStyles.container}>

      <View style={perfilStyles.logoWrapper}>
        <Image
          source={require('../assets/images/magnoliaModas_logo.png')}
          style={perfilStyles.logo}
        />
      </View>

      <ScrollView contentContainerStyle={perfilStyles.scrollContainer} showsVerticalScrollIndicator={false}>

        <Text style={perfilStyles.editPageTitle}>
          Editar Perfil
        </Text>

        <View style={perfilStyles.avatarWrapper}>

          <Image
            source={{ uri: foto }}
            style={perfilStyles.avatar}
          />

          <TouchableOpacity style={perfilStyles.cameraButton} onPress={alterarFoto}>
            <Ionicons
              name="camera"
              size={16}
              color={colors.white}
            />
          </TouchableOpacity>

        </View>

        <TouchableOpacity
          onPress={alterarFoto}
        >
          <Text style={perfilStyles.changePhotoText}>
            Alterar foto
          </Text>
        </TouchableOpacity>


        <View style={perfilStyles.sectionCard}>

          <Text style={perfilStyles.inputLabel}>
            Nome
          </Text>

          <View style={perfilStyles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={18}
              color="#888"
            />

            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Nome"
              style={perfilStyles.input}
            />
          </View>

          <Text style={perfilStyles.inputLabel}>
            Email
          </Text>

          <View style={perfilStyles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={18}
              color="#888"
            />

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              style={perfilStyles.input}
            />
          </View>

          <Text style={perfilStyles.inputLabel}>
            Telefone
          </Text>

          <View style={perfilStyles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={18}
              color="#888"
            />

            <TextInput
              value={telefone}
              onChangeText={setTelefone}
              placeholder="Telefone"
              style={perfilStyles.input}
            />
          </View>

          <Text style={perfilStyles.inputLabel}>
            Nova senha
          </Text>

          <View style={perfilStyles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color="#888"
            />

            <TextInput
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              placeholder="Nova senha"
              style={perfilStyles.input}
            />
          </View>

        </View>

        <TouchableOpacity style={perfilStyles.saveButton} onPress={salvar}>
          <Ionicons
            name="save-outline"
            size={20}
            color={colors.white}
          />

          <Text style={perfilStyles.saveButtonText}>
            Salvar alterações
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </View>

  );
}