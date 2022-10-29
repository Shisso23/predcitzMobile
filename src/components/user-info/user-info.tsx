import {Image} from '@rneui/themed';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {userSelector} from '../../reducers/user/user.reducer';

import Images from '../theme/Images';

const UserInfo: React.FC = () => {
  const {username} = useSelector(userSelector);

  return (
    <View style={styles.userDetails}>
      <Image source={Images.profile} style={styles.profileImage} />
      <Text style={styles.text}>{username} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 3,
  },
  profileImage: {
    width: 20,
    height: 20,
  },
  userDetails: {
    position: 'absolute',
    top: 3,
    right: 3,
    flexDirection: 'row',
  },
});
export default UserInfo;
