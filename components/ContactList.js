//import React from 'react';
import React, { useEffect } from 'react';
import {View, FlatList, StyleSheet, Text, StatusBar} from 'react-native';

const Item = ({ name, id }) => (
  <View style={styles.item}>
    <Text style={styles.title} onPress={() => {
      console.log (id)
      //this.props.navigation.navigate('AddAmount')
    }}>{name}</Text>
  </View>
);

const ContactList = ({
  data,
}) => {
  /*useEffect(() => {
    console.log ('use effect')
    this.props.navigation.setParams({
      screenNav:this.props.navigation.navigate
    })
  });*/
  const renderItem = ({ item, props }) => (
    //console.log (item.id)
    <Item name={item.name} id={item.id} />
  );
  
  return (
    <React.Fragment>
    <Text>Contacts</Text>
    <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </React.Fragment>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#ccc',
    padding: 5,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default ContactList