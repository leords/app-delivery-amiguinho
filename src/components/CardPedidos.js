// components/CardPedido.js
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const cores = {
  orange: "#ff8c00",
  orangeLight: "#fff3e0",
  orangeMid: "#ffd699",

  blue: "#2b5cb8",
  blueLight:'#c1d4f8',
  blueMid: '#577bbe',

  green: "#1f8825",
  greenLight:'#d1fad3',
  greenMid: '#66aa69',

  gray900: "#1a1f2e",
  gray700: "#495057",
  gray500: "#868e96",
  gray300: "#dee2e6",
  white: "#ffffff",
  border: "#eaecef",
};

function formatarData(isoString) {
  const data = new Date(isoString);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");
  return `${dia}/${mes} às ${hora}:${minuto}`;
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function CardPedido({ pedido, onPress }) {
  const { cliente, itens, total, data, formaPagamento } = pedido;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={estilos.containerLista}>

      <View style={estilos.cabecalho}>
        <View style={estilos.dataWrapper}>
          <FontAwesome name="clock-o" size={13} color={cores.gray500} />
          <Text style={estilos.data}>{formatarData(data)}</Text>
        </View>
        <View style={ pedido.status === 'pendente' ? estilos.badgePendente : pedido.status === 'carregado' ? estilos.badgeCarregado : estilos.badgeFinalizado } >
          <Text style={ pedido.status === 'pendente' ? estilos.badgeTextoPendente : pedido.status === 'carregado' ? estilos.badgeTextoCarregado : estilos.badgeTextoFinalizado}>
            {pedido.status === 'pendente' ? 'PENDENTE' : pedido.status === 'carregado' ? 'CARREGADO' : pedido.status === 'cancelado' ? 'CANCELADO' : 'FINALIZADO'}
            </Text>
        </View>
      </View>

      <Text style={estilos.nomeCliente} numberOfLines={1}>
        {cliente.nome}
      </Text>

      <View style={estilos.enderecoWrapper}>
        <FontAwesome name="map-marker" size={13} color={cores.gray500} />
        <Text style={estilos.endereco} numberOfLines={2}>
          {cliente.endereco}, {cliente.numero} — {cliente.bairro}
        </Text>
      </View>

      <View style={estilos.divisor} />

      <View style={estilos.rodape}>
        <View style={estilos.pagamentoWrapper}>
          <FontAwesome name="credit-card" size={13} color={cores.gray500} />
          <Text style={estilos.pagamento}>{formaPagamento.nome}</Text>
        </View>
        <Text style={[ pedido.status === 'pendente' ? estilos.totalPendente : pedido.status === 'carregado' ? estilos.totalCarregado : estilos.totalFinalizado ]}>{formatarMoeda(total)}</Text>
      </View>

      
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  containerLista: {
    backgroundColor: cores.white,
    borderRadius: 14,
    padding: 18,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  dataWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  data: {
    fontSize: 12,
    fontWeight: "600",
    color: cores.gray500,
  },

  badgePendente: {
    backgroundColor: cores.orangeLight,
    borderColor: cores.orangeMid,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeCarregado: {
    backgroundColor: cores.blueLight,
    borderColor: cores.blueMid,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeFinalizado: {
    backgroundColor: cores.greenLight,
    borderColor: cores.green,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },

  badgeTextoPendente: {
    color: cores.orange,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  badgeTextoCarregado: {
    color: cores.blue,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  badgeTextoFinalizado: {
    color: cores.green,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  nomeCliente: {
    fontSize: 17,
    fontWeight: "800",
    color: cores.gray900,
    marginBottom: 6,
  },

  enderecoWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },

  endereco: {
    flex: 1,
    fontSize: 13,
    color: cores.gray700,
    lineHeight: 18,
  },

  divisor: {
    height: 1,
    backgroundColor: cores.border,
    marginVertical: 12,
  },

  itensWrapper: {
    gap: 4,
    marginBottom: 12,
  },

  itemTexto: {
    fontSize: 13,
    color: cores.gray700,
    fontWeight: "500",
  },

  rodape: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  pagamentoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  pagamento: {
    fontSize: 12,
    fontWeight: "600",
    color: cores.gray500,
  },

  totalPendente: {
    fontSize: 18,
    fontWeight: "800",
    color: cores.orange,
  },

  totalFinalizado: {
    fontSize: 18,
    fontWeight: "800",
    color: cores.green,
  },

  totalCarregado: {
    fontSize: 18,
    fontWeight: "800",
    color: cores.blue,
  },
  
});