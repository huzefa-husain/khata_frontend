import React from 'react'
import { StyleSheet, Text, View, AsyncStorage, TouchableHighlight } from 'react-native'
import { Card, Icon } from 'react-native-elements'
import FormButton from '../components/FormButton'
import Loader from '../components/Loader'
import { api } from '../common/Api'
import { baseurl, dashboard } from '../common/Constant'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { withNavigation } from 'react-navigation';

const HeaderTitle = props => {
  return (
  <React.Fragment> 
    <Text>{props.title}</Text>
    {props.businessName && props.businessName !== "" ? <Text> | {props.businessName}</Text> : ''}
  </React.Fragment> 
  );
}



const Edit = (props) => {
  const navigation = props.nav;
  //console.log (props.type)
  return (
    <View>
        <Icon name={'edit'}
              type={'entypo'}
              size={20}
              color='#000'
              onPress={() => {
                navigation('AddKhata', {  
                  mode: 'edit',
                  typeid: props.type,
                  khataname: props.khataname,
                  businessname: props.businessName
                })
              }}
        />
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
                    <Text onPress={() => props.action(list.name,list.id,list.businessname,list.type)}>{list.name}</Text>
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
  constructor(props) {
    super(props);
    this.state = {
      //khataid:null,
      khataData:null,
      loading:false
    }
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerTitle: params ? <HeaderTitle title={params.screenTitle} businessName={params.businessName} /> : '' ,
      headerLeft: null,
      headerRight: params ? <React.Fragment> 
        <Edit nav={params.screenNav} type={params.typeId} khataname={params.screenTitle} businessName={params.businessName} khataId={params.khataId} /> 
        <DropDown action={params.dropButton} khatadata={params.screenData} nav={params.screenNav} /> 
        </React.Fragment> : ''
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

  setParam = async () => {
    this.props.navigation.setParams({ dropButton: this._dropButton });

    const value = await AsyncStorage.getItem('khataName');
    const businessname = await AsyncStorage.getItem('businessName');
    const typeID = await AsyncStorage.getItem('TypeId');
    const khataid = await AsyncStorage.getItem('KhataId');

    this.getDashboard(value, khataid, businessname, typeID);
    this.props.navigation.setParams({
      screenNav:this.props.navigation.navigate,
      businessName: businessname,
      screenTitle:value,
      typeId:typeID,
      khataId:khataid
    })
  }

  componentDidMount = async () => {
    this.displayStorage();
    this.focusListner = this.props.navigation.addListener("didFocus",() => {
      // Update your data
      this.setParam();
    });
  }

  componentWillUnmount() {
    // remove event listener
    this.focusListner.remove();
  }

  _dropButton = async (value, khataid, businessname, typeID) => {
    this.getDashboard(value, khataid, businessname, typeID);
  }

  getDashboard = async ( value, khataid, businessname,  typeID) => {
    const userToken = await AsyncStorage.getItem('userId');
    const getKhataId = await AsyncStorage.getItem('KhataId');
    const postBody = {
      userid:userToken,
      khataid: khataid,
    }
    this.setState({
      loading: true,
    });
    
    api(postBody, baseurl + dashboard, 'POST', null).then(async (response)=>{
      console.log(response);
      if (response.data) {
        this.setState({
          khataData: response.data.khatalist,
          loading:false
        });

        if (value !== undefined || khataid !== undefined || businessname !== undefined || typeID !== undefined) {
          await AsyncStorage.setItem('khataName', value);
          await AsyncStorage.setItem('businessName', businessname);
          await AsyncStorage.setItem('TypeId', typeID);
          await AsyncStorage.setItem('KhataId', khataid);

          const getKhataName = await AsyncStorage.getItem('khataName');
          const getBusinessName = await AsyncStorage.getItem('businessName');
          const getTypeId = await AsyncStorage.getItem('TypeId');
          const getKhataId = await AsyncStorage.getItem('KhataId');

          this.props.navigation.setParams({
            screenTitle: getKhataName,
            businessName: getBusinessName,
            typeId:getTypeId,
            khataId:getKhataId,
            screenData:this.state.khataData
          })
        } else {
          await AsyncStorage.setItem('khataName', response.data.khatalist[0].name);
          await AsyncStorage.setItem('businessName', response.data.khatalist[0].businessname);
          await AsyncStorage.setItem('TypeId', response.data.khatalist[0].type);
          await AsyncStorage.setItem('KhataId', response.data.khatalist[0].id);

          const getKhataName = await AsyncStorage.getItem('khataName');
          const getBusinessName = await AsyncStorage.getItem('businessName');
          const getTypeId = await AsyncStorage.getItem('TypeId');
          const getKhataId = await AsyncStorage.getItem('KhataId');

          this.props.navigation.setParams({
            screenTitle: getKhataName,
            businessName: getBusinessName,
            typeId:getTypeId,
            khataId:getKhataId,
            screenData:this.state.khataData
          })
        }
      }
      else {
        //alert (response.data.message)
      }
    }).catch(function (error) {
      console.log(error);
    });
  };

  signOutAsync = async () => {
    await AsyncStorage.removeItem('userId')
    this.props.navigation.navigate('Auth');
  };

  render() {
    const { khataData, khataName, loading } = this.state
    this.displayStorage();
    return (
      <React.Fragment>
        <View style={styles.container}> 
          <FormButton
            buttonType='outline'
            title='Sign Out'
            buttonColor='#F57C00'
            onPress={this.signOutAsync}
            //buttonStyle = {styles.button}
            //style={styles.button}
          />
        </View>
        {loading && <Loader />}
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
    marginTop:40
  },
})

export default withNavigation(Dashboard);
