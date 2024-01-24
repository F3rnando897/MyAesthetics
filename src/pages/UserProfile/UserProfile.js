import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, Picker, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Parse from 'parse/react-native.js';
import Avatar from '../../../assets/Icons/avatar.png';
import imgCover from '../../../assets/grayBackground.png';
import { AntDesign, Ionicons, Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  return new Date(date).toLocaleDateString(undefined, options);
};

export default function UserProfile({ route }) {
  const { objectId } = route.params;
  const [userProfile, setUserProfile] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [visibleImages, setVisibleImages] = useState(4);
  const [unfollowModalVisible, setUnfollowModalVisible] = useState(false);
  const [unfollowLoading, setUnfollowLoading] = useState(false);
  const [isPortfolioEmpty, setIsPortfolioEmpty] = useState(false);
  const [userEmpreendimento, setUserEmpreendimento] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [blockModalMessage, setBlockModalMessage] = useState('');
  const [denounceModalVisible, setDenounceModalVisible] = useState(false);
  const [denounceReason, setDenounceReason] = useState('');
  const [customDenounceReason, setCustomDenounceReason] = useState('');
  const [selectedDenounceOption, setSelectedDenounceOption] = useState('');
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

  const showMenu = () => {
    setMenuVisible(true);
  };

  const hideMenu = () => {
    setMenuVisible(false);
  };

  const handleMenuPress = () => {
    showMenu();
  };

  const handleDenouncePress = () => {
    // Mostra o modal de denúncia
    setDenounceModalVisible(true);
    hideMenu();
  };
  
  const handleDenounceConfirm = async () => {
    if (selectedDenounceOption) {
      // Defina as informações da denúncia
      const Report = Parse.Object.extend('Report');
      const report = new Report();
      report.set('reportedUser', userProfile.user); // O usuário que está sendo denunciado
      report.set('reportingUser', Parse.User.current()); // O usuário que está fazendo a denúncia
      const finalDenounceReason = selectedDenounceOption === 'other' ? customDenounceReason : selectedDenounceOption;
      report.set('reason', finalDenounceReason);
      try {
        await report.save();
        console.log('Denúncia enviada com sucesso:', finalDenounceReason);
  
        // Feche o modal
        setDenounceModalVisible(false);
      } catch (error) {
        console.error('Erro ao enviar a denúncia:', error);
      }
    } else {
      console.error('Nenhum motivo de denúncia selecionado.');
    }
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
  navigation.navigate('UserChat', { userId: userProfile.user });
}
  async function fetchUserProfile() {
    try {
      const User = Parse.Object.extend('User');
      const query = new Parse.Query(User);
      const user = await query.get(objectId);
  
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
      
      const activityQuery = new Parse.Query('UserActivity');
      activityQuery.equalTo('userId', user);
      activityQuery.include('userId'); // Isso irá incluir os dados do usuário nas atividades
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
  }, [objectId]);

  const handleFollowPress = async () => {
    if (isFollowing) {
      // Exibe o modal de confirmação ao deixar de seguir
      setUnfollowModalVisible(true);
    } else {
      try {
        const Follow = Parse.Object.extend('Follow');
        const follow = new Follow();
        follow.set('follower', Parse.User.current());
        follow.set('following', userProfile.user);
        await follow.save();

        setUserProfile((prevProfile) => ({
            ...prevProfile,
            followersCount: prevProfile.followersCount + 1,
          }));
  
        setFollowersCount(followersCount + 1);
        setIsFollowing(true);
      } catch (error) {
        console.error('Error following user:', error);
      }
    }
  };
  
  const handleUnfollowConfirm = async () => {
    try {
      setUnfollowLoading(true);

      const Follow = Parse.Object.extend('Follow');
      const followQuery = new Parse.Query(Follow);
      followQuery.equalTo('follower', Parse.User.current());
      followQuery.equalTo('following', userProfile.user);
      const followObject = await followQuery.first();
      await followObject.destroy();

      setUserProfile((prevProfile) => ({
        ...prevProfile,
        followersCount: prevProfile.followersCount - 1,
      }));
      setIsFollowing(false);
      setUnfollowModalVisible(false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setUnfollowLoading(false);
    }
  };
  
  const handleUnfollowCancel = () => {
    setUnfollowModalVisible(false);
  };

  const handleSeeMoreImagePress = () => {
    navigation.navigate('UserProfilePortfolio', {
      userId: objectId,
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
    return null; // Isso evitará a renderização de qualquer coisa enquanto userProfile for nulo
  }

  return (
    <ScrollView>
      
      <View>
        <LinearGradient colors={['rgba(0,0,0,0.8)', 'transparent']}  style={styles.gradientContainer}>
        <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMenuPress}>
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>    
        </LinearGradient>
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
    
        <TouchableOpacity
            onPress={handleFollowPress}
            style={[
              styles.followButton,
              { marginTop: 0, paddingHorizontal: 22, marginHorizontal: 5, flexDirection: 'row' },
              isFollowing && { backgroundColor: '#0e1014' },
            ]}>
            <Text style={{ color: isFollowing ? 'white' : '#0e1014', fontSize: 18 }}>
              {isFollowing ? 'Seguindo' : 'Seguir'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleChat} style={[styles.followButton, { marginTop: 0, paddingHorizontal: 20, marginHorizontal: 5, flexDirection: 'row' }]}>
            <Text style={{color: '#0e1014', fontSize: 18}}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text style={styles.title}>Portfolio</Text>
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
              <Image style={styles.activityType} source={{ uri: activity.type }} />
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
          <View style={styles.containerEmpreendimento}>
            {userEmpreendimento.imgCover ? ( // Verifique se há uma imagem de capa
              <Image source={{ uri: userEmpreendimento.imgCover }} style={styles.cover} />
            ) : (
              <Image source={imgCover} style={styles.cover} /> // Use imgCover se não houver uma imagem de capa
            )}
              <View>
            <Text style={styles.titleEmpreendimento}>{userEmpreendimento.name}</Text>
                <Text style={styles.description}>{userEmpreendimento.address.street}, {userEmpreendimento.address.number}</Text>
                <Text style={styles.description}>{userEmpreendimento.address.city} - {userEmpreendimento.address.state}</Text>
                <Text>CEP: {userEmpreendimento.address.cep}</Text>
              </View>
          </View>
        ) : (
          <Text style={styles.description}>Nenhum empreendimento associado.</Text>
        )}
      </View>

      <View>
  <Text style={styles.title}>Contatos</Text>
  <View>
    <Text>Telefone: {userProfile.telephone}</Text>
    <Text>Email: {userProfile.email}</Text>
  </View>
</View>

    {/* Modal de confirmação ao deixar de seguir */}
    <Modal
      animationType="slide"
      transparent={true}
      visible={unfollowModalVisible}
      onRequestClose={() => setUnfollowModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Tem certeza de que deseja parar de seguir?</Text>
          <TouchableOpacity
              onPress={handleUnfollowConfirm}
              disabled={unfollowLoading}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>{unfollowLoading ? 'Aguarde...' : 'Sim'}</Text>
            </TouchableOpacity>
          <TouchableOpacity onPress={handleUnfollowCancel} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    {/* Modal para o menu de opções */}
<Modal
  transparent={true}
  visible={menuVisible}
  onRequestClose={hideMenu}
>
<TouchableOpacity
    onPress={hideMenu}  // Adicionando ação para fechar o menu quando tocado fora
    style={styles.menuContainer}
  >
    <View style={[styles.menuContent, { left: 160, right: 0, top: 20, marginRight: 35 }]}>
      <TouchableOpacity onPress={handleDenouncePress} style={[styles.modalButton, { width: '100%' }]}>
        <Text style={styles.modalButtonText}>Denunciar esta conta</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
</Modal>

  <Modal
  transparent={true}
  visible={denounceModalVisible}
  onRequestClose={() => setDenounceModalVisible(false)}>
    <TouchableOpacity
          style={styles.modalBackground} // Added new style for the dark background
          activeOpacity={1} // To prevent unexpected touches
          onPress={() => setDenounceModalVisible(false)}>
    <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
    <Text style={styles.modalText}>Selecione o motivo da denúncia:</Text>

      {/* Adicione as opções diretamente ao modal */}
      <TouchableOpacity
        style={[
                styles.denounceOption,
                selectedDenounceOption === 'Conteúdo inapropriado' && styles.selectedDenounceOption,
              ]}
        onPress={() => handleDenounceReasonChange('Conteúdo inapropriado')}>
        <Text>Conteúdo Inapropriado</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
                styles.denounceOption,
                selectedDenounceOption === 'Spam ou Conteúdo Falso' && styles.selectedDenounceOption,
              ]}
        onPress={() => handleDenounceReasonChange('Spam ou Conteúdo Falso')}>
        <Text>Spam ou Conteúdo Falso</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
                styles.denounceOption,
                selectedDenounceOption === 'Comportamento Odioso' && styles.selectedDenounceOption,
              ]}
        onPress={() => handleDenounceReasonChange('Comportamento Odioso')}>
        <Text>Comportamento Odioso</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
                styles.denounceOption,
                selectedDenounceOption === 'Conteúdo Violento' && styles.selectedDenounceOption,
              ]}
        onPress={() => handleDenounceReasonChange('Conteúdo Violento')}>
        <Text>Conteúdo Violento</Text>
      </TouchableOpacity>

      {/* Adicione outras opções conforme necessário */}
      <TouchableOpacity
        style={[
                styles.denounceOption,
                selectedDenounceOption === 'Perfil Falso' && styles.selectedDenounceOption,
              ]}
        onPress={() => handleDenounceReasonChange('Perfil Falso')}>
        <Text>Perfil Falso</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
                styles.denounceOption,
                selectedDenounceOption === 'Assédio' && styles.selectedDenounceOption,
              ]}
        onPress={() => handleDenounceReasonChange('Assédio')}>
        <Text>Assédio</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.denounceOption}
        onPress={() => handleDenounceReasonChange('other')}>
        <Text>Outro</Text>
      </TouchableOpacity>

      {/* Mostrar TextInput para motivo personalizado se 'other' for selecionado */}
      {selectedDenounceOption === 'other' && (
        <TextInput
          style={styles.customDenounceReasonInput}
          placeholder="Digite o motivo"
          value={customDenounceReason}
          onChangeText={handleCustomDenounceReasonChange}
        />
      )}

      <View style={{flexDirection: 'row', margin: 50}}>
      <TouchableOpacity onPress={handleDenounceConfirm} style={styles.denounceButton}>
        <Text style={styles.modalButtonText}>Denunciar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDenounceCancel} style={styles.cancelButton}>
        <Text style={styles.modalButtonText}>Cancelar</Text>
      </TouchableOpacity>
      </View>
    </View>
  </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },

  activityImageWrapper: {
    width: 186,
    marginBottom: 10,
  },

  customDenounceReasonInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },

  gradientContainer: {
    flex: 1,
  },

  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12, // Fundo escuro e transparente
  },
  headerIcon: {
    color: 'white',
  },

  userImage: {
    width: 120,
    height: 120,
    borderRadius: 75,
    marginBottom: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    paddingHorizontal: 15,
    marginBottom: 10,
    paddingTop: 10,
    fontFamily: 'Montserrat_700Bold',
    color: '#4f4a4a',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  followButton: {
    backgroundColor: '#fff',
    width: 130,
    paddingHorizontal: 80,
    paddingVertical: 10,
    marginTop: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#0e1014',
    justifyContent: 'center',
  },
  followButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  activityType: {
    width: '100%', // Dois itens por linha com algum espaço entre eles
    height: 150,
    resizeMode: 'cover',
    marginBottom: 5,
  },
  seeMoreButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  seeMoreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  cancelButton:{
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'gray'
  },
  denounceButton: {
    backgroundColor: '#ef000094',
    padding: 10,
    marginRight: 10
  },
  modalButtonText: {
    color: 'black',
    fontSize: 15,
  },



  containerEmpreendimento: {
    shadowColor: "#000",
    shadowOffset: {
  width: 5,
  height: 5,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    marginTop: 20,
    backgroundColor: 'white',
    height: 250,
    width:  "95%",
    borderRadius: 10,
    padding: 10,
    marginRight: 20,
    marginLeft: 10,
    marginBottom: 15
},

cover: {
    width: "100%",
    height: "60%",
    borderRadius: 10,
},

content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
 
},

titleEmpreendimento: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: '#4f4a4a'
},

badge: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,

},

description: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: '#4f4a4a'
},

menuContainer: {
  flex: 1,
  backgroundColor: 'transparent',
},
menuContent: {
  position: 'absolute',
  backgroundColor: 'white',
  padding: 5,
  borderRadius: 5,
  alignItems: 'center',
},

modalBackground: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark background
  justifyContent: 'center',
  alignItems: 'center',
},

denounceOption: {
  paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
    width: "100%"
},

selectedDenounceOption: {
  backgroundColor: '#3498db42', // Adapte a cor de fundo conforme necessário
  borderColor: '#3498db42', // Adapte a cor da borda conforme necessário
  borderWidth: 1,
},

imageInfoContainer: {
  position: 'absolute',
  bottom: 20,
  width: '100%',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // fundo semi-transparente
  padding: 10, // espaço interno
  borderRadius: 5, // bordas arredondadas
},

modalContainer: {
  flex: 1,
  justifyContent: 'center',
},

imageInfoText: {
  color: 'white',
  fontSize: 16,
  marginBottom: 5, // espaço abaixo do texto
},

fullScreenImage: {
  flex: 1,
  resizeMode: 'contain',
},


closeButton: {
  position: 'absolute',
  top: 20,
  right: 20,
  padding: 10,
},
closeButtonText: {
  color: 'white',
  fontSize: 16,
},

modalContainerFullScreen: {
  flex: 1,
  backgroundColor: 'black',
  justifyContent: 'center',
},

});
