import React, {useEffect, useState} from 'react';
import * as S from './styled';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {FlatList, View} from 'react-native';
import Modal from 'react-native-modal';

const MultipleSelect = ({
  iconColor,
  selectTextColor,
  modalHeaderText,
  options,
  plusIconColor,
  selectedItemBorderColor,
  handleMultiSelect,
  value,
  navigate,
  placeholderText,
  disabled,
  inputText,
}) => {
  const [isShowingSuggestionBox, setIsShowingSuggestionBox] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setSuggestions(
      options.map(option => {
        option.selected = false;

        return option;
      }),
    );
  }, []);

  const handleSelect = (item, selected) => {
    const newSuggestions = suggestions.map(suggestion => {
      if (suggestion.id === item.id) {
        suggestion.selected = selected;
      }

      return suggestion;
    });
    setSuggestions(newSuggestions);
    handleMultiSelect(item);
    return newSuggestions;
  };

  const openModal = () => {
    options.forEach(option => {
      if (value.length === 0) {
        option.selected = false;
      } else {
        value.forEach(v => {
          if (option.id === v.id) option.selected = true;
        });
      }
    });
    setIsShowingSuggestionBox(true);
  };

  return (
    <S.Container>
      <S.SelectContent>
        <S.IconContainer
          disabled={disabled}
          onPress={
            disabled
              ? () => {
                  console.log('Não tem procedimento');
                }
              : openModal
          }>
          <Icon
            name={'brush'}
            size={30}
            style={{marginRight: 10}}
            color={iconColor}
          />
        </S.IconContainer>
        <S.SelectedContainer>
          <S.InputText color={iconColor}>{inputText}</S.InputText>
          {value.some(v => v.id) > 0 ? (
            <S.ItemsContainer>
              <FlatList
                horizontal={true}
                data={value}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <S.SelectedContent
                    selectedItemBorderColor={selectedItemBorderColor}>
                    <S.SelectedContentText>{item.name}</S.SelectedContentText>
                    <S.SelectedContentIcon
                      onPress={() => handleSelect(item, false)}
                      selectedItemBorderColor={selectedItemBorderColor}>
                      <Icon name={'times'} size={20} color={iconColor} />
                    </S.SelectedContentIcon>
                  </S.SelectedContent>
                )}
              />
            </S.ItemsContainer>
          ) : (
            <S.SelectedContainerText selectTextColor={selectTextColor}>
              {placeholderText ? placeholderText : 'Procedimentos'}
            </S.SelectedContainerText>
          )}
        </S.SelectedContainer>
      </S.SelectContent>
      <SuggestionModal
        isVisible={isShowingSuggestionBox}
        onClose={() => setIsShowingSuggestionBox(!isShowingSuggestionBox)}
        options={suggestions}
        value={value}
        modalHeaderText={modalHeaderText}
        plusIconColor={plusIconColor}
        handleSelect={handleSelect}
      />
    </S.Container>
  );
};

const SuggestionModal = ({
  isVisible,
  onClose,
  options,
  value,
  modalHeaderText,
  plusIconColor,
  handleSelect,
}) => {
  const [suggestions, setSuggestions] = useState([]);

  const onShow = () => {
    setSuggestions(
      options.map(option => {
        option.selected = value.some(procedure => procedure.id === option.id);

        return option;
      }),
    );
  };

  const selectItem = item => {
    setSuggestions(handleSelect(item, !item.selected));
  };

  return (
    <S.ModalContainer>
      <Modal
        onBackButtonPress={onClose}
        isVisible={isVisible}
        onBackdropPress={onClose}
        onRequestClose={onClose}
        onModalWillShow={onShow}>
        <S.SuggestionContainer>
          <S.SuggestionHeader>
            <S.SuggestionHeaderText>{modalHeaderText}</S.SuggestionHeaderText>
          </S.SuggestionHeader>
          <S.SuggestionContent>
            <S.SuggestionBody>
              <FlatList
                keyExtractor={item => item.id}
                style={{width: '100%', height: '100%'}}
                data={suggestions}
                renderItem={({item}) => {
                  if (!item.empty)
                    return (
                      <S.SuggestionItemContent>
                        <S.SuggestionItemIcon onPress={() => selectItem(item)}>
                          {item.selected ? (
                            <Icon
                              name={'minus-circle'}
                              size={25}
                              color={plusIconColor}
                            />
                          ) : (
                            <Icon
                              name={'plus'}
                              size={25}
                              color={plusIconColor}
                            />
                          )}
                        </S.SuggestionItemIcon>
                        <S.SuggestionItemText>{item.name}</S.SuggestionItemText>
                      </S.SuggestionItemContent>
                    );
                }}
              />
            </S.SuggestionBody>
          </S.SuggestionContent>
        </S.SuggestionContainer>
      </Modal>
    </S.ModalContainer>
  );
};

export default MultipleSelect;
