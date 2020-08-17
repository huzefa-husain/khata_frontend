import React, { Fragment } from 'react'
import axios from 'axios'
import { StyleSheet, SafeAreaView, View, AsyncStorage } from 'react-native'
import { Button } from 'react-native-elements'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import { baseurl, login } from '../common/Constant'

const validationSchema = Yup.object().shape({
  phone: Yup.number().test('len', 'Must be exactly 8 characters', 
  val => val && val.toString().length === 8 ),
  password: Yup.string()
    .label('Password')
    .required()
    .min(8, 'Password must have more than 8 characters '),
})

export default class Login extends React.Component {
  goToSignup = () => this.props.navigation.navigate('Signup')

  //handleSubmit = values => {
  handleSubmit = async (values) => {  
    let self = this;
    console.log (values)
    if (values.phone.length > 0 && values.password.length > 0) {
     axios.post(baseurl + login, {
        phone: values.phone,
        password: values.password
      })
      .then(async function (response) {
        console.log(response);
        if (response.data.success === 1) {
          console.log(response.data.id);
          await AsyncStorage.setItem('userId', response.data.id);
          await AsyncStorage.setItem('phone', response.data.phone);
          self.props.navigation.navigate('App')
        }
        else {
          alert (response.data.message)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Formik
          initialValues={{ phone:'', password: '' }}
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
                name='phone'
                value={values.phone}
                onChangeText={handleChange('phone')}
                placeholder='Phone Number'
                iconName='ios-phone-portrait'
                iconColor='#2C384A'
                onBlur={handleBlur('phone')}
                autoFocus
              />
              <ErrorMessage errorValue={touched.phone && errors.phone} />
              
              <FormInput
                name='password'
                value={values.password}
                onChangeText={handleChange('password')}
                placeholder='Enter password'
                secureTextEntry
                iconName='ios-lock'
                iconColor='#2C384A'
                onBlur={handleBlur('password')}
              />
              <ErrorMessage errorValue={touched.password && errors.password} />
              <View style={styles.buttonContainer}>
                <FormButton
                  buttonType='outline'
                  onPress={handleSubmit}
                  title='LOGIN'
                  buttonColor='#F57C00'
                  disabled={!isValid || isSubmitting}
                  loading={isSubmitting}
                />
              </View>
            </Fragment>
          )}
        </Formik>
        <Button
          title="Don't have an account? Sign Up"
          onPress={this.goToSignup}
          titleStyle={{
            color: '#F57C00'
          }}
          type='clear'
        />
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
