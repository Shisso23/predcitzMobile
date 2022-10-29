import {Button} from '@rneui/themed';
import React from 'react';
import SwipeButton from 'rn-swipe-button';
import {ImageBackground, StyleSheet, View} from 'react-native';
import UserInfo from '../components/user-info/user-info';
import {useNavigation} from '@react-navigation/native';
import Images from '../components/theme/Images';

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const onButtonPress = () => {
    navigation.navigate('thankyou');
  };
  const renderSwipeButton = () => (
    <SwipeButton
      disabled={false}
      swipeSuccessThreshold={40}
      height={45}
      width={280}
      title="Slide me to continue"
      onSwipeSuccess={onButtonPress}
      railFillBackgroundColor="#6dbec7"
      thumbIconBackgroundColor="#3A609C"
      thumbIconBorderColor="#3A609C"
      railBackgroundColor="rgba(0,0,0,0)"
      railBorderColor="#3A609C"
      shouldResetAfterSuccess={true}
      titleFontSize={14}
      titleColor="#3A609C"
      containerStyles={styles.swipeButton}
    />
  );

  return (
    <ImageBackground source={Images.backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <UserInfo />
        <Button
          title="Press me"
          type="clear"
          containerStyle={styles.buttonContainer}
          onPress={onButtonPress}
        />
        <Button
          title="Press me"
          type="outline"
          containerStyle={styles.buttonContainer}
          onPress={onButtonPress}
        />
        <Button
          title="Press me"
          containerStyle={styles.buttonContainer}
          onPress={onButtonPress}
        />
        {renderSwipeButton()}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: 280,
    marginVertical: 10,
  },
  background: {flex: 1, width: '100%', height: '100%'},
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  swipeButton: {width: 280},
});
export default WelcomeScreen;
