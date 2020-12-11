import React from 'react';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screen/login';
import Signup from '../screen/signup';
import Dashboard from '../screen/dashboard';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LogIn" component={Login} />
      <Stack.Screen name="SignUp" component={Signup} />
      <Stack.Screen name="DashBoard" component={Dashboard} />
    </Stack.Navigator>
  );
};
export default AuthStack;
