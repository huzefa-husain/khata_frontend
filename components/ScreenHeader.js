import React from 'react'
import { View, Text } from 'react-native';

const ScreenHeader = ({ mode, title}) => (
  <View>
      {mode && <React.Fragment>
      {mode === 'edit' ? <Text>Edit {title}</Text> : <Text>Add {title}</Text>}
      </React.Fragment>}
  </View>
)

export default ScreenHeader
