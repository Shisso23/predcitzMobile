/* eslint-disable react-hooks/exhaustive-deps */

import {SafeAreaView, SectionList} from 'react-native';
import moment from 'moment';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {Dialog} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';

import {FixtureDataModel} from '../../../models/fixtures';
import {StandingsModel} from '../../../models/standings-models';
import {StyleSheet} from 'react-native';
import {useTheme} from '../../../theme';
import {goupedFixturesMock} from '../../../../mock-data';
import {Colors} from '../../../theme/Variables';
import {Image, ListItem} from '@rneui/base';
import {betOptionModel} from '../../../models/bet-option-model/index';
import {AppStackProps} from '../../../navigation/app/types';
import {useSelector} from 'react-redux';
import {appSelector} from '../../../reducers/app/app-reducer';

type FixturesProps = {
  groupedFixtures: {
    fixtures: FixtureDataModel[];
    option: {
      name: String;
      id: number;
      level: number;
      shortName: String;
      description: string;
    };
  }[];
  leaguesStandings: StandingsModel[];
  allFixtures: FixtureDataModel[];
};
const Fixtures: React.FC<FixturesProps> = ({
  groupedFixtures,
  leaguesStandings,
  allFixtures,
}) => {
  const {Common, Layout, Gutters, Images, Fonts} = useTheme();
  const [selectedItem, setSelectedItem] = useState<FixtureDataModel>();
  const [selectedOption, setSelectedOption] = useState<betOptionModel>();
  const [standingsModelVisible, setStandingsModelVisible] = useState(false);
  const [favoriteFixtures, setFavoriteFixtures] = useState<
    {fixture: FixtureDataModel; option: betOptionModel}[] | null
  >(null);
  const {debugging} = useSelector(appSelector);
  const navigation = useNavigation<AppStackProps>();

  const reformatData = () => {
    const fixtures =
      __DEV__ && debugging ? goupedFixturesMock : groupedFixtures;
    // const fixtures = groupedFixtures;
    const data = fixtures
      .map(data_ => ({
        title: data_.option.shortName,
        data: data_.fixtures,
        option: data_.option,
      }))
      .filter(reformedData => reformedData.data.length > 0);
    return data;
  };

  const handleFixtureExpand =
    (item: FixtureDataModel, option: betOptionModel) => () => {
      if (selectedItem?.fixture.id === item.fixture.id) {
        setSelectedItem(undefined);
        setSelectedOption(undefined);
      } else {
        setSelectedItem(item);
        setSelectedOption(option);
      }
      // setStandingsModelVisible(true);
      navigation.navigate('fixtureDetails', {
        leaguesStandings,
        fixture: item,
        allFixtures,
      });
    };

  const closeStandingsModel = () => {
    setStandingsModelVisible(false);
  };

  const handleAddToFavorite =
    ({
      fixtureData,
      option,
      action,
    }: {
      fixtureData: FixtureDataModel;
      option: betOptionModel;
      action: string;
    }) =>
    () => {
      if (favoriteFixtures) {
        if (
          favoriteFixtures.some(
            data => data.fixture.fixture.id === fixtureData.fixture.id,
          )
        ) {
          const removedExistingFixture = favoriteFixtures.filter(
            data => data.fixture.fixture.id !== fixtureData.fixture.id,
          );
          if (action === 'remove') {
            setFavoriteFixtures(removedExistingFixture);
          } else {
            const newList = Array.from(removedExistingFixture);
            newList.push({fixture: fixtureData, option});
            setFavoriteFixtures(newList);
          }
        } else {
          const newList = Array.from(favoriteFixtures);
          newList.push({fixture: fixtureData, option});
          setFavoriteFixtures(newList);
        }
      } else {
        setFavoriteFixtures([{fixture: fixtureData, option}]);
      }
    };

  const renderFixtureDetail = (item: FixtureDataModel) => () => {
    return (
      <View
        style={[
          Layout.column,
          Layout.alignItemsCenter,
          Layout.justifyContentBetween,
          Layout.fill,
          Gutters.tinyHPadding,
          Gutters.tinyBPadding,
        ]}>
        <View style={[Layout.row, Layout.alignSelfCenter]}>
          <Text>{`${item.league.name} (${item.league.country})`}</Text>
        </View>
        <View
          style={[
            Layout.rowBetween,
            Layout.fullWidth,
            Gutters.smallHMargin,
            {justifyContent: 'center', paddingHorizontal: '5%'},
          ]}>
          <View
            style={[
              Layout.row,
              {
                width: '45%',
                justifyContent: 'flex-end',
                alignItems: 'center',
              },
            ]}>
            <Image
              source={{uri: `${item.teams.home.logo}`}}
              style={[styles.logo, Gutters.tinyRMargin]}
            />
            <Text numberOfLines={1} style={styles.teamName}>
              {item.teams.home.name}
            </Text>
          </View>
          <View
            style={{
              width: '10%',
              justifyContent: 'center',
            }}>
            <Text
              style={[
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              Vs
            </Text>
          </View>

          <View
            style={[
              Layout.row,
              {
                width: '45%',
                alignSelf: 'center',
                paddingRight: 5,
                alignItems: 'center',
              },
            ]}>
            <Image
              source={{uri: `${item.teams.away.logo}`}}
              style={[styles.logo, Gutters.tinyRMargin]}
            />
            <Text numberOfLines={1} style={styles.teamName}>
              {item.teams.away.name}
            </Text>
          </View>
        </View>
        <View style={[Layout.alignItemsCenter, Layout.justifyContentCenter]}>
          <Text style={Fonts.textSmall}>
            {moment(new Date(`${item.fixture.date}`)).format(
              'DD-MMMM-yyyy HH:mm',
            )}
          </Text>
        </View>
      </View>
    );
  };

  const renderFixture = ({
    item,
    index,
    section,
  }: {
    item: FixtureDataModel;
    index: number;
    section: {
      data: [FixtureDataModel];
      option: betOptionModel;
      title: string;
    };
  }) => {
    return (
      <ListItem.Accordion
        key={`${item.fixture.id}-${index}-${section.option.id}`}
        onPress={handleFixtureExpand(item, section.option)}
        ViewComponent={renderFixtureDetail(item)}
        style={[
          Common.viewWithShadow,
          Layout.rowBetween,
          Gutters.smallVMargin,
          styles.fixture,
        ]}
      />
    );
  };
  const renderEmptyLsitContent = () => {
    return (
      <Text style={styles.emptyList}>Add leagues to see predictions.</Text>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <SectionList
        sections={reformatData()}
        renderItem={renderFixture}
        renderSectionHeader={({section: {title, option}}) => (
          <Text
            style={styles.header}>{`${title} (${option.description})`}</Text>
        )}
        style={styles.sectionList}
        ListEmptyComponent={renderEmptyLsitContent}
        ListFooterComponent={<View style={{height: 60}} />}
      />

      <Dialog
        isVisible={standingsModelVisible}
        onBackdropPress={closeStandingsModel}
        presentationStyle="overFullScreen"
        overlayStyle={styles.standingsModel}>
        <View style={styles.standingsContainer}>
          <Text style={{fontWeight: '600', fontSize: 18}}>Standings</Text>
        </View>
      </Dialog>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  accordionIcon: {
    width: 80,
    height: 80,
  },
  addButton: {
    width: 40,
    height: 40,
  },
  emptyList: {
    fontWeight: '600',
    fontSize: 20,
    textAlign: 'center',
    alignSelf: 'center',
    color: Colors.white,
    marginTop: '50%',
  },
  fixture: {
    height: 90,
    padding: 2,
    borderRadius: 10,
  },
  header: {
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: Colors.secondary,
  },
  logo: {
    width: 20,
    height: 20,
  },
  mainContainer: {
    marginLeft: 10,
    marginRight: 10,
    flexGrow: 1,
    paddingBottom: 200,
  },
  sectionList: {
    width: '100%',
    marginRight: 10,
    height: '90%',
    paddingBottom: 100,
  },
  standingsModel: {
    height: '78%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  standingsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
  },
  teamName: {
    width: '80%',
  },
});

export default Fixtures;
