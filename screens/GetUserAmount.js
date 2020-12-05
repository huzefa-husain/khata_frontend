import React, { Component } from 'react'
import { View, Text, AsyncStorage, TouchableOpacity } from 'react-native'
import { Card, CardItem, Right, Title, Subtitle, Left, Icon, ListItem, Body } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { styles } from '../common/styles'
import FormButton from '../components/FormButton'
import Loader from '../components/Loader'
import { api } from '../common/Api'
import { baseurl, getuseramount, getcurrency } from '../common/Constant'

const ScreenRight = props => {
  //console.log (props)
  const textDebit = "You will get"
  const textCredit = "You will give"
  return (
    <View>
      {props.details &&
        <View style={{ flexDirection: "row", marginLeft: 16, marginRight: 16, marginTop: 5,marginBottom: 5,padding: 20,backgroundColor: '#ffffff', borderRadius:3}}>
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'left'}}>
        {props.details.amountType !== null ? <React.Fragment>
            <Text style={{fontWeight:'bold'}}>
             {props.details.amountType === "Pay" ? textDebit : textCredit}
            </Text>
          </React.Fragment> : <React.Fragment></React.Fragment>}
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end', alignContent: 'right' }}>
          <Text style={props.details.amountType === "Pay" ? styles.amountDebit : styles.amountCredit}>{props.details.amount !== null ? props.details.amount + ' ' + getcurrency : ''}</Text>
        </View>
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
        <View style={{flex: 1, alignItems: 'flex-start', marginLeft:15, marginTop:13, marginRight:10}}>
        <TouchableOpacity onPress={back}>
          <Icon type="FontAwesome" name="arrow-left" style={{color:'#fff', fontSize:18}}/>
        </TouchableOpacity>
        </View>
        <View>
        <Title onPress={editscreen} style={styles.title}>
            {props.details.name}
        </Title>
        <Subtitle onPress={editscreen} style={[styles.title, {fontSize:15}]}>{props.details.countrycode + props.details.phone}</Subtitle> 
        </View>
    </View>

  )
}
const AmountButtons = (props) => (
  <View style={{ flexDirection: 'row' }}>
    <Left>
      <View style={{width:'95%'}}>
        <FormButton
          buttonType='outline'
          title='YOU GAVE'
          textColor="#fff"
          fontSize={12}
          buttonColor='#BD3642'
          onPress={() => props.navigation.navigate('AddAmount', { type: '1', contactid:props.getContactId, color:'#BD3642' })}
        //loading={isSubmitting}
        />
      </View>
    </Left>
    <Right>
      <View style={{width:'95%'}}>
        <FormButton
          buttonType='outline'
          title='YOU GOT'
          textColor="#fff"
          buttonColor='#008648'
          fontSize={12}
          onPress={() => props.navigation.navigate('AddAmount', { type: '2', contactid:props.getContactId, color:'green' })}
        //loading={isSubmitting}
        />
      </View>
    </Right>
  </View>
)

export default class GetUserAmount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      contactAmount: null,
      contactDetails: null
    }
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerLeft: params && params.contactDetails ? <ScreenLeft details={params.contactDetails} contactid={params.contactid} nav={params.screenNav}/> : <React.Fragment></React.Fragment>,
      headerStyle: {
        backgroundColor: '#687DFC',
        borderBottomWidth: 0,
        shadowColor: 'transparent',
        paddingTop:10,
        paddingBottom:10
      },
      headerBackTitleVisible: false,
      headerBackTitle: null,
      //headerRight: params && params.contactDetails ? <ScreenRight details={params.contactDetails} contactid={params.contactid} nav={params.screenNav}/> : <React.Fragment></React.Fragment>,
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
    //console.log(values)
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

    //console.log(addBody)
    this.setState({
      loading: true,
    });
    //console.log(addBody)
    api(addBody, baseurl + apiurl, apimethod, null).then(async (response) => {
      if (response.data.success === 1) {
        console.log(response);
        /*self.props.navigation.navigate('Dashboard', {
          //mode: 'edit',
        })*/
        this.setState({
          loading: false,
          contactAmount: response.data.contactamount,
          contactDetails: response.data.contactdetails
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
    const { loading, contactAmount, contactDetails } = this.state
    const getContactId = this.props.navigation.getParam('id', 'default')
    return (
      <React.Fragment>
          <View style={[styles.container]}>
          {contactAmount && contactAmount.length > 0 ? <React.Fragment> 
          <View style={{backgroundColor:'#687DFC', paddingBottom:20, paddingTop:20}}>
            <ScreenRight details={contactDetails} contactid={getContactId} />
          </View>
          <View style={[styles.commonSpace]}>
          {/*<Card style={[styles.cardborder]}>
            {contactAmount && contactAmount.map((items, i) => {
              return (
                <View style={{marginBottom:5, marginTop:5}}>
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
                </View>
              );
            })}
          </Card>*/}
          <View style={{flexDirection: 'row',justifyContent: 'space-between', paddingTop:15, paddingBottom:15}}>
            <View style={{width:'40%'}}>
                <Text style={{fontSize:14}}>ENTRIES</Text>
            </View>
            <View style={{width:'30%'}}>
              <Text style={{fontSize:14, textAlign:'center'}}>YOU GAVE</Text>
            </View>
            <View style={{width:'30%'}}>
              <Text style={{fontSize:14, textAlign:'center'}}>YOU GOT</Text>
            </View>
          </View>
          {contactAmount && contactAmount.map((items, i) => {
              console.log (items.type === "2" ? 'credit' : 'debit')
              return (
                <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('AddAmount', { 
                  items:items,
                  mode:'edit'
                })}>
                <View key={i} style={{paddingTop:15, paddingBottom:15, backgroundColor: '#fff',shadowOpacity: 0.22,shadowRadius: 2.22,shadowColor: "#000",elevation: 3,shadowOffset: {width: 0,height: 1,}, marginBottom:10}}>
                {
                  <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
                  <View style={{width:'40%', paddingLeft:15}}>
                      <Text style={{fontSize:14}}>{items.createddate}</Text>
                  </View>
                  <View style={{width:'30%'}}>
                    <Text style={items.type === "2" ? {color:'red',textAlign:'center' } : {color:'green'}}>
                        {items.type === "2" ? items.amount : ''}
                    </Text>
                  </View>
                  <View style={{width:'30%'}}>
                    <Text style={items.type === "2" ? {color:'red'} : {color:'green', textAlign:'center'}}>
                        {items.type === "1" ? items.amount : ''}
                    </Text>
                  </View>
                </View>
                }
                </View>
                </TouchableOpacity>
              );
            })}
            {/*contactAmount && contactAmount.map((items, i) => {
              return (
                <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('AddAmount', { 
                  items:items,
                  mode:'edit'
                })}>
                <Card  style={{paddingBottom:5, paddingTop:5, borderRadius:5}}>
                <View style={{marginBottom:5, marginTop:5}}>
                <CardItem>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center',alignItems: 'flex-end'}}>
                      <Text>{items.createddate}</Text>
                      <Text style={styles.amount}>{items.amount}</Text>
                      {<Text>{items.note}</Text>}
                    </View>
                </CardItem>
                </View>
                </Card>
                </TouchableOpacity>
              );
            })*/}
          
          
          </View></React.Fragment> :

            <View style={[styles.commonSpace, {justifyContent: 'center', flex:1, alignItems:'center'}]}>
              <Text>No transactions for contact</Text>
              <Text style={{fontWeight:'bold', paddingTop:5}}>add a few</Text>
            </View>
          }
          </View>
          <View style={{ marginTop:30, marginBottom:20, borderTopColor:'#ddd', borderTopWidth:1}}>
            <View style={[styles.commonSpace, {paddingTop:20}]}>
              <AmountButtons navigation={this.props.navigation} getContactId={this.props.navigation.getParam('id', 'default')} />
            </View>
          </View>
        {loading && <Loader />}
      </React.Fragment>
    )
  }
}
