import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { perfilStyles, colors } from "../styles/perfilStyles";
import api from "../src/services/api";

export default function EditarPerfil() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [foto, setFoto] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const DEFAULT_AVATAR =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200";

  useEffect(() => {
    async function carregarDadosAtuais() {
      try {
        const response = await api.get("/auth/me");
        const dados = response.data;

        if (dados) {
          setNome(dados.nome || "");
          setEmail(dados.email || "");
          setTelefone(dados.telefone || "");
          setFoto(dados.foto_url || DEFAULT_AVATAR);
        }
      } catch (error: any) {
        console.error("Erro ao carregar dados do perfil:", error);

        Alert.alert(
          "Erro",
          "Não foi possível carregar os dados do seu perfil.",
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDadosAtuais();
  }, []);

  async function alterarFoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  }

  async function salvar() {
    if (!nome.trim() || !email.trim()) {
      Alert.alert("Erro", "Nome e E-mail são obrigatórios.");
      return;
    }

    try {
      setSalvando(true);

      const formData = new FormData();

      formData.append("nome", nome.trim());
      formData.append("email", email.trim());
      formData.append("telefone", telefone.trim());

      if (senha.trim() !== "") {
        formData.append("senha", senha.trim());
      }

      if (foto && foto.startsWith("file://")) {
        const filename = foto.split("/").pop();

        const match = /\.(\w+)$/.exec(filename || "");

        const type = match
          ? `image/${match[1]}`
          : `image`;

        formData.append("imagem", {
          uri: foto,
          name: filename || "avatar.jpg",
          type: type,
        } as any);
      }

      const response = await api.put(
        "/auth/atualizar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        Alert.alert(
          "Sucesso",
          "Perfil atualizado com sucesso!",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ],
        );
      }
    } catch (error: any) {
      console.error(
        "Erro ao salvar alterações do perfil:",
        error,
      );

      const mensagemErro =
        error.response?.data?.detail ||
        "Não foi possível atualizar o perfil.";

      Alert.alert("Erro ao salvar", mensagemErro);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View
        style={[
          perfilStyles.container,
          {
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.Lightolivegreen}
        />
      </View>
    );
  }

  return (
    <View style={perfilStyles.container}>

      <View style={perfilStyles.heroSection}>

        <View style={perfilStyles.heroBlob} />
        <View style={perfilStyles.heroBlob2} />

        <View style={perfilStyles.profileHeroRow}>

          <View style={perfilStyles.profileInfo}>

            <Text style={perfilStyles.userName}>
              Editar Perfil
            </Text>

            <Text style={perfilStyles.heroSubtitle}>
              Atualize suas informações
            </Text>

          </View>

          <View style={perfilStyles.avatarWrapper}>

            <Image
              source={{
                uri: foto || DEFAULT_AVATAR,
              }}
              style={perfilStyles.avatar}
            />

            <TouchableOpacity
              style={perfilStyles.cameraButton}
              onPress={alterarFoto}
            >
              <Ionicons
                name="camera"
                size={16}
                color={colors.white}
              />
            </TouchableOpacity>

          </View>

        </View>

      </View>

      <ScrollView
        contentContainerStyle={perfilStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >



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
              keyboardType="email-address"
              autoCapitalize="none"
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
              keyboardType="phone-pad"
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
              placeholder="Deixe em branco para manter a atual"
              style={perfilStyles.input}
            />
          </View>

        </View>

        <TouchableOpacity
          style={[
            perfilStyles.saveButton,
            salvando && { opacity: 0.6 },
          ]}
          onPress={salvar}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator
              size="small"
              color={colors.white}
            />
          ) : (
            <>
              <Ionicons
                name="save-outline"
                size={20}
                color={colors.white}
              />

              <Text style={perfilStyles.saveButtonText}>
                Salvar alterações
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={perfilStyles.cancelEditButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Text style={perfilStyles.cancelEditText}>
            Cancelar
          </Text>
          
        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}