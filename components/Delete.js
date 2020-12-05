import React from 'react'
import { View, Icon } from 'native-base';

const Delete = ({ action }) => {
  return (
    <View>
      <Icon type="FontAwesome" name="trash" onPress={() => {action()}} style={{fontSize: 24, color: '#BD3642', marginRight:10}}/>
    </View>
  )
}

export default Delete
