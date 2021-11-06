import styled from 'styled-components/native/dist/styled-components.native.esm';
import global from '../../../../common/global';
import {StyleSheet, Platform} from 'react-native';

export const Container = styled.View`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Select = styled.View`
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const TextContent = styled.View`
  margin-top: 10px;
  width: 100%;
  padding-left: 30px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const Text = styled.Text`
  font-size: 18px;
  font-family: ${global.fonts.mainFont};
`;

export const InputsContainer = styled.View`
  display: flex;
  margin: auto auto;
  border-radius: 40px;
  background-color: white;
  width: 80%;
  height: 180px;
  elevation: 5;
`;

export const InputsContent = styled.View`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const CloseButtonContent = styled.TouchableOpacity`
  background-color: ${global.colors.purpleColor};
  height: 50px;
  width: 60px;
  border-bottom-left-radius: 100px;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 50px;
  position: absolute;
  top: 0;
  left: ${Platform.OS === "ios" ? '252px' : '230px'};;
  display: flex;
  align-items: center;
  justify-content: center;
  elevation: 5;
`;

export const CloseButton = styled.View``;