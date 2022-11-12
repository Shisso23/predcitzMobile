import {Button} from '@rneui/base';
import React, {useState} from 'react';
import {StyleSheet, SafeAreaView, View, FlatList} from 'react-native';
import {LeagueDataModel} from '../../../models/leagues';
import {useTheme} from '../../../theme';
import {Colors} from '../../../theme/Variables';
import LeagueItem from '../league-item';

type FavoriteLeaguesProps = {
  showResults: Function;
  favoriteLeagues: LeagueDataModel[];
  initiallySelectedLeagues: LeagueDataModel[];
  closeActionSheet: Function;
  loading: boolean;
  scrollHandlers: any;
};
const FavoriteLeagues: React.FC<FavoriteLeaguesProps> = ({
  favoriteLeagues,
  showResults,
  initiallySelectedLeagues,
  loading,
  closeActionSheet,
  scrollHandlers,
}) => {
  const {Common, Layout, Gutters} = useTheme();
  const [selectedLeagues, setSelectedLeagues] = useState<LeagueDataModel[]>(
    initiallySelectedLeagues,
  );

  const clearLeagues = () => {
    setSelectedLeagues([]);
  };

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

  const renderListFooter = () => () => {
    return (
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
        selected={initiallySelectedLeagues?.some(league => {
          return `${league.league.id}` === `${item.league.id}`;
        })}
      />
    );
  };

  return (
    <SafeAreaView style={[Layout.alignItemsCenter]}>
      <FlatList
        data={favoriteLeagues}
        renderItem={renderLeagues}
        numColumns={2}
        contentContainerStyle={[Gutters.smallPadding, Layout.fulllHeight]}
        scrollEnabled
        ListFooterComponent={renderListFooter()}
        {...scrollHandlers}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  clearButtonTitle: {color: Colors.gray},
  showResultsButton: {maxHeight: 45},
  showResultsButtonStyle: {height: '100%'},
});

export default FavoriteLeagues;
