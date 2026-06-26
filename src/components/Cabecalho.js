import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { usarAuth } from "../context/AuthContext";

const cores = {
  orange: "#ff8c00",
  gray900: "#1a1f2e",
  gray700: "#495057",
  red: "#c92a2a",
  redLight: "#fff5f5",
};

export default function Cabecalho() {
  const navigation = useNavigation();
  const { sair } = usarAuth();

  const podeVoltar = navigation.canGoBack();

  return (
    <View style={estilos.cabecalho}>
      <View style={estilos.lado}>
        {podeVoltar && (
          <TouchableOpacity
            style={estilos.botaoVoltar}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={cores.gray700} />
            <Text style={estilos.textoVoltar}>Voltar</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[estilos.lado, estilos.ladoDireito]}>
        <TouchableOpacity
          style={estilos.botaoSair}
          onPress={sair}
          activeOpacity={0.7}
        >
          <Text style={estilos.textoSair}>Sair</Text>
          <FontAwesome name="sign-out" size={18} color={cores.red} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecalho: {
    width: "100%",
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    // ✅ marginTop removido daqui — responsabilidade de cada tela
    marginTop: Platform.OS === "android" ? 15 : 0,
  },
  lado: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  ladoDireito: {
    justifyContent: "flex-end",
  },
  botaoVoltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingRight: 10,
  },
  textoVoltar: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.gray700,
  },
  botaoSair: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: cores.redLight,
    borderRadius: 20,
  },
  textoSair: {
    fontSize: 13,
    fontWeight: "700",
    color: cores.red,
  },
});
