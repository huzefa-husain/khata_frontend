import React from 'react'
import { Input } from 'react-native-elements'
import { StyleSheet, View, TextInput } from 'react-native'
import { Icon } from 'native-base';

const DebouncedInput = ({
  iconName,
  iconColor,
  returnKeyType,
  keyboardType,
  name,
  placeholder,
  debounceTime,
  callback,
  font,
  ...rest
}) => {
  let debounceTimer = null
  return (
  <View style={styles.inputContainer}>
    <TextInput
      {...rest}
      //leftIcon={<Icon type="FontAwesome" name="search" color={iconColor}/>}
      leftIconContainerStyle={styles.iconStyle}
      placeholderTextColor='white'
      name={name}
      placeholder={placeholder}
      keyboardType={keyboardType}
      returnKeyType={returnKeyType}
      style={{fontSize:14, borderRadius:7, backgroundColor:'#5367E3', padding:10}}
      onChange={(event) => {
        debounceTimer = setTimeout(
          callback.bind(null, event.target.value), 
          debounceTime
        )
      }}
    />
  </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    margin: 15
  },
  iconStyle: {
    marginRight: 10,
  },
  input:{
    //fontSize:12
  }
})

export default DebouncedInput
