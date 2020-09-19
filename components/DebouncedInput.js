import React from 'react'
import { Input } from 'react-native-elements'
import { StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const DebouncedInput = ({
  iconName,
  iconColor,
  returnKeyType,
  keyboardType,
  name,
  placeholder,
  debounceTime,
  callback,
  ...rest
}) => {
  let debounceTimer = null
  return (
  <View style={styles.inputContainer}>
    <Input
      {...rest}
      leftIcon={<Ionicons name={iconName} size={28} color={iconColor} />}
      leftIconContainerStyle={styles.iconStyle}
      placeholderTextColor='grey'
      name={name}
      placeholder={placeholder}
      keyboardType={keyboardType}
      returnKeyType={returnKeyType}
      style={styles.input}
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
    marginRight: 10
  }
})

export default DebouncedInput
