import React from 'react'
import { StyleSheet, Text, View, AsyncStorage } from 'react-native'
import FormButton from '../components/FormButton'

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
          <FormButton
            buttonType='outline'
            title='Business'
            buttonColor='#F57C00'
            onPress ={() => this.addKhata('2')}
            buttonStyle = {styles.button}
            style={styles.button}
          />
          <FormButton
            buttonType='outline'
            title='Personal'
            buttonColor='#F57C00'
            onPress ={() => this.addKhata('1')}
            buttonStyle = {styles.button}
            style={styles.button}
          />
          <FormButton
            buttonType='outline'
            title='Sign Out'
            buttonColor='#F57C00'
            onPress={this.signOutAsync}
            buttonStyle = {styles.button}
            style={styles.button}
          />
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
