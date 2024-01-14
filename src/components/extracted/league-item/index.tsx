/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {ListItem} from '@rneui/base';

import useTheme from '../../../theme/hooks/useTheme';
import {Colors} from '../../../theme/Variables';
import {LeagueDataModel} from '../../../models/leagues/index';
import {useSelector} from 'react-redux';
import {leaguesSelector} from '../../../reducers/leagues/leagues.reducer';
import flashService from '../../../services/flash-service/flash.service';

type LeagueItemProps = {
  onPress: Function;
  item: LeagueDataModel;
  selected: boolean;
  disabled: boolean;
};

const LeagueItem: React.FC<LeagueItemProps> = ({
  onPress,
  item,
  selected,
  disabled,
}) => {
  const {selectedLeagues} = useSelector(leaguesSelector);
  const [isSelected, setIsSelected] = useState(selected);
  const {Gutters} = useTheme();

  useEffect(() => {
    setIsSelected(selected);
  }, []);

  const handleSelect = () => {
    console.log({isSelected});
    if (selectedLeagues.length === 4 && !isSelected) {
      flashService.info('Maximum number of leagues selected!');
    } else {
      onPress(!isSelected);
      setIsSelected(!isSelected);
    }
  };

  return (
    <TouchableOpacity
      style={[
        Gutters.tinyMargin,
        Gutters.regularPadding,
        styles.container,
        {
          backgroundColor: disabled
            ? Colors.secondary
            : isSelected
            ? Colors.secondary
            : Colors.lightGray,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      key={`${item.league.id}`}
      disabled={disabled}
      onPress={handleSelect}>
      <ListItem.Subtitle
        numberOfLines={2}
        style={[
          {
            color: isSelected ? Colors.white : Colors.black,
          },
        ]}>
        {`${item.league.name} - ${item.country.name}`}
      </ListItem.Subtitle>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
  },
});

export default LeagueItem;
