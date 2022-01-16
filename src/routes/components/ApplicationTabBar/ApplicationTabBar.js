import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import Client from '../../../assets/svg/clientSVG.svg';
import Clock from '../../../assets/svg/clockSVG.svg';
import Partner from '../../../assets/svg/partnerSVG.svg';
import global from '../../../common/global';
import { ScheduleContext } from '../../../contexts/Schedule/ScheduleContext';
import { UserContext } from '../../../contexts/User/UserContext';
import Loading from '../../../view/components/small/Loading';
import { TabArea, TabItem } from './style';


export default ({ state, navigation }) => {
  const { currentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const { loadAllSchedules, showingCurrentUserSchedule } =
    useContext(ScheduleContext);

  const tabBarColor = () => {
    let color = '';

    switch (state.index) {
      case 0:
        return `${global.colors.greenColor}`;
      case 1:
        return `${global.colors.purpleColor}`;
      case 2:
        return `${global.colors.blueColor}`;
    }

    return color;
  };

  const goTo = (screenName, params) => {
    navigation.navigate(screenName);
  };

  return (
    <TabArea>
      <Loading isLoading={isLoading} color={tabBarColor()} />

      <View>
        <TabItem key={'partnerTabItem'} onPress={() => goTo('Partners')}>
          {state.index === 0 ? (
            <Partner
              fill={tabBarColor()}
              borderFill={'#fff'}
              width={40}
              height={40}
            />
          ) : (
            <Partner
              fill={'#fff'}
              borderFill={tabBarColor()}
              width={40}
              height={40}
            />
          )}
        </TabItem>
      </View>
      <TabItem
        onPress={() =>
          goTo('Schedules', {
            calendarViewState: true,
            employee: undefined,
            employeeView: false,
          })
        }>
        {state.index === 1 ? (
          <Clock
            fill={tabBarColor()}
            borderFill={'#fff'}
            width={40}
            height={40}
          />
        ) : (
          <Clock
            fill={'#fff'}
            borderFill={tabBarColor()}
            width={40}
            height={40}
          />
        )}
      </TabItem>

      <TabItem onPress={() => goTo('Clients')}>
        {state.index === 2 ? (
          <Client
            fill={tabBarColor()}
            borderFill={'#fff'}
            width={40}
            height={40}
          />
        ) : (
          <Client
            fill={'#fff'}
            borderFill={tabBarColor()}
            width={40}
            height={40}
          />
        )}
      </TabItem>
    </TabArea>
  );
};
