import React, { Component, Fragment } from 'react'
import { StyleSheet, SafeAreaView, View, Text, AsyncStorage, StatusBar } from 'react-native'
import { Header, Card, CardItem, Body, Right, Title, Subtitle, Left } from 'native-base';
import FormButton from '../components/FormButton'
import Loader from '../components/Loader'
import { api } from '../common/Api'
import { baseurl, getuseramount, getcurrency } from '../common/Constant'

const ScreenRight = props => {
  const textDebit = "They'll Pay"
  const textCredit = "They'll Recieve"
  return (
    <View>
      {props.details &&
        <View>
          <Text style={props.details.amountType === "Pay" ? styles.amountDebit : styles.amountCredit}>{props.details.amount !== null ? props.details.amount + getcurrency : ''}</Text>
          {props.details.amountType !== null ? <React.Fragment>
            <Text>
              {props.details.amountType === "Pay" ? textDebit : textCredit}
            </Text>
          </React.Fragment> : <React.Fragment></React.Fragment>}
        </View>
      }
    </View>
  )
}

const ScreenLeft = props => {
  const navigation = props.nav;
  const editscreen = () => {
    return (
      navigation('AddContact', { 
        name: props.details.name, 
        phone:props.details.phone, 
        contactid:props.contactid,
        countrycode:props.details.countrycode,
        address:props.details.address,
        mode:'edit'
      })
    )
  }

  const back = () => {
    return (
      navigation('Dashboard')
    )
  }
  
  return (
    <View style={{flex: 1, flexDirection: 'row',justifyContent: 'space-between'}}>
        <View style={{flex: 1, alignItems: 'flex-start'}}>
          <Text onPress={back}>Back</Text>
        </View>
        <View>
        <Title onPress={editscreen} style={styles.title}>
              {props.details.name}
        </Title>
        <Subtitle onPress={editscreen} style={styles.title}>{props.details.countrycode + props.details.phone}</Subtitle> 
        </View>
    </View>

  )
}
const AmountButtons = (props) => (
  <View style={{ flexDirection: 'row' }}>
    <Left>
      <FormButton
        buttonType='outline'
        title='You Gave'
        buttonColor='#bd0d0d'
        onPress={() => props.navigation.navigate('AddAmount', { type: '1', contactid:props.getContactId })}
      //loading={isSubmitting}
      />
    </Left>
    <Right>
      <FormButton
        buttonType='outline'
        title='You Got'
        buttonColor='#6bbd0d'
        onPress={() => props.navigation.navigate('AddAmount', { type: '2', contactid:props.getContactId })}
      //loading={isSubmitting}
      />
    </Right>
  </View>
)

export default class GetUserAmount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      contactAmount: null
    }
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerLeft: params && params.contactDetails ? <ScreenLeft details={params.contactDetails} contactid={params.contactid} nav={params.screenNav}/> : <React.Fragment></React.Fragment>,

      headerRight: params && params.contactDetails ? <ScreenRight details={params.contactDetails} contactid={params.contactid} nav={params.screenNav}/> : <React.Fragment></React.Fragment>,
    }
  };

  componentDidMount() {
    this.focusListner = this.props.navigation.addListener("didFocus",() => {
      this.props.navigation.setParams({ dropButton: this._dropButton });
      // Update your data
      this.getAmount();
    });
  }

  getAmount = async (values) => {
    console.log(values)
    let self = this;
    const userToken = await AsyncStorage.getItem('userId');
    const apiurl = getuseramount
    const apimethod = 'POST'
    const getKhataId = await AsyncStorage.getItem('KhataId');
    const getContactId = this.props.navigation.getParam('id', 'default')
    const addBody = {
      userid: userToken,
      khataid: getKhataId,
      contactid: getContactId,
    }

    console.log(addBody)
    this.setState({
      loading: true,
    });
    console.log(addBody)
    api(addBody, baseurl + apiurl, apimethod, null).then(async (response) => {
      if (response.data.success === 1) {
        console.log(response);
        /*self.props.navigation.navigate('Dashboard', {
          //mode: 'edit',
        })*/
        this.setState({
          loading: false,
          contactAmount: response.data.contactamount
        });
        this.props.navigation.setParams({
          contactDetails:response.data.contactdetails,
          contactName: response.data.contactdetails.name,
          contactNumber: response.data.contactdetails.phone,
          contactAmount: response.data.contactdetails.amount,
          amountType: response.data.contactdetails.amountType,
          contactid:getContactId,
          screenNav:this.props.navigation.navigate
        })
      }
      else {
        this.setState({
          loading: false
        });
        alert(response.data.message)
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  handleSubmit = async values => {
    let self = this;
    if (values.notes.length > 0 && values.amount.length > 0) {
      self.getAmount(values);
    }
  }

  onValueChange(value) {
    this.setState({
      selected: value
    });
  }

  render() {
    const { loading, contactAmount } = this.state
    return (
      <React.Fragment>
        <SafeAreaView style={styles.container}>
          {contactAmount && contactAmount.length > 0 ? <Card style={styles.cardborder}>
            {contactAmount && contactAmount.map((items, i) => {
              return (
                <CardItem button key={i} onPress={() => this.props.navigation.navigate('AddAmount', { 
                  items:items,
                  mode:'edit'
                })}>
                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center',alignItems: 'flex-end'}}>
                      <Text style={styles.amount}>{items.amount}</Text>
                      <Text>{items.createddate}</Text>
                      <Text>{items.note}</Text>
                    </View>
                </CardItem>
              );
            })}
          </Card> :

            <View>
              <Text>No Records Found</Text>
            </View>
          }
          <AmountButtons navigation={this.props.navigation} getContactId={this.props.navigation.getParam('id', 'default')} />
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
  },
  cardborder: {
    borderWidth: 0
  },
  amountDebit: {
    fontSize: 20,
    color: 'red'
  },
  amountCredit: {
    fontSize: 20,
    color: 'green'
  },
  title: {
    color: 'black'
  },
  headerbg: {
    backgroundColor: '#fff'
  }
})
