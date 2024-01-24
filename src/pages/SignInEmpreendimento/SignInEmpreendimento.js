import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Text, View, TextInput, TouchableOpacity, ScrollView} from "react-native";
import {Picker} from '@react-native-picker/picker';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Animatable from "react-native-animatable";
import { useNavigation, useRoute } from "@react-navigation/native";
import { styles } from "./style";
import Parse from "parse/react-native.js";
import axios from "axios";
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

function validateCPF(cpf) {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11) {
    return false; // O CPF deve ter 11 dígitos
  }

  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  // Calcula os dígitos verificadores
  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf[i - 1]) * (11 - i);
  }
  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(cpf[9])) {
    return false;
  } 

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf[i - 1]) * (12 - i);
  }
  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(cpf[10])) {
    return false;
  }

  return true; // CPF válido
}

const schema = yup.object({
  username: yup.string().min(3, "Informe seu nome corretamente!").required("Informe seu nome!"),
  email: yup.string().email("Email Inválido!").required("Informe seu email!"),
  birthDate: yup.date().required("Informe sua data de nascimento!"),
  cpf: yup.string().test('cpf', 'CPF inválido!', validateCPF),
  nameEmpreendimento: yup.string().required("Informe o nome do empreendimento!"),
  endereco: yup.string().required("Informe o endereço do empreendimento!"),
  telephone: yup.string().required("Informe o número de telefone do empreendimento!"),
  termsError: yup.string().required("Você deve aceitar os termos de uso para continuar!")
});

const getCurrentUser = async function () {
  try {
    const currentUser = await Parse.User.currentAsync();
    if (currentUser !== null) {
      console.log(
        'Success!',
        `${currentUser.get('email')} is the current user!`,
      );
    }
    return currentUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export default function SignInEmpreendimento() {
  const [nationalities, setNationalities] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [termsError, setTermsError] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const route = useRoute();
  const addressData = route.params?.addressData || {};
  const selectedCountry = route.params?.selectedCountry || '';
  const { control, handleSubmit, formState: { errors } } = useForm({/*{
    resolver: yupResolver(schema),
  }*/});
  console.log(addressData)

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const user = await Parse.User.currentAsync();
        if (user) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    }

    getCurrentUser();
  }, []);
  
  const navigation = useNavigation();
  const handleNavigateToNationality = () => {
    navigation.navigate("Nationality");
  };
  const handleNavigateToAddress = () => {
    navigation.navigate("AddressEmpreendimento"); // Navegue para a tela "AddressEmpreendimento"
  };
  useEffect(() => {

    // Fetch nationalities using Axios from Rest Countries API
    axios.get("https://restcountries.com/v3.1/all")
      .then((response) => {
        // Extract the 'common' property from each object and store it in an array
        const nationalitiesList = response.data.map((country) => country.name.common);
        // Sort the nationalities alphabetically
        nationalitiesList.sort();
        setNationalities(nationalitiesList);
      })
      .catch((error) => {
        console.error("Error fetching nationalities:", error);
      });
  }, []);

  // ...

const handleSignIn = async (data) => {
  try {
    // Crie um novo objeto Empreendedores
    const empreendedor = new Parse.Object('Empreendedores');
    empreendedor.set('username', currentUser.get('username'));
    empreendedor.set('email', currentUser.get('email'));
    empreendedor.set('empUser', {
      __type: 'Pointer',
      className: '_User',
      objectId: currentUser.id,
    });
    empreendedor.set('cpf', data.cpf);
    // Converta a data de nascimento para um objeto Date
    const birthDate = new Date(data.date_birth);
    empreendedor.set('date_birth', birthDate);
    // Salve o objeto Empreendedores e obtenha o objectId
    const savedEmpreendedor = await empreendedor.save();
    const empreendedorObjectId = savedEmpreendedor.id;
 
    // Criar um novo objeto AddressesEmpreendimento
    const addressEmpreendimento = new Parse.Object('AddressesEmpreendimento');
    empreendedor.set('nationality', selectedCountry);
    addressEmpreendimento.set('cep', addressData.cep);
    addressEmpreendimento.set('state', addressData.estado);
    addressEmpreendimento.set('city', addressData.cidade);
    addressEmpreendimento.set('neighborhood', addressData.bairro);
    addressEmpreendimento.set('street', addressData.rua);
    addressEmpreendimento.set('number', addressData.numeroCasa);
    addressEmpreendimento.set('additionalInformation', addressData.additionalInformation);
    addressEmpreendimento.set('local', addressData.local);
    // Salva o objeto AddressesEmpreendimento e pega o objectId
    const savedAddressEmpreendimento = await addressEmpreendimento.save();
    const addressEmpreendimentoObjectId = savedAddressEmpreendimento.id;

    // Cria um novo objeto Empreendimentos
    const empreendimento = new Parse.Object('Empreendimentos');
    empreendimento.set('name', data.nameEmpreendimento);
    empreendimento.set('telephone', data.telephone);
    empreendimento.set('email', currentUser.get('email'));
    empreendimento.set('type', selectedBusinessType);
    // Associa o objeto Empreendedores usando seu objectId
    empreendimento.set('emp_empreendedores', {
      __type: 'Pointer',
      className: 'Empreendedores',
      objectId: empreendedorObjectId,
    });

    // Associa o objeto AddressesEmpreendimento utilizando seu objectId
    empreendimento.set('addressEmpreendimentoId', {
      __type: 'Pointer',
      className: 'AddressesEmpreendimento',
      objectId: addressEmpreendimentoObjectId,
    });
    console.log(addressEmpreendimentoObjectId);
// Salve o objeto Empreendimentos
await empreendimento.save();
    // Agora, crie uma entrada em BusinessMembers
    const BusinessMembers = Parse.Object.extend('BusinessMembers');
const newMember = new BusinessMembers();
newMember.set('entrepreneur', {
  __type: 'Pointer',
  className: '_User', // Change this to '_User'
  objectId: currentUser.id,
});
newMember.set('business', {
  __type: 'Pointer',
  className: 'Empreendimentos',
  objectId: empreendimento.id,
});
newMember.set('role', 'Função do Membro'); // Defina a função conforme necessário


await newMember.save();


    console.log('Empreendedor, AddressesEmpreendimento, and Empreendimento saved successfully!');
    // Redirecione ou execute outras ações após o salvamento bem-sucedido

    navigation.navigate("MyEmpreendimento");
  } catch (error) {
    console.error('Error saving Empreendedor, AddressesEmpreendimento, and Empreendimento:', error);
    // Trate o erro conforme necessário
  }

  if (!isTermsChecked) {
    setTermsError(true); // Define o erro dos termos como verdadeiro
    console.error("Aceite os termos de uso para continuar.");
    return;
  } else {
    setTermsError(false);
  }

  setTermsError(false);
  console.log(data);
  const cpfValue = data.cpf;

  if (!validateCPF(cpfValue)) {
    console.error("CPF inválido");
    return false;
  }
};


  return (
  <ScrollView>
    <View style={[styles.container, {backgroundColor: '#fff'}]}>
      <View style={styles.containerForm}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}><AntDesign name="arrowleft" size={24} color="black" /></TouchableOpacity>
      <Text style={{fontSize: 18,fontWeight: 'bold',fontFamily: 'Montserrat_700Bold', marginLeft: 5}}>Seja um empreendedor</Text>
    </View>

      <Animatable.View animation="fadeInLeft" delay={100}>
        <Text style={styles.text}>Identificação Fiscal</Text>
      </Animatable.View>
      
      <Animatable.View animation="fadeInUp">
        <Controller
          defaultValue=""
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput name="username" value={currentUser ? currentUser.get("username") : ""} onChangeText={onChange} onBlur={onBlur} placeholder="Informe o seu nome" style={[styles.input, { borderWidth: errors.username && 2, borderColor: errors.username && "#ff375b" }]} />
            </View>
          )}
        />
        {errors.username && <Text style={styles.labelError}>{errors.username?.message}</Text>}

        <Controller
          defaultValue=""
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                name="email"
                value={currentUser ? currentUser.get("email") : ""}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Informe o E-mail"
                style={[
                  styles.input,
                  { borderWidth: errors.username && 2, borderColor: errors.username && "#ff375b" },
                ]}
              />
            </View>
          )}
        />
        {errors.email && <Text style={styles.labelError}>{errors.email?.message}</Text>}
          
        <Controller
          defaultValue=""
          control={control}
          name="cpf"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                name="cpf"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Informe o seu CPF"
                style={[
                  styles.input,
                  { borderWidth: errors.cpf && 2, borderColor: errors.cpf && "#ff375b" },
                ]}
              />
            </View>
          )}
        />
        {errors.cpf && <Text style={styles.labelError}>{errors.cpf.message}</Text>}

        <Controller
          control={control}
          name="nationality"
          defaultValue="Brazil"
          render={({ field: { onChange, value } }) => (
            <TouchableOpacity onPress={handleNavigateToNationality}>
            <View style={styles.inputContainer}>
            <Text style={ {paddingTop: 10, borderWidth: errors.nationality && 2, borderColor: errors.nationality && "#ff375b", height: 40, width: "93%", fontSize: 16, marginVertical: 10 }}onChangeText={onChange} >{value || selectedCountry || 'Brazil'}</Text>
            <AntDesign name="right" size={22} color="black" style={{alignSelf: 'center'}} />
        </View>
        </TouchableOpacity>
          )}
        />

        <Controller
          control={control}
          name="date_birth"
          defaultValue={new Date()}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.title}>Data de Nascimento</Text>
              <View style={[styles.input, {width: "40%"}]}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Text style={ {fontSize:16, marginTop: 10}}>{value.toDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={value}
                    mode="date"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        onChange(selectedDate);
                      }
                    }}
                  />
                )}
              </View>
            </View>
          )}
        />
       
        </Animatable.View>
      </View>

      <View style={styles.containerForm}>

      <Animatable.View animation="fadeInLeft" delay={100}>
        <Text style={styles.text}>Informações do Empreendimento</Text>
      </Animatable.View>
      
      <Animatable.View animation="fadeInUp">
      <Controller
  defaultValue=""
  control={control}
  name="nameEmpreendimento" 
  render={({ field: { onChange, onBlur, value } }) => (
    <View style={styles.inputContainer}>
      <TextInput
        name="nameEmpreendimento"
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        placeholder="Nome do empreendimento"
        style={[styles.input]}
      />
      {console.log("Value do nameEmpreendimento: ", value)}
    </View>
  )}
/>
{errors.nameEmpreendimento && <Text style={styles.labelError}>{errors.nameEmpreendimento?.message}</Text>}

<Text style={{fontSize: 16, marginTop: 10}}>Tipo do Empreendimento</Text>
<Picker
  selectedValue={selectedBusinessType}
  onValueChange={(itemValue) => setSelectedBusinessType(itemValue)}
  style={[styles.input, { height: 40, width: "100%", marginBottom: 10, backgroundColor: '#00000010',borderWidth: 2, borderColor: 'blue' }]}
>
  <Picker.Item label="Selecione o tipo do empreendimento" value="" />
  <Picker.Item label="Salão de Beleza" value="Salão_de_Beleza" />
  <Picker.Item label="Manicure" value="Manicure" />
  <Picker.Item label="Pedicure" value="Pedicure" />
  <Picker.Item label="Massagem" value="Massagem" />
  <Picker.Item label="Esteticistas" value="Esteticistas" />
  <Picker.Item label="Sobrancelhas" value="Sobrancelhas" />
  <Picker.Item label="Maquiagem" value="Maquiagem" />
</Picker>
          
<Controller
  defaultValue=""
  control={control}
  name="endereco" 
  render={({ field: { onChange, value } }) => (
    <TouchableOpacity onPress={handleNavigateToAddress}>
    <View style={styles.inputContainer}>
    <TextInput editable={false} name="endereco" value={value || (addressData ? addressData.rua : '') || 'Endereço'}onChangeText={onChange} placeholder="Endereço" style={{height: 40, width: "93%", fontSize: 16, marginVertical: 10}}/>
      <AntDesign name="right" size={22} color="black" style={{alignSelf: 'center', marginRight: 20}} />
    </View>
    </TouchableOpacity>
  )}
/>
{/* {errors.endereco && <Text style={styles.labelError}>{errors.endereco?.message}</Text>} */}         

        <Controller
  defaultValue=""
  control={control}
  name="telephone" 
  render={({ field: { onChange, onBlur, value } }) => (
    <View style={styles.inputContainer}>
      <TextInput name="telephone" value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Informe o Telefone" style={[styles.input, { borderWidth: errors.username && 2, borderColor: errors.username && "#ff375b" }]} />
    </View>
  )}
/> 
{errors.telephone && <Text style={styles.labelError}>{errors.telephone?.message}</Text>}
        </Animatable.View>
  

        <TouchableOpacity
  onPress={() => setIsTermsChecked(!isTermsChecked)}
  style={{ flexDirection: 'row', marginTop: 25 }}>
  <FontAwesome name={isTermsChecked ? "check-square-o" : "square-o"} size={25} />
  <Text style={styles.checkboxLabel}> Termos de uso</Text>
</TouchableOpacity>
{!isTermsChecked && (<Text style={styles.labelError}>Você deve aceitar os termos de uso para continuar!</Text>)}


        <TouchableOpacity style={styles.button} title={"Sign Up"} onPress={handleSubmit(handleSignIn)}>
            <Text style={styles.buttonTxt}>Cadastrar</Text>
            </TouchableOpacity> 
      </View>
      

    </View>
    </ScrollView>
  );
}