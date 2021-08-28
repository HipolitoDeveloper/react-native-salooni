import React, {useContext, useEffect, useState} from 'react';
import * as S from './styled';
import Input from '../../../../components/Input';
import SubmitButton from '../../../../components/SubmitButton';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import global from '../../../../../common/global';
import ErrorMessage from '../../../../components/ErrorMessage';
import {useNavigation} from '@react-navigation/native';
import {ClientContext} from '../../../../../contexts/Client/ClientContext';
import errorMessages from '../../../../../common/errorMessages';
import AlertModal from '../../../../components/AlertModal';
import {ClientInformationContent, InformationContent} from './styled';
import {ActivityIndicator} from 'react-native';
import BackButton from '../../../../components/BackButton';
import {UserContext} from '../../../../../contexts/User/UserContext';
import {getSalonById} from '../../../../../services/SalonService';
import Icon from 'react-native-vector-icons/Ionicons';
import {NavigationEvents} from 'react-navigation';
import {ClientParseObjectToClientObject} from '../../../../../common/conversor';

const ClientRegister = ({route}) => {
  const {
    addClient,
    editClient,
    registeredClients,
    saveClient,

    cleanRegisteredClients,
    clientInView,
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
      const clientInView = route.params?.client
        ? ClientParseObjectToClientObject(route.params?.client)
        : {};

      if (Object.keys(clientInView).length !== 0) {
        setClient(clientInView);
        setIsEditing(true);
      }
    });
  }, [navigate]);

  useEffect(() => {
    registeredClients.forEach(client => (client.isInView = false));
  }, []);

  const handleChange = (text, rawText, name) => {
    setClient({
      ...client,
      [name]: text,
    });
  };

  const handleModal = (isShowing, text, isNavigating) => {
    setShowAlertModal({isShowing: isShowing, text: text});

    if (isNavigating) {
      navigate.navigate('Clients');
    }
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
      client.IdSalaoFK = await getSalonById(currentUser.idSalon, true);
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

    if (!verifyIfIsEditing()) {
      setClient({});
    }
  };

  const verifyIfIsEditing = () => {
    return registeredClients.some(client => client.isInView === true);
  };

  const saveClients = () => {
    setIsLoading(true);

    if (verifyInformationToGo()) {
      saveClient().then(
        () => {
          setIsLoading(false);
          cleanRegisteredClients();
          navigate.navigate('Clients');
          setErrorMessage('');
          setClient({});
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
      async () => {
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

  const deleteClients = () => {
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
    }
    setIsLoading(false);
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
      client.born_date === undefined ||
      client.born_date === ''
    ) {
      ableToGo = false;
      errorMessage = errorMessages.clientMessage;
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
    <S.Container>
      <S.Content>
        <S.HeaderContent>
          <BackButton
            positionTop={'20px'}
            positionLeft={'-35px'}
            buttonColor={`${global.colors.blueColor}`}
            onPress={() => {
              navigate.goBack();
            }}
          />
          <S.HeaderTitle>Registro de Clientes</S.HeaderTitle>
        </S.HeaderContent>
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
            mask={'999.999.999-99'}
          />

          <Input
            handleChange={handleChange}
            name={'born_date'}
            placeholder={'Data de Nascimento*'}
            value={client.born_date}
            width={'80%'}
            keyboard={'numeric'}
            isSecureTextEntry={false}
            fontSize={18}
            disabled={false}
            mask={'99/99/9999'}
          />

          <S.ClientInformationContent>
            <S.InformationContent isEditing={isEditing}>
              <Input
                handleChange={handleChange}
                name={'tel'}
                placeholder={'Celular*'}
                value={client.tel}
                width={'85%'}
                keyboard={'numeric'}
                isSecureTextEntry={false}
                fontSize={18}
                disabled={false}
                mask={'(99) 99999-9999'}
              />

              <Input
                handleChange={handleChange}
                name={'tel2'}
                placeholder={'Telefone'}
                value={client.tel2}
                width={'85%'}
                keyboard={'numeric'}
                isSecureTextEntry={false}
                fontSize={18}
                disabled={false}
                mask={'(99) 99999-9999'}
              />
            </S.InformationContent>

            {!isEditing && (
              <S.RegisteredProceduresContent>
                <S.RegisteredProceduresBoxTitle>
                  Já Cadastrados
                </S.RegisteredProceduresBoxTitle>
                <S.RegisteredProceduresBox>
                  {loadBoxInformation()}
                </S.RegisteredProceduresBox>
              </S.RegisteredProceduresContent>
            )}
          </S.ClientInformationContent>
        </S.BodyContent>
        <S.FooterContent>
          <S.AddButtonContent>
            {errorMessage !== '' && (
              <ErrorMessage
                text={errorMessage}
                width={'70%'}
                textColor={`${global.colors.blueColor}`}
              />
            )}

            {isLoading && (
              <S.LoadingContent>
                <ActivityIndicator
                  size="large"
                  color={global.colors.blueColor}
                />
              </S.LoadingContent>
            )}

            <S.ButtonsContent>
              {!isEditing && (
                <SubmitButton
                  text={client.isInView ? 'Editar' : 'Adicionar'}
                  onPress={() => chooseAddClientMethod()}
                  width={'40%'}
                  height={'30px'}
                  fontSize={'18px'}
                  buttonColor={`${global.colors.blueColor}`}
                />
              )}

              {client.isInView && (
                <S.DeleteButton
                  onPress={() => {
                    deleteClientInView(client);
                    setClient({});
                  }}>
                  <Icon name="trash" size={17} />
                </S.DeleteButton>
              )}
            </S.ButtonsContent>
          </S.AddButtonContent>
          <S.SubmitButtonContent>
            <SubmitButton
              disabled={verifyIfIsEditing()}
              text={'Salvar'}
              onPress={() => (!isEditing ? saveClients() : updateClients())}
              width={'40%'}
              height={'50px'}
              fontSize={'18px'}
              buttonColor={`${global.colors.blueColor}`}
            />
            {isEditing && (
              <S.DeleteButton onPress={() => deleteClients(client)}>
                <Icon name="trash" size={17} />
              </S.DeleteButton>
            )}
          </S.SubmitButtonContent>
        </S.FooterContent>
      </S.Content>

      <AlertModal
        text={showAlertModal.text}
        isVisible={showAlertModal.isShowing}
        onClose={() => {
          handleModal('', false, false);
        }}
        onOk={() => {
          handleModal('', false, true);
        }}
        title={'Atenção.'}
      />
    </S.Container>
  );
};

export default ClientRegister;