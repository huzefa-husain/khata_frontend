import React, { Fragment } from 'react'
import axios from 'axios'
import { StyleSheet, SafeAreaView, View, AsyncStorage } from 'react-native'
import { Button } from 'react-native-elements'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Loader from '../components/Loader'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import { baseurl, signup } from '../common/Constant'

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label('Name')
    .required()
    .min(2, 'Must have at least 2 characters'),
  phone: Yup.number().test('len', 'Must be exactly 8 characters', 
  val => val && val.toString().length === 8 ),
  password: Yup.string()
    .label('Password')
    .required()
    .min(8, 'Password must have more than 8 characters ')
})

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false
    }
  }
  goToLogin = () => this.props.navigation.navigate('Login')

  handleSubmit = async (values,actions) => {  
    let self = this;
    console.log (values)
    if (values.name.length > 0 && values.phone.length > 0 && values.password.length > 0) {
      this.setState({ loading: true });
      axios.post(baseurl + signup, {
        name: values.name,
        phone: values.phone,
        password: values.password
      })
      .then(async function (response) {
        console.log(response);
        self.setState({ loading:false });
        if (response.data.success === 1) {
          await AsyncStorage.setItem('userId', response.data.id);
          await AsyncStorage.setItem('dashboard', response.data.dashboard);
          self.props.navigation.navigate('App')
        } else {
          actions.setSubmitting(false);
          alert (response.data.message)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

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

  render() {
    const { loading } = this.state
    //this.displayStorage();
    return (
      <React.Fragment>
      <SafeAreaView style={styles.container}>
        <Formik
          validateOnChange
          initialValues={{
            name: '',
            phone: '',
            password: ''
          }}
          onSubmit={(values,actions) => {
            this.handleSubmit(values,actions)
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
            dirty
          }) => (
            <Fragment>
              <FormInput
                name='name'
                value={values.name}
                onChangeText={handleChange('name')}
                placeholder='Enter your name'
                iconName='md-person'
                iconColor='#2C384A'
                onBlur={handleChange('name')}
                //autoFocus
              />
              <ErrorMessage errorValue={touched.name && errors.name} />
              <FormInput
                name='phone'
                value={values.phone}
                onChangeText={handleChange('phone')}
                placeholder='Enter your phone'
                iconName='ios-phone-portrait'
                iconColor='#2C384A'
                onBlur={handleChange('phone')}
                keyboardType={'number-pad'}
                returnKeyType={'next'}
                //autoFocus
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
                  title='SIGNUP'
                  buttonColor='#F57C00'
                  disabled={!isValid || isSubmitting}
                  //loading={isSubmitting}
                />
              </View>
            </Fragment>
          )}
        </Formik>
        <Button
          title='Have an account? Login'
          onPress={this.goToLogin}
          titleStyle={{
            color: '#039BE5'
          }}
          type='clear'
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
  }
})
