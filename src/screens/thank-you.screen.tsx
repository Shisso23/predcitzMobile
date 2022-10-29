import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import Images from '../components/theme/Images';
import UserInfo from '../components/user-info/user-info';

const ThankYouScreen: React.FC = () => {
  return (
    <ImageBackground source={Images.backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <UserInfo />
        <Text style={styles.text}>Thanks for using this App </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {flex: 1, width: '100%', height: '100%'},
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  text: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 3,
  },
});
export default ThankYouScreen;
