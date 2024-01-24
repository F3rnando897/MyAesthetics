import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Parse from 'parse/react-native.js';
import Avatar from '../../../assets/Icons/avatar.png';

const TeamManagement = ({ route }) => {
  const { empreendimentoId } = route.params;
  const [equipe, setEquipe] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selecionarUsuarioModalVisible, setSelecionarUsuarioModalVisible] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [confirmarModalVisible, setConfirmarModalVisible] = useState(false);
  console.log(usuarios)

  const carregarEquipe = async () => {
    try {
      const BusinessMembers = Parse.Object.extend('BusinessMembers');
      const queryMembers = new Parse.Query(BusinessMembers);

      // Ajuste para usar um ponteiro para o empreendimento
      const Empreendimentos = Parse.Object.extend('Empreendimentos');
      const empreendimento = new Empreendimentos();
      empreendimento.set('objectId', empreendimentoId);

      queryMembers.equalTo('business', empreendimento);

      const resultMembers = await queryMembers.find();

      console.log('Query:', queryMembers);
      console.log('Result Members:', resultMembers);

      if (resultMembers.length > 0) {
        const equipeUsuarios = resultMembers.map((member) => {
          const entrepreneur = member.get('entrepreneur');
          return {
            objectId: entrepreneur.id,
            username: entrepreneur.get('username'),
            imgProfile: entrepreneur.get('imgProfile'),
          };
        });

        console.log('Equipe Usuários:', equipeUsuarios);

        setEquipe(equipeUsuarios);
      } else {
        console.log('Nenhum membro encontrado para o empreendimento:', empreendimentoId);
      }
    } catch (error) {
      console.error('Erro ao carregar a equipe:', error);
    }
  };

  const carregarUsuarios = async () => {
    try {
      const User = Parse.Object.extend('User');
      const queryUsuarios = new Parse.Query(User);
      const resultUsuarios = await queryUsuarios.find();

      // Filtrar usuários que não são membros da equipe
      const usuariosNaoMembros = resultUsuarios.filter((usuario) => {
        return !equipe.some((membro) => membro.objectId === usuario.id);
      });

      const listaUsuarios = usuariosNaoMembros.map((usuario) => ({
        objectId: usuario.id,
        username: usuario.get('username'),
        imgProfile: usuario.get('imgProfile').url(),
      }));

      setUsuarios(listaUsuarios);
    } catch (error) {
      console.error('Erro ao carregar os usuários:', error);
    }
  };

  useEffect(() => {
    carregarEquipe();
    carregarUsuarios();
  }, [empreendimentoId]);

  const adicionarMembro = async () => {
    try {
      setConfirmarModalVisible(true);
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
    }
  };

  const confirmarAdicaoMembro = async () => {
    try {
      if (!usuarioSelecionado || !usuarioSelecionado.objectId || !empreendimentoId) {
        console.error('Dados do usuário ou empreendimento inválidos.');
        return;
      }

      const Empreendimentos = Parse.Object.extend('Empreendimentos');
      const empreendimento = new Empreendimentos();
      empreendimento.set('objectId', empreendimentoId);

      const BusinessMembers = Parse.Object.extend('BusinessMembers');
      const newMember = new BusinessMembers();
      newMember.set('entrepreneur', {
        __type: 'Pointer',
        className: '_User',
        objectId: usuarioSelecionado.objectId,
      });
      newMember.set('business', empreendimento); // Usando um ponteiro para o empreendimento
      newMember.set('role', 'Função do Membro');

      await newMember.save();

      carregarEquipe();

      setConfirmarModalVisible(false);
      setUsuarioSelecionado(null);
    } catch (error) {
      console.error('Erro ao confirmar adição de membro:', error);
    }
  };

  const excluirMembro = async (membroId) => {
    try {
      const BusinessMembers = Parse.Object.extend('BusinessMembers');
      const queryMembers = new Parse.Query(BusinessMembers);

      const membro = await queryMembers.get(membroId);
      await membro.destroy();

      carregarEquipe();
    } catch (error) {
      console.error('Erro ao excluir membro:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
      <Image
        source={item.imgProfile ? { uri: item.imgProfile.url() } : Avatar}
        style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }}
      />
      <Text>{item.username}</Text>
      <TouchableOpacity onPress={() => excluirMembro(item.objectId)}>
        <Text style={{ color: 'red', marginLeft: 8 }}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderUsuarioItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setUsuarioSelecionado(item)}
      style={[
        styles.usuarioItem,
        usuarioSelecionado && usuarioSelecionado.objectId === item.objectId && styles.usuarioSelecionado,
      ]}
    >
      <Image
        source={
          item.imgProfile.url 
            ? { uri: item.imgProfile.url() }
            : Avatar
        }
        style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }}
      />
      <Text>{item.username}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Equipe do Empreendimento</Text>

      {console.log(equipe)}
      <FlatList data={equipe} keyExtractor={(item) => item.objectId} renderItem={renderItem} />

      <TouchableOpacity
        onPress={() => setSelecionarUsuarioModalVisible(true)}
        style={{ marginTop: 16, padding: 8, backgroundColor: 'blue', borderRadius: 8 }}
      >
        <Text style={{ color: 'white' }}>Adicionar Novo Membro</Text>
      </TouchableOpacity>

      <Modal visible={selecionarUsuarioModalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Selecione um Usuário</Text>

          <FlatList data={usuarios} keyExtractor={(item) => item.objectId} renderItem={renderUsuarioItem} />

          <TouchableOpacity
            onPress={adicionarMembro}
            style={{ marginTop: 16, padding: 8, backgroundColor: 'blue', borderRadius: 8 }}
          >
            <Text style={{ color: 'white' }}>Adicionar Membro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelecionarUsuarioModalVisible(false)}
            style={{ marginTop: 16, padding: 8, backgroundColor: 'red', borderRadius: 8 }}
          >
            <Text style={{ color: 'white' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={confirmarModalVisible} animationType="slide" transparent>
        <View style={styles.confirmarModal}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Confirmar Adição de Membro</Text>
          <Text>Deseja realmente adicionar {usuarioSelecionado?.username} à equipe?</Text>
          <TouchableOpacity
            onPress={confirmarAdicaoMembro}
            style={{ marginTop: 16, padding: 8, backgroundColor: 'blue', borderRadius: 8 }}
          >
            <Text style={{ color: 'white' }}>Confirmar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setConfirmarModalVisible(false);
              setUsuarioSelecionado(null);
            }}
            style={{ marginTop: 16, padding: 8, backgroundColor: 'red', borderRadius: 8 }}
          >
            <Text style={{ color: 'white' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  usuarioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    padding: 8,
    borderRadius: 8,
  },
  usuarioSelecionado: {
    backgroundColor: 'lightblue',
  },
  confirmarModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
  },
});

export default TeamManagement;
