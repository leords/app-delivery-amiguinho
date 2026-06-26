import { setStatusBarTranslucent } from "expo-status-bar";
import { createContext, useContext, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { api } from "../utils/conexaoAxios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null)
    const [carregando, setCarregando] = useState(false)


    useEffect(() => {
        const checkUsuario = async () => {
        const token = await AsyncStorage.getItem("token")
        const nome = await AsyncStorage.getItem("nomeUsuario")
        const id = await AsyncStorage.getItem("idUsuario")
        const nivelAcesso = await AsyncStorage.getItem("nivelAcesso")


        if(token) {
            setUsuario({
                id: Number(id),
                nome, 
                nivelAcesso
            });
        }
    };

    checkUsuario()

    }, []);


    // Função logar
    const login = (credenciais) => {
        // Armazenando os dados do usuário e token no Storaged.
        AsyncStorage.setItem("token", credenciais.token);
        AsyncStorage.setItem("nomeUsuario", credenciais.usuario.nome);
        AsyncStorage.setItem("idUsuario", String(credenciais.usuario.id));
        AsyncStorage.setItem("nivelAcesso", credenciais.usuario.nivelAcesso);

        setUsuario({
        id: credenciais.usuario.id,
        nome: credenciais.usuario.nome,
        nivelAcesso: credenciais.usuario.nivelAcesso,
        });
    }

    // Função deslogar
    const sair = () => {
        // Remover do localStorage e limpar o estado
        AsyncStorage.removeItem("token");
        AsyncStorage.removeItem("nomeUsuario");
        AsyncStorage.removeItem("idUsuario");
        AsyncStorage.removeItem("nivelAcesso");
        setUsuario(null);
    };



    return (
        <AuthContext.Provider
            value={{ usuario, login, sair }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const usarAuth = () => useContext(AuthContext)