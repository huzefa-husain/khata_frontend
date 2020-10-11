import React, { Fragment } from 'react'
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
import { api } from '../common/Api'
import { baseurl, login } from '../common/Constant'

const validationSchema = Yup.object().shape({
  phone: Yup.number().test('len', 'Must be exactly 8 characters', 
  val => val && val.toString().length === 8 ),
  password: Yup.string()
    .label('Password')
    .required()
    .min(8, 'Password must have more than 8 characters '),
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

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      showPassword:false
    }
  }

  goToSignup = () => this.props.navigation.navigate('Signup')

  handleSubmit = async values => {  
    let self = this;
    console.log (values)
    if (values.phone.length > 0 && values.password.length > 0) {
      this.setState({ loading: true });
      const postBody = {
        phone: values.phone,
        password: values.password
      }
      api(postBody, baseurl + login, 'POST', null).then(async (response)=>{
        console.log(response);
        this.setState({ loading: true });
        if (response.data.success === 1) {
          console.log(response.data.id);
          await AsyncStorage.setItem('userId', response.data.id);
          await AsyncStorage.setItem('phone', response.data.phone);
          await AsyncStorage.setItem('dashboard', response.data.dashboard);
          //self.props.navigation.navigate('App')
          response.data.dashboard !== "0" ? self.props.navigation.navigate('Dashboard') : self.props.navigation.navigate('App')
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
    const { loading,showPassword } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <HeaderTitle />
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
            <React.Fragment>
            <View style={{marginLeft:25,fontSize:16, marginTop:25}}>
            <Text style={{fontWeight:'bold',paddingBottom:5}}>Welcome back,</Text>
            <Text style={{paddingBottom:5}}>please login</Text>
            <Text>to your account</Text>
            </View>  
            <View style={styles.boxcontainer}>
              <View style={styles.inputDivider}>
              <FormInput
                name='phone'
                value={values.phone}
                onChangeText={handleChange('phone')}
                placeholder='Mobile Number'
                onBlur={handleBlur('phone')}
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
                secureTextEntry={showPassword ? true : false}
                onBlur={handleBlur('password')}
              />
              <Icon
              name={showPassword ? 'eye-slash' : 'eye'}
              size={15}
              color="grey"
              onPress={() => this.setState({showPassword: !showPassword})}
              style={{position:'absolute', top:25, right:10}}
            />
              
              <ErrorMessage errorValue={touched.password && errors.password} style={{ paddingLeft:0}}/>
              </View>
            </View>
            <View style={styles.buttonContainer}>
            <FormButton
              buttonType='outline'
              onPress={handleSubmit}
              title='Login'
              textColor= '#ffffff'
              buttonColor='#687DFC'
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
            />
          </View>
          </React.Fragment>
          )}
        </Formik>
        <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',}}>
          <View>
            <Text style={{fontSize:18}}>Don't have an account?</Text>
          </View>
        <View>
        <Button
          title="Sign up now"
          onPress={this.goToSignup}
          titleStyle={{
            color: '#687DFC'
          }}
          type='clear'
        />
        </View>
        </View>
        {loading && <Loader />}
      </SafeAreaView>
    )
  }
}
