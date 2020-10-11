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
    padding: '25px',
    margin: 25,
    padding: 0,
    borderRadius: 5
  },
  inputDivider: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingTop:15
  }
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