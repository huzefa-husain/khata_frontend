import React, { Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, Text, AsyncStorage } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import { api } from '../common/Api'
import { baseurl, addkhata, editkhata } from '../common/Constant'

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label('Name')
    .required()
    .min(2, 'Must have at least 2 characters'),
  business: Yup.string()
    .label('Business')
    .required()
    .min(2, 'Must have at least 2 characters')
})

const validationSchemaPersonal = Yup.object().shape({
  name: Yup.string()
    .label('Name')
    .required()
    .min(2, 'Must have at least 2 characters'),
})

export default class AddKhata extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      khataTypeID: this.props.navigation.getParam('typeid','default'),
      khataname: this.props.navigation.getParam('khataname','default'),
      khatatype: this.props.navigation.getParam('khatatype','default'),
      mode: this.props.navigation.getParam('mode','default')
    }
  }

  static navigationOptions = {
    title: 'Add New Khata'
  };

  addKhata = async (values) => {
    const userToken = await AsyncStorage.getItem('userId');
    const mode = this.props.navigation.getParam('mode','default')
    const apiurl = mode === 'edit' ? editkhata : addkhata
    const apimethod = mode === 'edit' ? 'PUT' : 'POST'

    const postBody = {
      userid:userToken,
      name: values.name,
      businessname: this.state.khataTypeID === 2 ? values.business : '',
      type:this.state.khataTypeID
    }
    console.log (postBody)
    console.log (userToken,mode,apiurl,apimethod )
    /*api(postBody, baseurl + apiurl, apimethod, null).then(async (response)=>{
      console.log(response);
      if (response.data.success === 1) {
        self.props.navigation.navigate('Dashboard')
      }
      else {
        alert (response.data.message)
      }
      }).catch(function (error) {
      console.log(error);
    });*/
  }

  handleSubmit = async values  => {
    let self = this;
    console.log (values)
    if (this.state.khataTypeID === 2 ? values.name.length > 0 && values.business.length > 0 : values.name.length > 0) {
      self.addKhata(values);
    }
  }

  render() {
    const { khataTypeID, khataname, khatatype, mode } = this.state
    //console.log ('mode',mode)
    console.log ('mode type',khataname)
    return (
      <SafeAreaView style={styles.container}>
        <Formik
          initialValues={{
            name: mode === 'edit' ? khataname : '',
            business: mode === 'edit' ? khatatype : '',
          }}
          onSubmit={values => {
            this.handleSubmit(values)
          }}
          validationSchema={khataTypeID === "2" && mode === "edit" ? validationSchema : validationSchemaPersonal}>
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
                placeholder='Name of Khata'
                iconName='md-person'
                iconColor='#2C384A'
                onBlur={handleBlur('name')}
                //autoFocus
              />
              <ErrorMessage errorValue={touched.name && errors.name} />
              {khataTypeID === "2" && mode === "edit" ? 
              <React.Fragment>
                <FormInput
                  name='business'
                  value={values.business}
                  onChangeText={handleChange('business')}
                  placeholder='Business Name'
                  iconName='md-person'
                  iconColor='#2C384A'
                  onBlur={handleBlur('business')}
                  //autoFocus
                />
                <ErrorMessage errorValue={touched.business && errors.business} />
              </React.Fragment>
              : ''
              }
              <View style={styles.buttonContainer}>
                <FormButton
                  buttonType='outline'
                  onPress={handleSubmit}
                  title='Save'
                  buttonColor='#F57C00'
                  disabled={!isValid || isSubmitting}
                  loading={isSubmitting}
                />
              </View>
            </Fragment>
          )}
        </Formik>
      </SafeAreaView>
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
  }
})
