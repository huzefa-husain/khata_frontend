import React, { Component, Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, Text, AsyncStorage } from 'react-native'
import { DatePicker } from 'native-base';
import moment from "moment";
import { Formik } from 'formik'
import * as Yup from 'yup'
import { styles } from '../common/styles'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
//import ScreenHeader from '../components/ScreenHeader'
import Delete from '../components/Delete'
import Loader from '../components/Loader'
import { api } from '../common/Api'
import { baseurl, addamount, editamount, deleteamount } from '../common/Constant'

const validationSchema = Yup.object().shape({
  notes: Yup.string()
    .label('notes')
    .min(1, 'Must have at least 1 characters'),
  amount: Yup.number().min(1, 'Must have at least 1 characters'),
})

const colorRed = '#BD3642'
const colorGreen = '#008648'

const ScreenHeader = ({title,screenColor}) => (
  <View>
      <React.Fragment>
        <Text style={{fontWeight:'bold', color:screenColor}}>{title}</Text>
      </React.Fragment>
  </View>
)

export default class AddAmount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      chosenDate: moment(new Date()).format("YYYY-MM-DD"),
      mode:this.props.navigation.getParam('mode','default'),
      data:this.props.navigation.getParam('items','default'),
      formcolorprop:this.props.navigation.getParam('type','default')
    }
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerTitle: params ? <ScreenHeader screenColor={params.screenColor === '1' ? colorRed : colorGreen} title={params.screenColor === '1' ? 'YOU GAVE' : 'YOU GOT'} /> : <React.Fragment></React.Fragment>,
      headerRight: params ? <Delete action={params.deleteButton} mode={params.screenEdit} /> : <React.Fragment></React.Fragment>,
      headerBackTitleVisible: false,
      headerTintColor: params.screenColor === '1' ? colorRed : colorGreen
    }
  };

  componentDidMount () {
    this.props.navigation.setParams({ deleteButton: this._deleteButton });
    this.focusListner = this.props.navigation.addListener("didFocus",() => {
      this.props.navigation.setParams({
        screenEdit:this.state.mode,
        screenColor:this.state.formcolorprop
      })
      console.log ('items',this.state.data)
    });
  }

  _deleteButton = () => {
    this.addAmount('delete');
  }

  addAmount = async (values) => {
    const { mode, data } = this.state
    let self = this;
    let apiurl
    let apimethod
    const userToken = await AsyncStorage.getItem('userId');
    const getKhataId = await AsyncStorage.getItem('KhataId');
    const getContactId = this.props.navigation.getParam('contactid','default')
    const getType = this.props.navigation.getParam('type','default')

    apiurl = mode === 'edit' ? editamount : addamount
    apimethod = mode === 'edit' ? 'PUT' : 'POST'
    
    if (values === 'delete') { apiurl = deleteamount, apimethod = 'POST'}

    const addBody = {
      userid: userToken,
      khataid: getKhataId,
      contactid: getContactId,
      type: getType,
      amount: values.amount,
      notes:values.notes,
      trndate:this.state.chosenDate
    }

    const deleteBody = {
      tranid:data.id,
    }

    const editBody = {
      tranid : data.id,
      type : data.type,
      amount : values.amount,
      notes: values.notes,
      trndate:this.state.chosenDate
    }
    
    const body = values === 'delete' ?  deleteBody : mode === 'edit' ? editBody : addBody

    this.setState({ loading: true });
    api(body, baseurl + apiurl, apimethod, null).then(async (response) => {
      if (response.data.success === 1) {
        console.log(response);
        self.props.navigation.navigate('GetUserAmount')
        this.setState({ loading: false });
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

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  render() {
    const { mode, data, loading, chosenDate, formcolorprop } = this.state
    const colorCode = formcolorprop === '1' ? colorRed : colorGreen
    return (
      <React.Fragment>
        <SafeAreaView style={styles.container}>
          <Formik
            initialValues={{
              notes: mode === 'edit' ? data.note : '',
              amount: mode === 'edit' ? data.amount : '',
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
                  <View style={styles.boxcontainerspace}>
                    <View style={{borderColor: '#ccc',borderWidth: 1,paddingTop:8, paddingBottom:8}}>
                      <FormInput
                        name='amount'
                        value={values.amount}
                        onChangeText={handleChange('amount')}
                        placeholder='00 KD'
                        iconName='ios-phone-portrait'
                        iconColor='#2C384A'
                        onBlur={handleBlur('amount')}
                        keyboardType={'number-pad'}
                        returnKeyType={'next'}
                        placeholderTextColor={colorCode}
                        //autoFocus
                      />
                    </View>
                  <ErrorMessage errorValue={touched.amount && errors.amount} />
                  <View style={{borderColor: '#ccc',borderWidth: 1,paddingTop:8, paddingBottom:8}}>
                    <FormInput
                      name='notes'
                      value={values.notes}
                      onChangeText={handleChange('notes')}
                      placeholder='Enter Notes'
                      iconName='md-person'
                      iconColor='#2C384A'
                      onBlur={handleBlur('notes')}
                    //autoFocus
                    />
                  </View>
                  <ErrorMessage errorValue={touched.notes && errors.notes} />
                  <View style={{borderColor: '#ccc',borderWidth: 1,paddingTop:8, paddingBottom:8}}>
                    <DatePicker
                      defaultDate={new Date(2018, 4, 4)}
                      minimumDate={new Date(2018, 1, 1)}
                      maximumDate={new Date(2018, 12, 31)}
                      locale={"en"}
                      timeZoneOffsetInMinutes={undefined}
                      modalTransparent={false}
                      animationType={"fade"}
                      androidMode={"default"}
                      placeHolderText="Enter Date"
                      textStyle={{ color: "green" }}
                      placeHolderTextStyle={{ color: "#ACACAC", fontSize:18 }}
                      onDateChange={this.setDate}
                      disabled={false}
                      formatChosenDate={date => {return moment(date).format('YYYY-MM-DD');}}
                      />
                  </View>
                    <Text>
                      Date: {chosenDate}
                    </Text>
                  
                  </View>
                  <View style={styles.buttonContainer}>
                    <FormButton
                      buttonType='outline'
                      onPress={handleSubmit}
                      title='Save'
                      textColor= '#ffffff'
                      buttonColor={colorCode}
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

/*const styles = StyleSheet.create({
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
})*/
