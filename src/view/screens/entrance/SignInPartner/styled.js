import styled from 'styled-components/native';
import global from '../../../../common/global';
import {StyleSheet} from 'react-native';

export const Container = styled.View`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${global.colors.lightGreyColor};
`;

export const Content = styled.View`
  height: 90%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

export const EmailMessage = styled.Text`
  width: 70%;
  margin-top: 10px;
  font-family: ${global.fonts.auxiliarFont};
  font-size: 14px;
  text-align: center;
  color: ${global.colors.purpleColor};
`;

export const Input = styled.TextInput`
  font-family: ${global.fonts.auxiliarFont};
  width: 70%;
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  border-bottom-color: ${global.colors.purpleColor};
  color: black;
`;

export const SalooniLogo = styled.Image`
  width: 180px;
  height: 180px;
  border-width: 1px;
  border-color: ${global.colors.purpleColor};
  border-radius: 100px;
`;


export const CloseButton = styled.TouchableOpacity`
  border: ${StyleSheet.hairlineWidth}px solid black;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
`;

export const FooterButtons = styled.View`
display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
`
