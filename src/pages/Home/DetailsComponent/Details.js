import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, ScrollView, Dimensions, Modal, Linking } from 'react-native'; 
import { useNavigation } from '@react-navigation/native';
import { Parse } from 'parse/react-native.js';
import {styles} from './style';
import * as Animatable from 'react-native-animatable'
import { Rating, AirbnbRating } from 'react-native-ratings';
import SemImg from '../../../../assets/grayBackground.png';
import SemImgFoto from '../../../../assets/Icons/imgSemFoto.jpg';
import { AntDesign, Ionicons, FontAwesome, FontAwesome5, Entypo } from '@expo/vector-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCoffee, faCar, faWheelchair, faChild, faPaw, faWifi3 } from '@fortawesome/free-solid-svg-icons';
import Avatar from '../../../../assets/Icons/avatar.png';

export default function Details({ route }) {
  const { objectId } = route.params;
  const [active, setActive] = useState(false);
  const [empreendimentoData, setEmpreendimentoData] = useState(null);
  const [servicesData, setServicesData] = useState([]);
  const [enderecoEmpreendimento, setEnderecoEmpreendimento] = useState(null);
  const [pictures, setPictures] = useState([]); 
  const [avaliationsData, setAvaliationsData] = useState([]);
  const [equipeData, setEquipeData] = useState([]);
  const [isFollowingEmpreendimento, setIsFollowingEmpreendimento] = useState(false);
  const [fullScreenImageVisible, setFullScreenImageVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [comodidades, setComodidades] = useState([]);
  const [socialMediaLinks, setSocialMediaLinks] = useState({
  facebookLink: '',
  instagramLink: '',
  websiteLink: '',
  linkedinLink: '',
});
const [visiblePhotos, setVisiblePhotos] = useState(4);
const initialLoadCount = 4;

const navigation = useNavigation();

const navigateToAllPhotos = () => {
  // Navegar para a tela "AllPhotos" com as fotos completas
  navigation.navigate('AllPhotos', {empreendimentoPictures: pictures});
};
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setFullScreenImageVisible(true);
  };

  const handleSocialMediaClick = (link) => {
    // Verifica se há um link válido
    if (link) {
      Linking.openURL(link).catch((error) => {
        console.error('Erro ao abrir o link de mídia social:', error);
      });
    }
  };
 
  async function fetchEmpreendimentoData() {
    const Empreendimentos = Parse.Object.extend('Empreendimentos');
    const query = new Parse.Query(Empreendimentos);

    // Consulta a tabela SocialMedia para obter os links de mídia social
    const SocialMedia = Parse.Object.extend('SocialMedia');
    const socialMediaQuery = new Parse.Query(SocialMedia);
    socialMediaQuery.equalTo('empreendimentoId', {
      __type: 'Pointer',
      className: 'Empreendimentos',
      objectId: objectId,
    });

    try {
      const socialMedia = await socialMediaQuery.first();
      if (socialMedia) {
        setSocialMediaLinks({
          facebookLink: socialMedia.get('facebookLink') || '',
          instagramLink: socialMedia.get('instagramLink') || '',
          websiteLink: socialMedia.get('websiteLink') || '',
          linkedinLink: socialMedia.get('linkedinLink') || '',
        });
      }
    } catch (error) {
      console.error('Erro ao buscar links de mídia social:', error);
    }
  
    try {
      const empreendimento = await query.get(objectId);
  
      const empreendimentoData = {
        name: empreendimento.get('name'),
        address: empreendimento.get('address'),
        imgCover: empreendimento.get('imgCover'),
        numberAddress: empreendimento.get('numberAddress'),
        telephone: empreendimento.get('telephone'),
        addressEmpreendimentoId: empreendimento.get('addressEmpreendimentoId'),
      };
  
      // Defina empreendimentoData antes de chamar fetchEnderecoEmpreendimento
      setEmpreendimentoData(empreendimentoData);
  
      // Consulta os serviços associados ao empreendimento
      const Services = Parse.Object.extend('Services');
      const servicesQuery = new Parse.Query(Services);
      servicesQuery.equalTo('serviceEmpreendimento', empreendimento);
      
      try {
        const services = await servicesQuery.find();
        // Define os serviços no estado
        setServicesData(services.map((service) => service.toJSON()));
  
        // Após definir empreendimentoData e servicesData, chame fetchEnderecoEmpreendimento
        fetchEnderecoEmpreendimento(empreendimentoData);
        
      } catch (error) {
        console.error('Erro ao buscar serviços do empreendimento:', error);
      }
    } catch (error) {
      console.error('Error fetching Empreendimento data', error);
    }

    // Consulte os membros da equipe associados ao empreendimento
  const BusinessMembers = Parse.Object.extend('BusinessMembers');
  const membersQuery = new Parse.Query(BusinessMembers);
  membersQuery.equalTo('business', {
    __type: 'Pointer',
    className: 'Empreendimentos',
    objectId: objectId,
  });
  try {
    const members = await membersQuery.find();
    const equipe = members.map((member) => {
      const entrepreneur = member.get('entrepreneur');
      return {
        objectId: entrepreneur.id,
        username: entrepreneur.get('username'),
        imgProfile: entrepreneur.get('imgProfile'),
      };
    });
  
    // Defina a equipe no estado
    setEquipeData(equipe);
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error);
  }
  }

  const handleFollowEmpreendimento = async () => {
    if (isFollowingEmpreendimento) {
      // Deixar de seguir o empreendimento
      await unfollowEmpreendimento();
    } else {
      // Seguir o empreendimento
      await followEmpreendimento();
    }
  };

  const followEmpreendimento = async () => {
    const Follow = Parse.Object.extend('FollowEmpreendimentos');
    const follow = new Follow();
  
    // Crie um objeto Pointer para a classe 'Empreendimentos' com base no `objectId`
    const Empreendimentos = Parse.Object.extend('Empreendimentos');
    const empreendimentoPointer = new Empreendimentos();
    empreendimentoPointer.id = objectId;
    follow.set('followingEmpreendimentos', empreendimentoPointer);
  
    // Associe o seguidor ao usuário atual
    follow.set('follower', Parse.User.current());
  
    try {
      await follow.save();
      setIsFollowingEmpreendimento(true);
    } catch (error) {
      console.error('Erro ao seguir o empreendimento:', error);
    }
  };
  
  const unfollowEmpreendimento = async () => {
    const Follou = Parse.Object.extend('FollowEmpreendimentos');
    const query = new Parse.Query(Follou);
    query.equalTo('follower', Parse.User.current());
  
    // Crie um objeto Pointer para a classe 'Empreendimentos' com base no `objectId`
    const Empreendimentos = Parse.Object.extend('Empreendimentos');
    const empreendimentoPointer = new Empreendimentos();
    empreendimentoPointer.id = objectId;
    query.equalTo('followingEmpreendimentos', empreendimentoPointer);
  
    try {
      const follow = await query.first();
      if (follow) {
        await follow.destroy();
        setIsFollowingEmpreendimento(false);
      }
    } catch (error) {
      console.error('Erro ao deixar de seguir o empreendimento:', error);
    }
  };

  async function checkIfFollowingEmpreendimento() {
    // Siga a mesma lógica que você já implementou para verificar se o usuário atual está seguindo o empreendimento
    const Follow = Parse.Object.extend('FollowEmpreendimentos');
    const query = new Parse.Query(Follow);
    query.equalTo('follower', Parse.User.current());
  
    // Crie um objeto Pointer para a classe 'Empreendimentos' com base no `objectId`
    const Empreendimentos = Parse.Object.extend('Empreendimentos');
    const empreendimentoPointer = new Empreendimentos();
    empreendimentoPointer.id = objectId;
    query.equalTo('followingEmpreendimentos', empreendimentoPointer);
  
    try {
      const follow = await query.first();
      setIsFollowingEmpreendimento(!!follow); // Define `isFollowingEmpreendimento` com base no resultado
    } catch (error) {
      console.error('Erro ao verificar se está seguindo:', error);
    }
  }
  
  async function fetchEnderecoEmpreendimento(empreendimentoData) {
    // Certifique-se de que empreendimentoData não seja nulo antes de continuar
    if (empreendimentoData) {
      const AddressesEmpreendimento = Parse.Object.extend('AddressesEmpreendimento');
      const query = new Parse.Query(AddressesEmpreendimento);
  
      // Use o `addressEmpreendimentoId` do empreendimento para buscar o endereço correspondente
      const addressEmpreendimentoId = empreendimentoData.addressEmpreendimentoId.id;
      query.equalTo('objectId', addressEmpreendimentoId);
  
      try {
        const endereco = await query.first();
        if (endereco) {
          setEnderecoEmpreendimento(endereco.toJSON());
        } else {
          console.warn('Endereço não encontrado para o empreendimento.');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do endereço:', error);
      }
    }
  }
  

    // Verifique se o empreendimento está nos favoritos e defina o estado `active` com base nisso
    async function checkIfFavorited() {
      const Favorite = Parse.Object.extend('Favorite');
      const query = new Parse.Query(Favorite);
      query.equalTo('favorite_user', Parse.User.current());

      // Crie um objeto Pointer para a classe 'Empreendimentos' com base no `objectId`
      const Empreendimentos = Parse.Object.extend('Empreendimentos');
      const empreendimentoPointer = Empreendimentos.createWithoutData(objectId);
      query.equalTo('favorite_empreendimento', empreendimentoPointer);

      try {
        const favorite = await query.first();
        setActive(!!favorite); // Define `active` como `true` se favoritado, senão como `false`
      } catch (error) {
        console.error('Erro ao verificar se está favoritado:', error);
      }
    }

    async function fetchPictures() {
      const Pictures = Parse.Object.extend('picturesEmpreendimentos');
      const query = new Parse.Query(Pictures);

      // Crie um objeto Pointer para a classe 'Empreendimentos' com base no `objectId`
      const Empreendimentos = Parse.Object.extend('Empreendimentos');
      const empreendimentoPointer = Empreendimentos.createWithoutData(objectId);
      query.equalTo('picture_empreendimentos', empreendimentoPointer);

      try {
        const result = await query.find();
        const pictureUrls = result.map((picture) => picture.get('picture').url());
        setPictures(pictureUrls);
      } catch (error) {
        console.error('Error fetching pictures', error);
      }
    }

    async function fetchAvaliations() {
      const Avaliations = Parse.Object.extend('Avaliations');
      const query = new Parse.Query(Avaliations);
  
      // Use o `empreendimentoPointer` para buscar as avaliações associadas ao empreendimento
      const empreendimentoPointer = Parse.Object.extend('Empreendimentos').createWithoutData(objectId);
      query.equalTo('avaliationEmpreendimentoId', empreendimentoPointer);
  
      try {
        const avaliations = await query.include('userAvaliationId').find();
        setAvaliationsData(avaliations.map((avaliacao) => avaliacao.toJSON()));
      } catch (error) {
        console.error('Erro ao buscar avaliações do empreendimento:', error);
      }
    }

    useEffect(() => {
        checkIfFollowingEmpreendimento();
        fetchEmpreendimentoData();
        fetchPictures();
        checkIfFavorited();
        fetchAvaliations();
        fetchEnderecoEmpreendimento();
        fetchComodidades();
      
    }, [objectId]);

  if (!empreendimentoData) {
    // Exibir algum indicador de carregamento enquanto os dados estão sendo buscados
    return (
      console.log("Carregando...")
    );
    
  }

  const addToFavorites = async () => {
    const Favorite = Parse.Object.extend('Favorite');
    const favorite = new Favorite();
    favorite.set('favorite_user', Parse.User.current());
  
    // Crie um objeto Pointer para a classe 'Empreendimentos'
    const Empreendimentos = Parse.Object.extend('Empreendimentos');
    const empreendimentoPointer = new Empreendimentos();
    empreendimentoPointer.id = objectId;
    favorite.set('favorite_empreendimento', empreendimentoPointer);

    try {
      await favorite.save();
      setActive(true); // Define o coração como ativo para indicar que está nos favoritos
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
    }
  };

  const removeFromFavorites = async () => {
  const Favorite = Parse.Object.extend('Favorite');
  const query = new Parse.Query(Favorite);
  query.equalTo('favorite_user', Parse.User.current());

  // Crie um objeto Pointer para a classe 'Empreendimentos'
  const Empreendimentos = Parse.Object.extend('Empreendimentos');
  const empreendimentoPointer = new Empreendimentos();
  empreendimentoPointer.id = objectId;

  try {
    const favorite = await query.first();
    if (favorite) {
      await favorite.destroy();
      setActive(false); // Define o coração como inativo para indicar que não está nos favoritos
    }
  } catch (error) {
    console.error('Erro ao remover dos favoritos:', error);
  }
};

  const handleHeartClick = () => {
    if (active) {
      removeFromFavorites();
    } else {
      addToFavorites();
    }
  };

  const calculateAverageRating = () => {
    if (avaliationsData.length === 0) {
      return 0; // Default to 0 if there are no ratings
    }

    const totalRating = avaliationsData.reduce((sum, avaliacao) => sum + avaliacao.numberAvaliation, 0);
    const averageRating = totalRating / avaliationsData.length;

    return averageRating;
  };
  const averageRating = calculateAverageRating();

  const handleAgendarServico = (serviceId) => {
    // Abra o componente de agendamento passando o empreendimentoId e serviceId
    navigation.navigate('Agendar', { empreendimentoId: objectId, serviceId });
  };

  async function fetchComodidades() {
    const Comodidades = Parse.Object.extend('Comodidades');
    const query = new Parse.Query(Comodidades);
    query.equalTo('empreendimentoId', {
      __type: 'Pointer',
      className: 'Empreendimentos',
      objectId: objectId,
    });
  
    try {
      const comodidades = await query.find();
      // Defina as comodidades no estado
      setComodidades(comodidades.map((comodidade) => comodidade.toJSON()));
    } catch (error) {
      console.error('Erro ao buscar comodidades do empreendimento:', error);
    }
  }
  function renderComodidadeIcon(comodidadeName) {
    const iconMap = {
      'Estacionamento': faCar,
      'Acessibilidade': faWheelchair,
      'Área para Crianças': faChild,
      'Permitida entrada de pets': faPaw,
      'Wi-Fi Gratuito': faWifi3,
      // Adicione mais mapeamentos conforme necessário
    };
  
    const icon = iconMap[comodidadeName];
  
    if (icon) {
      return <FontAwesomeIcon icon={icon} size={20} color="black" />;
    } else {
      return <View />;
    }
  }
  


 return(
  <ScrollView>
  <View style={styles.container}>
  <View>
            <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
            <Entypo name="dots-three-vertical" size={24} color="black" />
            </TouchableOpacity>
            </View>
    <Image key={route} animation='fadeInDown' source={empreendimentoData.imgCover ? { uri: empreendimentoData.imgCover.url() } : SemImg} style={styles.img} />

      <View animation='fadeInUp' duration={900} style={styles.mid}>
      <Text animation='fadeInLeft' duration={900} style={styles.title}>{empreendimentoData.name}</Text>
        <Text style={styles.description}>{enderecoEmpreendimento
              ? `${enderecoEmpreendimento.street}, ${enderecoEmpreendimento.number}, ${enderecoEmpreendimento.state}, ${enderecoEmpreendimento.cep}`
              : 'Endereço não encontrado'}</Text>

      
      </View>
      <View animation='fadeInUp' duration={900} style={styles.mid2}>

      <TouchableOpacity
  onPress={handleFollowEmpreendimento}
  style={[
    styles.btnMid,
    {
      width: 125,
      marginTop: 0,
      paddingHorizontal: 20,
      marginHorizontal: 5,
      flexDirection: 'row',
      backgroundColor: isFollowingEmpreendimento ? 'black' : 'white',
    },
  ]}
>
  <Text
    style={[
      styles.buttonTxt,
      { color: isFollowingEmpreendimento ? 'white' : '#0e1014' },
    ]}
  >
    {isFollowingEmpreendimento ? 'Seguindo' : 'Seguir'}
  </Text>
</TouchableOpacity>
{/* 
      <TouchableOpacity style={[// styles.btnMid, { marginTop: 0, paddingHorizontal: 20, flexDirection: 'row' }]} onPress={() => navigation.navigate('ChatEmpreendimento', { empreendimentoId: objectId })}>
      <Text style={[styles.buttonTxt, {color: '#0e1014'}]}>Chat</Text>
      </TouchableOpacity>
    */}
      <TouchableOpacity onPress={handleHeartClick} style={{marginLeft: '56%'}}>
        {active ? (
          <AntDesign name="heart" size={32} color="red" />
        ) : (
          <AntDesign name="hearto" size={32} color="black" />
        )
        }
      </TouchableOpacity>  
      </View>

      <View>
  <Text style={styles.subTitle}>Fotos</Text>
  <View style={{flexDirection: 'row'}}>
    <ScrollView horizontal>
  {pictures.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImageClick(item)}
              style={styles.itemContainer}
            >
              <Image source={{ uri: item }} style={styles.fotoEmpreendimento} />
            </TouchableOpacity>
          ))}
          {pictures.length > visiblePhotos && (
            <TouchableOpacity style={styles.viewAllButton} onPress={navigateToAllPhotos}>
              <AntDesign style={{ marginBottom: 5 }} name="pluscircleo" size={25} color="black" />
              <Text style={styles.description}>Ver mais</Text>
            </TouchableOpacity>
          )}
          </ScrollView>
  </View>
</View>



      <View>
  <Text style={styles.subTitle}>Serviços</Text>
  {servicesData.length > 0 ? (
          servicesData.slice(0, 3).map((item) => (
            <View key={item.objectId} style={styles.serviceItem}>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text style={styles.description}>{item.nameService}</Text>
                <Text style={styles.description2}>{item.description}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.description, { fontWeight: 'bold', marginRight: 5 }]}>R${item.price}</Text>
                <TouchableOpacity style={[styles.button, { marginTop: 0, paddingHorizontal: 20 }]} onPress={() => handleAgendarServico(item.objectId, empreendimentoData.objectId)}>
                  <Text style={styles.buttonTxt}>Agendar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.description}>Ainda não há serviços disponíveis.</Text>
        )}

  {servicesData.length > 3 && (
    <TouchableOpacity style={{ borderBottomWidth: 1, borderTopWidth: 1, borderColor: 'black' }}>
      <Text
        style={[styles.description, { fontSize: 15, marginVertical: 10, alignSelf: 'center' }]}
        onPress={() => navigation.navigate('Services', { empreendimentoId: objectId })}
      >
        Ver mais
      </Text>
    </TouchableOpacity>
  )}
</View>

<View>
  <Text style={[styles.subTitle, {marginTop: 20}]}>Avaliações</Text>
  {avaliationsData.length > 0 ? (
    <View>
      <View style={{flex: 1,flexDirection: 'row', alignSelf: 'center', marginBottom: 10}}>
        <AirbnbRating
          defaultRating={averageRating}
          size={20}
          showRating
          isDisabled
          reviews={false}
        />
        <Text style={{fontSize: 18, color: '#000', fontFamily: 'Montserrat_600SemiBold', marginTop: 10, left: 4, top: 46}}>({averageRating.toFixed(2)})</Text>
      </View>
      {avaliationsData.slice(0, 3).map((item) => (
              <View key={item.objectId} style={styles.avaliationsItem}>
                <Image source={{ uri: item.userAvaliationId.imgProfile.url }} style={styles.userImg} />
                <View style={{flexDirection: 'column', paddingHorizontal: 2}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.description, { fontSize: 18, marginTop: 5, marginRight: 2 }]}>{item.userAvaliationId.username}</Text>
                    <AirbnbRating
                      defaultRating={item.numberAvaliation}
                      size={15}
                      showRating={false}
                      isDisabled
                      reviews={false}
                    />
                  </View>
                  <Text style={[styles.description, {fontSize: 15}]}>{item.comentary}</Text>
                </View>
              </View>
            ))}
      {avaliationsData.length > 3 && (
        <TouchableOpacity style={{borderBottomWidth: 1, borderTopWidth: 1, borderColor: 'black'}}>
          <Text
            style={[styles.description, {fontSize: 15, marginVertical: 10,  alignSelf: 'center'}]} 
            onPress={() => navigation.navigate('Avaliations', { empreendimentoId: objectId })}
          >
            Ver mais
          </Text>
        </TouchableOpacity>
      )}
    </View>
  ) : (
    <Text style={[styles.description, { marginTop: 10 }]}>Ainda não há avaliações disponíveis.</Text>
  )}
</View>

<View>
        <Text style={[styles.subTitle, { marginTop: 20 }]}>Mídias Sociais</Text>
        {socialMediaLinks.facebookLink || socialMediaLinks.instagramLink || socialMediaLinks.websiteLink || socialMediaLinks.linkedinLink ? (
          <View style={styles.socialMediaContainer}>
            {socialMediaLinks.facebookLink && (
              <TouchableOpacity
                onPress={() => handleSocialMediaClick(socialMediaLinks.facebookLink)}
                style={styles.socialMediaIcon}
              >
                <AntDesign name="facebook-square" size={50} color="black" />
              </TouchableOpacity>
            )}
            {socialMediaLinks.instagramLink && (
              <TouchableOpacity
                onPress={() => handleSocialMediaClick(socialMediaLinks.instagramLink)}
                style={styles.socialMediaIcon}
              >
                <AntDesign name="instagram" size={50} color="black" />
              </TouchableOpacity>
            )}
            {socialMediaLinks.websiteLink && (
              <TouchableOpacity
                onPress={() => handleSocialMediaClick(socialMediaLinks.websiteLink)}
                style={styles.socialMediaIcon}
              >
                <FontAwesome name="globe" size={50} color="black" />
              </TouchableOpacity>
            )}
            {socialMediaLinks.linkedinLink && (
              <TouchableOpacity
                onPress={() => handleSocialMediaClick(socialMediaLinks.linkedinLink)}
                style={styles.socialMediaIcon}
              >
                <AntDesign name="linkedin-square" size={50} color="black" />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={[styles.description, { marginTop: 10 }]}>Ainda não há mídias sociais disponíveis.</Text>
        )}
      </View>

      <View>
        <Text style={[styles.subTitle, { marginTop: 20 }]}>Comodidades</Text>
        {comodidades.length > 0 ? (
          <View style={styles.comodidadesContainer}>
            {comodidades.map((comodidade) => (
              <View key={comodidade.objectId} style={styles.comodidadeItem}>
                {renderComodidadeIcon(comodidade.name)}
                <Text style={styles.description}>{comodidade.name}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={[styles.description, { marginTop: 10 }]}>Ainda não há comodidades disponíveis.</Text>
        )}
      </View>
 
<View>
        <Text style={[styles.subTitle, {marginTop: 20}]}>Equipe</Text>
        <View style={{alignSelf: 'center'}}>
        {equipeData.length > 0 ? (
    <FlatList
      data={equipeData}
      horizontal
      keyExtractor={(item) => item.objectId}
      renderItem={({ item }) => (
        <View style={styles.memberContainer}>
          {item.imgProfile ? (
            <Image source={{ uri: item.imgProfile.url() }} style={styles.memberImg} />
          ) : (
            <Image source={Avatar} style={styles.memberImg} /> 
          )}
          <Text style={styles.memberText}>{item.username}</Text>
        </View>
      )}
    />
  ) : (
    <Text style={[styles.description, { marginTop: 10 }]}>Ainda não há membros na equipe.</Text>
  )}
        </View>
        </View>
  </View>


  <Modal visible={fullScreenImageVisible} transparent={true} animationType="fade">
  <View style={styles.fullScreenContainer}>
    <TouchableOpacity onPress={() => setFullScreenImageVisible(false)}>
      <Text style={styles.closeButton}>Fechar</Text>
    </TouchableOpacity>
    <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} />
  </View>
</Modal>
</View>
</ScrollView>
  );
}