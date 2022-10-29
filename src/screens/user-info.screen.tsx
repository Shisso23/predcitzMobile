import React from 'react';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import FormScreenContainer from '../components/containers/form-screen-container/form-screen.container';
import {setUserNameAction} from '../reducers/user/user.actions';
import AuthForm from '../components/forms/sign-in/auth-form';
import {ImageBackground, StyleSheet} from 'react-native';
import Images from '../components/theme/Images';

const UserInfoScreen: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<any>();
  console.log({navigation});

  const onSubmit = (formData: {username: string}) => {
    dispatch(setUserNameAction(formData.username));
  };

  return (
    <ImageBackground source={Images.backgroundImage} style={styles.background}>
      <FormScreenContainer contentContainerStyle={styles.container}>
        <AuthForm initialValues={{username: ''}} submitForm={onSubmit} />
      </FormScreenContainer>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {flex: 1, width: '100%', height: '100%'},
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

export default UserInfoScreen;
