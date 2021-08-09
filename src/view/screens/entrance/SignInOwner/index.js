import React, {useContext, useEffect, useState} from 'react';
import SubmitButton from '../../../components/SubmitButton';
import * as S from './styled';
import SalooniLogo from '../../../../assets/icone11-nobackground.png';
import {UserContext} from '../../../../contexts/User/UserContext';

import {useNavigation} from '@react-navigation/native';
import Input from '../../../components/Input';
import errorMessages from '../../../../common/errorMessages';
import ErrorMessage from '../../../components/ErrorMessage';
import global from '../../../../common/global';
import {ClientContext} from '../../../../contexts/Client/ClientContext';

const SignInOwner = () => {
  const {doLogin} = useContext(UserContext);
  const navigate = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState({
    email: 'gabriel@gmail.com',
    password: '123',
  });

  const handleChange = (text, rawText, name) => {
    setUserData({
      ...userData,
      [name]: text,
    });
  };

  const onLogin = async () => {
    await doLogin(userData).then(
      () => {
        navigate.push('Client');
        setErrorMessage('');
      },
      error => {
        setErrorMessage(errorMessages.signinMessage);
        console.log(error);
      },
    );
  };

  return (
    <S.Container>
      <S.Content>
        <S.SalooniLogo source={SalooniLogo} />

        <Input
          handleChange={handleChange}
          name={'email'}
          placeholder={'E-mail'}
          value={userData.email}
          width={'70%'}
          keyboard={'email-address'}
          isSecureTextEntry={false}
          fontSize={18}
          disabled={false}
          mask="none"
        />

        <Input
          handleChange={handleChange}
          name={'password'}
          placeholder={'Senha'}
          value={userData.password}
          width={'70%'}
          keyboard={'default'}
          isSecureTextEntry={true}
          fontSize={18}
          disabled={false}
          mask="none"
        />

        <S.PasswordResetButton>
          <S.PasswordResetText>Esqueceu a senha?</S.PasswordResetText>
        </S.PasswordResetButton>
        <SubmitButton
          text={'Entrar'}
          onPress={() => onLogin()}
          width={'60%'}
          height={'50px'}
          fontSize={'18px'}
          buttonColor={`${global.colors.purpleColor}`}
        />
        {errorMessage !== '' && (
          <ErrorMessage
            text={errorMessage}
            width={'70%'}
            textColor={`${global.colors.purpleColor}`}
          />
        )}

        <S.RegisterContent>
          <S.RegisterText>Não possui cadastro?</S.RegisterText>
          <S.RegisterButton onPress={() => navigate.push('SignupStack')}>
            <S.RegisterButtonText>{''} Registre-se</S.RegisterButtonText>
          </S.RegisterButton>
        </S.RegisterContent>
      </S.Content>
    </S.Container>
  );
};

export default SignInOwner;
