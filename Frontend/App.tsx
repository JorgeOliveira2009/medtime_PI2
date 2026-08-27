import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider } from './assets/Contexts/AuthContext';
import { RemediosProvider } from './assets/Contexts/RemediosContext';

import PaginaArte from './assets/Pages/PaginaArte';
import PaginaLogin from './assets/Pages/PaginaLogin';
import PaginaCadastro from './assets/Pages/PaginaCadastro';
import PaginaPrincipal from './assets/Pages/PaginaPrincipal';

import PaginaPerfil from './assets/Pages/PaginaPerfil';
import PaginaNotificacoes from './assets/Pages/PaginaNotificacoes';
import PaginaAjuda from './assets/Pages/PaginaAjuda';
import PaginaConfiguracoes from './assets/Pages/PaginaConfiguracoes';

import { ThemeProvider } from './assets/Contexts/ThemeContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <RemediosProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="PaginaArte"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen
              name="PaginaArte"
              component={PaginaArte}
            />

            <Stack.Screen
              name="PaginaLogin"
              component={PaginaLogin}
            />

            <Stack.Screen
              name="PaginaCadastro"
              component={PaginaCadastro}
            />

            <Stack.Screen
              name="PaginaPrincipal"
              component={PaginaPrincipal}
            />

            {/* MENU LATERAL */}
            <Stack.Screen
              name="PaginaPerfil"
              component={PaginaPerfil}
            />

            <Stack.Screen
              name="PaginaNotificacoes"
              component={PaginaNotificacoes}
            />

            <Stack.Screen
              name="PaginaAjuda"
              component={PaginaAjuda}
            />

            <Stack.Screen
              name="PaginaConfiguracoes"
              component={PaginaConfiguracoes}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </RemediosProvider>
    </AuthProvider>
  );
}