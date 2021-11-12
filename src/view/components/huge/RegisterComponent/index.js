import React, {useEffect, useState} from 'react';
import RegisterHeader from './RegisterHeader';
import RegisteredItemsModal from './RegisteredItemsModal';
import * as S from './styled';
import ActionButton from 'react-native-circular-action-menu';
import global from '../../../../common/global';
import FloatButton from '../../small/FloatButton';
import {Platform, ScrollView, TouchableOpacity} from 'react-native';
import {Text} from '../../small/InputModal/styled';
import Times from '../../../../assets/svg/timesSVG.svg';
import {AddMessage, ButtonsContent} from './styled';
import AlertModal from '../../small/AlertModal';

const RegisterComponent = ({
  isSigningUp,
  children,
  onCancel,
  color,
  preRegisteredItems,
  handleSelect,
  deletePreRegisteredItem,
  onConfirm,
  isPreRegisteredEditing,
  isEditing,
  onAdd,
  cancelEditing,
  registeredItemRightInformation,
  registeredItemLeftInformation,
  headerTitle,
  validForm,
}) => {
  const [isRegisteredItemsBoxOpened, setIsRegisteredItemsBoxOpened] =
    useState(false);
  const [modalState, setModalState] = useState(false);

  const cancelRegister = () => {
    if (preRegisteredItems.length > 0) {
      setModalState(true);
    } else {
      onCancel();
    }
  };

  return (
    <>
      {!isSigningUp && (
        <RegisterHeader
          color={color}
          headerTitle={headerTitle}
          isPreRegisteredEditing={isPreRegisteredEditing}
          onCancel={cancelRegister}
          onConfirm={onConfirm}
          isEditing={isEditing}
          validForm={validForm}
        />
      )}
      <S.Content
        behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
        keyboardShouldPersistTaps="handled">
        {children}

        {isPreRegisteredEditing && (
          <S.CancelButton color={color} onPress={cancelEditing}>
            <Times
              fill={'#fff'}
              borderFill={`${global.colors.lightGreyColor}`}
              width={10}
              height={10}
            />
          </S.CancelButton>
        )}

        {!isEditing && (
          <>
            <S.AddMessage>
              Não esqueça de adicionar as informações.
            </S.AddMessage>
            <FloatButton
              disabled={!validForm()}
              bottom={'150px'}
              right={'40px'}
              onPress={() => {
                onAdd();
                setIsRegisteredItemsBoxOpened(true);
              }}
              buttonColor={color}
              icon={isPreRegisteredEditing ? 'pen' : 'plus'}
            />
          </>
        )}
      </S.Content>
      {!isEditing && (
        <RegisteredItemsModal
          color={color}
          isOpened={isRegisteredItemsBoxOpened}
          handleOpening={() =>
            setIsRegisteredItemsBoxOpened(!isRegisteredItemsBoxOpened)
          }
          deletePreRegisteredItem={deletePreRegisteredItem}
          handleSelect={handleSelect}
          items={preRegisteredItems}
          rightInformation={registeredItemRightInformation}
          leftInformation={registeredItemLeftInformation}
        />
      )}
      <AlertModal
        text={`Você possui ${preRegisteredItems.length} itens pré-registrados, gostaria de cancelar esses pré-registros?`}
        isVisible={modalState}
        onOk={onCancel}
        title={'Atenção!'}
        onClose={() => setModalState(false)}
        cancelTitle={'NÃO'}
      />
    </>
  );
};
export default RegisterComponent;
