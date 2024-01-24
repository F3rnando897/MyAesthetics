import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet, Image, Picker, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Parse from "parse/react-native.js";
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { styles } from './styles/styleSearchBar';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [objectIds, setObjectIds] = useState([]);
  const [userSearchResults, setUserSearchResults] = useState([]);
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (searchText !== "") {
      searchEmpreendimentos();
    } else {
      setSearchResults([]);
    }

    // Após a pesquisa, navegue para a tela de resultados
    navigation.navigate("SearchResults", { searchResults });
  };

  useEffect(() => {
    if (searchText !== "") {
      searchEmpreendimentos();
    } else {
      setSearchResults([]);
    }
  }, [searchText]);

  const searchEmpreendimentos = async () => {
    const Empreendimentos = Parse.Object.extend("Empreendimentos");
    const Users = Parse.Object.extend("User");
    const queryEmpreendimentos = new Parse.Query(Empreendimentos);
    const queryUsers = new Parse.Query(Users);

    if (searchText !== "") {
      queryEmpreendimentos.contains("name", searchText);
      queryUsers.contains("username", searchText);
    }

    try {
      const [empreendimentosResults, usersResults] = await Promise.all([
        queryEmpreendimentos.find(),
        queryUsers.find(),
      ]);

      if (empreendimentosResults.length > 0) {
        const empreendimentosIds = empreendimentosResults.map((objeto) => objeto.id);
        setObjectIds(empreendimentosIds);
      }

      const searchResults = [];

      for (const empreendimento of empreendimentosResults) {
        searchResults.push({
          type: "Empreendimento",
          name: empreendimento.get("name"),
          description: empreendimento.get("description"),
          imgCover: empreendimento.get("imgCover"),
          objectId: empreendimento.id,
        });
      }

      for (const user of usersResults) {
        searchResults.push({
          type: "User",
          username: user.get("username"),
          imgProfile: user.get("imgProfile"),
          objectId: user.id,
        });
      }

      setSearchResults(searchResults);

      if (usersResults.length > 0) {
        const usersIds = usersResults.map((user) => user.id);
        setUserSearchResults(usersIds);
      } else {
        console.log("Nenhum objeto encontrado.");
      }
    } catch (error) {
      console.error("Error while searching Empreendimentos and Users", error);
    }
  };

  const navigateToUserProfile = (objectId) => {
    // Navegue para a tela UserProfile com o objectId do usuário
    navigation.navigate("UserProfile", { objectId });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
    onPress={() => {
      if (item.type === "Empreendimento") {
          console.log(objectIds[index])
          navigation.navigate("Details", { objectId: objectIds[index] });
        } else if (item.type === "User") {
          navigateToUserProfile(item.objectId);
        }
      }}
    >
      <View style={styles.empreendimentoContainer}>
        {item.type === "Empreendimento" ? (
          <>
            <Image source={{ uri: item.imgCover.url() }} style={styles.empreendimentoImage} />
            <View style={styles.empreendimentoInfo}>
              <Text style={styles.empreendimentoName}>{item.name}</Text>
              <Text style={styles.empreendimentoDescription}>{item.description}</Text>
            </View>
          </>
        ) : (
          <>
            <Image source={{ uri: item.imgProfile.url() }} style={styles.empreendimentoImage} />
          
            <View style={styles.empreendimentoInfo}>
            <Text style={styles.empreendimentoName}>{item.username}</Text>
            </View>
          </>
         
        )}
      </View>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>

        <TextInput placeholder="Pesquisar..." style={styles.input} onChangeText={(text) => setSearchText(text)} value={searchText} />

        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.type}_${index}`}
        />
      ) : (
        <Text>Nenhum resultado encontrado.</Text>
      )}
    </View>
  );
}
