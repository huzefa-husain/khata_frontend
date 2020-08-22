import React from 'react'
import { StyleSheet, Text, View, AsyncStorage } from 'react-native'
import FormButton from '../components/FormButton'

export default class Dashboard extends React.Component {
  static navigationOptions = {
    title: 'Dashboard Screen',
    headerLeft: null
  };

  signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
  render() {
    return (
      <View>
        <FormButton
          buttonType='outline'
          title='Sign Out'
          buttonColor='#F57C00'
          onPress={this.signOutAsync}
          buttonStyle = {styles.button}
          style={styles.button}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
