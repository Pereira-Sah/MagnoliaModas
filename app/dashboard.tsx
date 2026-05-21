import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LineChart, PieChart } from "react-native-chart-kit";
import TabBar from "../components/TabBar";
import { dashboardStyles, colors } from "../styles/dashboardStyles";
import api from "../src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get("window");

interface AlertaEstoque {
  item: string;
  status: "Esgotado" | "Baixo";
}

interface ItemMix {
  name: string;
  population: number;
  color: string;
}

interface DashboardData {
  vendas_hoje: {
    total_reais: number;
    itens_vendidos: number;
    grafico_horas: string[];
    grafico_valores: number[];
  };
  sugestao_ia: {
    quantidade: number;
    categoria: string;
    texto: string;
  };
  alertas_estoque: AlertaEstoque[];
  mix_vendas: ItemMix[];
}

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

const DashboardCard = ({
  title,
  children,
  icon,
  iconColor,
}: DashboardCardProps) => (
  <View style={dashboardStyles.card}>
    <View style={dashboardStyles.cardHeader}>
      <View style={dashboardStyles.titleRow}>
        <Ionicons
          name={icon}
          size={20}
          color={iconColor || colors.Lightolivegreen}
        />
        <Text style={dashboardStyles.cardTitle}>{title}</Text>
      </View>
    </View>
    {children}
  </View>
);

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nome, setNome] = useState("Usuária");
  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/dashboard/dados");
      setData(response.data);
    } catch (error) {
      console.log("Erro ao buscar dados do dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const obterDadosUsuario = async () => {
      let nomeSalvo;

      if (Platform.OS === "web") {
        nomeSalvo = localStorage.getItem("userName");
      } else {
        nomeSalvo = await SecureStore.getItemAsync("userName");
      }

      if (nomeSalvo) setNome(nomeSalvo);
    };

    obterDadosUsuario();
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <View
        style={[
          dashboardStyles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.dustypink} />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Carregando dados do painel...
        </Text>
      </View>
    );
  }

  const graficoHoras = data?.vendas_hoje?.grafico_horas?.length
    ? data.vendas_hoje.grafico_horas
    : ["9h", "12h", "15h", "18h"];

  const graficoValores = data?.vendas_hoje?.grafico_valores?.length
    ? data.vendas_hoje.grafico_valores
    : [0, 0, 0, 0];

  const mixVendasData = data?.mix_vendas?.length ? data.mix_vendas : [];

  return (
    <View style={dashboardStyles.container}>
      <View style={dashboardStyles.heroSection}>
        <View style={dashboardStyles.heroBlob} />

        <View style={dashboardStyles.heroTopRow}>
          <View>
            <Text style={dashboardStyles.heroGreeting}>Olá, {nome} !</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={dashboardStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.dustypink]}
          />
        }
      >
        <Text style={dashboardStyles.welcomeText}>Painel de Controle</Text>

        {/* CARD 1: VENDAS DE HOJE */}
        <DashboardCard title="Vendas de Hoje" icon="stats-chart-outline">
          <View style={dashboardStyles.salesRow}>
            <View>
              <Text style={dashboardStyles.mainNumber}>
                R${" "}
                {data?.vendas_hoje?.total_reais !== undefined
                  ? data.vendas_hoje.total_reais.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "0,00"}
              </Text>
              <Text style={dashboardStyles.subText}>
                {data?.vendas_hoje?.itens_vendidos || 0} itens vendidos
              </Text>
            </View>
          </View>
          <LineChart
            data={{
              labels: graficoHoras,
              datasets: [{ data: graficoValores }],
            }}
            width={width - 64}
            height={140}
            chartConfig={lineChartConfig}
            bezier
            style={dashboardStyles.chartStyle}
            yAxisLabel="R$"
            yAxisSuffix=""
          />
        </DashboardCard>

        {/* CARD 2: SUGESTÃO DE COMPRA*/}
        <DashboardCard
          title="Sugestão de Compra (IA)"
          icon="bulb-outline"
          iconColor={colors.dustypink}
        >
          <View style={dashboardStyles.aiCardBody}>
            <Text style={dashboardStyles.aiNumber}>
              {data?.sugestao_ia?.quantidade || 0} unid.
            </Text>
            <Text
              style={[
                dashboardStyles.subText,
                { color: colors.dustypink, marginBottom: 8 },
              ]}
            >
              Foco na Categoria:{" "}
              {data?.sugestao_ia?.categoria || "Carregando..."}
            </Text>
            <Text style={dashboardStyles.subText}>
              {data?.sugestao_ia?.texto ||
                "Aguardando projeção inteligente do modelo."}
            </Text>
          </View>
        </DashboardCard>

        {/* CARD 3: ALERTAS DE ESTOQUE */}
        <DashboardCard
          title="Alertas de Estoque"
          icon="warning-outline"
          iconColor="#E57373"
        >
          {data?.alertas_estoque && data.alertas_estoque.length > 0 ? (
            data.alertas_estoque.map((alerta, index) => (
              <View key={index} style={dashboardStyles.alertItem}>
                <View
                  style={[
                    dashboardStyles.statusDot,
                    {
                      backgroundColor:
                        alerta.status === "Esgotado" ? "#E57373" : "#FFB74D",
                    },
                  ]}
                />
                <Text style={dashboardStyles.subText}>
                  {alerta.item} - {alerta.status}
                </Text>
              </View>
            ))
          ) : (
            <Text style={dashboardStyles.subText}>
              🎉 Todos os produtos estão com estoque em dia!
            </Text>
          )}
        </DashboardCard>

        <DashboardCard title="Mix de Vendas" icon="pie-chart-outline">
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            {mixVendasData.length > 0 ? (
              <PieChart
                data={mixVendasData.map((item) => ({
                  name: item.name,
                  population: item.population,
                  color: item.color || colors.dustypink,
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 12,
                }))}
                width={width - 40}
                height={180}
                chartConfig={pieChartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[10, 0]}
                absolute
              />
            ) : (
              <Text style={[dashboardStyles.subText, { marginVertical: 20 }]}>
                Nenhuma venda registrada hoje.
              </Text>
            )}

            <View style={dashboardStyles.insightBadge}>
              <Text style={dashboardStyles.insightText}>
                💡 Dica: A categoria "
                {mixVendasData[0]?.name || "Principais Peças"}" é o seu
                principal destaque hoje!
              </Text>
            </View>
          </View>
        </DashboardCard>
      </ScrollView>

      <TabBar />
    </View>
  );
}

const lineChartConfig = {
  backgroundGradientFrom: "#FFF",
  backgroundGradientTo: "#FFF",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(96, 135, 91, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
  strokeWidth: 3,
  propsForDots: { r: "5", strokeWidth: "2", stroke: "#60875b" },
};

const pieChartConfig = {
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};
