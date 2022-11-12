/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {ListItem} from '@rneui/base';

import useTheme from '../../../theme/hooks/useTheme';
import {Colors} from '../../../theme/Variables';
import {LeagueDataModel} from '../../../models/leagues/index';

type LeagueItemProps = {
  onPress: Function;
  item: LeagueDataModel;
  selected: boolean;
};

const LeagueItem: React.FC<LeagueItemProps> = ({onPress, item, selected}) => {
  const [isSelected, setIsSelected] = useState(selected);
  const {Gutters} = useTheme();

  useEffect(() => {
    setIsSelected(selected);
  }, []);

  const handleSelect = () => {
    onPress(!isSelected);
    setIsSelected(!isSelected);
  };

  return (
    <TouchableOpacity
      style={[
        Gutters.tinyMargin,
        Gutters.regularPadding,
        styles.container,
        {backgroundColor: isSelected ? Colors.secondary : Colors.lightGray},
      ]}
      key={`${item.league.id}`}
      onPress={handleSelect}>
      <ListItem.Subtitle
        style={[{color: isSelected ? Colors.white : Colors.black}]}>
        {item.league.name}
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
