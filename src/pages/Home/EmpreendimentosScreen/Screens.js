import React, {useState} from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Parse } from "parse/react-native.js";
import Recomendation from '../boxComponents/boxComponent.js';
import * as Animatable from 'react-native-animatable'
import {styles} from './style.js';

export default function EmpreendimentosScreen(props) {
  const [recomendations, setRecomendations] = React.useState([]);
  const [objectIds, setObjectIds] = useState([]);

  console.log(objectIds);
  React.useEffect(() => {
    async function fetchEmpreendimentos() {
      const Empreendimentos = Parse.Object.extend("Empreendimentos");
      const query = new Parse.Query(Empreendimentos);

      try {
        const listaDeEmpreendimentos = await query.find();

        if (listaDeEmpreendimentos.length > 0) {
          const empRecomendations = listaDeEmpreendimentos.map((empreendimento) => ({
            name: empreendimento.get('name'),
            imgCover: empreendimento.get('imgCover'),
            type: empreendimento.get('type'),
            id: empreendimento.id, // Adicione o ID aqui
          }));

          const filteredRecomendations = empRecomendations.filter(
            (recomendation) => recomendation.type === props.route.params.type
          );

          const filteredIds = filteredRecomendations.map((recomendation) => recomendation.id);
          setObjectIds(filteredIds); // Defina os IDs correspondentes aos empreendimentos filtrados

          setRecomendations(filteredRecomendations);
        } else {
          console.log("Nenhum objeto encontrado.");
        }
      } catch (error) {
        console.error('Error while fetching Empreendimentos', error);
      }
    }

    fetchEmpreendimentos();
  }, [props.route.params.type]);
  console.log(props)

  // ...

  return (
    <View style={styles.container}>
      
      {recomendations.map((recomendation, index) => (
  <TouchableOpacity key={index}>
    <Animatable.View animation="fadeInUp" duration={900} delay={150}>
      <Recomendation
        key={index} // Aqui você está fornecendo uma chave única para Recomendation
        name={recomendation.name}
        imgCover={recomendation.imgCover}
        onPress={() => props.navigation.navigate('Details', { objectId: objectIds[index] })}
        objectId={objectIds[index]}
        // Outras props que você deseja passar para o componente Recomendation
      />
    </Animatable.View>
  </TouchableOpacity>
))}
      
    </View>
  );
}