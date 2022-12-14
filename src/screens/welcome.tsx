/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Dialog, ListItem} from '@rneui/themed';
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import UserInfo from '../components/user-info/user-info';
import LeagueActionSheetContent from '../components/extracted/leagues-action-sheet-content';
import {useDispatch} from 'react-redux';
import {LeagueDataLeagueModel, LeaguesFilterModel} from '../models/leagues';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {Text} from 'react-native';
import {Button} from '@rneui/base';
import DateTimePicker from 'react-native-modal-datetime-picker';

import leaguesService from '../services/leagues';
import {leaguesSelector, setLeagues} from '../reducers/leagues/leagues.reducer';
import {
  betOptions,
  favoriteLeagueIds,
  seasonsBack,
} from '../data-config/data-config';
import {LeagueDataModel} from '../models/leagues/index';
import {getStandingsByLeagueId} from '../services/standings';
import {
  StandingsModel,
  StandingsResponseModel,
} from '../models/standings-models';
import {favLeaguesMock} from '../../mock-data';
import {getFilteredFixtures} from '../services/fixtures';
import {
  FixtureDataModel,
  FixturesFilterModel,
  FixturesModel,
} from '../models/fixtures';
import {toMomentDate} from '../helpers/dateTimeHelper';
import {betOptionModel} from '../models/bet-option-model';
import Fixtures from '../components/extracted/fixtures';
import BetOptions from '../components/extracted/bet-options';
import flashService from '../services/flash-service/flash.service';
import {useTheme} from '../theme';

const WelcomeScreen: React.FC = () => {
  const dispatch = useDispatch<any>();
  const {Images, Gutters, Layout} = useTheme();
  const [standingsLoading, setStandingsLoading] = useState(false);
  const [leaguesStandings, setLeaguesStandings] = useState<StandingsModel[]>(
    [],
  );
  const {leagues} = useSelector(leaguesSelector);
  const [leaguesModalVisible, setLeaguesModalVisible] =
    useState<boolean>(false);
  const [futureFixtures, setFutureFixtures] = useState<FixtureDataModel[]>([]);
  const [currentFixtures, setCurrentFixtures] = useState<FixtureDataModel[]>(
    [],
  );
  // const [loadingStandings, setLoadingStandings] = useState<Boolean>(false);
  const [allFixtures, setAllFixtures] = useState<FixtureDataModel[]>([]);
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(false);
  const [datesViewExapanded, setDatesViewExapanded] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState<betOptionModel[] | []>(
    betOptions,
  );
  const [predictedFixtures, setPredictedFixtures] = useState<
    {
      fixtures: FixtureDataModel[];
      option: {
        name: String;
        id: number;
        level: number;
        shortName: String;
        description: string;
      };
    }[]
  >([]);
  const [fromDate, setFromDate] = useState(
    new Date(moment().subtract(0, 'days').format('YYYY-MM-DD')),
  );
  const [loadingLeaguesFixtures, setLoadingLeaguesFixtures] = useState(false);
  const [toDate, setToDate] = useState(
    new Date(moment().add(2, 'days').format('YYYY-MM-DD')),
  );
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateToChange, setDateToChange] = useState<string>();

  const [selectedLeagues, setSelectedLeagues] = useState<
    LeagueDataLeagueModel[]
  >([]);
  const [favoriteLeagues, setFavoriteLeagues] = useState([]);
  const [readyToFetch, setReadyToFetch] = useState(false);
  const leaguesFilters: LeaguesFilterModel = {
    current: true,
    season: 2022,
    type: 'league',
  };

  const handleFABPress = () => {
    setLeaguesModalVisible(true);
  };

  const closeLeaguesModal = () => {
    setLeaguesModalVisible(false);
  };
  useEffect(() => {
    if (!__DEV__) {
      setReadyToFetch(true);
    }
  }, []);

  const closeModal = () => {
    setIsLoadingLeagues(false);
  };

  useEffect(() => {
    setCurrentFixtures(filterFixtresBetweenDates(fromDate, toDate));
  }, [fromDate.toString(), toDate.toString()]);

  useEffect(() => {
    if (currentFixtures) {
      predict();
    }
  }, [currentFixtures?.length]);

  useEffect(() => {
    if (selectedOptions) {
      predict();
    }
  }, [selectedOptions.length]);

  useEffect(() => {
    if (readyToFetch) {
      setIsLoadingLeagues(true);
      leaguesService
        .getFilteredLeagues(leaguesFilters)
        .then(response => {
          dispatch(setLeagues(response.data.response));
          setFavoriteLeagues(getFavoriteLeagues(response.data.response));
        })
        .catch(() => {
          flashService.error('Could not fetch leagues!');
        })
        .finally(() => {
          setIsLoadingLeagues(false);
        });
    }
  }, [readyToFetch]);

  useEffect(() => {
    setCurrentFixtures(filterFixtresBetweenDates(fromDate, toDate));
    console.log({futureFixtures});
  }, [futureFixtures?.length]);

  useEffect(() => {
    let leagueToFetchFixturesFor: LeagueDataLeagueModel[] = [];
    selectedLeagues.forEach(league => {
      if (
        allFixtures.length > 0 &&
        allFixtures.some(fixtureData => fixtureData.league.id === league.id)
      ) {
      } else {
        leagueToFetchFixturesFor = [...leagueToFetchFixturesFor, league];
      }
    });

    fetchLeaguesSeasonsFixtures(leagueToFetchFixturesFor);
  }, [JSON.stringify(selectedLeagues)]);

  const predict = () => {
    const predictions = selectedOptions.map((option: betOptionModel) =>
      option.predict({currentFixtures, allFixtures, leaguesStandings}),
    );
    setPredictedFixtures(predictions);
  };

  const sortStandings = (fixtureTeamsStandings: StandingsResponseModel[]) => {
    return fixtureTeamsStandings.sort((standDingsTeam1, standingsTeam2) => {
      return (
        standDingsTeam1.league.standings[0][0].rank -
        standingsTeam2.league.standings[0][0].rank
      );
    });
  };
  const handleDateConfirmed = (date: Date) => {
    if (dateToChange === 'startDate') {
      setFromDate(new Date(moment(date).format('YYYY-MM-DD')));
    } else if (dateToChange === 'endDate') {
      setToDate(new Date(moment(date).format('YYYY-MM-DD')));
    }
    setDatePickerVisible(false);
  };

  const filterFixtresBetweenDates = (from: Date, to: Date) => {
    const fixtures = futureFixtures.filter(fixtureData => {
      return (
        toMomentDate(fixtureData.fixture.date).isSameOrAfter(moment(from)) &&
        toMomentDate(fixtureData.fixture.date).isSameOrBefore(moment(to))
      );
    });
    return fixtures;
  };

  const getFavoriteLeagues = (leagues_: any) => {
    return leagues_?.filter((league: LeagueDataModel) =>
      favoriteLeagueIds.some(id => `${id}` === `${league.league.id}`),
    );
  };

  const getLeaguesSeasonsFixtures = async (
    leagueToFetchFixturesFor: LeagueDataLeagueModel[],
  ) => {
    setLoadingLeaguesFixtures(true);
    if (leagueToFetchFixturesFor) {
      return Promise.all(
        leagueToFetchFixturesFor.map(async (league: LeagueDataLeagueModel) => {
          const seasons = seasonsBack;
          return Promise.all(
            seasons.map(async (season: number) => {
              const getLeagueFixturesResponse: FixturesModel = await (
                await getFilteredFixtures(
                  new FixturesFilterModel({league: league.id, season}),
                )
              ).data;
              return getLeagueFixturesResponse.response;
            }),
          )
            .then(response => {
              return response.flat();
            })
            .catch(() => flashService.error('Could not fetch leagues!'));
        }),
      );
    }
  };
  const filterFutureFixtures = (fixtures: FixtureDataModel[]) => {
    return fixtures.filter(fixtureData => {
      return toMomentDate(fixtureData.fixture.date).isSameOrAfter(
        new Date(moment().subtract(1, 'days').format('YYYY-MM-DD')),
      );
    });
  };

  const fetchLeaguesSeasonsFixtures = async (
    leagueToFetchFixturesFor: LeagueDataLeagueModel[],
  ) => {
    console.log({leagueToFetchFixturesFor});
    getLeaguesSeasonsFixtures(leagueToFetchFixturesFor)
      .then(responses => {
        if (responses) {
          console.log({responses});
          const allSortedFixtures = responses
            .flat()
            .sort((fixtureA, fixtureB) => {
              return fixtureB.fixture.timestamp - fixtureA.fixture.timestamp;
            });
          const futureSortedFixtures = filterFutureFixtures(
            responses.flat().sort((fixtureA, fixtureB) => {
              return fixtureB.fixture.timestamp - fixtureA.fixture.timestamp;
            }),
          );
          setAllFixtures([...allFixtures, ...allSortedFixtures]);
          setFutureFixtures([...futureFixtures, ...futureSortedFixtures]);
        }
      })
      .finally(() => {
        setLoadingLeaguesFixtures(false);
      });
  };

  const handleNextClick = async (selectedLeagues_: LeagueDataLeagueModel[]) => {
    let newlyAddedLeagues: LeagueDataLeagueModel[] = [];
    selectedLeagues_.forEach(league_ => {
      if (selectedLeagues.some(league => league.id === league_.id)) {
      } else {
        newlyAddedLeagues = [...newlyAddedLeagues, league_];
      }
    });
    if (newlyAddedLeagues.length > 0) {
      setStandingsLoading(true);
      setSelectedLeagues([...selectedLeagues, ...newlyAddedLeagues]);
      return Promise.all(
        newlyAddedLeagues.map(league => {
          return getStandingsByLeagueId({
            leagueId: league.id,
            season: seasonsBack[0],
          });
        }),
      )
        .then(standingsData => {
          console.log({standingsData});
          setLeaguesStandings([...leaguesStandings, ...standingsData]);
        })
        .finally(() => {
          setStandingsLoading(false);
        });
    }
  };

  const handleSelectedOptions = (options: betOptionModel[]) => {
    setSelectedOptions(options);
  };

  return (
    <ImageBackground source={Images.backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <UserInfo />
        <BetOptions
          handleSelectedOptions={handleSelectedOptions}
          options={selectedOptions}
        />
      </View>

      <View style={styles.fixtures}>
        <ListItem.Accordion
          content={<Text style={Layout.fill}>Select dates</Text>}
          isExpanded={datesViewExapanded}
          containerStyle={Gutters.smallMargin}
          onPress={() => {
            setDatesViewExapanded(!datesViewExapanded);
            console.log('pressed');
          }}>
          <View style={styles.datesButtonContainer}>
            <Button
              title={`From: ${moment(fromDate).format('DD-MMM-YYYY')}`}
              onPress={() => {
                setDatePickerVisible(true);
                setDateToChange('startDate');
              }}
              titleProps={{numberOfLines: 1, style: styles.dateButtonTitle}}
              containerStyle={{flex: 1, borderRadius: 10, marginRight: 5}}
            />
            <Button
              title={`To: ${moment(toDate).format('DD-MMM-YYYY')}`}
              onPress={() => {
                setDatePickerVisible(true);
                setDateToChange('endDate');
              }}
              titleProps={{numberOfLines: 1, style: styles.dateButtonTitle}}
              containerStyle={{flex: 1, borderRadius: 10}}
            />
          </View>
        </ListItem.Accordion>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginHorizontal: 30,
          }}>
          <ListItem.Title style={[styles.title, {marginLeft: '30%'}]}>
            Predictions
          </ListItem.Title>
          <Button
            containerStyle={{
              alignSelf: 'flex-end',
              marginRight: 10,
              marginBottom: 5,
            }}
            titleStyle={{fontSize: 13}}
            title="Clear fixtures"
            onPress={() => {
              setAllFixtures([]);
              setPredictedFixtures([]);
              setSelectedLeagues([]);
            }}
          />
        </View>

        <Fixtures
          groupedFixtures={predictedFixtures}
          leaguesStandings={leaguesStandings}
          allFixtures={allFixtures}
        />
      </View>
      <TouchableOpacity onPress={handleFABPress} style={styles.fab}>
        <Image style={styles.fab} source={Images.plus} />
      </TouchableOpacity>
      <Dialog
        isVisible={leaguesModalVisible}
        onBackdropPress={closeLeaguesModal}
        presentationStyle="overFullScreen"
        overlayStyle={styles.overlay}>
        <LeagueActionSheetContent
          showResults={async (selectedLeagues_: LeagueDataModel[]) => {
            await handleNextClick(
              selectedLeagues_.map(league => league.league),
            );
          }}
          favoriteLeagues={__DEV__ ? favLeaguesMock : favoriteLeagues}
          allLeagues={__DEV__ ? favLeaguesMock : leagues ? leagues : []}
          closeActionSheet={closeLeaguesModal}
          initiallySelectedLeagues={[]}
          loading={standingsLoading}
        />
      </Dialog>

      <Dialog
        isVisible={isLoadingLeagues || loadingLeaguesFixtures}
        onBackdropPress={closeModal}>
        <Dialog.Title title="Fetching leagues" />
        <Dialog.Loading />
      </Dialog>
      <DateTimePicker
        isVisible={datePickerVisible}
        mode="datetime"
        onConfirm={handleDateConfirmed}
        date={dateToChange === 'startDate' ? fromDate : toDate}
        onCancel={() => setDatePickerVisible(false)}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  actionSheet: {
    borderRadius: Platform.OS === 'ios' ? 25 : 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  buttonContainer: {
    width: 280,
    marginVertical: 10,
  },
  background: {
    height: '100%',
  },
  container: {flex: 1},
  dateButtonTitle: {fontSize: 11},
  datesButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 5,
    marginRight: 5,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 5,
  },
  fab: {
    position: 'absolute',
    bottom: '8%',
    right: '37%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: 55,
    height: 55,
  },
  fixtures: {
    width: '100%',
    marginTop: '30%',
  },
  overlay: {
    height: '75%',
    width: '100%',
    position: 'absolute',
    bottom: '0%',
    left: 0,
    right: 0,
    padding: 0,
    margin: 0,
  },
  swipeButton: {width: 280},
  title: {
    alignSelf: 'center',
    fontSize: 19,
    fontWeight: '600',
  },
});
export default WelcomeScreen;
