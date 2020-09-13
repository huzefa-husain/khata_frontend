import React, { Component, Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, Text, AsyncStorage, ScrollView } from 'react-native'
import { Picker, Icon, Left } from "native-base";
//import { Icon } from 'react-native-elements'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import { api } from '../common/Api'
import { baseurl, addkhata, addcontact } from '../common/Constant'

const countrycode = [
  {
    'value': '+965',
    'label': 'Kuwait'
  },
  {
    'value': '+91',
    'label': 'India'
  },
  {
    'value': '+880',
    'label': 'Bangladesh'
  },
  {
    'value': '+20',
    'label': 'Egypt'
  }
]

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label('Name')
    .required()
    .min(2, 'Must have at least 2 characters'),
  address: Yup.string()
    .label('address')
    .required()
    .min(2, 'Must have at least 2 characters'),
  phone: Yup.number().test('len', 'Must be exactly 8 characters',
    val => val && val.toString().length === 8),
})

const ScreenHeader = props => {
  //console.log ('header',props.mode)
  return (
    <View>
      <Text>
        Add New Contact
    </Text>
    </View>
  )
}

export default class AddContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      khataTypeID: this.props.navigation.getParam('typeid', 'default'),
      khataname: this.props.navigation.getParam('khataname', 'default'),
      businessname: this.props.navigation.getParam('businessname', 'default'),
      mode: this.props.navigation.getParam('mode', 'default'),
      loading: false,
      code: 'js',
      selected: "+965"
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

  addContact = async (values) => {
    console.log(values)
    let self = this;
    const userToken = await AsyncStorage.getItem('userId');
    const apiurl = addcontact
    const apimethod = 'POST'
    const getKhataId = await AsyncStorage.getItem('KhataId');
    const addBody = {
      userid: userToken,
      name: values.name,
      ccode: this.state.selected,
      phone: values.phone,
      address: values.address,
      khataid: getKhataId
    }

    //console.log (postBody)
    this.setState({
      loading: true,
    });
    console.log(addBody)
    api(addBody, baseurl + apiurl, apimethod, null).then(async (response) => {
      if (response.data.success === 1) {
        console.log(response);
        self.props.navigation.navigate('GetUserAmount', {
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
    if (values.name.length > 0 && values.phone.length > 0) {
      self.addContact(values);
    }
  }

  onValueChange(value) {
    this.setState({
      selected: value
    });
  }

  render() {
    const { khataTypeID, khataname, businessname, mode, loading } = this.state
    //this.displayStorage();
    //console.log ('khatatype',khatatype)
    //console.log ('khataTypeID',khataTypeID)
    return (
      <React.Fragment>
        <SafeAreaView style={styles.container}>
          <Formik
            initialValues={{
              name: '',
              code: this.state.selected,
              phone: '',
              address: ''
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
                    name='name'
                    value={values.name}
                    onChangeText={handleChange('name')}
                    placeholder='Enter Name'
                    iconName='md-person'
                    iconColor='#2C384A'
                    onBlur={handleBlur('name')}
                  //autoFocus
                  />
                  <ErrorMessage errorValue={touched.name && errors.name} />
                  <View style={styles.inputContainer}>
                    <Picker
                      note
                      mode="dropdown"
                      iosHeader="Country Code"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: '100%' }}
                      selectedValue={this.state.selected}
                      onValueChange={this.onValueChange.bind(this)}
                    >
                      {countrycode.map((i, index) => (
                        <Picker.Item key={index} label={i.value + ' ' + i.label} value={i.value} />
                      ))}

                    </Picker>
                  </View>
                  <FormInput
                    name='phone'
                    value={values.phone}
                    onChangeText={handleChange('phone')}
                    placeholder='Enter Mobile Number'
                    iconName='ios-phone-portrait'
                    iconColor='#2C384A'
                    onBlur={handleBlur('phone')}
                    keyboardType={'number-pad'}
                    returnKeyType={'next'}
                  //autoFocus
                  />
                  <ErrorMessage errorValue={touched.phone && errors.phone} />
                  <FormInput
                    name='address'
                    value={values.address}
                    onChangeText={handleChange('address')}
                    placeholder='address'
                    iconName='md-person'
                    iconColor='#2C384A'
                    onBlur={handleBlur('address')}
                  //autoFocus
                  />
                  <ErrorMessage errorValue={touched.address && errors.address} />
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
