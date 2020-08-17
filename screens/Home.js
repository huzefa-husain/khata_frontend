import React from 'react'
import { StyleSheet, Text, View, AsyncStorage } from 'react-native'
import { Button } from 'react-native-elements'

export default class Home extends React.Component {
  signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
  render() {
    return (
      <View>
        <Text>Home Screen</Text>
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
