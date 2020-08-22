import React from 'react'
import { StyleSheet, Text, View, AsyncStorage } from 'react-native'
import { Button } from 'react-native-elements'

export default class Home extends React.Component {
  static navigationOptions = {
    title: 'Home Screen',
    headerLeft: null
  };

  signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
  addKhata = async (type) => {
    console.log (type)
    //this.props.navigation.navigate('AddKhata');
    this.props.navigation.navigate('AddKhata', {  
      khataType: type 
    })  
  };
  render() {
    return (
      <View>
        <View style={styles.buttonContainer}>
          <Button style={styles.button} title="Business" onPress ={() => this.addKhata('2')} />
          <Button style={styles.button} title="Personal" onPress ={() => this.addKhata('1')} />
          <Button style={styles.button} title="sign me out" onPress={this.signOutAsync} />
        </View>
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
  },
  buttonContainer: {
    marginTop: 25,
    maxWidth:'100%',
    justifyContent: 'center',
  },
  button: {
    marginBottom: 25,
    width:'50%',
    alignSelf: 'center'
  }
})
