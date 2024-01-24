import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { styles } from "./style";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Parse from 'parse/react-native.js';
import { useNavigation } from "@react-navigation/native";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';



const schema = yup.object().shape({
  cep: yup.string().matches(/^[0-9]{5}-[0-9]{3}$/, "CEP deve estar no formato 12345-678").required("CEP é obrigatório"),
  estado: yup.string().required("Estado é obrigatório"),
  cidade: yup.string().required("Cidade é obrigatória"),
  bairro: yup.string().required("Bairro é obrigatório"),
  rua: yup.string().required("Rua é obrigatória"),
  numeroCasa: yup.string().required("Número da Casa é obrigatório"),
});

export default function AddressEmpreendimento() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState("Trabalho");
  const [successMessage, setSuccessMessage] = useState(null);
  const onSubmit = async (data) => {
    data.local = selectedOption;
    navigation.navigate("SignInEmpreendimento", { addressData: data });
  };
  

  return (
    <View style={styles.container}>
        <View style={styles.containerForm}>
      <Text style={styles.text}>Endereço</Text>
      <View style={styles.inputContainer}>
        <Controller
          defaultValue=""
          control={control}
          name="cep"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              name="cep"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="CEP"
              style={[styles.inputAddress, { borderWidth: errors.cep && 2, borderColor: errors.cep && "#ff375b" }]}
            />
          )}
        />
      </View>
      {errors.cep && <Text style={styles.labelError}>{errors.cep.message}</Text>}

      <View style={styles.inputContainer}>
        <Controller
          defaultValue=""
          control={control}
          name="estado"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              name="estado"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Estado"
              style={[styles.inputAddress, { borderWidth: errors.estado && 2, borderColor: errors.estado && "#ff375b" }]}
            />
          )}
        />
      </View>
      {errors.estado && <Text style={styles.labelError}>{errors.estado.message}</Text>}

      <View style={styles.inputContainer}>
        <Controller
          defaultValue=""
          control={control}
          name="cidade"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              name="cidade"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Cidade"
              style={[styles.inputAddress, { borderWidth: errors.cidade && 2, borderColor: errors.cidade && "#ff375b" }]}
            />
          )}
        />
      </View>
      {errors.cidade && <Text style={styles.labelError}>{errors.cidade.message}</Text>}

      <View style={styles.inputContainer}>
        <Controller
          defaultValue=""
          control={control}
          name="bairro"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              name="bairro"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Bairro"
              style={[styles.inputAddress, { borderWidth: errors.bairro && 2, borderColor: errors.bairro && "#ff375b" }]}
            />
          )}
        />
      </View>
      {errors.bairro && <Text style={styles.labelError}>{errors.bairro.message}</Text>}

            
      <View style={styles.inputContainer}>
        <Controller
          defaultValue=""
          control={control}
          name="rua"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              name="rua"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Rua"
              style={[styles.inputAddress, { borderWidth: errors.rua && 2, borderColor: errors.rua && "#ff375b" }]}
            />
          )}
        />
      </View>
      {errors.rua && <Text style={styles.labelError}>{errors.rua.message}</Text>}

      <View style={[styles.inputContainer, {borderLeftWidth: 0.1}]}>
        
        <Controller
          defaultValue=""
          control={control}
          name="numeroCasa"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              name="numeroCasa"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Nº da Casa"
              style={[styles.inputAddress, {paddingLeft: 5, borderWidth: errors.numeroCasa && 2, borderColor: errors.numeroCasa && "#ff375b" }]}
            />
          )}
        />
      </View>
      {errors.numeroCasa && <Text style={styles.labelError}>{errors.numeroCasa.message}</Text>}
      

      <View style={styles.inputContainer}>
        <Controller
          defaultValue=""
          control={control}
          name="informacoesAdicionais"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              name="informacoesAdicionais"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Informações Adicionais"
              style={[styles.inputAddress, { borderWidth: errors.informacoesAdicionais && 2, borderColor: errors.informacoesAdicionais && "#ff375b" }]}
            />
          )}
        />
        {errors.informacoesAdicionais && <Text style={styles.labelError}>{errors.informacoesAdicionais.message}</Text>}
      </View>
      <Text style={styles.text}>Local</Text>
      <View style={styles.buttonContainer}>
        
            <TouchableOpacity
              style={[
                styles.addressButton,
                selectedOption === "Trabalho" && styles.selectedButton, // Estilize o botão selecionado
              ]}
              onPress={() => setSelectedOption("Trabalho")}
            >
              <Text style={[ selectedOption === "Trabalho" && styles.buttonTextSelected]}>Trabalho</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.addressButton,
                selectedOption === "Casa" && styles.selectedButton, // Estilize o botão selecionado
              ]}
              onPress={() => setSelectedOption("Casa")}
            >
              <Text style={[ selectedOption === "Casa" && styles.buttonTextSelected]}>Casa</Text>
            </TouchableOpacity>
          </View>

{/* Exibir a mensagem de sucesso se existir */}
{successMessage && (
        <Text style={styles.successMessage}>{successMessage}</Text>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonTxt}>Salvar Endereço</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}
