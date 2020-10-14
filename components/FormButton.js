import React from 'react'
import { Button } from 'react-native-elements'

const FormButton = ({ title, buttonType, buttonColor,textColor,buttonstate, ...rest }) => {
  return (
    <Button
    {...rest}
    type={buttonType}
    title={title}
    buttonStyle={{ borderColor: buttonColor, borderRadius: 5, backgroundColor:buttonColor, color: textColor }}
    titleStyle={{ color: textColor, fontSize:16,paddingTop:10, paddingBottom:10 }}
  />
  )
}

export default FormButton
