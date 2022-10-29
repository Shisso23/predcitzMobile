import Toast from 'react-native-toast-message';
const success = (message: string = '') => {
  Toast.show({text1: 'Success', text2: message, type: 'success'});
};

const error = (message: string) => {
  Toast.show({text1: 'Error', text2: message, type: 'error'});
};

const info = (message: string) => {
  Toast.show({text1: 'Info', text2: message, type: 'info'});
};

const inbox = (title: string, message: string) => {
  Toast.show({text1: title, text2: message, type: 'info'});
};

export default {
  success,
  error,
  info,
  inbox,
};
