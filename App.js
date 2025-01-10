import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Platform, SafeAreaView, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StoreProvider } from './Context_API/store_context';
import { UserProvider } from './Context_API/user_context';
import Home from './screens/home';
import Store_Detail from './conponents/modal/store_detail';
import Launch_Screen from './screens/launch_screen';
import Register from './screens/register';
import Login from './screens/login';

export default function App() {
  const Stack = createNativeStackNavigator();

  
  return (
    <SafeAreaView style={styles.container}>
      
    <UserProvider>
    <StoreProvider>
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen
            name='launch_screen'
            component={Launch_Screen}
            options={{
              headerTitleAlign: 'center',
              headerTitle: '',
              headerShown: false,
            }}
          />

          <Stack.Screen
            name='login'
            component={Login}
            options={{
              headerTitleAlign: 'center',
              headerTitle: '',
              headerShown: false,
            }}
          />

          <Stack.Screen
            name='register'
            component={Register}
            options={{
              headerTitleAlign: 'center',
              headerTitle: 'Register',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#F9F9F9', 
              },
            }}
          />

          <Stack.Screen
            name='Home'
            component={Home}
            options={{
              headerTitleAlign: 'center',
              headerTitle: '',
              headerShown: false,
            }}
          />

          <Stack.Screen
            name='store_detail'
            component={Store_Detail}
            options={{
              headerTitleAlign: 'center',
              headerTitle: '',
              headerShown: false,
            }}
          />
        
        </Stack.Navigator>
      </NavigationContainer>
    </StoreProvider>
    </UserProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 30,  // Fix 'iso' to 'ios'
  },
});
