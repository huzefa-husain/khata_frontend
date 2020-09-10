import React, { Component, Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, Text, AsyncStorage } from 'react-native'
import { Card, CardItem } from 'native-base';
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import { api } from '../common/Api'
import { baseurl, getuseramount } from '../common/Constant'

const validationSchema = Yup.object().shape({
  notes: Yup.string()
    .label('notes')
    .required()
    .min(1, 'Must have at least 1 characters'),
  amount: Yup.number().test('len', 'Must be exactly 1 characters',
    val => val && val.toString().length === 1),
})

const ScreenHeader = props => {
  //console.log ('header',props.mode)
  return (
    <View>
      <Text>
        User Amount
    </Text>
    </View>
  )
}

export default class GetUserAmount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      contactAmount:null
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <ScreenHeader />
    }
  };

  componentDidMount() {
    this.getAmount();
  }

  getAmount = async (values) => {
    console.log(values)
    let self = this;
    const userToken = await AsyncStorage.getItem('userId');
    const apiurl = getuseramount
    const apimethod = 'POST'
    const getKhataId = await AsyncStorage.getItem('KhataId');
    const getContactId = this.props.navigation.getParam('id', 'default')
    const addBody = {
      userid: userToken,
      khataid: getKhataId,
      contactid: getContactId,
    }

    console.log(addBody)
    this.setState({
      loading: true,
    });
    console.log(addBody)
    api(addBody, baseurl + apiurl, apimethod, null).then(async (response) => {
      if (response.data.success === 1) {
        console.log(response);
        /*self.props.navigation.navigate('Dashboard', {
          //mode: 'edit',
        })*/
        this.setState({
          loading: false,
          contactAmount:response.data.contactamount
        });
      }
      else {
        alert(response.data.message)
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  handleSubmit = async values => {
    let self = this;
    if (values.notes.length > 0 && values.amount.length > 0) {
      self.getAmount(values);
    }
  }

  onValueChange(value) {
    this.setState({
      selected: value
    });
  }

  render() {
    const { loading, contactAmount } = this.state
    console.log ('amount',contactAmount)
    return (
      <React.Fragment>
        <SafeAreaView style={styles.container}>
          <Text>Amount</Text>
          <Card style={styles.cardborder}>
            {contactAmount && contactAmount.map((items, i) => {
              return (
                <CardItem button key={i} onPress={() => this.props.navigation.navigate('AddAmount', { id: items.id })}>
                  <Text>{items.amount}</Text>
                  <Text>{items.createddate}</Text>
                  <Text>{items.note}</Text>
                </CardItem>
              );
            })}
          </Card>
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
  },
  cardborder:{
    borderWidth: 0
  }
})
