// API/pedido/buscarPedidosCarregados.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../src/utils/conexaoAxios";


export const authLogin = async (credenciais) => {
  try {
    const resposta = await api.post("/login", credenciais);

    return resposta.data;
  } catch (error) {
    console.log(error);

    if (error.response) {
      throw new Error(error.response.data.mensagem || "Erro na requisição");
    }

    if (error.request) {
      throw new Error("Servidor não respondeu, tente novamente");
    }

    throw new Error(error.message);
  }
};