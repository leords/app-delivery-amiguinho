import { View } from 'react-native'
import { AuthStack } from './AuthStack'
import { PrivateStack } from './PrivateStack'
import { NavigationContainer } from '@react-navigation/native'
import { usarAuth } from '../context/AuthContext'

export const AppNavigator = () => {

    const { usuario } = usarAuth();

    return (
        <NavigationContainer>
            { usuario ? <PrivateStack/> : <AuthStack />}
        </NavigationContainer>
    )
}