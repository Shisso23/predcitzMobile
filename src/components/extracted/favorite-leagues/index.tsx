/* eslint-disable react-hooks/exhaustive-deps */
import {Button} from '@rneui/base';
import React, {useEffect} from 'react';
import {StyleSheet, SafeAreaView, View, FlatList} from 'react-native';
import {LeagueDataModel} from '../../../models/leagues';
import {useTheme} from '../../../theme';
import {Colors} from '../../../theme/Variables';
import LeagueItem from '../league-item';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedLeaguesAction} from '../../../reducers/leagues/leagues.actions';
import {leaguesSelector} from '../../../reducers/leagues/leagues.reducer';

type FavoriteLeaguesProps = {
  showResults: Function;
  favoriteLeagues: LeagueDataModel[];
  initiallySelectedLeagues: LeagueDataModel[];
  predictedLeagues: LeagueDataModel[];
  closeActionSheet: Function;
  loading: boolean;
  remainingSeconds: number;
};
const FavoriteLeagues: React.FC<FavoriteLeaguesProps> = ({
  favoriteLeagues,
  showResults,
  initiallySelectedLeagues,
  predictedLeagues,
  loading,
  closeActionSheet,
  remainingSeconds,
}) => {
  const {Common, Layout, Gutters} = useTheme();
  const dispatch = useDispatch<any>();
  const {selectedLeagues} = useSelector(leaguesSelector);
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
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={favoriteLeagues}
        renderItem={renderLeagues}
        contentContainerStyle={[
          Gutters.regularTMargin,
          Gutters.largeBPadding,
          Gutters.smallHPadding,
        ]}
        scrollEnabled
      />
      {renderListFooter()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  clearButtonTitle: {color: Colors.gray},
  showResultsButton: {maxHeight: 45},
  showResultsButtonStyle: {height: '100%'},
});

export default FavoriteLeagues;
