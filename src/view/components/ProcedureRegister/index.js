import React, {useContext, useEffect, useState} from 'react';
import * as S from './styled';
import Input from '../Input';
import SubmitButton from '../SubmitButton';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import global from '../../../common/global';
import ErrorMessage from '../ErrorMessage';
import {useNavigation} from '@react-navigation/native';
import errorMessages from '../../../common/errorMessages';
import AlertModal from '../AlertModal';
import {ActivityIndicator, Text} from 'react-native';
import BackButton from '../BackButton';
import {UserContext} from '../../../contexts/User/UserContext';
import {SalonObject} from '../../../services/SalonService';
import Icon from 'react-native-vector-icons/Ionicons';
import {ProcedureContext} from '../../../contexts/Procedure/ProcedureContext';
import {EmployeeObject} from '../../../services/EmployeeService';
import {InputModal} from '../InputModal';
import {MaskedTextInput} from 'react-native-mask-text';

const ProcedureRegister = ({
  route,
  pageTitle,
  pageDescription,
  goBack,
  isSigningUp,
}) => {
  const {
    addProcedure,
    editProcedure,
    registeredProcedures,
    saveProcedures,
    cleanRegisteredProcedures,
    updateProcedureInView,
    updateProcedure,
    deleteProcedure,
    deleteProcedureInView,
  } = useContext(ProcedureContext);

  const {currentUser} = useContext(UserContext);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState({
    isShowing: false,
    text: '',
  });
  const [procedure, setProcedure] = useState({
    name: '',
    time: '',
    value: '',
    maintenanceValue: '',
    maintenanceDays: '',
    commissionPercentage: '',
    commissionValue: '',
  });
  const navigate = useNavigation();

  useEffect(() => {
    navigate.addListener('focus', () => {
      const procedureInView = route.params?.procedure;

      if (Object.keys(procedureInView).length !== 0) {
        setProcedure(procedureInView);
        setIsEditing(true);
      }
    });
  }, [navigate]);

  useEffect(() => {
    registeredProcedures.forEach(procedure => (procedure.isInView = false));
  }, []);

  const clearProcedure = () => {
    setProcedure({
      name: '',
      time: '',
      value: '',
      maintenanceValue: '',
      maintenanceDays: '',
      commissionPercentage: '',
      commissionValue: '',
    });
  };

  const handleChange = (text, name) => {
    if (name === 'commissionPercentage') {
      delete procedure.isFixedValue;
      procedure.commissionValue = 0;
      setProcedure({
        ...procedure,
        ['isPercentage']: !!text,
        [name]: text,
      });
    } else if (name === 'commissionValue') {
      delete procedure.isPercentage;
      procedure.commissionPercentage = 0;
      setProcedure({
        ...procedure,
        ['isFixedValue']: !!text,
        [name]: text,
      });
    } else {
      setProcedure({
        ...procedure,
        [name]: text,
      });
    }
  };

  const handleModal = (isShowing, text, isNavigating) => {
    setShowAlertModal({isShowing: isShowing, text: text});

    if (isNavigating) {
      navigate.navigate('SignupPartners');
    }
  };

  const chooseAddProcedureMethod = async () => {
    const {isInView, indexInView} = {...procedure};

    if (verifyInformation() && isInView) {
      procedure.isInView = false;
      editProcedure({procedure: procedure, index: indexInView});
      setErrorMessage('');
      clearProcedure();
    }

    if (verifyInformation() && !isInView) {
      if (!isSigningUp) {
        procedure.salonId = new SalonObject({objectId: currentUser.idSalon});
        procedure.employeeId = new EmployeeObject({
          objectId: currentUser.idFunc,
        });
      }

      addProcedure(procedure);
      setErrorMessage('');
      clearProcedure();
    }
  };

  const handleProcedure = (procedure, index) => {
    updateProcedureInView(index);
    procedure.isInView = !procedure.isInView;
    procedure.indexInView = index;

    procedure.isFixedValue = !!procedure.commissionValue;

    procedure.isPercentage = !!procedure.commissionPercentage;

    setProcedure(procedure);

    if (!verifyIfIsEditing()) {
      clearProcedure();
    }
  };

  const verifyIfIsEditing = () => {
    return registeredProcedures.some(procedure => procedure.isInView === true);
  };

  const goNextPage = () => {
    updateProcedureInView(-1);
    if (verifyInformationToGo()) {
      navigate.navigate('SignupPartners');
      setErrorMessage('');
      clearProcedure();
    }
  };

  const saveProcedure = () => {
    setIsLoading(true);

    if (verifyInformationToGo()) {
      saveProcedures().then(
        () => {
          setTimeout(() => {
            setIsLoading(false);
            navigate.navigate('Procedures');
            clearProcedure();
            cleanRegisteredProcedures();
          }, 3000);
          setErrorMessage('');
        },
        error => {
          setIsLoading(false);
          console.log(error);
        },
      );
    }
  };

  const updateProcedures = () => {
    setIsLoading(true);
    updateProcedure(procedure).then(
      async () => {
        setTimeout(() => {
          setIsLoading(false);
          navigate.navigate('Procedures');
          clearProcedure();
        }, 1000);
        setErrorMessage('');
      },
      error => {
        setIsLoading(false);
        console.log(error);
      },
    );
  };

  const deleteProcedures = () => {
    setIsLoading(true);
    deleteProcedure(procedure).then(
      () => {
        setIsLoading(false);
        navigate.navigate('Procedures');
        setErrorMessage('');
        clearProcedure();
      },
      error => {
        setIsLoading(false);
        console.log(error);
      },
    );
  };

  const verifyInformationToGo = () => {
    let ableToGo = true;
    if (Object.keys(procedure).length === 6) {
      addProcedure(procedure);
      return ableToGo;
    } else if (registeredProcedures.length === 0) {
      ableToGo = false;
      if (isSigningUp)
        handleModal(true, errorMessages.noProcedureMessage, false);
      else setErrorMessage(errorMessages.saveErrorProcedureMessage);
      setIsLoading(false);
    }
    return ableToGo;
  };

  const verifyInformation = () => {
    let ableToGo = true;
    let errorMessage = '';

    if (
      procedure === {} ||
      procedure.name === undefined ||
      procedure.name === '' ||
      procedure.time === undefined ||
      procedure.time === '' ||
      procedure.value === undefined ||
      procedure.value === ''
    ) {
      ableToGo = false;
      errorMessage = errorMessages.procedureMessage;
      setIsLoading(false);
    } else if (
      (procedure.commissionPercentage === undefined ||
        procedure.commissionPercentage === '') &&
      (procedure.commissionValue === undefined ||
        procedure.commissionValue === '')
    ) {
      ableToGo = false;
      errorMessage = errorMessages.commissionMessage;
      setIsLoading(false);
    } else {
      const procedureValue = parseFloat(
        procedure.value !== 0 ? procedure.value.replace(',', '') : 0,
      );
      const commissionValue = parseFloat(
        procedure.commissionValue !== 0
          ? procedure.commissionValue.replace(',', '')
          : 0,
      );

      if (commissionValue > procedureValue) {
        errorMessage = errorMessages.commissionMismatchMessage;
        ableToGo = false;
        setIsLoading(false);
      }
    }

    setErrorMessage(errorMessage);
    return ableToGo;
  };

  const loadBoxInformation = () =>
    registeredProcedures?.map((procedure, index) => (
      <S.BoxContent
        onPress={() => handleProcedure(procedure, index)}
        key={index}>
        <S.BoxText isInView={procedure.isInView}>{procedure.name}</S.BoxText>
      </S.BoxContent>
    ));

  return (
    <S.Container>
      <S.Content>
        <S.HeaderContent isSigningUp={isSigningUp}>
          <BackButton
            positionTop={isSigningUp ? '30px' : '40px'}
            positionLeft={isSigningUp ? '25px' : '-60px'}
            buttonColor={`${global.colors.purpleColor}`}
            onPress={() => goBack()}
          />
          <S.HeaderTitle>{pageTitle}</S.HeaderTitle>
          {pageDescription && (
            <S.HeaderText>
              Cadastre os procedimentos realizados em seu estabelecimento.
              {'\n'}
              Se precisar, você poderá mudar ou adicionar detalhes depois
            </S.HeaderText>
          )}
        </S.HeaderContent>
        <S.BodyContent isSigningUp={isSigningUp}>
          <Input
            handleChange={handleChange}
            name={'name'}
            placeholder={'Nome*'}
            value={procedure.name}
            width={'80%'}
            keyboard={'default'}
            isSecureTextEntry={false}
            fontSize={18}
            disabled={false}
            mask="none"
          />

          <Input
            handleChange={handleChange}
            name={'time'}
            placeholder={'Hora: minutos*'}
            value={procedure.time}
            width={'80%'}
            keyboard={'numeric'}
            isSecureTextEntry={false}
            fontSize={18}
            disabled={false}
            mask={'hour'}
            maxLength={3}
            rightPlaceholder={'minutos'}
          />

          <Input
            handleChange={handleChange}
            name={'value'}
            placeholder={'Preço*'}
            value={procedure.value}
            width={'80%'}
            keyboard={'numeric'}
            isSecureTextEntry={false}
            fontSize={18}
            disabled={false}
            mask={'brl'}
            leftPlaceholder={'R$'}
          />

          <InputModal
            renderInputs={() => (
              <>
                <Input
                  handleChange={handleChange}
                  name={'maintenanceValue'}
                  placeholder={'Valor'}
                  value={procedure.maintenanceValue}
                  width={'80%'}
                  keyboard={'numeric'}
                  isSecureTextEntry={false}
                  fontSize={18}
                  disabled={false}
                  mask="brl"
                  leftPlaceholder={'R$'}
                />
                <Input
                  handleChange={handleChange}
                  name={'maintenanceDays'}
                  placeholder={'Dias'}
                  value={procedure.maintenanceDays}
                  width={'80%'}
                  keyboard={'numeric'}
                  isSecureTextEntry={false}
                  fontSize={18}
                  disabled={false}
                  mask="none"
                />
              </>
            )}
          />

          <S.ClientInformationContent>
            <S.InformationContent isEditing={isEditing}>
              <S.CheckboxContent>
                <BouncyCheckbox
                  isChecked={procedure.isPercentage}
                  onPress={isChecked =>
                    handleChange(
                      !procedure.isPercentage,

                      'commissionPercentage',
                    )
                  }
                  fillColor={`${global.colors.purpleColor}`}
                  disableBuiltInState={true}
                  disableText={true}
                />
                <Input
                  handleChange={handleChange}
                  name={'commissionPercentage'}
                  value={procedure.commissionPercentage}
                  width={'73%'}
                  keyboard={'numeric'}
                  placeholder={'Porc.'}
                  isSecureTextEntry={false}
                  fontSize={18}
                  disabled={false}
                  mask={'percentage'}
                  maxLength={3}
                  rightPlaceholder={'%'}
                />
              </S.CheckboxContent>
              <S.CheckboxContent>
                <BouncyCheckbox
                  style={{borderColor: global.colors.purpleColor}}
                  isChecked={procedure.isFixedValue}
                  onPress={isChecked =>
                    handleChange(!procedure.isFixedValue, 'commissionValue')
                  }
                  fillColor={`${global.colors.purpleColor}`}
                  disableBuiltInState={true}
                  disableText={true}
                />
                <Input
                  handleChange={handleChange}
                  name={'commissionValue'}
                  value={procedure.commissionValue}
                  width={'73%'}
                  placeholder={'Valor.'}
                  keyboard={'numeric'}
                  isSecureTextEntry={false}
                  fontSize={18}
                  disabled={false}
                  mask={'brl'}
                  leftPlaceholder={'R$'}
                />
              </S.CheckboxContent>
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
                textColor={`${global.colors.purpleColor}`}
              />
            )}

            {isLoading && (
              <S.LoadingContent>
                <ActivityIndicator
                  size="large"
                  color={global.colors.purpleColor}
                />
              </S.LoadingContent>
            )}

            <S.ButtonsContent>
              {!isEditing && (
                <SubmitButton
                  text={procedure.isInView ? 'Editar' : 'Adicionar'}
                  onPress={() => chooseAddProcedureMethod()}
                  width={'40%'}
                  height={'30px'}
                  fontSize={'18px'}
                  buttonColor={`${global.colors.purpleColor}`}
                />
              )}

              {procedure.isInView && (
                <S.DeleteButton
                  onPress={() => {
                    deleteProcedureInView(procedure);
                    clearProcedure();
                  }}>
                  <Icon name="trash" size={17} />
                </S.DeleteButton>
              )}
            </S.ButtonsContent>
          </S.AddButtonContent>
          <S.SubmitButtonContent>
            {isSigningUp ? (
              <SubmitButton
                disabled={verifyIfIsEditing()}
                text={'Avançar'}
                onPress={() => goNextPage()}
                width={'40%'}
                height={'50px'}
                fontSize={'18px'}
                buttonColor={`${global.colors.purpleColor}`}
              />
            ) : (
              <SubmitButton
                disabled={verifyIfIsEditing()}
                text={'Salvar'}
                onPress={() =>
                  !isEditing ? saveProcedure() : updateProcedures()
                }
                width={'40%'}
                height={'50px'}
                fontSize={'18px'}
                buttonColor={`${global.colors.purpleColor}`}
              />
            )}
            {isEditing && (
              <S.DeleteButton
                onPress={() => handleModal(true, errorMessages.deleteMessage)}>
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
          handleModal(false, '', false);
        }}
        onOk={() => {
          isSigningUp
            ? handleModal(false, '', true)
            : deleteProcedures(procedure);
        }}
        title={'Atenção.'}
      />
    </S.Container>
  );
};

export default ProcedureRegister;
