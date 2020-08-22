import React, { Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, Text, AsyncStorage } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import { api } from '../common/Api'
import { baseurl, addkhata } from '../common/Constant'

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

export default class AddKhata extends React.Component {

  static navigationOptions = {
    title: 'Add New Khata'
  };

  handleSubmit = async values  => {
    let self = this;
    console.log (values)
    if (values.name.length > 0 && values.business.length > 0) {
      const userToken = await AsyncStorage.getItem('userId');
      const khataType = this.props.navigation.getParam('khataType','default')
      const postBody = {
        userid:userToken,
        name: values.name,
        businessname: values.business,
        type:khataType
      }
      //console.log (postBody)
      api(postBody, baseurl + addkhata, 'POST', null).then(async (response)=>{
        console.log(response);
        if (response.data.success === 1) {
          self.props.navigation.navigate('Dashboard')
          //console.log(response.data.id);
          //await AsyncStorage.setItem('userId', response.data.id);
          //await AsyncStorage.setItem('phone', response.data.phone);
          //await AsyncStorage.setItem('dashboard', response.data.dashboard);
          
          //response.data.dashboard === "0" ? self.props.navigation.navigate('App') : self.props.navigation.navigate('Dashboard')
        }
        else {
          alert (response.data.message)
        }
      }).catch(function (error) {
        console.log(error);
      });
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Formik
          initialValues={{
            name: '',
            business: '',
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
                placeholder='Name of Khata'
                iconName='md-person'
                iconColor='#2C384A'
                onBlur={handleBlur('name')}
                //autoFocus
              />
              <ErrorMessage errorValue={touched.name && errors.name} />
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
