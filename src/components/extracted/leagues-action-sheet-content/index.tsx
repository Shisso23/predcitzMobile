import React, {useState} from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import {Tab} from '@rneui/base';

import {useTheme} from '../../../theme';
import {Colors} from '../../../theme/Variables';
import {LeagueDataModel} from '../../../models/leagues/index';
import FavoriteLeagues from '../favorite-leagues';
import SearchLeagues from '../leagues-search';
import {Image} from '@rneui/themed';

type LeagueyActionSheetContentProps = {
  showResults: Function;
  favoriteLeagues: LeagueDataModel[];
  allLeagues: LeagueDataModel[];
  closeActionSheet: Function;
  initiallySelectedLeagues: LeagueDataModel[];
  predictedLeagues: LeagueDataModel[];
  loading: boolean;
  remainingSeconds: number;
};

const screenHeight = Dimensions.get('window').height;

const LeagueActionSheetContent: React.FC<LeagueyActionSheetContentProps> = ({
  showResults,
  favoriteLeagues,
  allLeagues,
  closeActionSheet,
  initiallySelectedLeagues,
  predictedLeagues,
  loading,
  remainingSeconds,
}) => {
  const {Gutters, Layout, Images} = useTheme();
  const [tabIndex, setTabIndex] = useState<number>(0);
  console.log('Favourite leagues', favoriteLeagues, {
    predictedLeagues,
    allLeagues,
  });

  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  return (
    <View style={{flexGrow: 1}}>
      <View style={[Layout.rowBetween]}>
        <Text
          style={[
            Gutters.regularLMargin,
            Gutters.regularMargin,
            styles.title,
            {alignSelf: 'center'},
          ]}>
          Leagues
        </Text>
        <Image
          source={Images.clear}
          style={{width: 25, height: 25, margin: 10}}
          onPress={() => closeActionSheet()}
        />
      </View>

      <View style={Layout.fullWidth}>
        <Tab
          value={tabIndex}
          onChange={handleTabChange}
          indicatorStyle={styles.tabIndicator}>
          <Tab.Item
            style={[
              styles.tabStyle,
              {
                backgroundColor:
                  tabIndex === 0 ? Colors.secondary : Colors.lightGray,
              },
            ]}
            titleStyle={[styles.tabTitle]}
            title="Popular leagues"
          />
          <Tab.Item
            style={[
              styles.tabStyle,
              {
                backgroundColor:
                  tabIndex === 1 ? Colors.secondary : Colors.lightGray,
              },
            ]}
            titleStyle={[styles.tabTitle]}
            title="All leagues"
          />
        </Tab>
      </View>
      {tabIndex === 0 ? (
        <FavoriteLeagues
          closeActionSheet={closeActionSheet}
          initiallySelectedLeagues={initiallySelectedLeagues}
          favoriteLeagues={favoriteLeagues}
          predictedLeagues={predictedLeagues}
          showResults={showResults}
          loading={loading}
          remainingSeconds={remainingSeconds}
        />
      ) : (
        <SearchLeagues
          closeActionSheet={closeActionSheet}
          initiallySelectedLeagues={initiallySelectedLeagues}
          allLeagues={allLeagues}
          predictedLeagues={predictedLeagues}
          showResults={showResults}
          loading={loading}
          remainingSeconds={remainingSeconds}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  clearButtonTitle: {color: Colors.gray},
  showResultsButton: {maxHeight: 45},
  showResultsButtonStyle: {height: '100%'},
  tabIndicator: {
    backgroundColor: Colors.secondary,
  },
  tabTitle: {
    color: Colors.black,
  },
  tabStyle: {
    backgroundColor: Colors.lightGray,
  },
  title: {fontSize: 18, fontWeight: '500', alignSelf: 'center'},
});

export default LeagueActionSheetContent;
