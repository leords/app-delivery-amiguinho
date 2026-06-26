import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from '@expo/vector-icons/Feather';
import { Animated, Easing } from "react-native";
import { useRef } from "react";

const cores = {
  orange: "#ff8c00",
  blue: "#2b5cb8",
  green: "#1f8825",
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

export default function TituloLista({icone, titulo, subtitulo, onAtualizar}) {

    // Rotacionar icone
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    // Função para rotacionar icone e no final chama a função atualizar lista do componente pai.
    const iniciarRotacao = () => {
        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(() => {
            rotateAnim.setValue(0);
        });

    onAtualizar?.();
    };

    return (

      <View style={estilos.cabecalho}>

        <View style={estilos.cabecalhoA}>
          <View style={[
              estilos.iconeWrapper,
              titulo === "CONFERÊNCIA"
                ? estilos.iconeWrapperConferir
                : titulo === "HISTÓRICO"
                ? estilos.iconeWrapperConcluida
                : estilos.iconeWrapperRota,
            ]}>
            {icone}
          </View>
          <View>
            <Text style={[
              estilos.subtitulo,
              titulo === "CONFERÊNCIA"
                ? estilos.subtituloConferir
                : titulo === "HISTÓRICO"
                ? estilos.subtituloConcluida
                : estilos.subtituloRota,
              ]}>{titulo}</Text>
            <Text style={estilos.titulo}>{subtitulo}</Text>
          </View>
        </View>

        <View style={estilos.cabecalhoB}>
            <TouchableOpacity onPress={iniciarRotacao}>
                <Animated.View
                    style={{ transform: [{ rotate }],}} > 
                    <Feather name="refresh-cw" size={24} color="black" />
                </Animated.View>
            </TouchableOpacity>
        </View>

      </View>
    )
}

const estilos = StyleSheet.create({
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

  iconeWrapperConferir: {
    backgroundColor: cores.orange,
  },
  iconeWrapperRota: {
    backgroundColor: cores.blue,
  },
  iconeWrapperConcluida: {
    backgroundColor: cores.green,
  },

  iconeWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: cores.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },

  subtituloConferir: {
    color: cores.orange
  },
  subtituloRota: {
    color: cores.blue
  },
  subtituloConcluida: {
    color: cores.green
  },

  subtitulo: {
    fontSize: 10,
    fontWeight: "700",
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
})