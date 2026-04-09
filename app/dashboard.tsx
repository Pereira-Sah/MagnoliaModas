import React from 'react';
import { View, Text, ScrollView, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import TabBar from '../components/TabBar';
import { dashboardStyles, colors } from '../styles/dashboardStyles';

const { width } = Dimensions.get('window');

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

const DashboardCard = ({ title, children, icon, iconColor }: DashboardCardProps) => (
  <View style={dashboardStyles.card}>
    <View style={dashboardStyles.cardHeader}>
      <View style={dashboardStyles.titleRow}>
        <Ionicons name={icon} size={20} color={iconColor || colors.green} />
        <Text style={dashboardStyles.cardTitle}>{title}</Text>
      </View>
    </View>
    {children}
  </View>
);

export default function Dashboard() {
  return (
    <View style={dashboardStyles.container}>
      <View style={dashboardStyles.logoWrapper}>
        <Image 
          source={require('../assets/images/magnoliaModas_logo.png')} 
          style={dashboardStyles.logo} 
        />
      </View>

      <ScrollView 
        contentContainerStyle={dashboardStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={dashboardStyles.welcomeText}>Painel de Controle</Text>

        <DashboardCard title="Vendas de Hoje" icon="stats-chart-outline">
          <View style={dashboardStyles.salesRow}>
            <View>
              <Text style={dashboardStyles.mainNumber}>R$ 1.250,00</Text>
              <Text style={dashboardStyles.subText}>18 itens vendidos</Text>
            </View>
          </View>
          <LineChart
            data={{
              labels: ["9h", "12h", "15h", "18h"],
              datasets: [{ data: [200, 450, 280, 800] }]
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

        <DashboardCard title="Sugestão de Compra (IA)" icon="bulb-outline" iconColor={colors.pink}>
          <View style={dashboardStyles.aiCardBody}>
            <Text style={dashboardStyles.aiNumber}>25 unid.</Text>
            <Text style={[dashboardStyles.subText, {color: colors.pink, marginBottom: 8}]}>Recomendação de estoque</Text>
            <Text style={dashboardStyles.subText}>
              Tendência de alta para a categoria "Vestidos" nos próximos 7 dias.
            </Text>
          </View>
        </DashboardCard>

        <DashboardCard title="Alertas de Estoque" icon="warning-outline" iconColor="#E57373">
          <View style={dashboardStyles.alertItem}>
            <View style={[dashboardStyles.statusDot, {backgroundColor: '#E57373'}]} />
            <Text style={dashboardStyles.subText}>Vestido Floral (G) - Esgotado</Text>
          </View>
          <View style={dashboardStyles.alertItem}>
            <View style={[dashboardStyles.statusDot, {backgroundColor: '#FFB74D'}]} />
            <Text style={dashboardStyles.subText}>Calça Jeans (38) - Estoque Baixo</Text>
          </View>
        </DashboardCard>

<DashboardCard title="Mix de Vendas" icon="pie-chart-outline">
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <PieChart
      data={[
        {
          name: 'Vestidos',
          population: 45,
          color: colors.pink,
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
        {
          name: 'Camisetas',
          population: 25,
          color: colors.green,
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
        {
          name: 'Acessórios',
          population: 20,
          color: '#D1D1D1',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
        {
          name: 'Outros',
          population: 10,
          color: '#F5F5F5',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
      ]}
      width={width - 40}
      height={180}
      chartConfig={pieChartConfig}
      accessor={"population"}
      backgroundColor={"transparent"}
      paddingLeft={"15"}
      center={[10, 0]}
      absolute 
    />
    <View style={dashboardStyles.insightBadge}>
      <Text style={dashboardStyles.insightText}>
        💡 Dica: Vestidos representam quase metade das suas vendas!
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
  propsForDots: { r: "5", strokeWidth: "2", stroke: "#60875b" }
};

const pieChartConfig = {
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};