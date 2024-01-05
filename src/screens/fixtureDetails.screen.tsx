/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useMemo, useState} from 'react';
import {ScrollView, Text, View, Dimensions} from 'react-native';
import {useTheme} from '../theme';
import {StyleSheet} from 'react-native';
import {Image, ListItem} from '@rneui/themed';
import {StandingsModel} from '../models/standings-models';
import {FixtureDataModel} from '../models/fixtures';
import {Colors} from '../theme/Variables';

import moment from 'moment';
import {
  getH2HFixtures,
  getLastFiveAwayTeamAwayFixtures,
  getLastFiveHomeTeamHomeFixtures,
} from '../prediction-functions/shared-functions';

type FixtureDetailsProps = {
  route: {
    params: {
      leaguesStandings: StandingsModel[];
      fixture: FixtureDataModel;
      allFixtures: FixtureDataModel[];
    };
  };
};

const DEVICE_WIDTH = Dimensions.get('screen').width;

const FixtureDetailsScreen: React.FC<FixtureDetailsProps> = ({route}) => {
  const {Gutters} = useTheme();
  const leaguesStandings: StandingsModel[] = route.params.leaguesStandings;
  const [h2hAccordionExpanded, setH2hAccordionExpanded] = useState(false);
  const [homeHistoryAccordionExpanded, setHomeHistoryAccordionExpanded] =
    useState(false);
  const [awayHistoryAccordionExpanded, setAwayHistoryAccordionExpanded] =
    useState(false);

  const homeTeam = route.params.fixture.teams.home;
  const awayTeam = route.params.fixture.teams.away;
  const homeTeamPreviousHomeFixtures = useMemo(
    () =>
      getLastFiveHomeTeamHomeFixtures({
        teamId: homeTeam?.id,
        allFixtures: route.params.allFixtures,
      }),
    [],
  );
  const awayTeamPreviousAwayFixtures = useMemo(
    () =>
      getLastFiveAwayTeamAwayFixtures({
        teamId: awayTeam?.id,
        allFixtures: route.params.allFixtures,
      }),
    [],
  );
  const fixtureH2h = useMemo(
    () =>
      getH2HFixtures({
        teamOneId: homeTeam?.id,
        teamTwoId: awayTeam?.id,
        allFixtures: route.params.allFixtures,
      }),
    [],
  );

  const renderLeagueTable = () => (
    <View style={styles.tables}>
      <Text style={{fontWeight: '600', fontSize: 18}}>Standings</Text>
      {leaguesStandings
        .filter(
          data => data.response[0].league.id === route.params.fixture.league.id,
        )[0]
        .response[0].league.standings.map(standings => {
          return (
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.rowNumbers}>Rank</Text>
                <Text numberOfLines={1} style={styles.teamName}>
                  Team
                </Text>
                <Text style={styles.rowNumbers}>MP</Text>
                <Text style={styles.rowNumbers}>W</Text>
                <Text style={styles.rowNumbers}>D</Text>
                <Text style={styles.rowNumbers}>L</Text>
                <Text style={styles.rowNumbers}>GD</Text>
                <Text style={styles.rowNumbers}>Points</Text>
              </View>
              <View style={styles.tableBody}>
                {standings.map(standing => (
                  <View
                    style={[
                      styles.tableRow,
                      {
                        backgroundColor:
                          route.params.fixture.teams.home.id ===
                            standing.team.id ||
                          route.params.fixture.teams.away.id ===
                            standing.team.id
                            ? Colors.primary
                            : Colors.inputBackground,
                      },
                    ]}>
                    <Text style={styles.rowNumbers}>{standing.rank}</Text>
                    <Text numberOfLines={1} style={styles.teamName}>
                      {standing.team.name}
                    </Text>
                    <Text style={styles.rowNumbers}>{standing.all.played}</Text>
                    <Text style={styles.rowNumbers}>{standing.all.win}</Text>
                    <Text style={styles.rowNumbers}>{standing.all.draw}</Text>
                    <Text style={styles.rowNumbers}>{standing.all.lose}</Text>
                    <Text style={styles.rowNumbers}>{standing.goalsDiff}</Text>
                    <Text style={styles.rowNumbers}>{standing.points}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
    </View>
  );
  const renderPreviousFixtures = (previousFixtures: FixtureDataModel[]) => {
    return (
      <View style={styles.previousMatchesContainer}>
        {previousFixtures.map(fixture => {
          return (
            <View style={styles.previousFixtureRowContainer}>
              <Text style={styles.date}>{`${moment(
                fixture.fixture.date.toString(),
              ).format('DD-MMM-YYYY HH:mm')}`}</Text>
              <View style={styles.previousFixtureRow}>
                <View style={[styles.teamNameAndImageView, {width: '41%'}]}>
                  <Image
                    style={styles.teamLogo}
                    source={{uri: `${fixture.teams.home.logo}`}}
                  />
                  <Text style={[styles.teamName, {width: '90%'}]}>
                    {fixture.teams.home.name}
                  </Text>
                </View>
                <Text
                  style={
                    styles.score
                  }>{`${fixture.score.fulltime.home} - ${fixture.score.fulltime.away}`}</Text>
                <View style={[styles.teamNameAndImageView, {width: '41%'}]}>
                  <Image
                    style={styles.teamLogo}
                    source={{uri: `${fixture.teams.away.logo}`}}
                  />
                  <Text style={[styles.teamName, {width: '90%'}]}>
                    {fixture.teams.away.name}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ListItem.Accordion
        content={<Text style={{width: '86%'}}>Head to head</Text>}
        isExpanded={h2hAccordionExpanded}
        containerStyle={Gutters.smallMargin}
        onPress={() => {
          setH2hAccordionExpanded(!h2hAccordionExpanded);
          console.log('pressed');
        }}>
        {renderPreviousFixtures(fixtureH2h)}
      </ListItem.Accordion>
      <ListItem.Accordion
        content={<Text style={{width: '86%'}}>Home team home fixtures</Text>}
        isExpanded={homeHistoryAccordionExpanded}
        containerStyle={[Gutters.smallMargin]}
        onPress={() => {
          setHomeHistoryAccordionExpanded(!homeHistoryAccordionExpanded);
          console.log('pressed');
        }}>
        {renderPreviousFixtures(homeTeamPreviousHomeFixtures)}
      </ListItem.Accordion>
      <ListItem.Accordion
        content={<Text style={{width: '86%'}}>Away team away fixtures</Text>}
        isExpanded={awayHistoryAccordionExpanded}
        containerStyle={Gutters.smallMargin}
        onPress={() => {
          setAwayHistoryAccordionExpanded(!awayHistoryAccordionExpanded);
          console.log('pressed');
        }}>
        {renderPreviousFixtures(awayTeamPreviousAwayFixtures)}
      </ListItem.Accordion>
      {renderLeagueTable()}
    </ScrollView>
  );
};

export default FixtureDetailsScreen;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    width: '100%',
    paddingVertical: 5,
    alignItems: 'center',
    paddingBottom: 50,
  },
  date: {
    fontSize: 11,
    marginBottom: 2,
  },
  previousMatchesContainer: {
    width: DEVICE_WIDTH - DEVICE_WIDTH * 0.08,
  },
  previousFixtureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.lightGray,
    padding: 3,
  },
  previousFixtureRowContainer: {
    marginBottom: 10,
  },
  score: {width: '8%', fontSize: 11},
  tableContainer: {width: '100%'},
  tableHeader: {flexDirection: 'row', justifyContent: 'space-around'},
  tableBody: {marginBottom: 5},
  tables: {
    width: '90%',
    alignItems: 'center',
    marginTop: 5,
    paddingVertical: 5,
  },
  tablesBody: {},
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  teamLogo: {
    width: 15,
    height: 15,
  },
  teamNameAndImageView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowNumbers: {
    width: '10%',
    fontSize: 10,
  },
  teamName: {
    width: '28%',
    fontSize: 11,
  },
});
