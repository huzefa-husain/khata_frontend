import React from 'react'
import { Input } from 'react-native-elements'
import { StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const FormInput = ({
  iconName,
  iconColor,
  returnKeyType,
  keyboardType,
  name,
  placeholder,
  ...rest
}) => (
  <View style={styles.inputContainer}>
    <Input
      {...rest}
      //leftIcon={<Ionicons name={iconName} size={28} color={iconColor} style={{padding:0}} />}
      leftIconContainerStyle={styles.iconStyle}
      placeholderTextColor='grey'
      name={name}
      placeholder={placeholder}
      keyboardType={keyboardType}
      returnKeyType={returnKeyType}
      underlineColorAndroid ='transparent'
      inputContainerStyle={{borderBottomWidth:0}}
    />
  </View>
)

const styles = StyleSheet.create({
  inputContainer: {
    //marginLeft:-10,
    //marginRight:-10,
    padding:0,
    borderWidth: 0
  },
  iconStyle: {
    //marginRight: 10
  }
})

export default FormInput
