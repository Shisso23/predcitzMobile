/* eslint-disable react-hooks/exhaustive-deps */
import React, {useRef, useEffect, useState} from 'react';
import {Button, FAB, Dialog, ListItem} from '@rneui/themed';
import {ImageBackground, Platform, StyleSheet, View} from 'react-native';
import _, {Dictionary} from 'lodash';
import ActionSheet from 'react-native-actions-sheet';

import UserInfo from '../components/user-info/user-info';
import {useNavigation} from '@react-navigation/native';
import Images from '../components/theme/Images';
import LeagueActionSheetContent from '../components/extracted/leagues-action-sheet-content';
import {useDispatch} from 'react-redux';
import {
  LeagueDataLeagueModel,
  LeagueDataSeasonsModel,
  LeaguesFilterModel,
} from '../models/leagues';
import {geFilteredLeaguesAction} from '../reducers/leagues/leagues.actions';
import {useSelector} from 'react-redux';
import leaguesService from '../services/leagues';
import {leaguesSelector, setLeagues} from '../reducers/leagues/leagues.reducer';
import {Colors} from '../theme/Variables';
import {favoriteLeagueIds, seasonsBack} from '../data-config/data-config';
import {LeagueDataModel} from '../models/leagues/index';
import {getStandingsByLeagueId} from '../services/standings';
import {
  StandingsModel,
  StandingsResponseModel,
} from '../models/standings-models';
import DateTimeInput from '../components/extracted/date-time-input';
import moment from 'moment';
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

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const actionSheetRef = useRef<any>();
  const dispatch = useDispatch<any>();
  const [standingsLoading, setStandingsLoading] = useState(false);
  const [leaguesStandings, setLeaguesStandings] = useState<StandingsModel[]>(
    [],
  );
  const [pickerModalOpen, setPickerModalOpen] = useState(false);
  const {leagues} = useSelector(leaguesSelector);
  const [futureFixtures, setFutureFixtures] = useState<FixtureDataModel[]>([]);
  const [currentFixtures, setCurrentFixtures] = useState<FixtureDataModel[]>(
    [],
  );
  const [loadingStandings, setLoadingStandings] = useState<Boolean>(false);
  const [allFixtures, setAllFixtures] = useState<FixtureDataModel[]>([]);
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(false);
  // const [groupedPredictionsData, setGroupedPredictionsData] = useState<
  //   {
  //     fixtures: FixtureDataModel[];
  //     option: {
  //       name: String;
  //       id: number;
  //       level: number;
  //       shortName: String;
  //       description: string;
  //     };
  //   }[]
  // >([]);
  const [selectedOptions, setSelectedOptions] = useState<betOptionModel[] | []>(
    [],
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
  >([]); //TODO try making a model for the bet option and reuse it
  // const [selectedLeagues, setSelectedLeagues] = useState<LeagueDataModel[]>();
  const [fromDate, setFromDate] = useState(
    new Date(moment().subtract(1, 'days').format('YYYY-MM-DD')),
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
    actionSheetRef.current?.setModalVisible(true);
  };

  useEffect(() => {
    setReadyToFetch(true);
  }, []);

  const closeModal = () => {
    setIsLoadingLeagues(false);
  };

  useEffect(() => {
    /*This predicted fixtures will give me a list of each prediction function result like. [{fixtures, option}, ...] so for me to display it on the jsx if one bet option is selected; only display the predictions for that bet option if there's any. If a level is selected; display prediction functions results for those options and merge them. if a fixtures is returned from 2 prediction functions. Add an Or eg. Over 1.5 or GG )
     */
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

  // useEffect(() => {
  // const groupedPredictionsData_ = _.groupBy(
  //   predictedFixtures,
  //   predictedFixture => predictedFixture.option.shortName,
  // );
  // setGroupedPredictionsData(groupedPredictionsData_);
  // }, [JSON.stringify(predictedFixtures)]);

  useEffect(() => {
    // if (readyToFetch) {
    //   setIsLoadingLeagues(true);
    //   leaguesService
    //     .getFilteredLeagues(leaguesFilters)
    //     .then(response => {
    //       console.log({response});
    //       dispatch(setLeagues(response.data.response));
    //       setFavoriteLeagues(getFavoriteLeagues(response.data.response));
    //     })
    //     .finally(() => {
    //       setIsLoadingLeagues(false);
    //     });
    // }
  }, [readyToFetch]);

  useEffect(() => {
    setCurrentFixtures(filterFixtresBetweenDates(fromDate, toDate));
  }, [futureFixtures?.length]);

  useEffect(() => {
    // fetchLeaguesSeasonsFixtures();
  }, [selectedLeagues.length]);

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
    console.log({leagues_});
    return leagues_?.filter((league: LeagueDataModel) =>
      favoriteLeagueIds.some(id => `${id}` === `${league.league.id}`),
    );
  };

  const getLeaguesSeasonsFixtures = async () => {
    setLoadingLeaguesFixtures(true);
    if (selectedLeagues) {
      return Promise.all(
        selectedLeagues.map(async (league: LeagueDataLeagueModel) => {
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
          ).then(response => {
            return response.flat();
          });
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

  const fetchLeaguesSeasonsFixtures = async () => {
    console.log('fetching');
    getLeaguesSeasonsFixtures()
      .then(responses => {
        console.log({responses});
        if (responses) {
          setAllFixtures(
            responses.flat().sort((fixtureA, fixtureB) => {
              return fixtureB.fixture.timestamp - fixtureA.fixture.timestamp;
            }),
          );
          setFutureFixtures(
            filterFutureFixtures(
              responses.flat().sort((fixtureA, fixtureB) => {
                return fixtureB.fixture.timestamp - fixtureA.fixture.timestamp;
              }),
            ),
          );
        }
      })
      .finally(() => {
        setLoadingLeaguesFixtures(false);
      });
  };

  const onActionSheetClose = () => {
    actionSheetRef.current.setModalVisible(false);
  };

  const onStartDateValueChange = (newValue: any) => {
    setPickerModalOpen(!pickerModalOpen);
    const newDate: Date = new Date(newValue);
    setFromDate(newDate);
  };

  const onEndDateValueChange = (newValue: any) => {
    setPickerModalOpen(!pickerModalOpen);
    const newDate: Date = new Date(newValue);
    setToDate(newDate);
  };

  const handleNextClick = async (selectedLeagues_: LeagueDataLeagueModel[]) => {
    console.log({selectedLeagues_});
    setStandingsLoading(true);
    setSelectedLeagues(selectedLeagues_);
    return Promise.all(
      selectedLeagues_.map(league => {
        return getStandingsByLeagueId({
          leagueId: league.id,
          season: seasonsBack[0],
        });
      }),
    )
      .then(standings => {
        setLeaguesStandings(standings);
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
      <ActionSheet
        ref={actionSheetRef}
        gestureEnabled
        containerStyle={styles.actionSheet}
        // onClose={onActionSheetClose}
      >
        <LeagueActionSheetContent
          showResults={async (selectedLeagues_: LeagueDataModel[]) => {
            await handleNextClick(
              selectedLeagues_.map(league => league.league),
            );
          }}
          leagues={favLeagues}
          closeActionSheet={onActionSheetClose}
          initiallySelectedLeagues={[]}
          loading={standingsLoading}
        />
      </ActionSheet>
      <Dialog
        isVisible={isLoadingLeagues || loadingLeaguesFixtures}
        onBackdropPress={closeModal}>
        <Dialog.Title title="Fetching leagues" />
        <Dialog.Loading />
      </Dialog>
      <DateTimeInput
        value={fromDate.toDateString()}
        onChange={onStartDateValueChange}
        label="Start date"
        mode="datetime"
        format="YYYY-MM-DD HH:mm"
        errorMessage={''}
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
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {flex: 1},
  fab: {
    backgroundColor: 'red',
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
  swipeButton: {width: 280},
  title: {
    alignSelf: 'center',
    fontSize: 19,
    fontWeight: '600',
  },
});
export default WelcomeScreen;
