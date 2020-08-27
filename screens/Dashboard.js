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
    {props.type && props.type !== "" ? <Text> | {props.type}</Text> : ''}
  </React.Fragment> 
  );
}



const Edit = (props) => {
  const navigation = props.nav;
  console.log (props.type)
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
                  khatatype: props.khatatype
                })
              }}
        />
    </View>
    
  )
}

const DropDown = props => {
  //console.log (props.action)
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
          </MenuOptions>
        </Menu>
    </React.Fragment>
  )
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      khataid:"9",
      khataData:null,
      khataName:null,
      khataType:null,
      loading:false
    }
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerTitle: params ? <HeaderTitle title={params.screenTitle} type={params.screenType} /> : '' ,
      headerLeft: null,
      headerRight: params ? <React.Fragment> 
        <Edit nav={params.screenNav} type={params.typeId} khataname={params.screenTitle} khatatype={params.screenType} /> 
        <DropDown action={params.dropButton} khatadata={params.screenData} /> 
        </React.Fragment> : ''
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({ dropButton: this._dropButton });
    this.getDashboard(this.state.khataid);
    this.props.navigation.setParams({
      screenNav:this.props.navigation.navigate,
    })
  }

  _dropButton = async (value, id, type, typeID) => {
    //console.log (type)

    await AsyncStorage.setItem('khataName', value);
    await AsyncStorage.setItem('khataType', type);
    await AsyncStorage.setItem('TypeId', typeID);

    const getKhataName = await AsyncStorage.getItem('khataName');
    const getkhataType = await AsyncStorage.getItem('khataType');
    const getTypeId = await AsyncStorage.getItem('TypeId');

    this.props.navigation.setParams({
      screenTitle: getKhataName,
      screenType: getkhataType,
      typeId:getTypeId
    })

    this.getDashboard(id);
  }

  getDashboard = async khataid => {
    const userToken = await AsyncStorage.getItem('userId');
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
          //khataName:response.data.khatalist[0].name,
          //khataType:response.data.khatalist[0].businessname
          loading:false
        });

        this.props.navigation.setParams({
          screenData:this.state.khataData
        })

        const getKhataName = await AsyncStorage.getItem('khataName');
        const getkhataType = await AsyncStorage.getItem('khataType');
        const getTypeId = await AsyncStorage.getItem('TypeId');

        if (getKhataName === null || getkhataType === null || getTypeId === null) {
          console.log ('from api',getTypeId)
          await AsyncStorage.setItem('khataName', response.data.khatalist[0].name);
          await AsyncStorage.setItem('khataType', response.data.khatalist[0].businessname);
          await AsyncStorage.setItem('TypeId', response.data.khatalist[0].type);
          this.props.navigation.setParams({
            screenTitle: getKhataName,
            screenType: getkhataType,
            typeId:getTypeId,
          })
        }

        this.props.navigation.setParams({
          screenTitle: getKhataName,
          screenType: getkhataType,
          typeId:getTypeId,
          screenData:this.state.khataData
        })
        //console.log(response.data);
      }
      else {
        //alert (response.data.message)
      }
    }).catch(function (error) {
      console.log(error);
    });
  };

  signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  render() {
    const { khataData, khataName, loading } = this.state
    //console.log (khataName)
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
