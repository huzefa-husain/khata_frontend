import React from 'react'
import { StyleSheet, Text, View, AsyncStorage, TouchableOpacity } from 'react-native'
import { styles } from '../common/styles'
import { Icon } from 'react-native-elements'
import FormButton from '../components/FormButton'
import Loader from '../components/Loader'
import ContactList from '../components/ContactList'
import DebouncedInput from '../components/DebouncedInput';
import { api } from '../common/Api'
import { baseurl, dashboard, getsearch } from '../common/Constant'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const HeaderTitle = props => {
  return (
    <React.Fragment> 
    <Text>{props.title}</Text>
    {props.businessName && props.businessName !== "" ? <Text> | {props.businessName}</Text> : <Text></Text>}
    </React.Fragment>
  );
}

const Edit = (props) => {
  const navigation = props.nav;
  //console.log (props.type)
  return (
    <View>
        <TouchableOpacity style={{flexDirection:"row"}} onPress={() => {
                navigation('AddKhata', {  
                  mode: 'edit',
                  typeid: props.type,
                  khataname: props.khataname,
                  businessname: props.businessName
                })
              }}>
        <Text>Edit</Text>
        <Icon name={'edit'}
              type={'entypo'}
              size={20}
              color='#000'
              
        />
        </TouchableOpacity>
    </View>
    
  )
}

const DropDown = props => {
  //console.log (props.action)
  const navigation = props.nav;
  return (
    <React.Fragment>
        <Menu /*onSelect={(value)  => props.action(value)}*/>
          <MenuTrigger>
          <Icon
            name={'dots-three-vertical'}
            type={'entypo'}
            size={20}
            color='#000'
            />
          </MenuTrigger>
          <MenuOptions optionsContainerStyle={{ marginTop: 40 }} >
            {
              props.khatadata && props.khatadata.map((list, i) => {
                return (
                  <MenuOption key={i} value={list.name}>
                    <Text onPress={() => 
                      props.action(list.name,list.id,list.businessname,list.type)
                      }>{list.name}</Text>
                  </MenuOption>
                );
              })
            }
            <MenuOption>
              <FormButton buttonType='outline' title='Add Khata' buttonColor='#F57C00' onPress={() => {
                navigation('Home') }}
              />
            </MenuOption>
          </MenuOptions>
        </Menu>
    </React.Fragment>
  )
}

class Dashboard extends React.Component {
  debounceTimer = null;
  constructor(props) {
    super(props);
    this.state = {
      khataContact:null,
      khataData:null,
      totalAmount:null,
      loading:false
    }
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerTitle: params ? <HeaderTitle title={params.screenTitle} businessName={params.businessName} /> : <React.Fragment></React.Fragment> ,
      headerLeft: null,
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: '#687DFC',
        borderBottomWidth: 0,
        shadowColor: 'transparent'
      },
      headerRight: params ? <React.Fragment> 
        <Edit nav={params.screenNav} type={params.typeId} khataname={params.screenTitle} businessName={params.businessName} khataId={params.khataId} /> 
        <DropDown action={params.dropButton} khatadata={params.screenData} nav={params.screenNav} /> 
        </React.Fragment> : <React.Fragment></React.Fragment>
      }
  };

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

  componentDidMount () {
    //this.displayStorage();
    this.focusListner = this.props.navigation.addListener("didFocus",() => {
      this.props.navigation.setParams({ dropButton: this._dropButton });
      // Update your data
      this.multiGet();
    });
  }

  /*componentWillUnmount() {
    // remove event listener
    this.focusListner.remove();
  }*/

  multiGet = () => {
    AsyncStorage.multiGet(["khataName", "KhataId", "businessName", "TypeId", ]).then(response => {
      let value = response[0][1]
      let khataid = response[1][1]
      let businessname = response[2][1]
      let typeID = response[3][1]
      //console.log(response)
      //console.log(value, khataid, businessname, typeID)
      this.getDashboard(value, khataid, businessname, typeID);
    }).catch(function (error) {
      console.log(error);
    });
  }

  setParam = async (value, khataid, businessname, typeID, khatadata) => {
    const items = [['khataName', value], ['KhataId', khataid], ['businessName', businessname], ['TypeId', typeID], ]
      AsyncStorage.multiGet(items).then(response => {  
        const getKhataName = response[0][0][1];
        const getKhataId= response[1][0][1]
        const getBusinessName = response[2][0][1]
        const getTypeId = response[3][0][1]

        this.props.navigation.setParams({
            screenTitle: getKhataName,
            businessName: getBusinessName,
            typeId:getTypeId,
            khataId:getKhataId,
            screenData:khatadata,
            screenNav:this.props.navigation.navigate
        })
    }).catch(function (error) {
      console.log(error);
    });
  }

  _dropButton = async (value, khataid, businessname, typeID) => {
    this.getDashboard(value, khataid, businessname, typeID);
  }

  getDashboard = async ( value, khataid, businessname,  typeID) => {
    const userToken = await AsyncStorage.getItem('userId');
    const postBody = {
      userid:userToken,
      khataid: khataid,
    }
    this.setState({
      loading: true,
    });
    
    api(postBody, baseurl + dashboard, 'POST', null).then(async (response)=>{
      //console.log('dashboard',response);
      if (response.data.dashboard !== 0) {
        this.setState({
          khataData: response.data.khatalist,
          khataContact:response.data.contactlist,
          totalAmount:response.data.totalamount[0],
          loading:false
        });

        if (
          value !== undefined || khataid !== undefined || businessname !== undefined || typeID !== undefined ||
          value !== null || khataid !== null || businessname !== null || typeID !== null
          ) {
          this.setParam(value, khataid, businessname, typeID, this.state.khataData);
          
        } else {
          const value = response.data.khatalist[0].name
          const businessname = response.data.khatalist[0].businessname
          const typeID = response.data.khatalist[0].type
          const khataid = response.data.khatalist[0].id

          this.setParam(value, khataid, businessname, typeID, this.state.khataData);
        }
      }
      else {
        this.props.navigation.navigate('Home');
        console.log (response.data.message)
      }
    }).catch(function (error) {
      console.log(error);
    });
  };

  getSuggestions = async (searchTerm) => {
    const userToken = await AsyncStorage.getItem('userId');
    //console.log(searchTerm)
    api(null, baseurl + getsearch + searchTerm + '&' + 'user=' + userToken, 'GET', null).then((response)=>{
      console.log(response);
      this.setState({
        khataContact:response.data.contactlist,
      });
    }).catch(function (error) {
      console.log(error);
    });
  }

  render() {
    const { loading, khataContact, totalAmount } = this.state
    //this.displayStorage();
    return (
      <React.Fragment>
        <View style={styles.container}>
          <View style={{backgroundColor:'#687DFC'}}>
            <DebouncedInput debounceTime={1000} callback={this.getSuggestions} placeholder='Search' Font={'12'}/>
          </View>
          <View style={{paddingLeft:20, paddingRight:20}}>
            <ContactList data={khataContact} navigation={this.props.navigation} contactCount={totalAmount && totalAmount.contactcount} />
          </View>
          <View style={{ paddingLeft:20, paddingRight:20, marginTop:30}}>
          <FormButton
            buttonType='outline'
            title='+ Add Customer'
            buttonColor='#687DFC'
            textColor='#ffffff'
            onPress={() => {
              this.props.navigation.navigate('AddContact')
            }}
          />
          </View>
          
        </View>
        {loading && <Loader />}
      </React.Fragment>
    )
  }
}

export default Dashboard;