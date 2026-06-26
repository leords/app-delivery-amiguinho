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
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { buscarPedidosCarregados } from "../../API/pedido/buscarPedidoCarregados";
import CardPedido from "../components/CardPedidos"
import { dataFormatadaCalendario } from "../utils/formatarData";
import Cabecalho from "../components/Cabecalho";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import TituloLista from "../components/TituloPagina";

const cores = {
  orange: "#ff8c00",
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

export default function ListaPendentes() {

  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");

  const inicio = dataFormatadaCalendario();
  const fim = dataFormatadaCalendario();

  const navegacao = useNavigation();

  async function carregarPedidos() {
    try {
      setErro("");
      const dados = await buscarPedidosCarregados({ 
        setor: "delivery", 
        dataInicio: inicio,
        dataFim: fim,
        status: "pendente"
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

    console.log('CHAMEI!')
  }, []);

  return (
    <SafeAreaView style={estilos.container}>

      <TituloLista 
        icone = { <FontAwesome6 name="list-check" size={20} color={cores.white} /> } 
        titulo = {'CONFERÊNCIA'}
        subtitulo = {'Entregas pendentes'}
        onAtualizar = {aoAtualizar}
      />

      {carregando ? (
        <View style={estilos.centro}>
          <ActivityIndicator size="large" color={cores.orange} />
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
            Nenhum pedido digitado na data de hoje
          </Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.uuid}
          renderItem={({ item }) => (
            <CardPedido 
              pedido={item}
              onPress={() => navegacao.navigate("PedidoCompleto", { pedido: item })}
            
            />
          )}
          contentContainerStyle={estilos.lista}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={aoAtualizar}
              colors={[cores.orange]}
              tintColor={cores.orange}
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
    
  },

  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.white,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: cores.border,
  },

  cabecalhoA: {
    width: '70%',
    display: 'flex',
    flexDirection: 'row',
    gap: 10
  },
  cabecalhoB: {
    width: '28%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },

  iconeWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: cores.orange,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: cores.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },

  subtitulo: {
    fontSize: 10,
    fontWeight: "700",
    color: cores.orange,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 2,
  },

  titulo: {
    fontSize: 18,
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