import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import { Icon } from 'native-base';
import FormButton from '../components/FormButton'
import CommonHeader from '../components/CommonHeader'

export default class Home extends React.Component {

  addKhata = async (type) => {
    //console.log (type)
    //this.props.navigation.navigate('AddKhata');
    this.props.navigation.navigate('AddKhata', {  
      typeid: type 
    })  
  };
  render() {
    return (
      <View>
        <CommonHeader />
        <View style={{marginLeft:25, marginTop:25, marginBottom:25}}>
            <Text style={{fontWeight:'bold',paddingBottom:5,fontSize:28}}>Choose a type,</Text>
            <Text style={{paddingBottom:5,fontSize:28 }}>Select your account</Text>
            <Text style={{fontSize:28 }}>type</Text>
        </View>  
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress ={() => this.addKhata('2')}>
          <View style={{borderColor:'#ccc', borderWidth:1, borderRadius:5, backgroundColor:'#fff', padding:20}}>
            <View style={{flexDirection:'row'}}>
              <View style={{backgroundColor:'#687DFC', padding:20, width:'25%', alignItems:'center'}}>
                  <Icon type="FontAwesome" name="building" style={{color:'#fff', fontSize:30}}/>
              </View>
              <View style={{width:'60%', alignItems:'flex-start', paddingLeft:10, paddingTop:10}}>
              <Text style={{fontSize:16, fontWeight:'bold'}}>Business</Text>
              <Text style={{fontSize:9}}>Business book comes with some advance business specific features.</Text>
              </View>
              <View style={{width:'20%', alignItems:'flex-end', paddingTop:15}}>
                <Icon type="FontAwesome" name="arrow-right" style={{color:'#687DFC', fontSize:30}}/>
              </View>
            </View>
          
          </View>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity onPress ={() => this.addKhata('1')}>
          <View style={{borderColor:'#ccc', borderWidth:1, borderRadius:5, backgroundColor:'#fff', padding:20}}>
            <View style={{flexDirection:'row'}}>
              <View style={{backgroundColor:'#687DFC', padding:20, width:'25%', alignItems:'center'}}>
                  <Icon type="FontAwesome" name="user" style={{color:'#fff', fontSize:30}}/>
              </View>
              <View style={{width:'60%', alignItems:'flex-start', paddingLeft:10, paddingTop:10}}>
              <Text style={{fontSize:16, fontWeight:'bold'}}>Personal</Text>
              <Text style={{fontSize:9}}>Personal book to maintain transactions of your home, family and friends.</Text>
              </View>
              <View style={{width:'20%', alignItems:'flex-end', paddingTop:15}}>
                <Icon type="FontAwesome" name="arrow-right" style={{color:'#687DFC', fontSize:30}}/>
              </View>
            </View>
          
          </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    marginBottom: 25,
    paddingLeft:20,
    paddingRight:20,
    maxWidth:'100%',
    justifyContent: 'center',
  },
  button: {
    marginBottom: 25,
    width:'50%',
    alignSelf: 'center'
  }
})
