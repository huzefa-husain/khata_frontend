import React, { Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, Text, AsyncStorage } from 'react-native'
import { Icon } from 'react-native-elements'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import { api } from '../common/Api'
import { baseurl, addkhata, editkhata, deletekhata } from '../common/Constant'

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

const ScreenHeader = props => {
  //console.log ('header',props.mode)
  return (
    <View>
    <Text>
      <h4>{props.mode === 'edit' ? 'Edit Khata' : 'Add New Khata'}</h4>
    </Text>
  </View>
  )
}

const Delete = props => {
  console.log ('delete',props.mode)
  return (
    <View>
      {<Icon name={'trash'} type={'entypo'} size={20} color='#000'
      onPress={() => {props.action()}}
      />}
    </View>
  )
}

export default class AddKhata extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      khataTypeID: this.props.navigation.getParam('typeid','default'),
      khataname: this.props.navigation.getParam('khataname','default'),
      businessname: this.props.navigation.getParam('businessname','default'),
      mode: this.props.navigation.getParam('mode','default'),
      loading:false
    }
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerTitle: params ? <ScreenHeader mode={params.screenEdit} /> : '',
      headerRight: params ? <Delete action={params.deleteButton} mode={params.screenEdit} /> : ''
    }
  };

  componentDidMount () {
    this.props.navigation.setParams({ deleteButton: this._deleteButton });
    this.props.navigation.setParams({
      screenEdit:this.state.mode,
    })
  }

  _deleteButton = async (value) => {
    /*const userToken = await AsyncStorage.getItem('userId');
    const apiurl = deletekhata
    const getKhataId = await AsyncStorage.getItem('KhataId');

    const postBody = {
      userid: userToken,
      khataid: getKhataId
    }
    console.log ('working')*/
    this.addKhata('delete');
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

  addKhata = async (values) => {
    console.log (values)

    let self = this;
    let apiurl
    let apimethod
    const userToken = await AsyncStorage.getItem('userId');
    const mode = this.props.navigation.getParam('mode','default')
    apiurl = mode === 'edit' ? editkhata : addkhata
    apimethod = mode === 'edit' ? 'PUT' : 'POST'
    const getKhataId = await AsyncStorage.getItem('KhataId');
    if (values === 'delete') { apiurl = deletekhata, apimethod = 'POST'}
    const addBody = {
      userid:userToken,
      name: values.name,
      businessname: this.state.khataTypeID === "2" ? values.business : '',
      type:this.state.khataTypeID,
      khataid:mode === 'edit' ? getKhataId : ''
    }
    const deleteBody = {
      userid:userToken,
      khataid:getKhataId
    }
    const body = values === 'delete' ?  deleteBody : addBody

    
    //console.log (postBody)
    this.setState({
      loading: true,
    });
    console.log (userToken,apiurl,body )
    api(body, baseurl + apiurl, apimethod, null).then(async (response)=>{
      if (response.data.success === 1) {
        console.log(response);
        await AsyncStorage.setItem('khataName', response.data.name);
        await AsyncStorage.setItem('businessName', response.data.businessname);
        await AsyncStorage.setItem('TypeId', response.data.type);
        await AsyncStorage.setItem('KhataId', response.data.id);
        //self.props.navigation.navigate('Dashboard')
        self.props.navigation.navigate('Dashboard', {  
          mode: 'edit',
        })
        this.setState({
          loading:false
        });
      }
      else {
        alert (response.data.message)
      }
      }).catch(function (error) {
      console.log(error);
    });
  }

  handleSubmit = async values  => {
    let self = this;
    //console.log (values)
    if (this.state.khataTypeID === "2" ? values.name.length > 0 && values.business.length > 0 : values.name.length > 0) {
      self.addKhata(values);
    }
  }

  render() {
    const { khataTypeID, khataname, businessname, mode, loading } = this.state
    this.displayStorage();
    //console.log ('khatatype',khatatype)
    //console.log ('khataTypeID',khataTypeID)
    return (
      <React.Fragment>
      <SafeAreaView style={styles.container}>
        <Formik
          initialValues={{
            name: mode === 'edit' ? khataname : '',
            business: mode === 'edit' ? businessname : '',
          }}
          onSubmit={values => {
            this.handleSubmit(values)
          }}
          validationSchema={khataTypeID !== "2" ? validationSchemaPersonal : validationSchema}>
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
              {khataTypeID === "2" ? 
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
  }
})
