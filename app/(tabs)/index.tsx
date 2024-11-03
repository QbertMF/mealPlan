import {useEffect, useState} from 'react';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Image } from 'expo-image';

const PlaceholderImage = require('@/assets/images/no-image.png');

import EditScreenInfo from '@/components/EditScreenInfo';
import MealInfo from '@/components/MealInfo';
import { Text, View } from '@/components/Themed';

const DATA = [
  {
    id:"1",
    title:"Data Structures"
  },
  {
    id:"2",
    title:"STL"
  },
  {
    id:"3",
    title:"C++"
  },
  {
    id:"4",
    title:"Java"
  },
  {
    id:"5",
    title:"Python"
  },
  {
    id:"6",
    title:"CP"
  },
  {
    id:"7",
    title:"ReactJs"
  },
  {
    id:"8",
    title:"NodeJs"
  },
  {
    id:"9",
    title:"MongoDb"
  },
  {
    id:"10",
    title:"ExpressJs"
  },
  {
    id:"11",
    title:"PHP"
  },
  {
    id:"12",
    title:"MySql"
  },
];



export default function TabOneScreen() {

  const [selectedId, setSelectedId] = useState<string>();

  const Item = ({item}) => {
    return( 
      <TouchableOpacity style={styles.listItem} onPress={() => setSelectedId(item.id)}>
        <Image
          style={styles.imagePreview}
          source={PlaceholderImage}
        />
        <Text>{item.title}</Text>
      </TouchableOpacity >
    );
  }

  const getAPIdata = async () => {
    const url = "https://www.themealdb.com/api/json/v1/1/random.php";
    let result = await fetch(url);
    result = await result.json();
    console.warn(result);
  }

  useEffect(()=>{
    getAPIdata()
  },[])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />

      <FlatList
       data={DATA}
       renderItem={({item}) => <Item item={item} />}
       keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  listItem: {
    width: '96%',
    fontSize: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginBottom: 8,
    marginLeft:8,
    backgroundColor: 'lightgrey',
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imagePreview: {
    width: 50,
    height: 50,
  },
});
