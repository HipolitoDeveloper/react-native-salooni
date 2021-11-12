import React, {useEffect, useState} from 'react';
import * as S from './styled';
import RoundedTimes from '../../../../../assets/svg/roundedTimesSVG.svg';
import Confirm from '../../../../../assets/svg/confirmSVG.svg';
import Salooni from '../../../../../assets/svg/salooniSVG.svg';
import {ButtonText} from './styled';

const RegisterHeader = ({
  color,
  headerTitle,
  isPreRegisteredEditing,
  onConfirm,
  onCancel,
  isEditing,
  validForm,
}) => {
  return (
    <S.Container headerColor={color}>
      <S.Content>
        <S.ButtonContent>
          <S.CancelButton onPress={onCancel}>
            <RoundedTimes
              fill={'white'}
              borderFill={color}
              width={35}
              height={35}
            />
          </S.CancelButton>
          <S.ButtonText>Voltar</S.ButtonText>
        </S.ButtonContent>
        <Salooni fill={color} borderFill={'white'} width={60} height={60} />
        <S.ButtonContent>
          <S.ConfirmButton
            disabled={isPreRegisteredEditing}
            isEditing={isPreRegisteredEditing}
            onPress={onConfirm}>
            <Confirm fill={color} borderFill={'white'} width={35} height={35} />
          </S.ConfirmButton>
          <S.ButtonText>{isEditing ? 'Editar' : 'Adicionar'}</S.ButtonText>
        </S.ButtonContent>
      </S.Content>
      <S.HeaderTitleContent>
        <S.HeaderTitle headerColor={color}>{headerTitle}</S.HeaderTitle>
      </S.HeaderTitleContent>
      <S.HeaderLine headerColor={color} />
    </S.Container>
  );
};

export default RegisterHeader;
