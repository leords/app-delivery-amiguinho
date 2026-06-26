// screens/SalesDay.js
import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { buscarPedidosCarregados } from "../../API/pedido/buscarPedidoCarregados";
import CardPedido from "../components/CardPedidos"
import { dataFormatadaCalendario } from "../utils/formatarData";
import Cabecalho from "../components/Cabecalho";
import TituloLista from "../components/TituloPagina";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const cores = {
  green: "#208120",
  gray900: "#1a1f2e",
  gray700: "#495057",
  gray500: "#868e96",
  gray300: "#dee2e6",
  gray100: "#f8f9fa",
  white: "#ffffff",
  border: "#eaecef",
  red: "#c92a2a",
  redLight: "#fff5f5",
};

export default function ListaConcluidas() {

  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");

  const inicio = dataFormatadaCalendario();
  const fim = dataFormatadaCalendario();

  async function carregarPedidos() {
    try {
      setErro("");
      const dados = await buscarPedidosCarregados({ 
        setor: "delivery", 
        dataInicio: inicio,
        dataFim: fim,
        status: "entregue"
      });
      setPedidos(dados);

    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

    useFocusEffect(
      useCallback(() => {
         carregarPedidos();
       }, [])
    )



  const aoAtualizar = useCallback(() => {
    setAtualizando(true);
    carregarPedidos();
  }, []);

  return (
    <SafeAreaView style={estilos.container}>

      <TituloLista 
        icone = { <MaterialCommunityIcons name="clipboard-check-outline" size={26} color={cores.white} /> } 
        titulo = {'HISTÓRICO'}
        subtitulo = {'Entregas concluidas'}
        onAtualizar = {aoAtualizar}
      />

      {carregando ? (
        <View style={estilos.centro}>
          <ActivityIndicator size="large" color={cores.green} />
        </View>
      ) : erro ? (
        <View style={estilos.centro}>
          <View style={estilos.erroCaixa}>
            <FontAwesome name="exclamation-circle" size={20} color={cores.red} />
            <Text style={estilos.erroTexto}>{erro}</Text>
          </View>
        </View>
      ) : pedidos.length === 0 ? (
        <View style={estilos.centro}>
          <FontAwesome name="check-circle" size={40} color={cores.gray300} />
          <Text style={estilos.vazioTitulo}>Nenhuma entrega pendente</Text>
          <Text style={estilos.vazioTexto}>
            Todas as entregas carregadas já foram feitas
          </Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.uuid}
          renderItem={({ item }) => <CardPedido pedido={item} />}
          contentContainerStyle={estilos.lista}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={aoAtualizar}
              colors={[cores.green]}
              tintColor={cores.green}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.gray100,
  },

  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: cores.white,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: cores.border,
  },

  iconeWrapper: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: cores.green,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: cores.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },

  subtitulo: {
    fontSize: 11,
    fontWeight: "700",
    color: cores.green,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 2,
  },

  titulo: {
    fontSize: 20,
    fontWeight: "800",
    color: cores.gray900,
    letterSpacing: -0.3,
  },

  lista: {
    padding: 20,
  },

  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 8,
  },

  erroCaixa: {
    backgroundColor: cores.redLight,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  erroTexto: {
    color: cores.red,
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },

  vazioTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: cores.gray500,
    marginTop: 8,
  },

  vazioTexto: {
    fontSize: 13,
    color: cores.gray300,
    textAlign: "center",
  },
});