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
import {StandingsResponseModel} from '../models/standings-models';
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
import {appSelector} from '../reducers/app/app-reducer';
import {
  setPredictedLeaguesAction,
  setSelectedLeaguesAction,
} from '../reducers/leagues/leagues.actions';
import {
  setAllFixturesAction,
  setPredictedFixturesAction,
} from '../reducers/fixtures/fixtures.actions';
import {fixturesSelector} from '../reducers/fixtures/fixtures.reducer';
import {setStandingsAction} from '../reducers/standings/standings.actions';
import {standingsSelector} from '../reducers/standings/standings.reducer';

const PredictScreenScreen: React.FC = () => {
  const dispatch = useDispatch<any>();
  const {Images, Gutters, Layout} = useTheme();
  const selectedLeaguesData = useSelector(leaguesSelector);
  const {allFixtures} = useSelector(fixturesSelector);
  const [standingsLoading, setStandingsLoading] = useState(false);
  const {leaguesStandings} = useSelector(standingsSelector);
  const {predictedFixtures} = useSelector(fixturesSelector);
  const {predictedLeagues} = useSelector(leaguesSelector);
  const {leagues} = useSelector(leaguesSelector);
  const [leaguesModalVisible, setLeaguesModalVisible] =
    useState<boolean>(false);
  const [futureFixtures, setFutureFixtures] = useState<FixtureDataModel[]>([]);
  const [currentFixtures, setCurrentFixtures] = useState<FixtureDataModel[]>(
    [],
  );
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(false);
  const [datesViewExapanded, setDatesViewExapanded] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState<betOptionModel[] | []>(
    betOptions,
  );

  const [fromDate, setFromDate] = useState(
    new Date(moment().subtract(0, 'days').format('YYYY-MM-DD')),
  );
  const [loadingLeaguesFixtures, setLoadingLeaguesFixtures] = useState(false);
  const [toDate, setToDate] = useState(
    new Date(moment().add(2, 'days').format('YYYY-MM-DD')),
  );
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateToChange, setDateToChange] = useState<string>();

  const [favoriteLeagues, setFavoriteLeagues] = useState([]);
  const [readyToFetch, setReadyToFetch] = useState(false);
  const {debugging} = useSelector(appSelector);
  const [isResultsButtonDisabled, setIsResultsButtonDisabled] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(60);

  const leaguesFilters: LeaguesFilterModel = {
    current: true,
    season: seasonsBack[0],
    type: 'league',
  };

  useEffect(() => {
    let countdownInterval: number;

    if (isResultsButtonDisabled) {
      countdownInterval = setInterval(() => {
        setRemainingSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [isResultsButtonDisabled]);

  const resetCounter = () => {
    setRemainingSeconds(60);
  };

  const handleFABPress = () => {
    const initialValue: number = 0;
    const sumWithInitial = predictedFixtures.reduce(
      (accumulator, currentValue) => accumulator + currentValue.fixtures.length,
      initialValue,
    );
    if (sumWithInitial >= 15) {
      flashService.inbox(
        'Max number reached!',
        'Clear fixtures to make more predictions!',
      );
    } else {
      setLeaguesModalVisible(true);
    }
  };

  const closeLeaguesModal = () => {
    setLeaguesModalVisible(false);
  };

  useEffect(() => {
    if (!debugging) {
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
    if (readyToFetch && !leagues) {
      setIsLoadingLeagues(true);
      leaguesService
        .getFilteredLeagues(leaguesFilters)
        .then(response => {
          dispatch(setLeagues(response.data.response));
          setFavoriteLeagues(getFavoriteLeagues(response.data.response));
          flashService.success('Successfully fetched leagues!');
        })
        .catch(() => {
          flashService.error('Could not fetch leagues!');
        })
        .finally(() => {
          setIsLoadingLeagues(false);
        });
    }
    if (leagues) {
      setFavoriteLeagues(getFavoriteLeagues(leagues));
      flashService.success('Successfully retrieved cached leagues!');
    }
  }, [readyToFetch]);

  useEffect(() => {
    setCurrentFixtures(filterFixtresBetweenDates(fromDate, toDate));
    console.log({futureFixtures});
  }, [futureFixtures?.length]);

  const fetchFixtures = async () => {
    let leagueToFetchFixturesFor: LeagueDataLeagueModel[] = [];
    selectedLeaguesData.selectedLeagues.forEach((league: LeagueDataModel) => {
      if (
        allFixtures.length > 0 &&
        allFixtures.some(
          (fixtureData: FixtureDataModel) =>
            fixtureData.league.id === league.league.id,
        )
      ) {
      } else {
        leagueToFetchFixturesFor = [...leagueToFetchFixturesFor, league.league];
      }
    });

    await fetchLeaguesSeasonsFixtures(leagueToFetchFixturesFor);
  };

  const predict = () => {
    const initialValue: number = 0;
    const sumWithInitial = predictedFixtures.reduce(
      (accumulator, currentValue) => accumulator + currentValue.fixtures.length,
      initialValue,
    );
    if (sumWithInitial >= 15) {
      flashService.inbox(
        'Max number reached!',
        'Clear fixtures to make more predictions!',
      );
    } else {
      const predictions = selectedOptions.map((option: betOptionModel) =>
        option.predict({currentFixtures, allFixtures, leaguesStandings}),
      );
      dispatch(setPredictedFixturesAction(predictions));
    }
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
          const allSortedFixtures = (responses as unknown as FixtureDataModel[])
            .flat()
            .sort((fixtureA, fixtureB) => {
              return fixtureB.fixture.timestamp - fixtureA.fixture.timestamp;
            });
          const futureSortedFixtures = filterFutureFixtures(
            (responses as unknown as FixtureDataModel[])
              .flat()
              .sort((fixtureA, fixtureB) => {
                return fixtureB.fixture.timestamp - fixtureA.fixture.timestamp;
              }),
          );
          dispatch(
            setPredictedLeaguesAction([
              ...predictedLeagues,
              ...selectedLeaguesData.selectedLeagues,
            ]),
          );
          dispatch(
            setAllFixturesAction([...allFixtures, ...allSortedFixtures]),
          );
          setToDate(moment(fromDate).add(1, 'days').toDate());
          setFutureFixtures([...futureFixtures, ...futureSortedFixtures]);
        }
      })
      .finally(() => {
        setLoadingLeaguesFixtures(false);
      });
  };

  const handleNextClick = async () => {
    setStandingsLoading(true);
    await fetchFixtures();
    return Promise.all(
      selectedLeaguesData.selectedLeagues.map((league: LeagueDataModel) => {
        return getStandingsByLeagueId({
          leagueId: league.league.id,
          season: seasonsBack[0], //TODO change to current season
        });
      }),
    )
      .then(standingsData => {
        flashService.success('Successfully fetched standings!');
        dispatch(setStandingsAction([...leaguesStandings, ...standingsData]));
        dispatch(setSelectedLeaguesAction([]));
      })
      .catch(() => {
        flashService.error('Failed fetching standings!');
      })
      .finally(() => {
        setStandingsLoading(false);
      });
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
              dispatch(setAllFixturesAction([]));
              setCurrentFixtures([]);
              setFutureFixtures([]);
              dispatch(setStandingsAction([]));
              dispatch(setPredictedFixturesAction([]));
              dispatch(setPredictedLeaguesAction([]));
              dispatch(setSelectedLeaguesAction([]));
            }}
          />
        </View>

        <Fixtures
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
          showResults={async () => {
            if (!isResultsButtonDisabled) {
              if (selectedLeaguesData.selectedLeagues.length >= 4) {
                setIsResultsButtonDisabled(true);
              }

              // Simulate an API call (replace this with your actual API call)
              await handleNextClick();
              if (selectedLeaguesData.selectedLeagues.length >= 4) {
                setTimeout(() => {
                  setIsResultsButtonDisabled(false);
                  resetCounter();
                }, 60000);
              }
            }

            if (currentFixtures?.length > 0) {
              setToDate(moment(fromDate).add(1, 'days').toDate());
            }
          }}
          favoriteLeagues={
            __DEV__ && debugging ? favLeaguesMock : favoriteLeagues
          }
          allLeagues={
            __DEV__ && debugging ? favLeaguesMock : leagues ? leagues : []
          }
          closeActionSheet={closeLeaguesModal}
          initiallySelectedLeagues={selectedLeaguesData.selectedLeagues}
          predictedLeagues={predictedLeagues}
          loading={standingsLoading}
          remainingSeconds={remainingSeconds}
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
        mode="date"
        minimumDate={new Date()}
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
export default PredictScreenScreen;
