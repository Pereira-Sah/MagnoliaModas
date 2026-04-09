import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { perfilStyles, colors } from '../styles/perfilStyles';
import TabBar from '../components/TabBar';

const InfoItem = ({ icon, label, value, isLast = false }: any) => (
  <View style={[perfilStyles.infoRow, isLast && { marginBottom: 0 }]}>
    <View style={perfilStyles.iconBox}>
      <Ionicons name={icon} size={20} color={colors.green} />
    </View>
    <View>
      <Text style={perfilStyles.infoLabel}>{label}</Text>
      <Text style={perfilStyles.infoValue}>{value}</Text>
    </View>
  </View>
);

export default function Perfil() {
  return (
    <View style={perfilStyles.container}>
      <View style={perfilStyles.logoWrapper}>
        <Image 
          source={require('../assets/images/magnoliaModas_logo.png')} 
          style={perfilStyles.logo} 
        />
      </View>

      <ScrollView 
        contentContainerStyle={perfilStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        
        <View style={perfilStyles.avatarWrapper}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200' }} 
            style={perfilStyles.avatar} 
          />
          <TouchableOpacity style={perfilStyles.editIconButton} activeOpacity={0.7}>
            <Ionicons name="pencil" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>

        <Text style={perfilStyles.userName}>Fernanda Magnolia</Text>
        <View style={perfilStyles.roleBadge}>
          <Text style={perfilStyles.roleText}>Administradora</Text>
        </View>

        <View style={perfilStyles.sectionCard}>
          <InfoItem icon="mail-outline" label="E-mail Cadastrado" value="fernanda@magnoliamodas.com" />
          <InfoItem icon="call-outline" label="Telefone" value="(11) 98888-7777" />
          <InfoItem icon="business-outline" label="Loja" value="Magnolia Modas" isLast/>
        </View>

        <View style={perfilStyles.sectionCard}>
          <InfoItem icon="calendar-outline" label="Membro desde" value="Janeiro de 2024"  />
          <InfoItem icon="cube-outline" label="Produtos cadastrados pelo usuário" value="128" />
          <InfoItem icon="checkmark-circle-outline" label="Status" value="Ativo"  isLast />
        </View>

        <TouchableOpacity style={perfilStyles.logoutButton} activeOpacity={0.6}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={perfilStyles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        <Text style={{ marginTop: 20, color: '#CCC', fontSize: 10 }}>Magnolia Systems - Todos os direitos reservados</Text>

      </ScrollView>

      <TabBar />
    </View>
  );
}