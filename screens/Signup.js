import React, { Fragment } from 'react'
import axios from 'axios'
import { StyleSheet, SafeAreaView, View, AsyncStorage, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Header, Body, Title } from 'native-base';
import { styles, buttons } from '../common/styles'
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

const HeaderTitle = props => {
  //console.log ('header',props)
  return (
    <Header style={{backgroundColor:'#fff'}}>
    <Body>
      <Title style={{color:'#687DFC'}}>Khata Book</Title>
    </Body>
  </Header>
  );
}

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      showPassword:false
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
    const { loading,showPassword } = this.state
    //this.displayStorage();
    return (
      <React.Fragment>
      <SafeAreaView style={styles.container}>
        <HeaderTitle />
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
              <View style={{marginLeft:25, marginTop:25}}>
                <Text style={{fontWeight:'bold',paddingBottom:5, fontSize:28}}>Welcome,</Text>
                <Text style={{paddingBottom:5, fontSize:28}}>Sign up and enjoy</Text>
                <Text style={{fontSize:28}}>our app.</Text>
              </View>
              <View style={styles.boxcontainer}>
              <View style={styles.inputDivider}>  
              <FormInput
                name='name'
                value={values.name}
                onChangeText={handleChange('name')}
                placeholder='Full Name'
                iconName='md-person'
                iconColor='#2C384A'
                onBlur={handleChange('name')}
                //autoFocus
              />
              <ErrorMessage errorValue={touched.name && errors.name} />
              </View>
              <View style={styles.inputDivider}>    
              <FormInput
                name='phone'
                value={values.phone}
                onChangeText={handleChange('phone')}
                placeholder='Enter mobile number'
                iconName='ios-phone-portrait'
                iconColor='#2C384A'
                onBlur={handleChange('phone')}
                keyboardType={'number-pad'}
                returnKeyType={'next'}
                //autoFocus
              />
              <ErrorMessage errorValue={touched.phone && errors.phone} />
              </View>
              <View style={{paddingTop:15,position:'relative'}}>
              <FormInput
                name='password'
                value={values.password}
                onChangeText={handleChange('password')}
                placeholder='Password'
                secureTextEntry
                iconName='ios-lock'
                iconColor='#2C384A'
                onBlur={handleBlur('password')}
              />
              <Icon
              name={showPassword ? 'eye-slash' : 'eye'}
              size={15}
              color="grey"
              onPress={() => this.setState({showPassword: !showPassword})}
              style={{position:'absolute', top:25, right:10}}
            />
              <ErrorMessage errorValue={touched.password && errors.password} />
              </View>
              </View>
              <View style={styles.buttonContainer}>
                <FormButton
                  buttonType='outline'
                  onPress={handleSubmit}
                  title='Next'
                  textColor= '#ffffff'
                  buttonColor='#687DFC'
                  disabled={!isValid || isSubmitting}
                  //loading={isSubmitting}
                />
              </View>
            </Fragment>
          )}
        </Formik>
        <View style={{fontSize:16, alignItems:'center'}}>
          <Text style={{fontWeight:'bold',paddingBottom:5}}>By creating an account you agree to our</Text>
          <Text style={{paddingBottom:5}}>Terms &amp; Conditions and Privacy Policy</Text>
        </View>
        <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',}}>
          <View>
            <Text style={{fontSize:16}}>Have an account?</Text>
          </View>
        <View>
        <Button
          title='Login'
          onPress={this.goToLogin}
          titleStyle={{
            color: '#687DFC',
            fontSize:16
          }}
          type='clear'
        />
        </View>
        </View>
      </SafeAreaView>
      {loading && <Loader />}
      </React.Fragment>
    )
  }
}
