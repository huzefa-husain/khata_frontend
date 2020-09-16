import React, { Component, Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, Text, AsyncStorage, ScrollView } from 'react-native'
import { Picker, Icon, Left } from "native-base";
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import ScreenHeader from '../components/ScreenHeader'
import Delete from '../components/Delete'
import Loader from '../components/Loader'
import { api } from '../common/Api'
import { baseurl, editcontact, addcontact, deletecontact, countrycode } from '../common/Constant'

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

export default class AddContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: this.props.navigation.getParam('mode', 'default'),
      name: this.props.navigation.getParam('name', 'default'),
      phone: this.props.navigation.getParam('phone', 'default'),
      contactid: this.props.navigation.getParam('contactid', 'default'),
      address:this.props.navigation.getParam('address', 'default'),
      loading: false,
      //countrycode: this.props.navigation.getParam('countrycode', 'default'),
      selected: "+965"
    }
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerTitle: params ? <ScreenHeader mode={params.screenEdit} title={'Contact'} /> : <React.Fragment></React.Fragment>,
      headerRight: params ? <Delete action={params.deleteButton} mode={params.screenEdit} /> : <React.Fragment></React.Fragment>,
      headerBackTitleVisible: false,
    }
  };

  componentDidMount () {
    this.props.navigation.setParams({ deleteButton: this._deleteButton });
    this.props.navigation.setParams({
      screenEdit:this.state.mode,
    })
    if (this.state.mode === 'edit') {
      this.setState({
        selected: this.props.navigation.getParam('countrycode', 'default')
      });
    }
  }

  _deleteButton = () => {
    this.addContact('delete');
  }

  addContact = async (values) => {
    console.log(values)
    let self = this;
    let apiurl
    let apimethod

    const userToken = await AsyncStorage.getItem('userId');
    //const apiurl = addcontact
    //const apimethod = 'POST'
    const mode = this.state.mode
    apiurl = mode === 'edit' ? editcontact : addcontact
    apimethod = mode === 'edit' ? 'PUT' : 'POST'
    const getKhataId = await AsyncStorage.getItem('KhataId');
    if (values === 'delete') { apiurl = deletecontact, apimethod = 'POST'}
    const addBody = {
      userid: userToken,
      name: values.name,
      ccode: this.state.selected,
      phone: values.phone,
      address: values.address,
      khataid: getKhataId,
      contactid:this.state.contactid
    }

    const deleteBody = {
      userid:userToken,
      khataid:getKhataId,
      contactid:this.state.contactid
    }
    const body = values === 'delete' ?  deleteBody : addBody

    //console.log (postBody)
    this.setState({loading: true});
    console.log(addBody)
    api(body, baseurl + apiurl, apimethod, null).then(async (response) => {
      if (response.data.success === 1) {
        console.log(response);
        self.props.navigation.navigate('Dashboard')
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

  render() {
    const { mode, name, phone, address, loading } = this.state
    return (
      <React.Fragment>
        <SafeAreaView style={styles.container}>
          <Formik
            initialValues={{
              name: mode === 'edit' ? name : '',
              code: this.state.selected,
              phone: mode === 'edit' ? phone : '',
              address: mode === 'edit' ? address : ''
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
              isSubmitting,
              setFieldValue
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
                      onValueChange={(itemValue) => {
                        setFieldValue('code', itemValue)
                        this.setState({selected: itemValue})
                      }} 
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
