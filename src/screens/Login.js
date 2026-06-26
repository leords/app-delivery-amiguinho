import { useState } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authLogin } from "../../API/pedido/authLogin";
import { usarAuth } from '../context/AuthContext'


const cores = {
  orange: "#ff8c00",
  orangeLight: "#fff3e0",
  orangeMid: "#ffd699",
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

export default function Login() {
  const navegacao = useNavigation();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [focado, setFocado] = useState(null);

  const { login } = usarAuth();

  async function realizarLogin() {
    setErro("");
    if (!usuario || !senha) {
      setErro("Preencha usuário e senha");
      return;
    }
    setCarregando(true);
    try {
      const resposta = await authLogin({ usuario, senha });
      login(resposta);
    } catch (e) {
      setErro(e.message || "Usuário ou senha inválidos");
    } finally {
      setCarregando(false);
    }
  }

  return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={0}
  >
    <ScrollView
      style={estilos.scroll}
      contentContainerStyle={estilos.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor={cores.gray100} />

      <View style={estilos.cartaoLogo}>
        <Image
          source={require("../assets/logo-delivery.png")}
          style={estilos.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={estilos.titulo}>Delivery Amiguinho</Text>
      <Text style={estilos.subtitulo}>RELATÓRIO DE ENTREGAS</Text>

      <View style={estilos.cartao}>
        <Text style={estilos.rotulo}>Usuário</Text>
        <View style={estilos.campoWrapper}>
          <TextInput
            placeholder="Digite seu usuário"
            placeholderTextColor={cores.gray500}
            style={estilos.input}
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <Text style={[estilos.rotulo, { marginTop: 18 }]}>Senha</Text>
        <View style={estilos.campoWrapper}>
          <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor={cores.gray500}
            style={estilos.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!mostrarSenha}
            textContentType="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => setMostrarSenha((v) => !v)}
            style={estilos.botaoOlho}
          >
            <Text style={estilos.textoOlho}>
              {mostrarSenha ? "OCULTAR" : "VER"}
            </Text>
          </TouchableOpacity>
        </View>

        {erro ? <Text style={estilos.textoErro}>{erro}</Text> : null}

        <TouchableOpacity
          onPress={realizarLogin}
          style={estilos.botao}
          disabled={carregando}
          activeOpacity={0.85}
        >
          {carregando ? (
            <ActivityIndicator color={cores.white} />
          ) : (
            <Text style={estilos.textoBotao}>ENTRAR</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={estilos.rodape}>v1.0 · leords</Text>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: cores.gray100, // ✅ bg no ScrollView, não no container
  },

  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 40,
  },

  cartaoLogo: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: "65%",
    height: "100%",
  },

  titulo: {
    fontSize: 24,
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
    marginTop: 4,
    marginBottom: 28,
  },

  cartao: {
    width: "100%",
    backgroundColor: cores.white,
    borderRadius: 14,
    padding: 24,
    borderWidth: 1,
    borderColor: cores.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  rotulo: {
    fontSize: 11,
    fontWeight: "700",
    color: cores.gray700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  campoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.white,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: cores.gray300,
  },

  campoFocado: {
    borderColor: cores.orange,
    shadowColor: cores.orange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },

  input: {
    flex: 1,
    color: cores.gray700,
    fontSize: 15,
    fontWeight: "500",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  botaoOlho: {
    paddingHorizontal: 14,
  },

  textoOlho: {
    color: cores.orange,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  textoErro: {
    color: cores.red,
    backgroundColor: cores.redLight,
    fontSize: 12,
    fontWeight: "600",
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    textAlign: "center",
  },

  botao: {
    flexDirection: "row",
    backgroundColor: cores.orange,
    paddingVertical: 14,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    shadowColor: cores.orange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  botaoDesabilitado: {
    backgroundColor: cores.gray300,
    shadowOpacity: 0,
  },

  textoBotao: {
    color: cores.white,
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.5,
  },

  rodape: {
    color: cores.gray300,
    fontSize: 11,
    marginTop: 24,
  },
});
