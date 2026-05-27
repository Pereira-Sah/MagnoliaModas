import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { authStyles } from "../styles/authStyles";
import AuthLayout from "./AuthLayout";
import api from "../src/services/api";
import AuthInput from "../components/AuthInput";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(true);
  const [entrandoloding, setEntrandoLoading] = useState(false);

  useEffect(() => {
    const verificarToken = async () => {
      let token;
      let roleUsuario;

      if (Platform.OS === "web") {
        token = localStorage.getItem("userToken");
        roleUsuario = localStorage.getItem("userRole");
      } else {
        token = await SecureStore.getItemAsync("userToken");
        roleUsuario = await SecureStore.getItemAsync("userRole");
      }

      if (token && roleUsuario) {
        console.log("Usuário já logado com a role:", roleUsuario);
        router.replace("/produtos");
      } else {
        setLoading(false);
      }
    };

    verificarToken();
  }, []);

  const handleLogin = async () => {
    if (!email || !senha) {
      alert("Erro: Preencha todos os campos");
      return;
    }

    try {
      setEntrandoLoading(true);
      const response = await api.post("/auth/login", null, {
        params: {
          email,
          senha,
        },
      });

      const token = response.data.token;
      const nomeUsuario =
        response.data.user?.nome || response.data.nome || "Usuária";

      const roleCrua =
        response.data.user?.role || response.data.role || "cliente";
      const roleUsuario = roleCrua.trim().toLowerCase();

      if (token) {
        if (Platform.OS === "web") {
          localStorage.setItem("userToken", token);
          localStorage.setItem("userName", nomeUsuario);
          localStorage.setItem("userRole", roleUsuario);
        } else {
          await SecureStore.setItemAsync("userToken", token);
          await SecureStore.setItemAsync("userName", nomeUsuario);
          await SecureStore.setItemAsync("userRole", roleUsuario);
        }

        router.replace("/produtos");
      }
    } catch (error: any) {
      console.log(error);
      const msg =
        error.response?.data?.detail ||
        "Erro ao fazer login. Verifique suas credenciais.";
      alert(msg);
    } finally {
      setEntrandoLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#808000" />
      </View>
    );
  }

  return (
    <AuthLayout title="Bem-vinda de volta" subtitle="Sentimos sua Falta!">
      <KeyboardAvoidingView>
        <View style={authStyles.formContainer}>
          <Text style={authStyles.description}>
            Entre com sua conta para acessar
          </Text>

          <AuthInput
            icon="mail-outline"
            placeholder="E-mail"
            onChangeText={setEmail}
          />

          <AuthInput
            icon="lock-closed-outline"
            placeholder="Senha"
            secureTextEntry
            onChangeText={setSenha}
          />

          <TouchableOpacity style={authStyles.button} onPress={handleLogin}>
            <Text style={authStyles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/cadastro")}>
            <Text style={authStyles.link}>Não possui conta? Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}
