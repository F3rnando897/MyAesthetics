  import React, { useState, useEffect } from 'react';
  import { Text, View, Image, ScrollView, FlatList, TouchableOpacity, Modal, TextInput, Linking, RefreshControl} from 'react-native';
  import CheckBox from 'react-native-checkbox';
  import { useNavigation, useFocusEffect } from '@react-navigation/native';
  import { Parse } from 'parse/react-native.js';
  import { styles } from './styles/Mystyle';
  import imgSemImagem from '../../../assets/grayBackground.png';
  import * as ImagePicker from 'expo-image-picker';
  import { AntDesign, Ionicons, FontAwesome, FontAwesome5, Entypo } from '@expo/vector-icons';
  import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
  import { faCoffee, faCar, faWheelchair, faChild, faPaw, faWifi3 } from '@fortawesome/free-solid-svg-icons';

  export default function MyEmpreendimento({ route }) {
    const navigation = useNavigation();
    const [empreendimentoData, setEmpreendimentoData] = useState(null);
    const [empreendimentoPictures, setEmpreendimentoPictures] = useState([]);
    const [enderecoEmpreendimento, setEnderecoEmpreendimento] = useState(null);
    const [servicesData, setServicesData] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [socialMediaModalVisible, setSocialMediaModalVisible] = useState(false); // Correção aqui
    const [linkedinLink, setLinkedinLink] = useState('');
    const [facebookLink, setFacebookLink] = useState('');
    const [instagramLink, setInstagramLink] = useState('');
    const [websiteLink, setWebsiteLink] = useState('');
    const [socialMediaData, setSocialMediaData] = useState(null);
    const [comodidadesModalVisible, setComodidadesModalVisible] = useState(false);
    const [comodidadesData, setComodidadesData] = useState([]);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [comodidades, setComodidades] = useState([]);
    const [selectedComodidades, setSelectedComodidades] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const comodidadeIcons = {
      'Wi-Fi Gratuito': faWifi3,
      'Estacionamento': faCar,
      'Acessibilidade': faWheelchair,
      'Área para Crianças': faChild,
      'Permitida entrada de pets': faPaw,
      // Adicione mais comodidades e seus ícones conforme necessário
    };
    const onRefresh = () => {
      setRefreshing(true);
    
      // Realize ações de recarregamento, como carregar novamente a equipe ou atualizar dados
      fetchEmpreendimentoData();
      // Após concluir a atualização, defina o refreshing de volta para false
      setRefreshing(false);
    };

    const openDrawer = () => {
      setDrawerVisible(true);
    };

    const closeDrawer = () => {
      setDrawerVisible(false);
    };

    const renderDrawer = () => (
      <View
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
    
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('Agenda', { empreendimentoId: empreendimentoData.objectId });
            closeDrawer(); 
          }}
        >
          <Text style={styles.drawerItemText}>Agenda</Text>
        </TouchableOpacity>
    
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('AvaliationEmpreendimento', { empreendimentoId: empreendimentoData.objectId });
            closeDrawer(); 
          }}
        >
          <Text style={styles.drawerItemText}>Avaliações</Text>
        </TouchableOpacity>
    
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('TeamManagement', { empreendimentoId: empreendimentoData.objectId });
            closeDrawer(); 
          }}
        >
          <Text style={styles.drawerItemText}>Gerenciamento de Equipe</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('PromotionsManagement', { empreendimentoId: empreendimentoData.objectId });
            closeDrawer(); 
          }}
        >
          <Text style={styles.drawerItemText}>Gestão de promoções</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('OpeningHours', { empreendimentoId: empreendimentoData.objectId });
            closeDrawer(); 
          }}
        >
          <Text style={styles.drawerItemText}>Horarios de funcionamento</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('Wallet', { empreendimentoId: empreendimentoData.objectId, empreendedorId: empreendimentoData.emp_empreendedores.objectId,
               empreendedorEmail: empreendimentoData.emp_empreendedores.email });
            closeDrawer(); 
          }}
        >
          <Text style={styles.drawerItemText}>Carteira</Text>
        </TouchableOpacity>
      
      </View>
    );
    

    
      async function fetchEmpreendimentoData() {
        try {
          const currentUser = await Parse.User.currentAsync();
          if (currentUser) {
            const Empreendedores = Parse.Object.extend('Empreendedores');
            const empreendedoresQuery = new Parse.Query(Empreendedores);
            empreendedoresQuery.equalTo('empUser', currentUser);

            const Empreendimentos = Parse.Object.extend('Empreendimentos');
            const empreendimentosQuery = new Parse.Query(Empreendimentos);
            empreendimentosQuery.matchesQuery('emp_empreendedores', empreendedoresQuery);

            const empreendimento = await empreendimentosQuery.first();
            if (empreendimento) {
              setEmpreendimentoData(empreendimento.toJSON());
              
              // Buscar dados do endereço associado
              const address = empreendimento.get('addressEmpreendimentoId');
              if (address) {
                const AddressesEmpreendimento = Parse.Object.extend('AddressesEmpreendimento');
                const addressQuery = new Parse.Query(AddressesEmpreendimento);
                addressQuery.equalTo('objectId', address.id); // Usar o ID do ponteiro
                
                try {
                  const endereco = await addressQuery.first();
                  if (endereco) {
                    setEnderecoEmpreendimento(endereco.toJSON());
                  } else {
                    console.warn('Endereço não encontrado para o empreendimento.');
                  }
                } catch (error) {
                  console.error('Erro ao buscar dados do endereço:', error);
                }
              }
              // Consulta as fotos do empreendimento a partir da tabela picturesEmpreendimentos
              const PicturesEmpreendimentos = Parse.Object.extend('picturesEmpreendimentos');
              const picturesQuery = new Parse.Query(PicturesEmpreendimentos);
              picturesQuery.equalTo('picture_empreendimentos', empreendimento);

              try {
                const result = await picturesQuery.find();
                const pictureUrls = result.map((picture) => picture.get('picture').url());
                setEmpreendimentoPictures(pictureUrls);
              } catch (error) {
                console.error('Error fetching pictures', error);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching empreendimento data:', error);
        }
      }

      async function fetchServicesData() {
        try {
          const currentUser = await Parse.User.currentAsync();
          if (currentUser) {
            const Empreendedores = Parse.Object.extend('Empreendedores');
            const empreendedoresQuery = new Parse.Query(Empreendedores);
            empreendedoresQuery.equalTo('empUser', currentUser);
      
            const Empreendimentos = Parse.Object.extend('Empreendimentos');
            const empreendimentosQuery = new Parse.Query(Empreendimentos);
            empreendimentosQuery.matchesQuery('emp_empreendedores', empreendedoresQuery);
      
            const empreendimento = await empreendimentosQuery.first();
            if (empreendimento) {
              const empreendimentoId = empreendimento.id; // Get the objectId of the current Empreendimento
      
              // Create a Parse Query for the "Services" class
              const Services = Parse.Object.extend('Services');
              const servicesQuery = new Parse.Query(Services);
      
              // Include the pointer to the "Empreendimento" class
              servicesQuery.include('serviceEmpreendimento');
      
              // Filter services by the current Empreendimento objectId
              servicesQuery.equalTo('serviceEmpreendimento', {
                __type: 'Pointer',
                className: 'Empreendimentos',
                objectId: empreendimentoId,
              });
      
              // Fetch services related to the current Empreendimento
              const services = await servicesQuery.find();
      
              // Set the services data in the state
              setServicesData(services.map((service) => service.toJSON()));
            }
          }
        } catch (error) {
          console.error('Error fetching services data:', error);
        }
      }
      
      async function deleteService(serviceId) {
        try {
          // Crie um Parse.Object para o serviço a ser excluído
          const Services = Parse.Object.extend('Services');
          const serviceObject = new Services({ objectId: serviceId });
      
          // Consultar a tabela Schedules para obter os registros associados ao serviço
          const Schedules = Parse.Object.extend('Schedules');
          const schedulesQuery = new Parse.Query(Schedules);
          schedulesQuery.equalTo('serviceId', { __type: 'Pointer', className: 'Services', objectId: serviceId });
          const schedules = await schedulesQuery.find();
      
          // Excluir os registros da tabela Schedules associados ao serviço
          await Parse.Object.destroyAll(schedules);
      
          // Consultar a tabela Agenda para obter os registros associados ao serviço
          const Agenda = Parse.Object.extend('Agenda');
          const agendaQuery = new Parse.Query(Agenda);
          agendaQuery.equalTo('serviceId', { __type: 'Pointer', className: 'Services', objectId: serviceId });
          const agendaItems = await agendaQuery.find();
      
          // Excluir os registros da tabela Agenda associados ao serviço
          await Parse.Object.destroyAll(agendaItems);
      
          // Exclua o serviço
          await serviceObject.destroy();
      
          // Atualize a lista de serviços após a exclusão
          const updatedServices = servicesData.filter((service) => service.objectId !== serviceId);
          setServicesData(updatedServices);
      
          console.log('O serviço foi excluído com sucesso, juntamente com registros em Schedules e Agenda.');
        } catch (error) {
          console.error('Erro ao excluir o serviço:', error);
          // Lide com o erro de acordo com as necessidades do seu aplicativo
        }
        
      }
      
      async function fetchSocialMediaData() {
        
        try {
      
          const SocialMediaLinks = Parse.Object.extend('SocialMedia');
          const socialMediaQuery = new Parse.Query(SocialMediaLinks);
          socialMediaQuery.equalTo('empreendimentoId', {
            __type: 'Pointer',
            className: 'Empreendimentos',
            objectId: empreendimentoData.objectId,
          });
      
          const socialMedia = await socialMediaQuery.first();
          
      
          if (socialMedia) {
            setSocialMediaData(socialMedia.toJSON());
      
            // Atualize os estados dos links
            setLinkedinLink(socialMedia.get('linkedinLink') || '');
            setFacebookLink(socialMedia.get('facebookLink') || '');
            setInstagramLink(socialMedia.get('instagramLink') || '');
            setWebsiteLink(socialMedia.get('websiteLink') || '');
          } else {
            console.warn('Dados de mídia social não encontrados para o empreendimento.');
          }
        } catch (error) {
          console.error('Erro ao buscar dados de mídia social:', error);
        }
      }

      async function fetchComodidades() {
        try {
          // Crie um Parse Query para a classe Comodidades
          const Comodidades = Parse.Object.extend('Comodidades');
          const comodidadesQuery = new Parse.Query(Comodidades);
      
          // Filtrar comodidades pelo empreendimento atual
          comodidadesQuery.equalTo('empreendimentoId', {
            __type: 'Pointer',
            className: 'Empreendimentos',
            objectId: empreendimentoData.objectId,
          });
      
          // Realize a consulta para obter as comodidades
          const comodidadesResult = await comodidadesQuery.find();
      
          // Atualize o estado local ou faça o processamento necessário com os dados obtidos
          // Por exemplo, você pode definir as comodidades em um estado para serem exibidas na sua interface
          const comodidadesData = comodidadesResult.map((comodidade) => comodidade.toJSON());
          setComodidades(comodidadesData);
        } catch (error) {
          console.error('Erro ao buscar dados de comodidades:', error);
          // Lide com o erro de acordo com as necessidades do seu aplicativo
        }
      }

      async function fetchComodidadesData() {
        // Função para buscar dados de comodidades do seu backend
        try {
          // Substitua este bloco de código pelo código real para buscar comodidades do seu backend
          const comodidades = [
            { id: '1', name: 'Wi-Fi Gratuito'},
            { id: '2', name: 'Estacionamento'},
            { id: '3', name: 'Acessibilidade'},
            { id: '4', name: 'Área para Crianças'},
            { id: '6', name: 'Permitida entrada de pets' },
            // Adicione mais comodidades conforme necessário
          ];
          setComodidadesData(comodidades);
        } catch (error) {
          console.error('Erro ao buscar dados de comodidades:', error);
        }
      }

      async function handleAddComodidade() {
        try {
          // Crie uma consulta para encontrar as comodidades existentes associadas a este empreendimento
          const Comodidades = Parse.Object.extend('Comodidades');
          const query = new Parse.Query(Comodidades);
          query.equalTo('empreendimentoId', {
            __type: 'Pointer',
            className: 'Empreendimentos',
            objectId: empreendimentoData.objectId,
          });
      
          // Execute a consulta para obter as comodidades existentes
          const comodidadesExistem = await query.find();
      
          // Iterar sobre as comodidades existentes e removê-las
          for (const comodidadeExistente of comodidadesExistem) {
            await comodidadeExistente.destroy();
          }
      
          // Iterar sobre as comodidades selecionadas
          for (const comodidadeId of selectedComodidades) {
            // Criar um novo objeto Comodidades
            const comodidadeObject = new Comodidades();
      
            // Configurar os campos do objeto
            comodidadeObject.set('name', comodidadesData.find((c) => c.id === comodidadeId).name);
      
            // Adicionar relacionamento com o Empreendimento atual
            comodidadeObject.set('empreendimentoId', {
              __type: 'Pointer',
              className: 'Empreendimentos',
              objectId: empreendimentoData.objectId,
            });
      
            // Salvar o objeto no Back4App
            await comodidadeObject.save();
          }
      
          // Fechar o modal após adicionar todas as comodidades
          setComodidadesModalVisible(false);
        } catch (error) {
          console.error('Erro ao adicionar/com substituir comodidades:', error);
          // Lide com o erro de acordo com as necessidades do seu aplicativo
        }
      }
      
      useEffect(() => {
        // Fetch empreendimentoData only if it's not available
        async function loadData() {
          await fetchEmpreendimentoData(); // Primeiro, busca dados do empreendimento.
      
          if (empreendimentoData && empreendimentoData.objectId) {
            // Certifique-se de que empreendimentoData foi definido
            await fetchComodidades();
            await fetchServicesData();
            await fetchSocialMediaData();
            await fetchComodidadesData();
          }
        }
        
        loadData();
      }, [empreendimentoData]);

    useFocusEffect(
      React.useCallback(() => {
        fetchServicesData();
        fetchEmpreendimentoData();
      }, [])
    );


    const handleSaveSocialMedia = async () => {
      try {
        // Verifique se já existe uma entrada na tabela SocialMedia associada ao empreendimento
        const SocialMediaLinks = Parse.Object.extend('SocialMedia');
        const socialMediaQuery = new Parse.Query(SocialMediaLinks);
        socialMediaQuery.equalTo('empreendimentoId', {
          __type: 'Pointer',
          className: 'Empreendimentos',
          objectId: empreendimentoData.objectId,
        });
        
        const existingSocialMedia = await socialMediaQuery.first();
        
        if (existingSocialMedia) {
          // Se existir, atualize os campos com os novos links
          existingSocialMedia.set('linkedinLink', linkedinLink);
          existingSocialMedia.set('facebookLink', facebookLink);
          existingSocialMedia.set('instagramLink', instagramLink);
          existingSocialMedia.set('websiteLink', websiteLink);
          
          // Salve as alterações
          await existingSocialMedia.save();
          console.log('Links de mídias sociais atualizados com sucesso.');
        } else {
          // Se não existir, crie uma nova entrada na tabela SocialMedia
          const socialMediaObject = new SocialMediaLinks();
      
          socialMediaObject.set('empreendimentoId', {
            __type: 'Pointer',
            className: 'Empreendimentos',
            objectId: empreendimentoData.objectId,
          });
      
          socialMediaObject.set('linkedinLink', linkedinLink);
          socialMediaObject.set('facebookLink', facebookLink);
          socialMediaObject.set('instagramLink', instagramLink);
          socialMediaObject.set('websiteLink', websiteLink);
      
          await socialMediaObject.save();
          console.log('Links de mídias sociais salvos com sucesso.');
        }
        
        // Feche o modal
        setSocialMediaModalVisible(false);
      } catch (error) {
        console.error('Erro ao salvar/atualizar links de mídias sociais:', error);
        // Lide com o erro de acordo com as necessidades do seu aplicativo
      }
    };

    const updateEmpreendimento = (updatedEmpreendimento) => {
      setEmpreendimentoData(updatedEmpreendimento);
    };

    const handleImagePicker = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaType: 'photo',
        allowsEditing: true,
        base64: true,
        aspect: [4, 4],
        quality: 1,
      });
    
      if (!result.cancelled) {
        const base64Image = result.base64; // Dados em base64 da imagem
        const fileName = result.uri.split('/').pop(); // Obtém o nome do arquivo a partir do URI
    
        const parseFile = new Parse.File(fileName, { base64: base64Image });
    
        try {
          await parseFile.save();
    
          // Crie um objeto na tabela picturesEmpreendimento
          const PicturesEmpreendimentos = Parse.Object.extend('picturesEmpreendimentos');
          const pictureObject = new PicturesEmpreendimentos();
          
          // Defina o campo "pictures" para o Parse.File que você salvou
          pictureObject.set('picture', parseFile);
          
          // Defina o campo "picture_empreendimento" com o objectId do empreendimento
          const empreendimentoId = empreendimentoData.objectId; // Certifique-se de que empreendimentoData contenha o objectId
          
          pictureObject.set('picture_empreendimentos', {
            __type: 'Pointer',
            className: 'Empreendimentos',
            objectId: empreendimentoId,
          });
    
          await pictureObject.save();
          
          // Atualize a lista de fotos após o upload
          const updatedPictures = [...empreendimentoPictures, parseFile.url()];
          setEmpreendimentoPictures(updatedPictures);
          
          console.log('A foto foi enviada para a tabela picturesEmpreendimento.');
        } catch (error) {
          console.error('A foto não pôde ser enviada para a tabela picturesEmpreendimento:', error);
        }
      }
    };

    return (
      <ScrollView style={{backgroundColor: '#fff'}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={[styles.container, {backgroundColor: '#fff'}]}>

          {/* Header */}
          <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={openDrawer}>
              <Ionicons name="ios-menu" size={24} color="white" />
            </TouchableOpacity>
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

        <Image key={route} animation='fadeInDown' source={empreendimentoData?.imgCover?.url ? { uri: empreendimentoData.imgCover.url } : imgSemImagem} style={styles.img}/>


          

          <View style={styles.top}>
            <Text animation='fadeInLeft' duration={900} style={styles.title}>
              {empreendimentoData ? empreendimentoData.name : 'Nome do Empreendimento'}
            </Text>
          </View>

          <View animation='fadeInUp' duration={900} style={styles.mid}>
            <View>
            <Text style={styles.description}>
              {enderecoEmpreendimento ? `${enderecoEmpreendimento.street}, ${enderecoEmpreendimento.number}, ${enderecoEmpreendimento.state}, ${enderecoEmpreendimento.cep}` : 'Rua, número'}
            </Text>
            </View>
            <View>
            <Text style={styles.description}>
              {empreendimentoData ? `${empreendimentoData.email}` : 'email'}
            </Text>
            </View>
            <View>
            <Text style={styles.description}>
              {empreendimentoData ? `${empreendimentoData.telephone}` : 'telefone'}
              
            </Text>
            </View>
            <TouchableOpacity style={[styles.button, { marginTop: 10, paddingHorizontal: 20 }]} onPress={() => navigation.navigate('EditEmpreendimento', { empreendimento: empreendimentoData, updateEmpreendimento: updateEmpreendimento })}>

    <Text style={styles.buttonTxt}>Editar</Text>
  </TouchableOpacity>
          </View>
        </View>

        <View>
    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10}}>
      <Text style={styles.subTitle}>Fotos</Text>
      <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginTop: 13}} onPress={handleImagePicker}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AntDesign style={{marginLeft:5}} name="plus" size={20} color="black" />
          <Text style={styles.buttonTxt}>Adicionar</Text>
        </View>
      </TouchableOpacity>
    </View>
    <View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {empreendimentoPictures.length > 0 ? (
      <View style={styles.containerFotos}>
    {showAllPhotos
      ? empreendimentoPictures.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Image source={{ uri: item }} style={styles.fotoEmpreendimento} />
          </View>
        ))
      : empreendimentoPictures.slice(0, 4).map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Image source={{ uri: item }} style={styles.fotoEmpreendimento} />
          </View>
        ))}
    {empreendimentoPictures.length > 4 && (
      <TouchableOpacity
      style={styles.showAllPhotosButton}
      onPress={() => navigation.navigate('AllPhotos', { empreendimentoPictures: empreendimentoPictures })}
      >
        <AntDesign style={{marginBottom:5}} name="pluscircleo" size={25} color="black" />
        <Text style={styles.description}>
          Ver Mais
        </Text>
      </TouchableOpacity>
  )}
  
  </View>
) : (
  <View style={styles.serviceItem}>
    <Text style={styles.description}>Sem fotos disponíveis</Text>
  </View>
)}
</ScrollView>
 
  </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginBottom: 25}}>
          <Text style={styles.subTitle}>Serviços</Text>
          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginTop: 13}} onPress={() => navigation.navigate('AddService', { empreendimentoId: empreendimentoData.objectId})}>
            <AntDesign style={{marginLeft:5}}name="plus" size={20} color="black" />
            <Text style={styles.buttonTxt}>Adicionar</Text>
          </TouchableOpacity>
          </View>

          {servicesData.length > 0 ? (
  <View>
    {servicesData.slice(0, 3).map((item) => (
      <View key={item.objectId} style={styles.serviceItem}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={styles.description}>{item.nameService}</Text>
          <Text style={styles.description2}>{item.description}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[styles.description, { fontWeight: 'bold', marginRight: 5 }]}>
            R${String(item.price)}
          </Text>
          <TouchableOpacity
            style={[styles.button, { marginTop: 0, paddingHorizontal: 20 }]}
            onPress={() => deleteService(item.objectId)}
          >
            <Text style={styles.buttonTxt}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    ))}
    {servicesData.length > 3 && (
      <TouchableOpacity style={{borderBottomWidth: 1, borderTopWidth: 1, borderColor: 'black'}}>
        <Text
          style={[styles.description, {fontSize: 15, marginVertical: 10,  alignSelf: 'center'}]} 
          onPress={() => navigation.navigate('Services', { empreendimentoId: objectId })}
        >
          Ver mais
        </Text>
      </TouchableOpacity>
    )}
  </View>
) : (
  <View style={styles.serviceItem}>
    <Text style={styles.description}>Sem serviços disponíveis</Text>
  </View>
)}  
        </View>

        <View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginBottom: 25}}>
          <Text style={styles.subTitle}>Mídias Sociais</Text>
          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginTop: 13}} onPress={() => setSocialMediaModalVisible(true)}>
            <AntDesign style={{marginLeft:5}}name="plus" size={20} color="black" />
            <Text style={styles.buttonTxt}>Adicionar</Text>
          </TouchableOpacity>
        </View>
    <View style={styles.socialMediaContainer}>
      {socialMediaData && (
        <>
          {socialMediaData.linkedinLink && (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(socialMediaData.linkedinLink);
              }}
              style={styles.socialMediaIcon}
            >
              <AntDesign name="linkedin-square" size={50} color="black" />
            </TouchableOpacity>
          )}
          {socialMediaData.facebookLink && (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(socialMediaData.facebookLink);
              }}
              style={styles.socialMediaIcon}
            >
              <AntDesign name="facebook-square" size={50} color="black" />
            </TouchableOpacity>
          )}
          {socialMediaData.instagramLink && (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(socialMediaData.instagramLink);
              }}
              style={styles.socialMediaIcon}
            >
              <AntDesign name="instagram" size={50} color="black" />
            </TouchableOpacity>
          )}
          {socialMediaData.websiteLink && (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(socialMediaData.websiteLink);
              }}
              style={styles.socialMediaIcon}
            >
              <FontAwesome name="globe" size={50} color="black" />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  </View>
  <View>
  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginBottom: 25}}>
    <Text style={styles.subTitle}>Comodidades</Text>
    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginTop: 13}} onPress={() => setComodidadesModalVisible(true)}>
      <AntDesign style={{marginLeft:5}}name="plus" size={20} color="black" />
      <Text style={styles.buttonTxt}>Adicionar</Text>
    </TouchableOpacity>
  </View>

  {/* Lista de comodidades */}
    {comodidades.map((item) => (
      <View key={item.objectId} style={styles.comodidadeItem}>
        <FontAwesomeIcon icon={comodidadeIcons[item.name]} size={20} color={'black'} />
        <Text style={styles.description}>{item.name}</Text>
        {/* Adicione mais detalhes sobre a comodidade, se necessário */}
      </View>
    ))}
  
</View>

        <Modal transparent={true} visible={socialMediaModalVisible} animationType="slide" onRequestClose={() => setSocialMediaModalVisible(false)}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSocialMediaModalVisible(false)}>
              <TouchableOpacity>
              <View style={styles.modalContent}>
                {/* Additional TextInputs for each platform */}
                {['LinkedIn', 'Facebook', 'Instagram', 'Website'].map((platform) => (
                  <View key={platform}>
                    <Text>{`${platform}`}</Text>
                    <TextInput
                      style={styles.modalTextInput}
                      placeholder={`Link do ${platform}`}
                      value={
                        platform === 'LinkedIn'
                          ? linkedinLink
                          : platform === 'Facebook'
                          ? facebookLink
                          : platform === 'Instagram'
                          ? instagramLink
                          : websiteLink
                      }
                      onChangeText={(link) => {
                        // Update the state based on the platform
                        if (platform === 'LinkedIn') {
                          setLinkedinLink(link);
                        } else if (platform === 'Facebook') {
                          setFacebookLink(link);
                        } else if (platform === 'Instagram') {
                          setInstagramLink(link);
                        } else {
                          setWebsiteLink(link);
                        }
                      }}
                    />
                  </View>
                ))}
                {/* Save Button */}
                <TouchableOpacity onPress={handleSaveSocialMedia} style={styles.modalSaveButton}>
                  <Text>Salvar</Text>
                </TouchableOpacity>
              </View>
              </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* Modal para adicionar comodidades */}
      <Modal transparent={true} visible={comodidadesModalVisible} animationType="slide" onRequestClose={() => setComodidadesModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setComodidadesModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={[styles.modalContent, { width: '100%', height: '100%', marginTop: 0 }]}>
                <Text>Adicionar Comodidade</Text>
                {/* Lista de checkboxes para comodidades */}
                <FlatList
                  data={comodidadesData}
                  keyExtractor={(comodidade) => comodidade.id}
                  renderItem={({ item: comodidade }) => (
                    <View style={styles.comodidadeItem}>
                      <CheckBox
                        label={comodidade.name}
                        checked={selectedComodidades.includes(comodidade.id)}
                        onChange={() => {
                          setSelectedComodidades((prevSelected) => {
                            if (prevSelected.includes(comodidade.id)) {
                              return prevSelected.filter((id) => id !== comodidade.id);
                            } else {
                              return [...prevSelected, comodidade.id];
                            }
                          });
                        }}
                      />
                    </View>
                  )}
                />
                {/* Botão para adicionar a comodidade */}
                <TouchableOpacity onPress={handleAddComodidade} style={styles.modalSaveButton}>
                  <Text>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      </ScrollView>
    );
  }
