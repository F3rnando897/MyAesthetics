import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign} from '@expo/vector-icons';
import { useNavigation} from '@react-navigation/native';
const Header = () => {
  const navigation = useNavigation();
  return (
      <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={26} color="black" />
            </TouchableOpacity>
            </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
},
});

export default Header;
