import React from 'react'
import { View, Text } from 'react-native';

const ScreenHeader = ({ mode, title}) => (
  <View>
      {mode && <React.Fragment>
      {mode === 'edit' ? <Text style={{fontWeight:'bold'}}>Edit {title}</Text> : <Text style={{fontWeight:'bold'}}>Add a new {title}</Text>}
      </React.Fragment>}
  </View>
)

export default ScreenHeader
