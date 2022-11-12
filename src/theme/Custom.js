import {CardStyleInterpolators} from '@react-navigation/stack';

export default ({Colors, FontFamily}) => ({
  globalNavigatorScreenOptions: {
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    headerBackTitleVisible: false,
    headerStyle: {
      backgroundColor: Colors.secondary,
      shadowRadius: 0,
      shadowColor: 'transparent',
      elevation: 0,
    },
    headerTitleStyle: {
      fontFamily: FontFamily.secondary,
      color: Colors.white,
    },
    headerTintColor: Colors.white,
    cardStyle: {
      backgroundColor: Colors.white,
    },
  },
  headerButtonIcon: {
    height: 30,
    width: 30,
    margin: 5,
    resizeMode: 'contain',
  },
  headerButton: {
    backgroundColor: Colors.headerButtonBackgroundWhite,
    marginHorizontal: 15,
    borderRadius: 10,
  },
});
