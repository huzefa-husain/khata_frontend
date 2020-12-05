import { Left } from 'native-base'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0
  },
  buttonContainer: {
    margin: 25
  },
  boxcontainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 25,
    padding: 0,
    borderRadius: 5
  },
  boxcontainerspace: {
    margin: 25,
  },
  inputDivider: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingTop:15
  },
  commonSpace:{
    paddingLeft:20, paddingRight:20, backgroundColor:'#F5F5F5'
  },
  cardborder: {
    //borderWidth: 0,
  },
  amountDebit: {
    fontSize: 14,
    color: '#BD3642',
    textAlign:'right',
    fontWeight:'bold'
  },
  amountCredit: {
    fontSize: 14,
    color: '#008648',
    textAlign:'right',
    fontWeight:'bold'
  },
  title: {
    color: '#fff',
    textAlign:'left',
    fontSize:16
  },
  headerbg: {
    backgroundColor: '#fff'
  },
  inputContainer: {
    marginLeft: 15,
    marginRight: 15
  },
})

const buttons = StyleSheet.create({
  primary: {
    flex: 1,
    height: 70,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20
  }
})

export { styles, buttons }  