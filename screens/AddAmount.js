import React, { Component, Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, Text, AsyncStorage } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import { api } from '../common/Api'
import { baseurl, addkhata, addamount } from '../common/Constant'

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
        Add Amount
    </Text>
    </View>
  )
}

export default class AddAmount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <ScreenHeader />
    }
  };

  displayStorage = async () => {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (error, stores) => {
        stores.map((result, i, store) => {
          console.log({ [store[i][0]]: store[i][1] });
          return true;
        });
      });
    });
  }

  addAmount = async (values) => {
    console.log(values)
    let self = this;
    const userToken = await AsyncStorage.getItem('userId');
    const apiurl = addamount
    const apimethod = 'POST'
    const getKhataId = await AsyncStorage.getItem('KhataId');
    const getContactId = this.props.navigation.getParam('id','default')
    const addBody = {
      userid: userToken,
      khataid: getKhataId,
      contactid: getContactId,
      type: 1,
      amount: values.amount,
      notes:values.notes
    }

    console.log (addBody)
    this.setState({
      loading: true,
    });
    console.log(addBody)
    api(addBody, baseurl + apiurl, apimethod, null).then(async (response) => {
      if (response.data.success === 1) {
        console.log(response);
        self.props.navigation.navigate('Dashboard', {
          //mode: 'edit',
        })
        this.setState({
          loading: false
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
      self.addAmount(values);
    }
  }

  onValueChange(value) {
    this.setState({
      selected: value
    });
  }

  render() {
    const { loading } = this.state
    //this.displayStorage();
    //console.log ('khatatype',khatatype)
    //console.log ('khataTypeID',khataTypeID)
    return (
      <React.Fragment>
        <SafeAreaView style={styles.container}>
          <Formik
            initialValues={{
              notes: '',
              amount: '',
            }}
            onSubmit={values => {
              this.handleSubmit(values)
            }}
            validationSchema={validationSchema}>
            {({
              handleChange,
              values,
              handleSubmit,
              errors,
              isValid,
              touched,
              handleBlur,
              isSubmitting
            }) => (
                <Fragment>
                  <FormInput
                    name='amount'
                    value={values.amount}
                    onChangeText={handleChange('amount')}
                    placeholder='Enter Amount'
                    iconName='ios-phone-portrait'
                    iconColor='#2C384A'
                    onBlur={handleBlur('amount')}
                    keyboardType={'number-pad'}
                    returnKeyType={'next'}
                  //autoFocus
                  />
                  <ErrorMessage errorValue={touched.amount && errors.amount} />
                  <FormInput
                    name='notes'
                    value={values.notes}
                    onChangeText={handleChange('notes')}
                    placeholder='Notes'
                    iconName='md-person'
                    iconColor='#2C384A'
                    onBlur={handleBlur('notes')}
                  //autoFocus
                  />
                  <ErrorMessage errorValue={touched.notes && errors.notes} />
                  <View style={styles.buttonContainer}>
                    <FormButton
                      buttonType='outline'
                      onPress={handleSubmit}
                      title='Save'
                      buttonColor='#F57C00'
                      disabled={!isValid || isSubmitting}
                    //loading={isSubmitting}
                    />
                  </View>
                </Fragment>
              )}
          </Formik>

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
