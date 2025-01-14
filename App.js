import "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Platform, SafeAreaView, TouchableOpacity} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StoreProvider } from './contextApi/store_context';
import { UserProvider } from './contextApi/user_context';
import Home from './screens/home/home';
import Store_Detail from "./screens/storeDetail/store_detail";
import Launch_Screen from "./screens/launchScreen/launchScreen";
import Register from "./screens/register/register";
import Login from './screens/login/login';
import Account from "./screens/account/account";
import PaymentHistory from "./screens/paymentHistory/paymentHistory";

export default function App() {


  const StackNav=()=>{
    const Stack = createNativeStackNavigator();
    return(
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

          <Stack.Screen
            name='Account'
            component={Account}
            options={{
              headerTitleAlign: 'center',
              headerTitle: 'Account',
              headerShown: false,
            }}
          />

          <Stack.Screen
            name='paymentHistory'
            component={PaymentHistory}
            options={{
              headerTitleAlign: 'center',
              headerTitle: '',
              headerShown: false,
            }}
          />

        </Stack.Navigator>
    )
  }

  return (
    <SafeAreaView style={styles.container}>   
      <UserProvider>
      <StoreProvider>

        <NavigationContainer>
          <StackNav/>
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
