//import React from 'react';
import React, { useEffect } from 'react';
import {StyleSheet, Text, StatusBar} from 'react-native';
import { List, ListItem, Left, Right, View, Body, Card, CardItem } from 'native-base';
import { getcurrency } from '../common/Constant'

const textDebit = "You'll Get"
const textCredit = "You'll Give"

class ContactList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <React.Fragment>
        <View style={{paddingTop:15}}>
        <Text style={{color:'#ACACAC'}}>{this.props.contactCount && this.props.contactCount + ' Customers'}</Text>
        <View style={{paddingTop:15}}>
        {this.props.data && this.props.data.map((items, i) => {
            //console.log ('contact', this.props.data)
            return (
              <Card key={i} onPress={() => this.props.navigation.navigate('GetUserAmount', { id: items.id })} style={{paddingBottom:5, paddingTop:5, borderRadius:5}}>
              <CardItem>
                <View style={{flex: 1, flexDirection: 'row',justifyContent: 'space-between'}}>
                  <View style={{justifyContent: 'center', fontWeight:'bold'}} >
                    <Text style={{fontWeight:'bold'}}>{items.name}</Text>
                    <Text style={styles.offText}>{items.transectionscince}</Text>
                  </View>
                  <View>
                      <Text style={items.amountType === "Pay" ? styles.amountDebit : styles.amountCredit}>
                        {items.amountType === "Pay" || items.amountType === "Receive" ? items.amount + ' ' + getcurrency : ''}
                      </Text>
                      <Text style={styles.offText}>
                        {items.amountType === "Pay" ? textDebit : items.amount === null ? <React.Fragment></React.Fragment> : textCredit}
                      </Text>
                  </View>
                </View>
              </CardItem>
              </Card>
            );
        })}
        </View>
        </View>
      </React.Fragment>  
    )
  }
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
  amountDebit: {
    fontSize: 15,
    color: '#BD3642',
    fontWeight:'bold',
    textAlign:'right'
  },
  amountCredit: {
    fontSize: 15,
    color: '#008648',
    fontWeight:'bold',
    textAlign:'right'
  },
  offText: {
    color:'#ACACAC',
    fontSize:12,
    paddingTop:3
  },
});

export default ContactList