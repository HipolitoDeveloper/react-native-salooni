import React, {useEffect, useRef, useState} from 'react';
import global from '../../../common/global';
import * as S from './styled';
import ListContent from './ListContent';
import ListHeader from './ListHeader';
import Button from '../small/Button';
import ListMenu from './ListMenu';
import {FlatList, Animated} from 'react-native';
import FloatButton from '../small/FloatButton';
import Times from '../../../assets/svg/timesSVG.svg';
import Loading from '../small/Loading';
import {getCloser} from '../../../common/headerFunctions';
import {useNavigation} from '@react-navigation/native';
const {diffClamp} = Animated;

const headerHeight = Platform.OS === 'ios' ? 90 * 2 : 70 * 2;

const List = ({
  showCalendarButton,
  showHeader,
  color,
  headerText,
  menuItems,
  objectMenuItems,
  checkItems,
  confirmItems,
  itemType,
  itemList,
  deleteUniqueItem,
  deleteItemList,
  isLoading,
  onAddNavigateTo,
  onEditNavigateTo,
  deleteProcedure,
  handleState,
  navigateToCalendar,
  isOwner,
  searchPlaceHolder,
}) => {
  const scrollY = useRef(new Animated.Value(0));
  const scrollYClamped = diffClamp(scrollY.current, 0, headerHeight);
  const translateY = scrollYClamped.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -(headerHeight / 2)],
  });
  const translateYNumber = useRef();

  const ref = useRef(null);

  const [items, setItems] = useState(itemList);
  const [menuState, setMenuState] = useState({
    itemToShow: {},
    open: false,
  });
  const [isConfirming, setIsConfirming] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [scrolling, setScrolling] = useState(false);

  const isDeleting = items.some(item => item.selected);
  const selectedItems = items.filter(item => item.selected);
  const showFooter = isDeleting || isConfirming;

  const navigate = useNavigation();

  navigate.addListener('focus', () => {
    setItems(itemList);
  });

  const handleScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {y: scrollY.current},
        },
      },
    ],
    {
      useNativeDriver: true,
    },
  );

  translateY.addListener(({value}) => {
    translateYNumber.current = value;
    setScrolling(translateYNumber.current === 0);
  });

  const handleSnap = ({nativeEvent}) => {
    const offsetY = nativeEvent.contentOffset.y;

    if (
      !(
        translateYNumber.current === 0 ||
        translateYNumber.current === -headerHeight / 2
      )
    ) {
      if (ref.current) {
        ref.current.scrollToOffset({
          offset:
            getCloser(translateYNumber.current, -headerHeight / 2, 0) ===
            -headerHeight / 2
              ? offsetY + headerHeight / 2
              : offsetY - headerHeight / 2,
        });
      }
    }
  };

  const changeListState = itemId => {
    selectItem(itemId, true);
  };

  const selectItem = (itemId, changingState) => {
    if (isDeleting || changingState) {
      setItems(
        items.map(item => {
          if (item.id === itemId) {
            item.selected = !item.selected;

            if (item.selected && isConfirming) {
              checkItem(item.id);
              item.checked = false;
              setIsConfirming(false);
            }
          }
          return item;
        }),
      );
    }
  };

  const searchItems = text => {
    if (itemType === 'schedule') {
      const regex = new RegExp(`${text.trim()}`, 'i');
      setItems(
        itemList.filter(
          i => i.client.name.search(regex) >= 0 || i.selected || i.checked,
        ),
      );
    } else {
      const regex = new RegExp(`${text.trim()}`, 'i');
      setItems(itemList.filter(i => i.name.search(regex) >= 0 || i.selected));
    }
  };

  const unselectItems = () => {
    setItems(
      items.map(item => {
        item.selected = false;
        return item;
      }),
    );
  };

  const closeMenu = () => {
    setMenuState({
      open: false,
      itemToShow: {},
    });
  };

  const deleteItem = itemToDelete => {
    deleteUniqueItem(itemToDelete);
    setItems(items.filter(item => item.id !== itemToDelete.id));
  };
  const deleteItems = itemsToDelete => {
    deleteItemList(itemsToDelete);
    let newItems = items;

    itemsToDelete.forEach(itemToDelete => {
      newItems.forEach((item, index) => {
        if (itemToDelete.id === item.id) {
          newItems.splice(index, 1);
        }
      });
    });

    setItems(newItems);
  };

  const deleteItemProcedure = itemProcedure => {
    deleteProcedure(itemProcedure);
    const newItemList = itemList;
    newItemList.forEach(item => {
      if (item.id === itemProcedure.employeeId) {
        item.procedures.forEach((procedure, index) => {
          if (procedure.id === itemProcedure.id) {
            item.procedures.splice(index, 1);
          }
        });
      }
    });

    setItems(newItemList);
  };

  const checkItem = id => {
    checkItems(id);
    const newItemList = itemList;
    if (id === -1) {
      setIsConfirming(false);
      setCheckedItems([]);
    } else {
      setIsConfirming(true);
      newItemList.forEach(item => {
        if (checkedItems.length === 0) setCheckedItems([...checkedItems, item]);
        else if (!checkedItems.some(checkedItem => checkedItem.id === item.id))
          setCheckedItems([...checkedItems, item]);
      });
    }

    setItems(newItemList);
  };

  const onConfirm = () => {
    confirmItems(checkedItems);
    setCheckedItems([]);
    setIsConfirming(false);
  };

  const handleMenu = item => {
    console.log(
      'Procedure',
      itemList.find(itemToShow => itemToShow.id === item.id),
    );
    setMenuState({
      open: !menuState.open,
      itemToShow: itemList.find(itemToShow => itemToShow.id === item.id),
    });
  };

  return (
    <S.Container>
      <ListMenu
        isOwner={isOwner}
        navigateToCalendar={navigateToCalendar}
        handleMenu={handleMenu}
        showCalendarButton={showCalendarButton}
        isConfirming={isConfirming}
        checkItem={checkItem}
        onConfirm={onConfirm}
        itemType={itemType}
        objectMenuItems={objectMenuItems}
        menuState={menuState}
        color={color}
        menuItems={menuItems}
        deleteItem={deleteItem}
        closeMenu={closeMenu}
        onEditNavigateTo={onEditNavigateTo}
        deleteProcedure={deleteItemProcedure}
      />
      <Loading isLoading={isLoading} color={color} />
      {showHeader && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              right: 0,
              width: '100%',
              zIndex: 1,
            },
            {transform: [{translateY}]},
          ]}>
          <ListHeader
            isDeleting={isDeleting}
            items={items}
            headerColor={color}
            headerTitle={headerText}
            searchItems={searchItems}
            selectedItemsLength={selectedItems.length}
            cancelDelete={unselectItems}
            handleState={handleState}
            headerHeight={headerHeight}
            searchPlaceHolder={searchPlaceHolder}
            scrolling={scrolling}
          />
        </Animated.View>
      )}
      <S.Body isDeleting={isDeleting} isConfirming={isConfirming}>
        <Animated.FlatList
          ref={ref}
          scrollEventThrottle={16}
          contentContainerStyle={{paddingTop: showHeader ? headerHeight : 0}}
          onMomentumScrollEnd={handleSnap}
          onScroll={handleScroll}
          keyExtractor={item => item.id}
          data={items}
          renderItem={({item}) => (
            <ListContent
              {...item}
              item={item}
              isDeleting={isDeleting}
              itemType={itemType}
              color={color}
              changeListState={changeListState}
              selectItem={selectItem}
              checkItem={checkItem}
              onPressItem={() => {
                setItems(itemList);
                handleMenu(item);
              }}
            />
          )}
        />
      </S.Body>
      {!showFooter && (
        <FloatButton
          bottom={'40px'}
          right={'30px'}
          onPress={onAddNavigateTo}
          buttonColor={color}
          icon={'plus'}
        />
      )}

      {showFooter && (
        <S.Footer color={color}>
          <S.FooterButtons>
            {isDeleting && (
              <Button
                onPress={() => deleteItems(selectedItems)}
                text={'Apagar'}
                width={'120px'}
                height={'35px'}
                fontSize={'17px'}
                color={color}
                textColor={global.colors.backgroundColor}
                backgroundColor={color}
              />
            )}
            {isConfirming && (
              <>
                <Button
                  onPress={onConfirm}
                  text={'Confirmar'}
                  width={'120px'}
                  height={'35px'}
                  fontSize={'17px'}
                  color={color}
                  textColor={color}
                  backgroundColor={global.colors.backgroundColor}
                />
                <S.CancelButton
                  onPress={() => {
                    checkItem(-1);
                  }}>
                  <Times
                    fill={'#fff'}
                    borderFill={'#fff'}
                    width={15}
                    height={15}
                  />
                </S.CancelButton>
              </>
            )}
          </S.FooterButtons>
        </S.Footer>
      )}
    </S.Container>
  );
};

export default List;