import React from 'react'
import { StyleSheet, Text, View, AsyncStorage, ActivityIndicator } from 'react-native'
import { Card, Icon } from 'react-native-elements'
import FormButton from '../components/FormButton'
import { api } from '../common/Api'
import { baseurl, dashboard } from '../common/Constant'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';

const HeaderTitle = props => {
  return (
  <React.Fragment> 
    <Text>{props.title}</Text>
    <Text>{props.type}</Text>
  </React.Fragment> 
  );
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
              props.khatadata && props.khatadata.map((u, i) => {
                return (
                  <MenuOption key={i} value={u.name}>
                    <Text onPress={() => props.action(u.name,u.id)}>{u.name}</Text>
                  </MenuOption>
                );
              })
            }
          </MenuOptions>
        </Menu>
    </React.Fragment>
  )
}

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      khataid:"9",
      khataData:null,
      khataName:null,
      khataType:null,
      toggle: false,
    }
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerTitle: params ? <HeaderTitle title={params.screenTitle} type={params.screenType} /> : <ActivityIndicator /> ,
      headerLeft: null,
      headerRight: params ? <DropDown action={params.dropButton} khatadata={params.screenData} /> : <ActivityIndicator />      
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({ dropButton: this._dropButton });
    this.getDashboard(this.state.khataid);
  }

  _dropButton = async (value, id) => {
    console.log (id)

    await AsyncStorage.setItem('khataName', value);
    //await AsyncStorage.setItem('khataType', response.data.khatalist[0].businessname);

    const getKhataName = await AsyncStorage.getItem('khataName');
    //const getkhataType = await AsyncStorage.getItem('khataType'); 

    this.props.navigation.setParams({
      screenTitle: getKhataName,
    })
    this.setState({
      toggle: !this.state.toggle,
    });
    this.getDashboard(id);
  }

  getDashboard = async khataid => {
    const userToken = await AsyncStorage.getItem('userId');
    const postBody = {
      userid:userToken,
      khataid: khataid,
    }
    api(postBody, baseurl + dashboard, 'POST', null).then(async (response)=>{
      console.log(response);
      if (response.data) {
        this.setState({
          khataData: response.data.khatalist,
          //khataName:response.data.khatalist[0].name,
          //khataType:response.data.khatalist[0].businessname
        });

        this.props.navigation.setParams({
          screenData:this.state.khataData
        })

        const getKhataName = await AsyncStorage.getItem('khataName');
        const getkhataType = await AsyncStorage.getItem('khataType'); 

        if (!getKhataName && !getkhataType) {
          await AsyncStorage.setItem('khataName', response.data.khatalist[0].name);
          await AsyncStorage.setItem('khataType', response.data.khatalist[0].businessname);
          this.props.navigation.setParams({
            screenTitle: getKhataName,
            screenType: getkhataType,
          })
        }

        this.props.navigation.setParams({
          screenTitle: getKhataName,
          screenType: getkhataType,
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
    const { khataData, khataName, toggle } = this.state
    //console.log (khataName)
    return (
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
  }
})
