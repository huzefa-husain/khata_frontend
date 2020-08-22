import React from 'react'
import { StyleSheet, Text, View, AsyncStorage } from 'react-native'
import { Button } from 'react-native-elements'

export default class Dashboard extends React.Component {
  static navigationOptions = {
    title: 'Dashboard',
    headerLeft: null
  };

  signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
  render() {
    return (
      <View>
        <Text>Dashboard Screen</Text>
        <Button title="sign me out" onPress={this.signOutAsync} />
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
