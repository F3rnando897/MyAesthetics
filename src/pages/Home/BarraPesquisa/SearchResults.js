import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet, Modal, Button } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Parse from "parse/react-native.js";
import { FontAwesome, AntDesign, Feather } from '@expo/vector-icons';
import Avatar from '../../../../assets/Icons/avatar.png';
import imgCover from '../../../../assets/grayBackground.png';
import * as Animatable from 'react-native-animatable';
export default function SearchResults() {
  const navigation = useNavigation();
  const route = useRoute();

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [noResults, setNoResults] = useState(false); // Novo estado para controlar se não há resultados
  // Estados para controlar filtros
  const [showUserFilter, setShowUserFilter] = useState(false);
  const [showEmpreendimentoFilter, setShowEmpreendimentoFilter] = useState(false);
  // Obtenha os resultados da pesquisa da rota
  const { searchResults: initialSearchResults } = route.params;


  const handleFilterPress = () => {
    setShowFilterModal(true);
  };
  const CloseFilter = () => {
    setShowFilterModal(false);
  };

  // Função para aplicar filtros
  const applyFilters = () => {
    // Lógica para aplicar os filtros selecionados
    console.log(showUserFilter)
    const filteredResults = initialSearchResults.filter(item => {
      if (showUserFilter && showEmpreendimentoFilter) {
        return true; // Mostrar ambos
      } else if (showUserFilter) {
        return item.type === "User";
      } else if (showEmpreendimentoFilter) {
        return item.type === "Empreendimento";
      } else {
        return false; // Não mostrar nada
      }
    });

    setSearchResults(filteredResults);
    setShowFilterModal(false);
  };

  useEffect(() => {
    setSearchResults(initialSearchResults);
  }, [initialSearchResults]);

  const handleResultPress = (item, index) => {
    if (item.type === "Empreendimento") {
      navigation.navigate("Details", { objectId: searchResults[index].objectId || initialSearchResults[index].objectId });
    } else if (item.type === "User") {
      navigation.navigate("UserProfile", { objectId: item.objectId });
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleResultPress(item, index)}>
      <View style={styles.resultContainer}>
        {item.type === "Empreendimento" ? (
          <>
            <Image
              source={item.imgCover ? { uri: item.imgCover.url() } : imgCover}
              style={styles.resultImage}
            />
            <View style={styles.resultInfo}>
              <Text style={styles.resultName}>{item.name}</Text>
              <Text style={styles.resultDescription}>{item.description}</Text>
            </View>
          </>
        ) : (
          <>
            <Image
              source={item.imgProfile ? { uri: item.imgProfile.url() } : Avatar}
              style={styles.resultImage}
            />
            <View style={styles.resultInfo}>
              <Text style={styles.resultName}>{item.username}</Text>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
  
  

  const performSearch = async () => {
    const Empreendimentos = Parse.Object.extend("Empreendimentos");
    const Users = Parse.Object.extend("User");
    const queryEmpreendimentos = new Parse.Query(Empreendimentos);
    const queryUsers = new Parse.Query(Users);
  
    if (showUserFilter || showEmpreendimentoFilter) {
      if (searchText !== "") {
        if (showEmpreendimentoFilter) {
          queryEmpreendimentos.contains("name", searchText);
        }
        if (showUserFilter) {
          queryUsers.contains("username", searchText);
        }
      }
    } else {
      // Nenhum filtro está ativado, busque todos os resultados
      if (searchText !== "") {
        queryEmpreendimentos.contains("name", searchText);
        queryUsers.contains("username", searchText);
      }
    }
  
    try {
      const [empreendimentosResults, usersResults] = await Promise.all([
        showEmpreendimentoFilter || !showUserFilter ? queryEmpreendimentos.find() : [],
        showUserFilter || !showEmpreendimentoFilter ? queryUsers.find() : [],
      ]);
  
      const newSearchResults = [];
  
      if (showEmpreendimentoFilter || !showUserFilter) {
        for (const empreendimento of empreendimentosResults) {
          newSearchResults.push({
            type: "Empreendimento",
            name: empreendimento.get("name"),
            description: empreendimento.get("description"),
            imgCover: empreendimento.get("imgCover"),
            objectId: empreendimento.id,
          });
        }
      }
  
      if (showUserFilter || !showEmpreendimentoFilter) {
        for (const user of usersResults) {
          newSearchResults.push({
            type: "User",
            username: user.get("username"),
            imgProfile: user.get("imgProfile"),
            objectId: user.id,
          });
        }
      }
  
      // Verifique se não há resultados antes de atualizar a lista
      const noResults = newSearchResults.length === 0;
      setNoResults(noResults);
      setSearchResults(newSearchResults);
    } catch (error) {
      console.error("Error while searching Empreendimentos and Users", error);
    }
  };
  
  const renderDrawer = () => (
    <Animatable.View
      style={styles.filterModal}
      animation={showFilterModal ? 'slideInRight' : 'slideOutRight'}
      duration={500}
    >
      
      <Text style={styles.filterTitle}>Filtros</Text>

      <View style={styles.filterOptions}>
        <TouchableOpacity
          style={styles.filterOption}
          onPress={() => setShowUserFilter(!showUserFilter)}
        >
          <Feather
            name={showUserFilter ? "check-square" : "square"}
            size={24}
            color="black"
          />
          <Text style={styles.filterOptionText}>Usuários</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterOption}
          onPress={() => setShowEmpreendimentoFilter(!showEmpreendimentoFilter)}
        >
          <Feather
            name={showEmpreendimentoFilter ? "check-square" : "square"}
            size={24}
            color="black"
          />
          <Text style={styles.filterOptionText}>Empreendimentos</Text>
        </TouchableOpacity>
      </View>

      <Button title="Aplicar Filtros" onPress={applyFilters} />

    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          onChangeText={setSearchText}
          value={searchText}
        />
        <TouchableOpacity style={styles.searchButton} onPress={performSearch}>
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
          <FontAwesome name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {noResults ? (
        <Text style={styles.noResultsText}>Nenhum resultado encontrado</Text>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.type}_${index}`}
        />
      )}

      <Modal transparent={true} visible={showFilterModal}>
      <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPressOut={() => CloseFilter()}
        >
        {renderDrawer()}
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
    fontSize: 16,
  },
  searchButton: {
    padding: 5,
  },
  resultContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  resultImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
  },
  resultDescription: {
    fontSize: 14,
    color: "#888",
  },
  noResultsText: {
    fontSize: 16,
    textAlign: "center",
    margin: 20,
  },
  backButton: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 2,
    backgroundColor: "transparent",
  },
  filterButton: {
    padding: 5,
  },
  filterModal: {
    flex: 1,
    width: "75%",
    left: "25%",
    backgroundColor: "white",
    borderColor: 'gray',
    borderLeftWidth: 0.5,
    padding: 15
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterOptions: {
    alignItems: "flex-start",
    margin: 10,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  filterOptionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo escuro transparente
  },
});