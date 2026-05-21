import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { router, useFocusEffect } from "expo-router";
import { perfilStyles, colors } from "../styles/perfilStyles";
import TabBar from "../components/TabBar";
import api from "../src/services/api";

const InfoItem = ({ icon, label, value, isLast = false }: any) => (
  <View style={[perfilStyles.infoRow, isLast && { marginBottom: 0 }]}>
    <View style={perfilStyles.iconBox}>
      <Ionicons name={icon} size={20} color={colors.Lightolivegreen} />
    </View>
    <View>
      <Text style={perfilStyles.infoLabel}>{label}</Text>
      <Text style={perfilStyles.infoValue}>{value || "Não informado"}</Text>
    </View>
  </View>
);

export default function Perfil() {
  const [usuario, setUsuario] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  const DEFAULT_AVATAR =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200";

  useFocusEffect(
    useCallback(() => {
      async function buscarPerfil() {
        try {
          const response = await api.get("/auth/me");
          setUsuario(response.data);
        } catch (error: any) {
          console.error("Erro ao buscar dados do perfil:", error);
          Alert.alert(
            "Erro",
            "Não foi possível atualizar as informações do perfil.",
          );
        } finally {
          setCarregando(false);
        }
      }

      buscarPerfil();
    }, []),
  );

  async function logout() {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("userToken");
      } else {
        await SecureStore.deleteItemAsync("userToken");
      }

      router.replace("/");
    } catch (error) {
      console.log("Erro ao fazer logout:", error);
      alert("Não foi possível sair da conta.");
    }
  }

  const formatarCargo = (role: string) => {
    if (role === "admin") return "Administradora";
    if (role === "funcionario") return "Funcionária";
    return "Cliente";
  };

  if (carregando) {
    return (
      <View
        style={[
          perfilStyles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.Lightolivegreen} />
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
      {usuario?.nome || "Usuária"}
    </Text>

    <Text style={perfilStyles.heroSubtitle}>
      Sua área pessoal
    </Text>

    <View style={perfilStyles.roleBadge}>
      <Text style={perfilStyles.roleText}>
        {formatarCargo(usuario?.role)}
      </Text>
    </View>
  </View>

  <View style={perfilStyles.avatarWrapper}>
    <Image
      source={{
        uri: usuario?.foto_url || DEFAULT_AVATAR,
      }}
      style={perfilStyles.avatar}
    />

    <TouchableOpacity
      style={perfilStyles.editIconButton}
      activeOpacity={0.7}
      onPress={() => router.push("/editarPerfil")}
    >
      <Ionicons
        name="pencil"
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
          <InfoItem
            icon="mail-outline"
            label="E-mail Cadastrado"
            value={usuario?.email}
          />
          <InfoItem
            icon="call-outline"
            label="Telefone"
            value={usuario?.telefone}
          />
          <InfoItem
            icon="business-outline"
            label="Loja"
            value={usuario?.loja}
            isLast
          />
        </View>

        <View style={perfilStyles.sectionCard}>
          <InfoItem
            icon="calendar-outline"
            label="Membro desde"
            value={usuario?.criado_em}
          />

          <InfoItem
            icon="checkmark-circle-outline"
            label="Status"
            value="Ativo"
            isLast
          />
        </View>

        <TouchableOpacity
  style={perfilStyles.managementCard}
  activeOpacity={0.85}
  onPress={() => router.push("/cadastroFuncionario")}
>
    <View style={perfilStyles.managementIcon}>
      <Ionicons
        name="person-add-outline"
        size={22}
        color="#FFF"
      />
    </View>

    <View style={{ flex: 1 }}>
      <Text style={perfilStyles.managementTitle}>
        Gerenciar equipe
      </Text>

      <Text style={perfilStyles.managementSubtitle}>
        Cadastrar novo funcionário
      </Text>
    </View>

    <Ionicons
      name="chevron-forward"
      size={18}
      color="#AAA"
    />
  </TouchableOpacity>



        <TouchableOpacity
          style={perfilStyles.logoutButton}
          activeOpacity={0.6}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={perfilStyles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>


      </ScrollView>

      <TabBar />
    </View>
  );
}
