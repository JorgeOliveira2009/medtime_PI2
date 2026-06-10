import { StyleSheet, Text, View } from 'react-native';
import PaginaArte from './assets/Pages/PaginaArte';
import PaginaLogin from './assets/Pages/PaginaLogin';
import PaginaCadastro from './assets/Pages/PaginaCadastro';
import PaginaPrincipal from './assets/Pages/PaginaPrincipal';
import MenuLateral from './assets/Components/MenuLateral';
import PaginaPerfil from './assets/Pages/PaginaPerfil';
import PaginaNotificacoes from './assets/Pages/PaginaNotificacoes';
import PaginaConfiguracoes from './assets/Pages/PaginaConfiguracoes';



export default function App() {
  return (
     <PaginaConfiguracoes/>
  );
}

const styles = StyleSheet.create({
    
});

/*import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PaginaArte from './assets/Pages/PaginaArte';
import PaginaLogin from './assets/Pages/PaginaLogin';
import PaginaCadastro from './assets/Pages/PaginaCadastro';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PaginaArte" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PaginaArte" component={PaginaArte} />
        <Stack.Screen name="PaginaLogin" component={PaginaLogin} />
        <Stack.Screen name="PaginaCadastro" component={PaginaCadastro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
  */ 