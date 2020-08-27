import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const Loader = ({theme = 'white', size = 'large'}) => {
  const color = theme === 'white' ? '#00bdcd' : '#fff';
  return (
    <View
      style={{
        ...StyleSheet.absoluteFill,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loader