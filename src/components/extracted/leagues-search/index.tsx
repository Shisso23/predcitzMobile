/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Button, Image, Input} from '@rneui/base';
import {StyleSheet, View, FlatList} from 'react-native';

import {LeagueDataModel} from '../../../models/leagues';
import {useTheme} from '../../../theme';
import {Colors} from '../../../theme/Variables';
import LeagueItem from '../league-item';
import {FormScreenContainer} from '../../containers';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedLeaguesAction} from '../../../reducers/leagues/leagues.actions';
import {leaguesSelector} from '../../../reducers/leagues/leagues.reducer';

type SearchLeaguesProps = {
  showResults: Function;
  allLeagues: LeagueDataModel[];
  initiallySelectedLeagues: LeagueDataModel[];
  predictedLeagues: LeagueDataModel[];
  closeActionSheet: Function;
  loading: boolean;
  remainingSeconds: number;
};
const SearchLeagues: React.FC<SearchLeaguesProps> = ({
  allLeagues,
  showResults,
  initiallySelectedLeagues,
  predictedLeagues,
  loading,
  closeActionSheet,
  remainingSeconds,
}) => {
  const {Common, Layout, Gutters, Images} = useTheme();
  const dispatch = useDispatch<any>();
  const {selectedLeagues} = useSelector(leaguesSelector);
  const [searchedLeagues, setSearchedLeagues] = useState<
    LeagueDataModel[] | []
  >([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>();

  const clearLeagues = () => {
    dispatch(setSelectedLeaguesAction([]));
  };

  const handleLeagueSelect = (league_: LeagueDataModel, selected: boolean) => {
    if (selectedLeagues) {
      if (selected) {
        dispatch(setSelectedLeaguesAction([...selectedLeagues, league_]));
      } else if (!selected) {
        dispatch(
          setSelectedLeaguesAction(
            selectedLeagues.filter(
              (league: LeagueDataModel) =>
                league.league.id !== league_.league.id,
            ),
          ),
        );
      }
    } else {
      dispatch(setSelectedLeaguesAction([league_]));
    }
  };
  const clearSearch = () => () => {
    if (searchKeyWord) {
      setSearchKeyWord(undefined);
    }
  };
  const handleSearch = (keyword: string) => {
    setSearchKeyWord(keyword);
    if (keyword.length === 0) {
      setSearchedLeagues(allLeagues);
    } else {
      const result: LeagueDataModel[] = allLeagues.filter(data => {
        const sortedLeagueName = data.league.name
          .split('')
          .sort()
          .join('')
          .replace(new RegExp('-', 'g'), '')
          .replace(new RegExp(' ', 'g'), '');
        const sortedCountryName = data.country.name
          .split('')
          .sort()
          .join('')
          .replace(new RegExp('-', 'g'), '')
          .replace(new RegExp(' ', 'g'), '');
        const sortedKeyword = keyword
          .split('')
          .sort()
          .join('')
          .replace(new RegExp('-', 'g'), '')
          .replace(new RegExp(' ', 'g'), '');
        return (
          sortedLeagueName
            .toLowerCase()
            .includes(sortedKeyword.toLowerCase()) ||
          sortedCountryName
            .toLocaleLowerCase()
            .includes(sortedKeyword.toLowerCase()) ||
          data.league.name.toLowerCase().includes(keyword.toLowerCase()) ||
          data.country.name.toLowerCase().includes(keyword.toLowerCase()) ||
          `${sortedCountryName.toLowerCase()}${sortedLeagueName.toLowerCase()}`.includes(
            sortedKeyword.toLowerCase(),
          ) ||
          `${sortedLeagueName.toLowerCase()}${sortedCountryName.toLowerCase()}`.includes(
            sortedKeyword.toLowerCase(),
          )
        );
      });
      setSearchedLeagues(result);
    }
  };

  const renderListFooter = () => {
    return (
      <View style={[Layout.rowBetween, Gutters.regularMargin]}>
        <Button
          title={remainingSeconds < 60 ? 'Please wait 60 sec' : 'Show results'}
          onPress={async () => {
            showResults(selectedLeagues).then(() => {
              closeActionSheet();
            });
          }}
          containerStyle={[
            Common.submitButtonContainer,
            styles.showResultsButton,
          ]}
          disabled={remainingSeconds < 60}
          loading={loading}
          buttonStyle={[Common.submitButton, styles.showResultsButtonStyle]}
        />

        <Button
          type="clear"
          title="Clear"
          onPress={clearLeagues}
          titleStyle={styles.clearButtonTitle}
          containerStyle={[Gutters.regularRMargin]}
        />
      </View>
    );
  };

  const renderLeagues = ({item}: {item: LeagueDataModel}) => {
    return (
      <LeagueItem
        key={`${item.league.id}`}
        item={item}
        onPress={(selected: boolean) => {
          handleLeagueSelect(item, selected);
        }}
        disabled={predictedLeagues.some(
          leagueData => leagueData.league.id === item.league.id,
        )}
        selected={initiallySelectedLeagues?.some(league => {
          return `${league.league.id}` === `${item.league.id}`;
        })}
      />
    );
  };

  return (
    <FormScreenContainer contentContainerStyle={styles.container}>
      <Input
        value={searchKeyWord}
        onChangeText={handleSearch}
        rightIcon={
          <View style={[Layout.row]}>
            <Image
              onPress={clearSearch()}
              source={Images.clear}
              style={[styles.searchIcon, Gutters.tinyRMargin]}
            />
            <Image source={Images.search} style={styles.searchIcon} />
          </View>
        }
        placeholder="Search for a league"
        inputContainerStyle={[styles.inputContainer, Gutters.smallTMargin]}
        inputStyle={{textAlign: 'center'}}
        showSoftInputOnFocus
      />
      <FlatList
        data={searchKeyWord ? searchedLeagues : allLeagues}
        renderItem={renderLeagues}
        nestedScrollEnabled
        showsVerticalScrollIndicator
        contentContainerStyle={[Gutters.largeBPadding, Gutters.smallHPadding]}
      />
      {renderListFooter()}
    </FormScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  clearButtonTitle: {color: Colors.gray},
  inputContainer: {borderWidth: 1, width: '100%', borderRadius: 10},
  searchIcon: {
    width: 20,
    height: 20,
  },
  showResultsButton: {maxHeight: 45},
  showResultsButtonStyle: {height: '100%'},
});

export default SearchLeagues;
