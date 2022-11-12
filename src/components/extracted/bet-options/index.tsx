/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {betOptionModel} from '../../../models/bet-option-model/index';
import {useTheme} from '../../../theme';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {betOptions} from '../../../data-config/data-config';
import {Colors} from '../../../theme/Variables';

type BetOptionProps = {
  handleSelectedOptions: (options: betOptionModel[]) => void;
  options: betOptionModel[];
};

const BetOptions: React.FC<BetOptionProps> = ({
  handleSelectedOptions,
  options,
}) => {
  const {Common} = useTheme();
  const [selectedOptions, setSelectedOptions] =
    useState<betOptionModel[]>(options);

  useEffect(() => {
    handleSelectedOptions(selectedOptions);
  }, [selectedOptions.length]);

  const handleSelect = (item: betOptionModel) => () => {
    if (selectedOptions.some(option => option.id === item.id)) {
      setSelectedOptions(selectedOptions.filter(opt => opt.id !== item.id));
    } else {
      setSelectedOptions([...selectedOptions, item]);
    }
  };

  const renderBetOption = ({item}: {item: betOptionModel}) => {
    return (
      <TouchableOpacity
        key={`${item.id}`}
        onPress={handleSelect(item)}
        style={[
          Common.viewWithShadow,
          styles.option,
          {
            backgroundColor: selectedOptions.some(
              option => option.id === item.id,
            )
              ? Colors.warning
              : Colors.white,
          },
        ]}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return <Text style={styles.title}>Bet Options</Text>;
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList<betOptionModel>
        data={betOptions}
        renderItem={renderBetOption}
        horizontal
        contentContainerStyle={styles.flatList}
      />
    </View>
  );
};

export default BetOptions;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    width: '100%',
    paddingVertical: 5,
    alignItems: 'center',
  },
  flatList: {
    paddingVertical: 15,
    backgroundColor: Colors.lightGray,
  },
  option: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    marginHorizontal: 2,
  },
  title: {
    fontSize: 19,
    fontWeight: '600',
  },
});
