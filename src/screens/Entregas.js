import { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, SafeAreaView  } from "react-native";
import ListaPendentes from "./ListaPendentes";
import ListaCarregados from "./ListaCarregados";
import ListaConcluidas from "./ListaConcluidas";
import Cabecalho from "../components/Cabecalho";

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

export default function Entregas() {
  const [abaAtiva, setAbaAtiva] = useState("rota");

  // Função auxiliar para retornar estilos condicionais do botão
  const estilosBotao = (aba) => [
    estilos.botaoAba,
    abaAtiva === aba && estilos.botaoAbaSelecionada,
  ];

  // Função auxiliar para retornar estilos condicionais do texto
  const estilosTexto = (aba) => [
    estilos.textoAba,
    abaAtiva === aba && estilos.textoAbaSelecionada,
  ];

  return (
    <SafeAreaView  style={estilos.container}>
      <Cabecalho />

      {/* Abas de navegação */}
      <View style={estilos.cabecalho}>
        <TouchableOpacity
          style={estilosBotao("conferir")}
          onPress={() => setAbaAtiva("conferir")}
        >
          <Text style={estilosTexto("conferir")}>A Conferir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={estilosBotao("rota")}
          onPress={() => setAbaAtiva("rota")}
        >
          <Text style={estilosTexto("rota")}>Em Rota</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={estilosBotao("concluidas")}
          onPress={() => setAbaAtiva("concluidas")}
        >
          <Text style={estilosTexto("concluidas")}>Concluídas</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo por aba */}
      {abaAtiva === "conferir" && (
        <View style={estilos.corpo}>
          <ListaPendentes />
        </View>
      )}

      {abaAtiva === "rota" && (
        <View style={estilos.corpo}>
          <ListaCarregados />
        </View>
      )}

      {abaAtiva === "concluidas" && (
        <View style={estilos.corpo}>
          <ListaConcluidas />
        </View>
      )}
      
    </SafeAreaView >
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: cores.gray100,
  },
  cabecalho: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: cores.white,
    borderBottomWidth: 1,
    borderBottomColor: cores.border,
  },
  botaoAba: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  // ✅ Borda inferior aplicada no botão (TouchableOpacity), não no Text
  botaoAbaSelecionada: {
    borderBottomWidth: 2,
    borderBottomColor: cores.orange,
  },
  textoAba: {
    fontSize: 14,
    color: cores.gray500,
  },
  // ✅ fontWeight como string, color no Text
  textoAbaSelecionada: {
    color: cores.orange,
    fontWeight: "600",
  },
  corpo: {
    flex: 1,
    width: "100%",
  },
});
