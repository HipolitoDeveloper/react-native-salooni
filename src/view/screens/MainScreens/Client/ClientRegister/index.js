import React, {useContext, useEffect, useState} from 'react';
import * as S from './styled';
import Input from '../../../../components/small/Input';
import SubmitButton from '../../../../components/small/SubmitButton';
import global from '../../../../../common/global';
import ErrorMessage from '../../../../components/small/ErrorMessage';
import {useNavigation} from '@react-navigation/native';
import {ClientContext} from '../../../../../contexts/Client/ClientContext';
import errorMessages from '../../../../../common/errorMessages';
import AlertModal from '../../../../components/small/AlertModal';
import {ActivityIndicator} from 'react-native';
import BackButton from '../../../../components/small/BackButton';
import {UserContext} from '../../../../../contexts/User/UserContext';
import {SalonObject} from '../../../../../services/SalonService';
import Icon from 'react-native-vector-icons/Ionicons';
import RegisterComponent from '../../../../components/huge/RegisterComponent';
import Loading from '../../../../components/small/Loading';

const ClientRegister = ({route}) => {
  const {
    addClient,
    editClient,
    registeredClients,
    saveClient,

    cleanRegisteredClients,
    updateClientInView,
    updateClient,
    deleteClient,
    deleteClientInView,
  } = useContext(ClientContext);

  const {currentUser} = useContext(UserContext);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState({
    isShowing: false,
    text: '',
  });
  const [client, setClient] = useState({});
  const navigate = useNavigation();

  useEffect(() => {
    navigate.addListener('focus', () => {
      if (Object.keys(route.params?.client).length !== 0) {
        const clientInView = route.params?.client;

        setClient(clientInView);
        setIsEditing(true);
      }
    });
  }, [navigate]);

  useEffect(() => {
    registeredClients.forEach(client => (client.isInView = false));
  }, []);

  const handleChange = (text, name) => {
    setClient({
      ...client,
      [name]: text,
    });
  };

  const handleModal = (isShowing, text) => {
    setShowAlertModal({isShowing: isShowing, text: text});
  };

  const chooseAddClientMethod = async () => {
    const {isInView, indexInView} = {...client};

    if (verifyInformation() && isInView) {
      client.isInView = false;
      editClient({client: client, index: indexInView});
      setErrorMessage('');
      setClient({});
    }

    if (verifyInformation() && !isInView) {
      client.salonId = currentUser.idSalon;
      addClient(client);
      setErrorMessage('');
      setClient({});
    }
  };

  const handleClient = (client, index) => {
    updateClientInView(index);
    client.isInView = !client.isInView;
    client.indexInView = index;

    setClient(client);

    if (!verifyIfIsPreRegisteredEditing()) {
      setClient({});
    }
  };

  const verifyIfIsPreRegisteredEditing = () => {
    return registeredClients.some(client => client.isInView === true);
  };

  const saveClients = () => {
    setIsLoading(true);
    if (verifyInformationToGo()) {
      saveClient().then(
        () => {
          setTimeout(() => {
            setIsLoading(false);
            navigate.push('TabStack', {screen: 'Clients'});
            setClient({});
          }, 3000);
          cleanRegisteredClients();
          setErrorMessage('');
        },
        error => {
          setIsLoading(false);
          console.log(error);
        },
      );
    }
  };

  const updateClients = () => {
    setIsLoading(true);
    updateClient(client).then(
      () => {
        setTimeout(() => {
          setIsLoading(false);
          navigate.push('TabStack', {screen: 'Clients'});
          setClient({});
        }, 500);
        setErrorMessage('');
      },
      error => {
        setIsLoading(false);
        console.log(error);
      },
    );
  };

  const deletePreRegisteredItem = client => {
    deleteClientInView(client);
    setClient({});
  };

  const cancelEditing = () => {
    updateClientInView(-1);
    setClient({});
  };

  const deleteClients = () => {
    setIsLoading(true);
    deleteClient(client).then(
      () => {
        setIsLoading(false);
        navigate.navigate('Clients');
        setErrorMessage('');
        setClient({});
      },
      error => {
        setIsLoading(false);
        console.log(error);
      },
    );
  };

  const verifyInformationToGo = () => {
    let ableToGo = true;
    if (Object.keys(client).length === 5) {
      addClient(client);
      return ableToGo;
    } else if (registeredClients.length === 0) {
      ableToGo = false;
      setErrorMessage(errorMessages.noClientMessage);
      setIsLoading(false);
    }
    return ableToGo;
  };

  const verifyInformation = () => {
    let ableToGo = true;
    let errorMessage = '';

    if (
      client === {} ||
      client.name === undefined ||
      client.name === '' ||
      client.email === undefined ||
      client.email === '' ||
      client.cpf === undefined ||
      client.cpf === '' ||
      client.tel === undefined ||
      client.tel === '' ||
      client.bornDate === undefined ||
      client.bornDate === ''
    ) {
      ableToGo = false;
      errorMessage = errorMessages.clientMessage;
      setIsLoading(false);
    }

    setErrorMessage(errorMessage);
    return ableToGo;
  };

  const loadBoxInformation = () =>
    registeredClients.map((client, index) => (
      <S.BoxContent onPress={() => handleClient(client, index)} key={index}>
        <S.BoxText isInView={client.isInView}>{client.name}</S.BoxText>
      </S.BoxContent>
    ));

  return (
    <RegisterComponent
      onCancel={() => navigate.goBack()}
      color={`${global.colors.blueColor}`}
      preRegisteredItems={registeredClients}
      handleSelect={handleClient}
      deletePreRegisteredItem={deletePreRegisteredItem}
      onConfirm={isEditing ? updateClients : saveClients}
      isPreRegisteredEditing={verifyIfIsPreRegisteredEditing()}
      cancelEditing={cancelEditing}
      isEditing={isEditing}
      onAdd={chooseAddClientMethod}
      registeredItemRightInformation={'tel'}
      headerTitle={'Clientes'}>
      {errorMessage !== '' && (
        <ErrorMessage
          text={errorMessage}
          width={'70%'}
          textColor={`${global.colors.blueColor}`}
        />
      )}
      <Loading isLoading={isLoading} color={`${global.colors.blueColor}`} />
      <S.BodyContent>
        <Input
          handleChange={handleChange}
          name={'name'}
          placeholder={'Nome*'}
          value={client.name}
          width={'80%'}
          keyboard={'default'}
          isSecureTextEntry={false}
          fontSize={18}
          disabled={false}
          mask="none"
        />

        <Input
          handleChange={handleChange}
          name={'email'}
          placeholder={'E-mail*'}
          value={client.email}
          width={'80%'}
          keyboard={'email-address'}
          isSecureTextEntry={false}
          fontSize={18}
          disabled={false}
          mask="none"
        />

        <Input
          handleChange={handleChange}
          name={'cpf'}
          placeholder={'CPF*'}
          value={client.cpf}
          width={'80%'}
          keyboard={'numeric'}
          isSecureTextEntry={false}
          fontSize={18}
          disabled={false}
          mask={'cpf'}
        />

        <Input
          handleChange={handleChange}
          name={'bornDate'}
          placeholder={'Data de Nascimento*'}
          value={client.bornDate}
          width={'80%'}
          keyboard={'numeric'}
          isSecureTextEntry={false}
          fontSize={18}
          disabled={false}
          mask={'date'}
        />

        <Input
          handleChange={handleChange}
          name={'tel'}
          placeholder={'Celular*'}
          value={client.tel}
          width={'80%'}
          keyboard={'numeric'}
          isSecureTextEntry={false}
          fontSize={18}
          disabled={false}
          mask={'phone'}
        />

        <Input
          handleChange={handleChange}
          name={'tel2'}
          placeholder={'Telefone'}
          value={client.tel2}
          width={'80%'}
          keyboard={'numeric'}
          isSecureTextEntry={false}
          fontSize={18}
          disabled={false}
          mask={'phone'}
        />
      </S.BodyContent>

      <AlertModal
        text={showAlertModal.text}
        isVisible={showAlertModal.isShowing}
        onClose={() => {
          handleModal(false, '');
        }}
        onOk={() => {
          deleteClients();
        }}
        title={'Atenção.'}
      />
    </RegisterComponent>
  );
};

export default ClientRegister;
