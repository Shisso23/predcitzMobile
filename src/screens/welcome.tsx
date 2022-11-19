/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {FAB, Dialog, ListItem} from '@rneui/themed';
import {ImageBackground, Platform, StyleSheet, View} from 'react-native';

import UserInfo from '../components/user-info/user-info';
import Images from '../components/theme/Images';
import LeagueActionSheetContent from '../components/extracted/leagues-action-sheet-content';
import {useDispatch} from 'react-redux';
import {LeagueDataLeagueModel, LeaguesFilterModel} from '../models/leagues';
import {useSelector} from 'react-redux';
import moment from 'moment';

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
import {favLeagues} from '../../mock-data';
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

const WelcomeScreen: React.FC = () => {
  const dispatch = useDispatch<any>();
  const [standingsLoading, setStandingsLoading] = useState(false);
  const [leaguesStandings, setLeaguesStandings] = useState<StandingsModel[]>(
    [],
  );
  const [pickerModalOpen, setPickerModalOpen] = useState(false);
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
    setReadyToFetch(true);
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

  const onStartDateValueChange = (newValue: any) => {
    setPickerModalOpen(!pickerModalOpen);
    const newDate: Date = new Date(newValue);
    setFromDate(newDate);
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
        .then(standings => {
          setLeaguesStandings([...leaguesStandings, ...standings]);
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
        <ListItem.Title style={styles.title}>Predictions</ListItem.Title>
        <Fixtures groupedFixtures={predictedFixtures} />
      </View>
      <FAB
        // icon={{
        //   name: 'plus',
        //   type: 'font-awesome',
        //   size: 30,
        //   containerStyle: {},
        // }}
        size="large"
        style={styles.fab}
        color="#3A609C"
        onPress={handleFABPress}
      />
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
          favoriteLeagues={favoriteLeagues}
          // favoriteLeagues={favLeagues}
          allLeagues={leagues ? leagues : []}
          // allLeagues={favLeagues}
          closeActionSheet={() => {}}
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
  fab: {
    position: 'absolute',
    bottom: '8%',
    right: '45%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  fixtures: {
    width: '100%',
    marginTop: '30%',
  },
  overlay: {
    height: '65%',
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
