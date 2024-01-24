    import React, { useEffect, useState, useRoute } from 'react';
    import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, Picker, TextInput } from 'react-native';
    import { useNavigation } from '@react-navigation/native';
    import Parse from 'parse/react-native.js';
    import imgCover from '../../../assets/grayBackground.png';
    import Avatar from '../../../assets/Icons/avatar.png';
    import { AntDesign, Ionicons, Entypo } from '@expo/vector-icons';
    import * as Animatable from 'react-native-animatable';
    import {styles} from './styles/styleProfile'
    export default function Profile({route}) {
    const [userProfile, setUserProfile] = useState(null);
    const [followersCount, setFollowersCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [visibleImages, setVisibleImages] = useState(4);
    const [isPortfolioEmpty, setIsPortfolioEmpty] = useState(false);
    const [userEmpreendimento, setUserEmpreendimento] = useState(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImageContent, setSelectedImageContent] = useState('');
    const [selectedImageDate, setSelectedImageDate] = useState('');
    
    const navigation = useNavigation();

    const openImageModal = (image, content, date) => {
      setSelectedImage(image);
      setSelectedImageContent(content); // Define selectedImageContent
      setSelectedImageDate(date); // Define selectedImageDate
      setImageModalVisible(true);
    };
    const formatDate = (date) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(date).toLocaleDateString(undefined, options);
    };

    const handleMenuPress = () => {
        showMenu();
    };
    
    const handleDenounceConfirm = () => {
        // If the reason is 'other', use the customDenounceReason as the reason
        const finalDenounceReason = denounceReason === 'other' ? customDenounceReason : denounceReason;

        // Logic to send the report to your backend
        console.log('Denúncia enviada:', finalDenounceReason);

        // Close the modal
        setDenounceModalVisible(false);
    };
    
    const handleDenounceCancel = () => {
        // Fecha o modal de denúncia sem enviar a denúncia
        setDenounceModalVisible(false);
    };
    
    const handleDenounceReasonChange = (reason) => {
        if (reason === 'other') {
        setCustomDenounceReason('');
        setSelectedDenounceOption('other');
        } else {
        setCustomDenounceReason('');
        setSelectedDenounceOption(reason);
        }
    };

    const handleCustomDenounceReasonChange = (text) => {
        setCustomDenounceReason(text);
    };

    const handleChat = () => {
        navigation.navigate('ChatListProfile');
    }
    const userObject = Parse.User.current();

    async function fetchUserProfile() {
        try {
        const User = Parse.Object.extend('User');
        const query = new Parse.Query(User);
        const user = await query.get(userObject.id);
    
        const Follow = Parse.Object.extend('Follow');
        const followQuery = new Parse.Query(Follow);
        followQuery.equalTo('follower', Parse.User.current());
        followQuery.equalTo('following', user);
        const isFollowingObject = await followQuery.first();

        // Consulta para obter o número de usuários que o usuário está seguindo
        const followersQuery = new Parse.Query(Follow);
        followersQuery.equalTo('following', user);
        const followersCount = await followersQuery.count();
    
        // Consulta para obter o número de usuários que o usuário está seguindo
        const followingQuery = new Parse.Query(Follow);
        followingQuery.equalTo('follower', user);
        const followingCount = await followingQuery.count();
        
        const Activity = Parse.Object.extend('UserActivity');
        const activityQuery = new Parse.Query(Activity);
        activityQuery.equalTo('userId', user);
        const activities = await activityQuery.find();
    
    
        setUserProfile({
            user,
            username: user.get('username'),
            surname: user.get('surname'),
            email: user.get('email'),
            imgProfile: user.get('imgProfile') ? user.get('imgProfile').url() : null,
            description: user.get('description'),
            telephone: user.get('telephone'),
            followersCount, // Agora está usando a variável correta
            followingCount,
            activities: activities.map((activity) => ({
            type: activity.get('type') ? activity.get('type').url() : null,
            content: activity.get('content'),
            date: activity.get('date'),
            })),
        });
    
        setIsFollowing(!!isFollowingObject);
        setIsPortfolioEmpty(activities.length === 0);
        
        const Empreendedores = Parse.Object.extend('Empreendedores');
        const empreendedoresQuery = new Parse.Query(Empreendedores);
        empreendedoresQuery.equalTo('empUser', user);
        
        
        const Empreendimentos = Parse.Object.extend('Empreendimentos');
        const empreendimentosQuery = new Parse.Query(Empreendimentos);
        empreendimentosQuery.matchesQuery('emp_empreendedores', empreendedoresQuery);
        const empreendimento = await empreendimentosQuery.first();

    if (empreendimento) {

    const addressEmpreendimentoId = empreendimento.get('addressEmpreendimentoId');

    if (addressEmpreendimentoId) {
        const AddressesEmpreendimento = Parse.Object.extend('AddressesEmpreendimento');
        const addressQuery = new Parse.Query(AddressesEmpreendimento);
        addressQuery.equalTo('objectId', addressEmpreendimentoId.id);

        const address = await addressQuery.first();
        

        setUserEmpreendimento({
        id: empreendimento.id,
        name: empreendimento.get('name'),
        imgCover: empreendimento.get('imgCover') ? empreendimento.get('imgCover').url() : null,
        address: {
            street: address.get('street'),
            number: address.get('number'),
            city: address.get('city'),
            state: address.get('state'),
            cep: address.get('cep'),
            neighborhood: address.get('neighborhood'),
            local: address.get('local'),
        },
        });
    } else {
        console.error('No addressEmpreendimentoId found for the empreendimento.');
        setUserEmpreendimento(null);
    }
    } else {
    // Handle the case when empreendimento is undefined
    console.error('No empreendimento found for the user.');
    setUserEmpreendimento(null);
    }

        const BusinessMembers = Parse.Object.extend('BusinessMembers');
        const businessMembersQuery = new Parse.Query(BusinessMembers);
        businessMembersQuery.equalTo('entrepreneur', user);
        const businessMembers = await businessMembersQuery.find();

        } catch (error) {
        console.error('Error fetching user profile:', error);
        }
    }
    
    
    
    

    useEffect(() => {
        fetchUserProfile();

        // Verifique se há dados atualizados passados como parâmetros
        if (route.params && route.params.updatedUserData) {
          // Atualize o estado com os novos dados do usuário
          fetchUserProfile();
          setUserProfile((prevUserProfile) => ({
            ...prevUserProfile,
            ...route.params.updatedUserData,
          }));
        }
    }, [userObject, route.params]);

    const openDrawer = () => {
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    const renderDrawer = () => (
        <Animatable.View
        style={styles.menuContainer}
        animation={drawerVisible ? 'slideInRight' : 'slideOutRight'}
        duration={500}
        >
        {/* Conteúdo do menu aqui */}
        <TouchableOpacity
            style={[styles.drawerItem, styles.backButton]}
            onPress={closeDrawer}
        >
            <AntDesign name="arrowright" size={24} color="black" />
        </TouchableOpacity>
    
        {/* Adicione a verificação de empreendedor aqui */}
        {userEmpreendimento ? (
        // Se o usuário for um empreendedor, mostrar a opção "Seu Empreendimento"
        <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
            navigation.navigate('MyEmpreendimento');
            closeDrawer(); 
            }}
        >
            <Text style={styles.drawerItemText}>Seu Empreendimento</Text>
        </TouchableOpacity>
        ) : (
        // Se o usuário não for um empreendedor, mostrar a opção "Seja um Empreendedor"
        <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
            navigation.navigate('SignInEmpreendimento');
            closeDrawer(); 
            }}
        >
            <Text style={styles.drawerItemText}>Seja um Empreendedor</Text>
        </TouchableOpacity>
        )}

        <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
                navigation.navigate('Schedules');
                closeDrawer(); 
            }}
        >
            <Text style={styles.drawerItemText}>Meus Agendamentos</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
            navigation.navigate('EditProfile');
            closeDrawer(); 
            }}
        >
            <Text style={styles.drawerItemText}>Editar Perfil</Text>
        </TouchableOpacity>
    
        <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
            navigation.navigate('Favorites');
            closeDrawer(); 
            }}
        >
            <Text style={styles.drawerItemText}>Favoritos</Text>
        </TouchableOpacity>
    
        <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
            navigation.navigate('FollowingEmpreendimentos');
            closeDrawer(); 
            }}
        >
            <Text style={styles.drawerItemText}>Empreendimentos que voce segue</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
            navigation.navigate('FollowingUsers');
            closeDrawer(); 
            }}
        >
            <Text style={styles.drawerItemText}>Usuarios que voce segue</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
            navigation.navigate('Config');
            closeDrawer(); 
            }}
        >
            <Text style={styles.drawerItemText}>Configurações</Text>
        </TouchableOpacity>
        
        </Animatable.View>
    );

    const handleSeeMoreImagePress = () => {
        navigation.navigate('UserProfilePortfolio', {
        userId: userObject,
        });
    };

    const FullScreenImageModal = ({ visible, image, content, date, closeImageModal }) => {
        return (
          <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={closeImageModal}
          >
            <View style={styles.modalContainerFullScreen}>
              <Image
                style={styles.fullScreenImage}
                source={{ uri: image }}
              />
              <View style={styles.imageInfoContainer}>
                <Text style={styles.imageInfoText}>{content}</Text>
                <Text style={styles.imageInfoText}>{formatDate(date)}</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={closeImageModal}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        );
      };
    

    if (!userProfile) {
        return (
        <View>
            <Text>Carregando...</Text>
        </View>
        );
    }

    const navigateToAddPhoto = () => {
        navigation.navigate('AddPortfolio');
      };

    return (
        <ScrollView style={{backgroundColor: '#fff'}}>
        
        <View>
            
            <View style={styles.headerContainer}>
            <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={openDrawer}>
                <Ionicons name="ios-menu" size={24} color="black" />
            </TouchableOpacity>
            </View>
        </View>   
        </View>
        
        <View style={[styles.container, {marginTop: 50}]}>
        {userProfile.imgProfile ? (
    <Image source={{ uri: userProfile.imgProfile }} style={styles.userImage} />
    ) : (
    <Image source={Avatar} style={styles.userImage} />
    )}
            <Text style={styles.username}>{userProfile.username} {userProfile.surname}</Text>
            <Text style={styles.description}>{userProfile.description}</Text>
            <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'column', alignItems: 'center', marginHorizontal: 15 }}>
                <Text style={styles.text}>Seguindo</Text>
                <Text style={styles.text}>{userProfile.followingCount || 0}</Text>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center', marginHorizontal: 15 }}>
                <Text style={styles.text}>Seguidores</Text>
                <Text style={styles.text}>{userProfile.followersCount || 0}</Text>
            </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
 
            {/* Renderizar o botão Empreendimento apenas se o usuário for empreendedor */}
            {userEmpreendimento && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('MyEmpreendimento');
                  closeDrawer(); 
                }}
                style={[
                  styles.followButton,
                  {
                    marginTop: 0,
                    paddingHorizontal: 10,
                    marginHorizontal: 5,
                    flexDirection: 'row',
                  },
                ]}
              >
                <Text style={{ color: '#0e1014', fontSize: 16}}>Empreendimento</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={handleChat} style={[styles.followButton, { marginTop: 0, paddingHorizontal: 20, marginHorizontal: 5, flexDirection: 'row' }]}>
                <Text style={{color: '#0e1014', fontSize: 16}}>Chat</Text>
            </TouchableOpacity>
            </View>
        </View>
        <View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.title}>Portfolio</Text>
            <TouchableOpacity onPress={navigateToAddPhoto} style={[styles.addButton, {flexDirection: 'row', alignItems: 'center'}]}>
            <AntDesign style={{marginLeft:5}}name="plus" size={20} color="black" />
              <Text style={ {marginRight: 10, fontSize: 18}}>Adicionar</Text>
            </TouchableOpacity>
            </View>
            {isPortfolioEmpty ? (
            <Text style={styles.emptyPortfolioText}>Nenhum item no portfólio.</Text>
            ) : (
            <>
            <View style={styles.activityContainer}>
            <View style={styles.imageContainer}>
                {userProfile.activities.slice(0, visibleImages).map((activity, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.activityImageWrapper}
                    onPress={() => openImageModal(activity.type, activity.content, activity.date)}
                >
                <Image key={index} style={styles.activityType} source={{ uri: activity.type }} />
                </TouchableOpacity>
                ))}
            </View>
            {userProfile.activities.length > visibleImages && (
                <TouchableOpacity onPress={handleSeeMoreImagePress} style={styles.seeMoreButton}>
                <Text style={styles.seeMoreButtonText}>Ver mais</Text>
                </TouchableOpacity>
            )}
            </View>
            </>)}
        </View>

        <View>
        <Text style={styles.title}>Empreendimento que trabalha</Text>
        {userEmpreendimento ? (
            <TouchableOpacity onPress={() => navigation.navigate('Details', { objectId: userEmpreendimento.id })}>
            <View style={styles.containerEmpreendimento}>
            {userEmpreendimento.imgCover ? (
              <Image source={{ uri: userEmpreendimento.imgCover }} style={styles.cover} />
            ) : (
              <Image source={imgCover} style={styles.cover} /> // Usar a imagem de fallback
            )}
                <View>
                <Text style={styles.titleEmpreendimento}>{userEmpreendimento.name}</Text>
                    <Text style={styles.description}>{userEmpreendimento.address.street}, {userEmpreendimento.address.number}</Text>
                    <Text style={styles.description}>{userEmpreendimento.address.city} - {userEmpreendimento.address.state}</Text>
                    <Text>CEP: {userEmpreendimento.address.cep}</Text>
                </View>
            </View>
            </TouchableOpacity>
            ) : (
                <View>
                    {/* Renderizar o botão Seja um Empreendedor se o usuário não for empreendedor */}
                    {!userEmpreendimento && (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('SignInEmpreendimento');
                          closeDrawer(); 
                        }}
                        style={[
                          styles.followButton,
                          {
                            marginTop: 0,
                            paddingHorizontal: 20,
                            marginHorizontal: 16,
                            flexDirection: 'row',
                            width: '90%'
                          },
                        ]}
                      >
                        <Text style={{ color: '#0e1014', fontSize: 18 }}>Seja um Empreendedor</Text>
                      </TouchableOpacity>
                    )}
                </View>
            )}
        </View>

        <View style={{marginBottom: 10}}>
    <Text style={styles.title}>Contatos</Text>
    <View style={{marginLeft: 15}}>
        <Text style={{fontSize: 15}}><Text style={{fontWeight: 'bold'}}>Telefone: </Text>{userProfile.telephone}</Text>
        <Text style={{fontSize: 15}}><Text style={{fontWeight: 'bold'}}>Email: </Text>{userProfile.email}</Text>
        
    </View>
    </View>

    <Modal transparent={true} visible={drawerVisible} onRequestClose={closeDrawer}>
            <TouchableOpacity
                style={styles.menuOverlay}
                activeOpacity={1}
                onPressOut={() => closeDrawer()}
            >
                {renderDrawer()}
            </TouchableOpacity>
            </Modal>

<FullScreenImageModal
  visible={imageModalVisible}
  image={selectedImage}
  content={selectedImageContent}
  date={selectedImageDate}
  closeImageModal={() => setImageModalVisible(false)}
/>
        </ScrollView>
    );
    }

    
