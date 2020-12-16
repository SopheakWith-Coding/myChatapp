import React from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';

const screenWidth = Dimensions.get('screen').width;

export default class Chat extends React.Component {
  render() {
    return (
      <View style={styles.container}>

        <View style={styles.subcontainer}>
          <View style={styles.imageWrapper}>
            <Image
              style={{width: 80, height: 80, borderRadius: 50}}
              source={{
                uri:
                  'https://about.abc.net.au/wp-content/uploads/2018/05/JaneConnorsCorpSite-250x250.jpg',
              }}
            />
          </View>
          <View style={styles.TextWrapper}>
            <Text style={styles.texttitle}>Sopheak</Text>
            <Text style={styles.textsubtitle}>Helo how are you?</Text>
          </View>
          <View style={styles.TimeWrapper}>
            <Text>9:40pm</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  subcontainer: {
    height: 80,
    width: screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  imageWrapper: {
    marginLeft: 10,
  },
  TextWrapper: {
    justifyContent: 'center',
    width: 210,
  },
  TimeWrapper: {
    justifyContent: 'flex-end',
    marginRight: 20,
  },
  texttitle: {
    fontSize: 25,
  },
  textsubtitle: {
    fontSize: 20,
  },
});
