// API/pedido/buscarPedidosCarregados.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../src/utils/conexaoAxios";
import { parseISO } from 'date-fns'

export const carregarPedido = async (uuid) => {

  const token = await AsyncStorage.getItem("token");
  
  try {
    const resposta = await api.patch(
      `/carregar-pedido-delivery/${uuid}`, 
      {},
      {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
    });

    return resposta.data;
  } catch (error) {
    console.log(error)
    if (error.response) {
      throw new Error(error.response.data.mensagem || "Erro na requisição");
    }
    if (error.request) {
      throw new Error("Servidor não respondeu, tente novamente");
    }
    throw new Error(error.message);
  }
};