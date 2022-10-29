import React from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import {Input} from '@rneui/themed';
import {Formik} from 'formik';
import * as Yup from 'yup';

type AuthFormProps = {
  submitForm: Function;
  initialValues: {username: string};
};

const AuthSchema = Yup.object().shape({
  username: Yup.string().min(3).required('Username is required'),
});

const AuthForm: React.FC<AuthFormProps> = ({submitForm, initialValues}) => {
  const _handleSubmission = (formData: {username: string}) => {
    submitForm(formData);
  };

  return (
    <Formik
      initialValues={initialValues}
      initialStatus={{apiErrors: {}}}
      onSubmit={_handleSubmission}
      validationSchema={AuthSchema}
      enableReinitialize>
      {({handleChange, handleSubmit, errors}) => {
        return (
          <>
            <View style={[styles.inputView]}>
              <Text>Enter your name to start</Text>
              <Input
                placeholder="Name here"
                errorStyle={{color: 'red'}}
                errorMessage={errors.username}
                onChangeText={handleChange('username')}
                labelStyle={styles.placeHolder}
              />
            </View>

            <Button title="Submit" onPress={handleSubmit} />
          </>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  buttonsView: {width: '100%'},
  inputView: {marginTop: '25%', width: '85%'},
  input: {
    borderWidth: 1,
  },
  placeHolder: {
    marginLeft: 5,
  },
});

export default AuthForm;
