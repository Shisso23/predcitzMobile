/* eslint-disable react-hooks/exhaustive-deps */

import {SafeAreaView, SectionList} from 'react-native';
import moment from 'moment';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {FixtureDataModel} from '../../../models/fixtures';
import {StandingsResponseModel} from '../../../models/standings-models';
import {StyleSheet} from 'react-native';
import {useTheme} from '../../../theme';
// import {goupedFixturesMock} from '../../../../mock-data';
import {Colors} from '../../../theme/Variables';
import {Button, Image, ListItem} from '@rneui/base';
import {TouchableOpacity} from 'react-native';
import {betOptionModel} from '../../../models/bet-option-model/index';

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
};
const Fixtures: React.FC<FixturesProps> = ({groupedFixtures}) => {
  const {Common, Layout, Gutters, Images, Fonts} = useTheme();
  const [selectedItem, setSelectedItem] = useState<FixtureDataModel>();
  const [selectedOption, setSelectedOption] = useState<betOptionModel>();
  const [favoriteFixtures, setFavoriteFixtures] = useState<
    {fixture: FixtureDataModel; option: betOptionModel}[] | null
  >(null);

  const reformatData = () => {
    // const data = goupedFixturesMock
    const data = groupedFixtures
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
            const newList = [
              ...removedExistingFixture,
              {fixture: fixtureData, option},
            ];
            setFavoriteFixtures(newList);
          }
        } else {
          const newList = [...favoriteFixtures, {fixture: fixtureData, option}];
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
          <Image
            source={{uri: `${item.league.logo}`}}
            style={[styles.logo, Gutters.tinyRMargin]}
          />
          <Text>{item.league.name}</Text>
        </View>
        <View
          style={[Layout.rowBetween, Layout.fullWidth, Gutters.smallHMargin]}>
          <View style={Layout.row}>
            <Image
              source={{uri: `${item.teams.home.logo}`}}
              style={[styles.logo, Gutters.tinyRMargin]}
            />
            <Text>{item.teams.home.name}</Text>
          </View>
          <Text style={Gutters.regularRMargin}>Vs</Text>
          <View style={Layout.row}>
            <Image
              source={{uri: `${item.teams.away.logo}`}}
              style={[styles.logo, Gutters.tinyRMargin]}
            />
            <Text>{item.teams.away.name}</Text>
          </View>
        </View>
        <View style={[Layout.alignItemsCenter, Layout.justifyContentCenter]}>
          <Text style={Fonts.textSmall}>
            {moment(new Date(`${item.fixture.date}`)).format('DD-MMMM-yyyy')}
          </Text>
        </View>
      </View>
    );
  };

  const renderAccordionButtons = (
    item: FixtureDataModel,
    option: betOptionModel,
  ) => {
    return (
      <View style={[Layout.rowBetween, Gutters.smallBMargin]}>
        <TouchableOpacity
          onPress={handleAddToFavorite({
            fixtureData: item,
            option,
            action: favoriteFixtures?.some(
              data =>
                data.fixture.fixture.id === item?.fixture.id &&
                data.option.id === option.id,
            )
              ? 'remove'
              : 'add',
          })}>
          <Image
            source={
              favoriteFixtures?.some(
                data =>
                  data.fixture.fixture.id === item?.fixture.id &&
                  data.option.id === option.id,
              )
                ? Images.remove
                : Images.add
            }
            style={[styles.addButton]}
          />
        </TouchableOpacity>

        <Button title="View fixture details" />
      </View>
    );
  };

  const sortStandings = (fixtureTeamsStandings: StandingsResponseModel[]) => {
    return fixtureTeamsStandings.sort((standDingsTeam1, standingsTeam2) => {
      return (
        standDingsTeam1.league.standings[0][0].rank -
        standingsTeam2.league.standings[0][0].rank
      );
    });
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
        isExpanded={
          selectedItem?.fixture.id === item.fixture.id &&
          section.option.id === selectedOption?.id
        }
        key={`${item.fixture.id}-${index}-${section.option.id}`}
        onPress={handleFixtureExpand(item, section.option)}
        ViewComponent={renderFixtureDetail(item)}
        style={[
          Common.viewWithShadow,
          Layout.rowBetween,
          Gutters.smallVMargin,
          styles.fixture,
        ]}>
        {selectedItem?.fixture.id === item.fixture.id &&
          selectedOption?.id === section.option.id &&
          renderAccordionButtons(item, section.option)}
      </ListItem.Accordion>
    );
  };
  const renderEmptyLsitContent = () => {
    return (
      <Text style={styles.emptyList}>Select leagues to see predictions.</Text>
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
        contentContainerStyle={styles.sectionList}
        ListEmptyComponent={renderEmptyLsitContent}
      />
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
    color: Colors.darkGray,
    marginTop: '25%',
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
  },
  sectionList: {
    width: '100%',
    marginRight: 10,
    paddingBottom: 150,
  },
});

export default Fixtures;
