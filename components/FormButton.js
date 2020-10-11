import React from 'react'
import { Button } from 'react-native-elements'

const FormButton = ({ title, buttonType, buttonColor,textColor,buttonstate, ...rest }) => {
  return (
    <Button
    {...rest}
    type={buttonType}
    title={title}
    buttonStyle={{ borderColor: buttonColor, borderRadius: 5, backgroundColor:buttonColor}}
    titleStyle={{ color: textColor }}
  />
  )
}

export default FormButton
