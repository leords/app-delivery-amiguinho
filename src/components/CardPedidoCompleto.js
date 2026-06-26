// components/CardPedido.js
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, FlatList } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { usarProdutos } from "../context/ProdutosContext"
import Cabecalho from "./Cabecalho";
import { usarFormasPagamento } from "../context/FormaPagamentosContext";
import { carregarPedido } from "../../API/pedido/carregarPedido";
import { finalizarPedido } from "../../API/pedido/FinalizarPedido";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

const cores = {
  orange: "#ff8c00",
  orangeLight: "#fff3e0",
  orangeMid: "#ffd699",
  gray900: "#1a1f2e",
  gray700: "#495057",
  gray500: "#868e96",
  gray300: "#dee2e6",
  white: "#ffffff",
  border: "#eaecef",
  green: "#2e7d32",
  greenLight: "#e8f5e9",
  greenMid: "#a5d6a7",
  red: "#c62828",
  redLight: "#ffebee",
  redMid: "#ef9a9a",
  blue: "#1565c0",
  blueLight: "#e3f2fd",
  blueMid: "#90caf9",
};

// Config badge por status
const BADGE_CONFIG = {
  pendente:  { label: "A CONFERIR",  bg: cores.orangeLight, border: cores.orangeMid, text: cores.orange },
  carregado: { label: "EM ROTA",     bg: cores.blueLight,   border: cores.blueMid,   text: cores.blue },
  entregue:  { label: "ENTREGUE",    bg: cores.greenLight,  border: cores.greenMid,  text: cores.green },
  cancelado: { label: "CANCELADO",   bg: cores.redLight,    border: cores.redMid,    text: cores.red },
};


// Helpers 
function formatarData(isoString) {
  if (!isoString) return "—";
  const data = new Date(isoString);
  const dia    = String(data.getDate()).padStart(2, "0");
  const mes    = String(data.getMonth() + 1).padStart(2, "0");
  const hora   = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");
  return `${dia}/${mes} às ${hora}:${minuto}`;
}

function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Componente Principal
export default function CardPedidoCompleto({ route }) {
    const { pedido } = route.params;
    console.log('pedido: ', pedido)
    const { uuid, cliente, itens, total, data, formaPagamento, status } = pedido;
    const { produtosMap } = usarProdutos();
    const { formasPagamentoMap } = usarFormasPagamento();

    const [modalFinalizarVisivel, setModalFinalizarVisivel] = useState(false);
    const [statusSelecionado, setStatusSelecionado]         = useState("entregue");
    const [formaSelecionada, setFormaSelecionada]           = useState(pedido.formaPagamento);
    const [lat, setLat] = useState("")
    const [long, setLong] = useState("")
    const [precisao, setPrecisao] = useState("")

    const navegacao = useNavigation();

  const badge = BADGE_CONFIG[pedido.status] ?? BADGE_CONFIG.pendente;

  // Captura GPS
  async function capturarLocalizacao() {
    const { status } = await Location.requestForegroundPermissionsAsync();
  
    if (status !== "granted") {
      throw new Error("Permissão de localização negada.");
    }
  
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    setLat(location.coords.latitude)
    setLong(location.coords.longitude)
    setPrecisao(location.coords.accuracy)

  }

  // Confirmação de carregamento
  async function handleConfirmacao() {
    Alert.alert(
      "Confirmar carregamento",
      "Realmente deseja carregar este pedido?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: handleCarregar,
        },
      ]
    );
  }

    async function handleCarregar() {

      const resultado = await carregarPedido(pedido.uuid)

      // valida retorno da API
      if(!resultado) return 

      // voltar a rota anterior.
      navegacao.goBack();
  }

  // Finalizar pedido (entregue / cancelado)
  async function handleFinalizar() {
    await finalizarPedido({
      uuid: pedido.uuid,
      status: statusSelecionado,
      lat: lat,
      long: long,
      precisao: precisao,
      formaPagamentoId: formaSelecionada.id,

    });
    setModalFinalizarVisivel(false);
  }

  return (
      <View style={estilos.container}>
        <Cabecalho />
    <View style={estilos.corpo}>

        {/* DATA E STATUS */}
        <View style={estilos.cabecalho}>
            <View style={estilos.dataWrapper}>
              <FontAwesome name="clock-o" size={13} color={cores.orange} />
              <Text style={estilos.data}>{formatarData(pedido.data)}</Text>
            </View>
            <View style={[estilos.badge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
              <Text style={[estilos.badgeTexto, { color: badge.text }]}>{badge.label}</Text>
            </View>
        </View>

        {/* CLIENTE */}
        <View style={estilos.descricao}>
          <Text style={estilos.subtitulo}>Pedido do cliente: </Text>
          <Text style={estilos.titulo}>{pedido.cliente.nome}</Text>
        </View>
        
        <View style={estilos.card}>

          {/* Endereço */}
          <View style={estilos.linhaInfo}>
              <FontAwesome name="map-marker" size={13} color={cores.gray500} />
              <Text style={estilos.textoInfo} numberOfLines={2}>
                {pedido.cliente.endereco}, {pedido.cliente.numero}
                {pedido.cliente.bairro ? ` — ${pedido.cliente.bairro}` : ""} · {pedido.cliente.cidade}
              </Text>
          </View>

          {/* Vendedor */}
          <View style={estilos.linhaInfo}>
              <FontAwesome name="user" size={13} color={cores.gray500} />
              <Text style={estilos.textoInfo}>{pedido.vendedor}</Text>
          </View>

          <View style={estilos.divisor} />

          {/* Itens */}
          <View style={estilos.itensWrapper}>
              {pedido.itens.map((item) => {
              const produto = produtosMap[item.produtoId];
              return (
                  <View key={item.id} style={estilos.itemLinha}>
                  <Text style={estilos.itemQtd}>{item.quantidade}x</Text>
                  <Text style={estilos.itemNome} numberOfLines={1}>
                      {produto ? produto.nome : `Produto #${item.produtoId}`}
                  </Text>
                  <Text style={estilos.itemValor}>{formatarMoeda(item.valorTotal)}</Text>
                  </View>
              );
              })}
          </View>

          <View style={estilos.divisor} />

          {/* Forma de pagamento e Total */}
              <View style={estilos.linhaInfo}>
                <FontAwesome name="credit-card" size={13} color={cores.gray500} />
                <Text style={estilos.textoInfo}>{pedido.formaPagamento.nome}</Text>
                <Text style={estilos.total}>{formatarMoeda(pedido.total)}</Text>
              </View>
      

          {/* Ações condicionais por status */}
          {/* STATUS: pendente → botão confirmar carregamento */}
          {pedido.status === "pendente" && (
              <TouchableOpacity style={estilos.botaoCarregar} onPress={handleConfirmacao} activeOpacity={0.85}>
                <FontAwesome name="truck" size={14} color={cores.white} />
                <Text style={estilos.botaoCarregarTexto}>CONFIRMAR CARREGAMENTO</Text>
              </TouchableOpacity>
          )}

          {/* STATUS: carregado → finalizar entrega */}
          {pedido.status === "carregado" && (
              <>
              <TouchableOpacity
                  style={estilos.botaoFinalizar}
                  onPress={() => setModalFinalizarVisivel(true)}
                  activeOpacity={0.85}
              >
                  <FontAwesome name="check-circle" size={14} color={cores.white} />
                  <Text style={estilos.botaoFinalizarTexto}>FINALIZAR PEDIDO</Text>
              </TouchableOpacity>

              {/* Modal de finalização */}
              <Modal
                  visible={modalFinalizarVisivel}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setModalFinalizarVisivel(false)}
              >
                  <View style={estilos.modalOverlay}>
                  <View style={estilos.modalContainer}>

                      <Text style={estilos.modalTitulo}>Finalizar Pedido</Text>
                      <Text style={estilos.modalSubtitulo}>{pedido.cliente.nome}</Text>

                      <View style={estilos.divisor} />

                      {/* Forma de pagamento */}
                      <Text style={estilos.modalSecao}>Forma de Pagamento</Text>
                      <View style={estilos.opcoesWrapper}>
                      {formasPagemento.map((forma) => {
                          const ativo = formaSelecionada?.id === forma.id;
                          return (
                          <TouchableOpacity
                              key={forma.id}
                              style={[estilos.opcaoBotao, ativo && estilos.opcaoBotaoAtivo]}
                              onPress={() => setFormaSelecionada(forma)}
                          >
                              <Text style={[estilos.opcaoTexto, ativo && estilos.opcaoTextoAtivo]}>
                              {forma.nome}
                              </Text>
                          </TouchableOpacity>
                          );
                      })}
                      </View>

                      {/* Status final */}
                      <Text style={[estilos.modalSecao, { marginTop: 16 }]}>Status</Text>
                      <View style={estilos.opcoesWrapper}>
                      {[
                          { value: "entregue",  label: "ENTREGUE",  cor: cores.green,  corLight: cores.greenLight,  corBorder: cores.greenMid },
                          { value: "cancelado", label: "CANCELADO", cor: cores.red,    corLight: cores.redLight,    corBorder: cores.redMid },
                      ].map((opcao) => {
                          const ativo = statusSelecionado === opcao.value;
                          return (
                          <TouchableOpacity
                              key={opcao.value}
                              style={[
                              estilos.opcaoBotao,
                              ativo && { backgroundColor: opcao.corLight, borderColor: opcao.corBorder },
                              ]}
                              onPress={() => setStatusSelecionado(opcao.value)}
                          >
                              <Text style={[estilos.opcaoTexto, ativo && { color: opcao.cor, fontWeight: "700" }]}>
                              {opcao.label}
                              </Text>
                          </TouchableOpacity>
                          );
                      })}
                      </View>

                      <View style={estilos.divisor} />

                      {/* Ações do modal */}
                      <View style={estilos.modalAcoes}>
                      <TouchableOpacity
                          style={estilos.botaoCancelarModal}
                          onPress={() => setModalFinalizarVisivel(false)}
                      >
                          <Text style={estilos.botaoCancelarModalTexto}>Voltar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={estilos.botaoConfirmarModal} onPress={handleFinalizar}>
                          <Text style={estilos.botaoConfirmarModalTexto}>Confirmar</Text>
                      </TouchableOpacity>
                      </View>

                  </View>
                  </View>
              </Modal>
              </>
          )}

        </View>
            </View>
    </View>
  );
}

// Estilos
const estilos = StyleSheet.create({
  container: {
      flex: 1,
  },

  corpo: {
      height: '95%',
      alignItems: 'center',
      padding: 20,
  },

  descricao: {
    width: '100%',
    display: 'flex',
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: cores.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    paddingVertical: 10
  },

  iconeWrapper: {
    width: 46,
    height: 46,
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
    fontSize: 11,
    fontWeight: "700",
    color: cores.orange,
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
  
  card: {
    flex: 1,
    width: '100%',
    backgroundColor: cores.white,
    borderRadius: 14,
    padding: 18,
    marginTop: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: cores.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  cabecalho: {
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10
  },

  dataWrapper: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 6 
  },

  data: { 
    fontSize: 12, 
    fontWeight: "600", 
    color: cores.gray500 
  },

  badge: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeTexto: { 
    fontSize: 10, 
    fontWeight: "700", 
    letterSpacing: 0.5 
  },
  nomeCliente: { 
    fontSize: 17, 
    fontWeight: "800", 
    color: cores.gray900, 
    marginBottom: 6 
  },

  linhaInfo: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: 'center',
    gap: 6, 
    marginBottom: 4,
  },

  textoInfo: { 
    flex: 1, 
    fontSize: 13, 
    color: cores.gray700, 
    lineHeight: 18 
  },
  divisor:    { height: 1, backgroundColor: cores.border, marginVertical: 12 },
  itensWrapper: { gap: 6 },
  itemLinha: { flexDirection: "row", alignItems: "center", gap: 6 },
  itemQtd:   { fontSize: 13, fontWeight: "700", color: cores.orange, width: 28 },
  itemNome:  { flex: 1, fontSize: 13, color: cores.gray700 },
  itemValor: { fontSize: 13, fontWeight: "600", color: cores.gray700 },

  total: { fontSize: 18, fontWeight: "800", color: cores.orange },

  // Botão carregar
  botaoCarregar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: cores.orange,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 14,
  },
  botaoCarregarTexto: { color: cores.white, fontWeight: "700", fontSize: 13, letterSpacing: 0.5 },

  // Botão finalizar
  botaoFinalizar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: cores.blue,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 14,
  },
  botaoFinalizarTexto: { color: cores.white, fontWeight: "700", fontSize: 13, letterSpacing: 0.5 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: cores.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitulo:   { fontSize: 18, fontWeight: "800", color: cores.gray900 },
  modalSubtitulo:{ fontSize: 14, color: cores.gray500, marginTop: 2 },
  modalSecao:    { fontSize: 13, fontWeight: "700", color: cores.gray700, marginBottom: 8 },
  opcoesWrapper: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  opcaoBotao: {
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: cores.white,
  },
  opcaoBotaoAtivo: {
    backgroundColor: cores.orangeLight,
    borderColor: cores.orangeMid,
  },
  opcaoTexto:      { fontSize: 13, fontWeight: "600", color: cores.gray500 },
  opcaoTextoAtivo: { color: cores.orange, fontWeight: "700" },
  modalAcoes: { flexDirection: "row", gap: 10, marginTop: 4 },
  botaoCancelarModal: {
    flex: 1,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  botaoCancelarModalTexto: { fontSize: 14, fontWeight: "600", color: cores.gray700 },
  botaoConfirmarModal: {
    flex: 2,
    backgroundColor: cores.orange,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  botaoConfirmarModalTexto: { fontSize: 14, fontWeight: "700", color: cores.white },
});
