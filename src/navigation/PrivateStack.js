import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Login from "../screens/Login";
import Menu from "../screens/Menu";
import ListaCarregados from "../screens/ListaCarregados"
import Entregas from "../screens/Entregas";
import CardPedidoCompleto from "../components/CardPedidoCompleto";
import { ProdutosProvider } from "../context/ProdutosContext";
import { FormaPagamentosProvider } from "../context/FormaPagamentosContext";

const Stack = createNativeStackNavigator();

export const PrivateStack = () => {

    return (
        <ProdutosProvider >
            <FormaPagamentosProvider>
                <Stack.Navigator screenOptions={{headerShown: false}} >
                    <Stack.Screen name="Menu" component={Menu} />
                    <Stack.Screen name="Entregas" component={Entregas} />
                    <Stack.Screen name='PedidoCompleto' component={CardPedidoCompleto} />
                </Stack.Navigator>
            </FormaPagamentosProvider>
        </ProdutosProvider>
    )
}