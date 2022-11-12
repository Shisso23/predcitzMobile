import {Platform, StyleSheet} from 'react-native';

/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */

export default ({Colors, FontFamily}) =>
  StyleSheet.create({
    android60PercentWhite: Platform.OS === 'android' ? {color: '#c2bebe'} : {},
    backgroundPrimary: {
      backgroundColor: Colors.primary,
    },
    backgroundReset: {
      backgroundColor: Colors.transparent,
    },
    cardTitle: {
      color: Colors.black,
      fontSize: 20,
      fontWeight: '500',
      textTransform: 'capitalize',
    },
    errorStyle: {
      color: Colors.error,
      fontFamily: FontFamily.primary,
      fontSize: 15,
      height: 26,
      marginBottom: 0,
      marginLeft: 10,
      marginTop: 0,
      paddingBottom: 0,
      paddingTop: 0,
    },
    fabAlignment: {
      bottom: '13%',
      position: 'absolute',
      right: 30,
    },
    headerLogo: {
      width: 200,
    },
    inputContainer: {
      borderBottomWidth: 0,
      elevation: 3,
      shadowColor: Colors.shadow,
      shadowOffset: {
        width: 2,
        height: 3,
      },
      shadowOpacity: 0.35,
      shadowRadius: 8,
    },
    inputWithRoundBorders: {
      backgroundColor: Colors.inputBackground,
      borderRadius: 14,
      color: Colors.muted,
      marginBottom: 10,
      marginTop: 10,
      minHeight: 50,
      textAlign: 'center',
    },
    link: {
      color: Colors.secondary,
      fontWeight: 'bold',
    },
    submitButton: {
      backgroundColor: Colors.secondary,
      borderRadius: 20,
    },
    submitButtonContainer: {borderRadius: 20, width: '70%'},
    submitButtonTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    textInput: {
      backgroundColor: Colors.inputBackground,
      borderColor: Colors.text,
      borderWidth: 1,
      color: Colors.text,
      marginBottom: 10,
      marginTop: 10,
      minHeight: 50,
      textAlign: 'center',
    },
    viewWithShadow: {
      backgroundColor: Colors.white,
      borderRadius: 14,
      elevation: 15,
      shadowColor: Colors.shadow,
      shadowOffset: {
        width: 0,
        height: 20,
      },
      shadowOpacity: 0.3,
      shadowRadius: 20,
    },
  });
