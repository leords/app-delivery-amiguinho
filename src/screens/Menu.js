// Menu.js
import { View, StyleSheet, Image, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


import Entypo from "@expo/vector-icons/Entypo";
import BotaoPaginaInicio from "../components/BotaoPaginaInicio";
import Cabecalho from "../components/Cabecalho";

// Paleta oficial do Design System Amigão
const cores = {
  orange: "#ff8c00",
  green: "#2f9e44",
  blue: "#1971c2",
  purple: "#7048e8",
  gray900: "#1a1f2e",
  gray700: "#495057",
  gray500: "#868e96",
  gray300: "#dee2e6",
  gray100: "#f8f9fa",
  white: "#ffffff",
  border: "#eaecef",
};

export default function Menu() {
  return (
    <SafeAreaView style={estilos.container}>
      <Cabecalho />
      <View style={estilos.cartaoLogo}>
        <Image
          source={require("../assets/logo-delivery.png")}
          style={estilos.logo}
          resizeMode="contain"
        />
      </View>
      <View style={estilos.titulos}>
        <Text style={estilos.titulo}>Delivery Amiguinho</Text>
        <Text style={estilos.subtitulo}>ENTREGAS DISTRIBUIDORA AMIGÃO</Text>
      </View>
      <ScrollView
        contentContainerStyle={estilos.containerBotoes}
        showsVerticalScrollIndicator={false}
      >

        <BotaoPaginaInicio
          BGcolor={cores.orange}
          destinationPage={"Entregas"}
          image={<MaterialIcons name="pending-actions" size={26} color="white" />}
          name={"Entregas"}
        />

        <BotaoPaginaInicio
          BGcolor={cores.blue}
          destinationPage={"ListaCarregados"}
          image={<MaterialIcons name="delivery-dining" size={26} color="white" />}
          name={"Entregas carregadas"}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
  },

  cartaoLogo: {
    width: "100%",
    height: 160, // aumentado de 110 pra dar espaço pro personagem inteiro
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    overflow: "visible",
  },

  logo: {
    width: "85%",
    height: "100%",
  },

  titulos: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  titulo: {
    fontSize: 20,
    fontWeight: "800",
    color: cores.gray900,
    letterSpacing: -0.3,
  },

  subtitulo: {
    fontSize: 11,
    fontWeight: "700",
    color: cores.orange,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginTop: 6,
  },

  containerBotoes: {
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
});