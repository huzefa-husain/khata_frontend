import React, { Component, Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, Text, AsyncStorage } from 'react-native'
import { DatePicker } from 'native-base';
import moment from "moment";
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import ScreenHeader from '../components/ScreenHeader'
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

export default class AddAmount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      chosenDate: moment(new Date()).format("YYYY-MM-DD"),
      mode:this.props.navigation.getParam('mode','default'),
      data:this.props.navigation.getParam('items','default')
    }
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerTitle: params ? <ScreenHeader mode={params.screenEdit} title={'Amount'}/> : <React.Fragment></React.Fragment>,
      headerRight: params ? <Delete action={params.deleteButton} mode={params.screenEdit} /> : <React.Fragment></React.Fragment>,
      headerBackTitleVisible: false,
    }
  };

  componentDidMount () {
    this.props.navigation.setParams({ deleteButton: this._deleteButton });
    this.focusListner = this.props.navigation.addListener("didFocus",() => {
      this.props.navigation.setParams({
        screenEdit:this.state.mode,
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
    const { mode, data, loading, chosenDate } = this.state
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
                  <FormInput
                    name='amount'
                    value={values.amount}
                    onChangeText={handleChange('amount')}
                    placeholder='Enter Amount'
                    iconName='ios-phone-portrait'
                    iconColor='#2C384A'
                    onBlur={handleBlur('amount')}
                    keyboardType={'number-pad'}
                    returnKeyType={'next'}
                  //autoFocus
                  />
                  <ErrorMessage errorValue={touched.amount && errors.amount} />
                  <FormInput
                    name='notes'
                    value={values.notes}
                    onChangeText={handleChange('notes')}
                    placeholder='Notes'
                    iconName='md-person'
                    iconColor='#2C384A'
                    onBlur={handleBlur('notes')}
                  //autoFocus
                  />
                  <ErrorMessage errorValue={touched.notes && errors.notes} />
                  <DatePicker
                    defaultDate={new Date(2018, 4, 4)}
                    minimumDate={new Date(2018, 1, 1)}
                    maximumDate={new Date(2018, 12, 31)}
                    locale={"en"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    placeHolderText="Select date"
                    textStyle={{ color: "green" }}
                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                    onDateChange={this.setDate}
                    disabled={false}
                    formatChosenDate={date => {return moment(date).format('YYYY-MM-DD');}}
                    />
                    <Text>
                      Date: {chosenDate}
                    </Text>
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
