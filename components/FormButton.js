import React from 'react'
import { Text } from 'react-native'
//import { Button } from 'react-native-elements'
import { Button, Icon } from 'native-base';

const FormButton = ({ title, buttonType, buttonColor,textColor,buttonstate,icon,iconName,iconType, ...rest }) => {
  return (
    /*<Button
    {...rest}
    type={buttonType}
    title={title}
    buttonStyle={{ borderColor: buttonColor, borderRadius: 5, backgroundColor:buttonColor}}
    titleStyle={{ color: textColor, fontSize:16,paddingTop:10, paddingBottom:10 }}
  />*/
  <Button iconRight block large light {...rest} style={{backgroundColor:buttonColor, borderRadius: 5, borderColor: buttonColor}}>
    <Text style={{color: textColor, fontSize:16}}>{title}</Text>
    {icon && <Icon type={iconType} name={iconName} style={{color:'#fff', fontSize:14, paddingLeft:10}} />}
  </Button>
  )
}

export default FormButton
