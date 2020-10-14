import React, { Component, Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, Text, AsyncStorage } from 'react-native'
import Loader from '../components/Loader'
import FormButton from '../components/FormButton'
import { api } from '../common/Api'
import { baseurl, addamount, editamount, deleteamount } from '../common/Constant'

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  signOutAsync = async () => {
    await AsyncStorage.removeItem('userId')
    this.props.navigation.navigate('Auth');
  };

  render() {
    const { mode, data, loading, chosenDate } = this.state
    return (
      <React.Fragment>
        <SafeAreaView style={styles.container}>
          <Text>Profile Screen</Text>
          <FormButton
            buttonType='outline'
            title='Sign Out'
            buttonColor='#F57C00'
            onPress={this.signOutAsync}
          />
        </SafeAreaView>
        {loading && <Loader />}
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  buttonContainer: {
    margin: 25
  },
  inputContainer: {
    marginLeft: 15,
    marginRight: 15
  }
})
