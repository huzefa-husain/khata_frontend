//import React from 'react';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { getcurrency } from '../common/Constant'

const Totals = ({totalAmount}) => {
  return (
    <View style={{ flexDirection: "row", marginLeft: 16, marginRight: 16, marginTop: 5,marginBottom: 5,padding: 20,backgroundColor: '#ffffff', borderRadius:8}}>
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <Text style={styles.amountDebit}>{totalAmount && totalAmount.totalget} {getcurrency}</Text>
        <Text style={styles.offText}>{totalAmount && totalAmount.gettext}</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', borderLeftColor:'#E3E3E3', borderLeftWidth:1}}>
        <Text style={styles.amountCredit}>{totalAmount && totalAmount.totalgive} {getcurrency}</Text>
        <Text style={styles.offText}>{totalAmount && totalAmount.givetext}</Text>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1
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
    fontWeight: 'bold'
  },
  amountCredit: {
    fontSize: 15,
    color: '#008648',
    fontWeight: 'bold'
  },
  offText: {
    color: '#ACACAC',
    fontSize: 12,
    paddingTop: 10,
    fontWeight: 'bold'
  },
});

export default Totals