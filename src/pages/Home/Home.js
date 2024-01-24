import React, { useEffect, useState } from "react";
import { Text, StyleSheet, ScrollView, TouchableOpacity, Image, View, RefreshControl, BackHandler} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from 'react-native-animatable';
import { Parse } from "parse/react-native.js";
import Empreendimentos from './Empreendimentos/Empreendimentos.js';
import Recomendation from "./boxComponents/boxComponent";
import Avatar from '../../../assets/Icons/avatar.png'
import { AntDesign, Ionicons, Entypo } from '@expo/vector-icons';
export default function Home({ props, route }) {
  const navigation = useNavigation();
  const [recomendations, setRecomendations] = useState([]);
  const [objectIds, setObjectIds] = useState([]);
  const [showVerMaisButton, setShowVerMaisButton] = useState(false);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [isEmpreendedor, setIsEmpreendedor] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [backPressCount, setBackPressCount] = useState(0);
  console.log(backPressCount)
  const onRefresh = () => {
    setRefreshing(true);
  
    // Realize ações de recarregamento, como carregar novamente a equipe ou atualizar dados
    fetchData();
    // Após concluir a atualização, defina o refreshing de volta para false
    setRefreshing(false);
  };
  const emprendimentosTop = [
        {
            img: require("../../../assets/Icons/salao-de-beleza.png"),
            title: "Salões de beleza",
            type: "Salão_de_Beleza",
        },
        {
            img: require("../../../assets/Icons/manicure.png"),
            title: "Manicure",
            type: "Manicure",            
        }, 
        {
            img: require("../../../assets/Icons/pedicure.png"),
            title: "Pedicure",
            type: "Pedicure",            
        },
        {
            img: require("../../../assets/Icons/massagem.png"),
            title: "Massagem",
            type: "Massagem",   
        },
        {
            img: require("../../../assets/Icons/esteticista.png"),
            title: "Esteticistas",
            type: "Esteticistas",           
        },
        {
            img: require("../../../assets/Icons/sobrancelha.png"),
            title: "Sobrancelhas",
            type: "Sobrancelhas",          
        },
        {
            img: require("../../../assets/Icons/maquiagem.png"),
            title: "Maquiagem",
            type: "Maquiagem",          
        },
        
    
    ];

  
    async function fetchData() {
      try {
        // Fetch Empreendimentos
        const Empreendimentos = Parse.Object.extend("Empreendimentos");
        const empreendimentosQuery = new Parse.Query(Empreendimentos);
        const listaDeEmpreendimentos = await empreendimentosQuery.find();
  
        if (listaDeEmpreendimentos.length > 0) {
          const ids = listaDeEmpreendimentos.map((objeto) => objeto.id);
          setObjectIds(ids);
  
          const empRecomendations = listaDeEmpreendimentos.map((empreendimento) => ({
            name: empreendimento.get('name'),
            description: empreendimento.get('description'),
            imgCover: empreendimento.get('imgCover'),
            rating: empreendimento.get('assessment'),
            address: empreendimento.get('address'),
            numberAddress: empreendimento.get('numberAddress'),
          }));
  
          setRecomendations(empRecomendations);
          setShowVerMaisButton(empRecomendations.length > 3);
        }
  
        // Fetch Recommended Users
        const User = Parse.Object.extend("_User");
        const usersQuery = new Parse.Query(User);
  
        // Adicione uma condição para excluir o usuário logado
        const currentUser = Parse.User.current();
        if (currentUser) {
          usersQuery.notEqualTo("objectId", currentUser.id);
        }
  
        const users = await usersQuery.find();
       
  
        if (users.length > 0) {
          const recommendedUsersData = users.map((user) => ({
            username: user.get('username'),
            imgProfile: user.get('imgProfile') ? user.get('imgProfile').url() : null,
            email: user.get('email'),
            objectId: user.id,
          }));
          setRecommendedUsers(recommendedUsersData);
        }

        // Verifique se o usuário é um empreendedor
        if (currentUser) {
          // Verifique se o usuário está na tabela "Empreendedores"
          const Empreendedores = Parse.Object.extend("Empreendedores");
          const empreendedoresQuery = new Parse.Query(Empreendedores);
          empreendedoresQuery.equalTo("empUser", currentUser);
    
          const isEmpreendedorObject = await empreendedoresQuery.first();
          const userIsEmpreendedor = !!isEmpreendedorObject;
    
          setIsEmpreendedor(userIsEmpreendedor);
        }
      } catch (error) {
        console.error('Error while fetching data', error);
      }
    }
  
    useEffect(() => {
      fetchData();
  
      const backAction = () => {
        // Se o usuário estiver na tela de login, não permita o retorno
        if (route.name === 'Login') {
          return false;
        }
  
        // Caso contrário, permita o retorno padrão
        if (backPressCount === 1) {
          // Se for o primeiro pressionamento, aumente o contador e mostre a mensagem
          setBackPressCount(backPressCount + 1);
          ToastAndroid.show('Pressione novamente para sair', ToastAndroid.SHORT);
  
          // Configure um temporizador para reiniciar o contador após um período
          setTimeout(() => {
            setBackPressCount(0);
          }, 2000); // 2000 milissegundos (2 segundos)
        } else if (backPressCount === 2) {
          // Se for o segundo pressionamento, saia do aplicativo
          BackHandler.exitApp();
        }
  
        // Retorna true para indicar que o evento foi manipulado
        return true;
      };
  
      // Adicione o manipulador ao evento de volta
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
      // Remova o manipulador quando o componente for desmontado
      return () => backHandler.remove();
    }, [route, backPressCount]);
  
    const handleVerMaisPress = () => {
      navigation.navigate('UsersList');
    };
    const handleSignInEmpreendimento = () => {
      navigation.navigate('SignInEmpreendimento');
    } 
    
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: 'white' }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 15, paddingBottom: 20, paddingTop: 15 }}>
        {emprendimentosTop.map((novo, index) => (
            <Animatable.View key={index} animation="fadeInUp" duration={500}>
              <Empreendimentos
                cover={novo.img}
                title={novo.title}
                onPress={() => navigation.navigate("EmpreendimentosScreen", novo)}
              />
            </Animatable.View>
          ))}
        </ScrollView>
  
        <View style={[styles.contentNew]}>
          <Text style={styles.title}>Recomendações</Text>
        </View>
  
        {recomendations.slice(0, 3).map((recomendation, index) => (
          <View key={index} animation="fadeInUp" duration={900} delay={150}>
            <Recomendation
              key={index}
              name={recomendation.name}
              numberAddress={recomendation.numberAddress}
              imgCover={recomendation.imgCover}
              onPress={() => navigation.navigate('Details', { objectId: objectIds[index] })}
              objectId={objectIds[index]}
            />
          </View>
        ))}
  
        {showVerMaisButton && (
          <TouchableOpacity onPress={handleVerMaisPress} style={styles.verMaisButton}>
            <Text style={styles.verMaisButtonText}>Ver Mais</Text>
          </TouchableOpacity>
        )}
  
        {/* Nova seção para Usuários Recomendados */}
        <View animation="fadeInLeft" delay={200} style={styles.contentNew}>
          <Text style={styles.title}>Usuários Recomendados</Text>
        </View>
  
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendedUsersContainer}>
      {recommendedUsers.slice(0, 5).map((user, index) => (
        <Animatable.View key={index} animation="fadeInLeft" delay={150} style={styles.userContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { objectId: user.objectId })}>
            <Image source={user.imgProfile ? { uri: user.imgProfile } : Avatar} style={styles.userImage} />
            <Text style={styles.username}>{user.username}</Text>
          </TouchableOpacity>
        </Animatable.View>
      ))}
    {recommendedUsers.length > 5 && (
      <TouchableOpacity onPress={handleVerMaisPress} style={styles.verMaisButton}>
        <AntDesign style={{marginBottom:5}} name="pluscircleo" size={25} color="black" />
        <Text style={styles.verMaisButtonText}>Ver Mais</Text>
      </TouchableOpacity>
    )}
    </ScrollView>


  
      {!isEmpreendedor && (
      <View>
        <Text style={styles.title}>Seja um empreendedor</Text>
        <Text style={[styles.description, { marginLeft: 20 }]}>Seja um empreendedor junto com a gente!</Text>
        <TouchableOpacity style={styles.btn} onPress={handleSignInEmpreendimento}>
          <Text>Ser um empreendedor</Text>
        </TouchableOpacity>
      </View>
    )}

      </ScrollView>
    );
  }


const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 20
    },

    btn:{
      backgroundColor: '#fff',
        width: 377,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 12,
        marginBottom: 12,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#0e1014',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },

    input: {
        flex: 1,
        height: 35,
        width: '100%',
        fontSize: 16,
        borderRadius: 4,
        marginLeft: 20,
        paddingLeft: 5,
    },

    contentNew: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
    },

    title: {
        fontSize: 18,
        paddingHorizontal: 15,
        marginBottom: 10,
        paddingTop: 10,
        fontFamily: 'Montserrat_700Bold',
        color: '#4f4a4a'
    },
   img: {
    width: 50,
    height: 50
   },

  container: {
    backgroundColor: 'white',
  },
  contentNew: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    paddingHorizontal: 15,
    marginBottom: 10,
    paddingTop: 10,
    fontFamily: 'Montserrat_700Bold',
    color: '#4f4a4a',
  },
  recommendedUsersContainer: {
    paddingHorizontal: 15,
    paddingBottom: 50,
    paddingTop: 15,
  },
  userContainer: {
    marginRight: 15,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    marginTop: 8,
    textAlign: 'center',
  },

  followButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#3498db',
    borderRadius: 5,
    alignItems: 'center',
  },
  followButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
  },
  verMaisButton: {
    padding: 10,
    margin: 10,
    alignItems: 'center',
    alignSelf: 'center'
  },
  verMaisButtonText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
  },
});
