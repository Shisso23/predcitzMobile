import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  ImageBackground,
  StyleSheet,
  Switch,
  SwitchChangeEvent,
  Text,
  View,
} from 'react-native';
import Images from '../components/theme/Images';
import {appSelector, setDebugging} from '../reducers/app/app-reducer';
import useTheme from '../theme/hooks/useTheme';
import {useNavigation} from '@react-navigation/native';
import {AppStackProps} from '../navigation/app/types';
import {Button} from '@rneui/base';

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<AppStackProps>();
  const {debugging} = useSelector(appSelector);
  const {Colors} = useTheme();

  const onStart = () => {
    navigation.navigate('predict');
  };

  const onSwitchChange = (event: SwitchChangeEvent) => {
    dispatch(setDebugging(event.nativeEvent.value));
  };

  return (
    <ImageBackground source={Images.backgroundImage} style={styles.background}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            color: Colors.black,
            fontSize: 20,
            fontWeight: '800',
            textAlign: 'center',
          }}>
          Score big with our soccer betting predictions
        </Text>
        <View style={{height: 5}} />
        <Button
          title="Start"
          onPress={onStart}
          buttonStyle={{width: 150}}
          style={{marginTop: '15%'}}
        />
      </View>
      {__DEV__ && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'absolute',
            top: '2%',
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              margin: 5,
              color: Colors.warning,
            }}>
            Enable debugging:
          </Text>
          <Switch
            value={debugging}
            onChange={onSwitchChange}
            thumbColor={Colors.secondary}
            ios_backgroundColor={Colors.darkGray}
          />
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {flex: 1, width: '100%', height: '100%'},
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

export default HomeScreen;
