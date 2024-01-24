import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import * as Animatable from 'react-native-animatable'
import Welcome from '../pages/Welcome/Welcome';
import Login from '../pages/Login/Login';
import SignIn from '../pages/SignIn/SignIn';
import Home from '../pages/Home/Home';
import UsersList from '../pages/Home/UsersList/UsersList.js';
import EmpreendimentosScreen from '../pages/Home/EmpreendimentosScreen/Screens';
import Details from '../pages/Home/DetailsComponent/Details';
import Agendar from '../pages/Home/DetailsComponent/Agendar';
import Services from '../pages/Home/DetailsComponent/Services';
import Avaliations from '../pages/Home/DetailsComponent/Avaliations';
import SearchBar from '../pages/Home/BarraPesquisa/SearchBar';
import SearchScreen from '../pages/Home/BarraPesquisa/SearchBar';
import SearchResults from '../pages/Home/BarraPesquisa/SearchResults';

import Profile from '../pages/Profile/Profile';
import EditProfile from '../pages/Profile/EditProfile';
import Favorites from '../pages/Profile/Favorites';
import FollwingUsers from '../pages/Profile/FollowingUsers';
import Schedules from '../pages/Profile/Schedules';
import ChatListProfile from '../pages/Profile/ChatListProfile';

import MyEmpreendimento from '../pages/MyEmpreendimento/MyEmpreendimento';
import EditEmpreendimento from '../pages/MyEmpreendimento/EditEmpreendimento';
import AddService from '../pages/MyEmpreendimento/AddService';
import AvaliationEmpreendimento from '../pages/MyEmpreendimento/AvaliationEmpreendimento';
import Agenda from '../pages/MyEmpreendimento/Agenda';
import TeamManagement from '../pages/MyEmpreendimento/TeamManagement';
import PromotionsManagement from '../pages/MyEmpreendimento/PromotionsManagement';
import AddPromotion from '../pages/MyEmpreendimento/AddPromotion';
import OpeningHours from '../pages/MyEmpreendimento/OpeningHours';
import FollowingUsers from '../pages/Profile/FollowingUsers';
import FollowingEmpreendimentos from '../pages/Profile/FollowingEmpreendimentos';
import AllPhotos from '../pages/MyEmpreendimento/AllPhotos.js';

import SignInEmpreendimento from '../pages/SignInEmpreendimento/SignInEmpreendimento';
import NationalityScreen from '../pages/SignInEmpreendimento/Nationality';
import AddressEmpreendimentoScreen from '../pages/SignInEmpreendimento/AddressEmpreendimento';

import UserProfile from '../pages/UserProfile/UserProfile';
import UserProfilePortfolio from '../pages/UserProfile/UserProfilePortfolio';
import UserChat from '../pages/UserProfile/UserChat.js';
import Payment from '../pages/Home/DetailsComponent/Payment.js';

import Config from '../pages/Config/Config';
import ManageMyAccount from '../pages/Config/componentsConfig/ManageMyAccount.js';
import ChangePassword from '../pages/Config/componentsConfig/ChangePassword.js';

import PaymentFail from '../pages/Home/DetailsComponent/PaymentFail.js';
import PaymentSuccess from '../pages/Home/DetailsComponent/PaymentSucess.js';
import Wallet from '../pages/MyEmpreendimento/Wallet.js';
import AddPortfolio from '../pages/Profile/AddPortfolio.js';
const Stack = createNativeStackNavigator();

export default function Routes() { 
    const Navigation = useNavigation();
    return(
        <Stack.Navigator initialRouteName='Welcome'>
            <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
            /> 
            <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false }}
            />   
            <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
            />  

<Stack.Screen
            name="Details"
            component={Details}
            options={{ headerShown: false }}
            />

<Stack.Screen
            name="Agendar"
            component={Agendar}

            
            />
<Stack.Screen name="Payment" component={Payment}/>
<Stack.Screen name="Services" component={Services}/>
<Stack.Screen name="Avaliations" component={Avaliations}/>
<Stack.Screen name="SearchBar" component={SearchBar}/>
<Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }}/>
<Stack.Screen name="SearchResults" component={SearchResults} options={{ headerShown: false }}/>
<Stack.Screen name="UsersList" component={UsersList}/>
<Stack.Screen name="PaymentSuccess" component={PaymentSuccess} options={{ headerShown: false }}/>
<Stack.Screen name="PaymentFail" component={PaymentFail} options={{ headerShown: false }}/>
<Stack.Screen name="Wallet" component={Wallet}/>
<Stack.Screen name="AddPortfolio" component={AddPortfolio}/>
<Stack.Screen
            name="EmpreendimentosScreen"
            component={EmpreendimentosScreen}
            options={{ headerShown: true, headerShadowVisible: false, headerTitle: ()=> 
                <Animatable.View animation='fadeInRight' duration={900}>
                    <Text style={{fontFamily: 'Montserrat_700Bold', fontSize: 18}}>Empreendimentos</Text>
                </Animatable.View>}}
                />  

            
            <Stack.Screen 
            name="Home"
            component={Home}
            options={{ headerShown: true, headerShadowVisible: false,
            headerTitle: ()=> 
            <Animatable.View animation='fadeInLeft' delay={100} >
                <Text style={{fontFamily: 'Montserrat_700Bold', fontSize: 18}}>Início</Text>
            </Animatable.View>,  
            
            headerBackVisible: () => null, 
            
            headerRight: ()=> 
            <Animatable.View animation='fadeInRight' style={{ flex: 1, flexDirection: 'row', alignItems: 'center',
            justifyContent: 'center', alignSelf: 'flex-end' }} >

            <TouchableOpacity style={{ marginRight: 15, marginLeft: "90%" }} onPress={ () => Navigation.navigate('SearchScreen')}>
                <FontAwesome name="search" size={30} color="black" />
            </TouchableOpacity>

            <TouchableOpacity style={{ marginRight: 15 }} onPress={ () => Navigation.navigate('Profile')}>
                <FontAwesome name="user" size={30} color="black" />
            </TouchableOpacity>
            </Animatable.View>
            
        }} 
            />

<Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
<Stack.Screen name="EditProfile" component={EditProfile}/>
<Stack.Screen name="Favorites" component={Favorites} />
<Stack.Screen name="FollwingUsers" component={FollwingUsers} />
<Stack.Screen name="FollowingEmpreendimentos" component={FollowingEmpreendimentos}/>
<Stack.Screen name="Schedules" component={Schedules} />
<Stack.Screen name="ChatListProfile" component={ChatListProfile} options={{ headerShown: false }}/>

<Stack.Screen name="MyEmpreendimento" component={MyEmpreendimento} options={{ headerShown: false }}/>  
<Stack.Screen name="EditEmpreendimento" component={EditEmpreendimento}/>
<Stack.Screen name="AddService" component={AddService}/>
<Stack.Screen name="AvaliationEmpreendimento" component={AvaliationEmpreendimento}/>
<Stack.Screen name="Agenda" component={Agenda}


/>
<Stack.Screen name="TeamManagement" component={TeamManagement}/>
<Stack.Screen name="PromotionsManagement" component={PromotionsManagement}/>
<Stack.Screen name="AddPromotion" component={AddPromotion}/>
<Stack.Screen name="OpeningHours" component={OpeningHours}/>
<Stack.Screen name="FollowingUsers" component={FollowingUsers}/>
<Stack.Screen name="AllPhotos" component={AllPhotos} options={{ headerShown: false }}/>

<Stack.Screen name="SignInEmpreendimento" component={SignInEmpreendimento} options={{ headerShown: false }}/>
<Stack.Screen name="Nationality" component={NationalityScreen}/>
<Stack.Screen name="AddressEmpreendimento" component={AddressEmpreendimentoScreen}/>

<Stack.Screen name="UserProfile" component={UserProfile} options={{ headerShown: false }}/>
<Stack.Screen name="UserProfilePortfolio" component={UserProfilePortfolio} options={{ headerShown: false }}/>
<Stack.Screen name="UserChat" component={UserChat} options={{ headerShown: false }}/>

<Stack.Screen name="Config" component={Config}/>
<Stack.Screen name="ManageMyAccount" component={ManageMyAccount}/>
<Stack.Screen name="ChangePassword" component={ChangePassword}/>

        </Stack.Navigator>

        
    );
}
