import React, {useState, useEffect} from 'react';
import {StyleSheet, View, FlatList, Text} from 'react-native';
import {Button} from '@rneui/base';

import {useTheme} from '../../../theme';
import {Colors} from '../../../theme/Variables';
import LeagueItem from '../league-item';
import {LeagueDataModel} from '../../../models/leagues/index';

type LeagueyActionSheetContentProps = {
  showResults: Function;
  leagues: LeagueDataModel[];
  closeActionSheet: Function;
  initiallySelectedLeagues: LeagueDataModel[];
  loading: boolean;
};

const LeagueActionSheetContent: React.FC<LeagueyActionSheetContentProps> = ({
  showResults,
  leagues,
  closeActionSheet,
  initiallySelectedLeagues,
  loading,
}) => {
  const {Gutters, Common, Layout} = useTheme();
  const [selectedLeagues, setSelectedLeagues] = useState<LeagueDataModel[]>(
    initiallySelectedLeagues,
  );
  useEffect(() => {
    console.log({leagues});
    return () => {
      clearLeagues();
    };
  }, []);

  const handleLeagueSelect = (league_: LeagueDataModel, selected: boolean) => {
    if (selectedLeagues) {
      if (selected) {
        setSelectedLeagues([...selectedLeagues, league_]);
      } else if (!selected) {
        setSelectedLeagues(
          selectedLeagues.filter(
            league => league.league.id !== league_.league.id,
          ),
        );
      }
    } else {
      setSelectedLeagues([league_]);
    }
  };

  const clearLeagues = () => {
    setSelectedLeagues([]);
  };

  const renderLeagues = ({item}: {item: LeagueDataModel}) => {
    return (
      <LeagueItem
        key={`${item.league.id}`}
        item={item}
        onPress={(selected: boolean) => {
          handleLeagueSelect(item, selected);
        }}
        selected={initiallySelectedLeagues?.some(league => {
          return `${league.league.id}` === `${item.league.id}`;
        })}
      />
    );
  };

  return (
    <View style={[Gutters.largeRPadding, Gutters.smallBMargin]}>
      <Text
        style={[Gutters.regularLMargin, Gutters.regularMargin, styles.title]}>
        Leagues
      </Text>
      <View style={[Gutters.tinyLMargin]}>
        <FlatList
          data={leagues}
          renderItem={renderLeagues}
          numColumns={3}
          contentContainerStyle={[Gutters.smallPadding, Gutters.regularRMargin]}
          scrollEnabled
        />
      </View>
      <View style={[Layout.rowBetween, Gutters.regularMargin]}>
        <Button
          title="Show results"
          onPress={async () => {
            showResults(selectedLeagues).then(() => {
              closeActionSheet();
            });
          }}
          containerStyle={[
            Common.submitButtonContainer,
            styles.showResultsButton,
          ]}
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
    </View>
  );
};

const styles = StyleSheet.create({
  clearButtonTitle: {color: Colors.gray},
  showResultsButton: {maxHeight: 45},
  showResultsButtonStyle: {height: '100%'},
  title: {fontSize: 18, fontWeight: '500'},
});

export default LeagueActionSheetContent;
