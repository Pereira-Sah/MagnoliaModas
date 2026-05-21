import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { cadastroFuncionario, colors } from "../styles/cadastroFuncionario";

import api from "../src/services/api";
import AuthInput from "../components/AuthInput";

export default function CadastroFuncionario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleCadastro = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const response = await api.post("/auth/cadastro", {
        nome_usuario: nome,
        email: email,
        senha: senha,
        role: "funcionario",
      });

      if (response.status === 200 || response.status === 201) {
        if (Platform.OS === "web") {
          alert("Funcionário cadastrado com sucesso!");
        }

        Alert.alert(
          "Sucesso",
          "Novo funcionário cadastrado com sucesso!",
        );

        router.back();
      }
    } catch (error) {
      let erroMsg = "Erro ao conectar com o servidor";

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        erroMsg = (error as any).response?.data?.detail || erroMsg;
      }

      Alert.alert("Erro no Cadastro", erroMsg);
    }
  };

  return (
    <View style={cadastroFuncionario.container}>
      <ScrollView
        contentContainerStyle={cadastroFuncionario.scrollContent}
        showsVerticalScrollIndicator={false}
      >
<View style={cadastroFuncionario.heroSection}>
  <View style={cadastroFuncionario.heroBlob} />
  <View style={cadastroFuncionario.heroBlob2} />

    <View style={cadastroFuncionario.profileHeroRow}>

        <View style={cadastroFuncionario.profileInfo}>
        <Text style={cadastroFuncionario.title}>
            Novo Funcionário
        </Text>

        <Text style={cadastroFuncionario.subtitle}>
            Adicione alguém à equipe Magnolia
        </Text>

        <View style={cadastroFuncionario.roleBadge}>
            <Text style={cadastroFuncionario.roleText}>
            ACESSO INTERNO
            </Text>
        </View>
        </View>

        <View style={cadastroFuncionario.avatarWrapper}>
        <View style={cadastroFuncionario.iconAvatar}>
            <Ionicons
            name="people-outline"
            size={38}
            color={colors.white}
            />
        </View>
        </View>

    </View>
    </View>

        <View style={cadastroFuncionario.formCard}>
          <Text style={cadastroFuncionario.sectionTitle}>
            Informações da conta
          </Text>

          <AuthInput
            icon="person-outline"
            placeholder="Nome completo"
            onChangeText={setNome}
          />

          <AuthInput
            icon="mail-outline"
            placeholder="E-mail corporativo"
            onChangeText={setEmail}
          />

          <AuthInput
            icon="lock-closed-outline"
            placeholder="Senha temporária"
            secureTextEntry
            onChangeText={setSenha}
          />

          <TouchableOpacity
            style={cadastroFuncionario.button}
            onPress={handleCadastro}
          >
            <Ionicons
              name="person-add-outline"
              size={18}
              color="#FFF"
            />

            <Text style={cadastroFuncionario.buttonText}>
              Cadastrar funcionário
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={cadastroFuncionario.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={cadastroFuncionario.cancelText}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}