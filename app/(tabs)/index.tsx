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
  const [meals, setMeals] = useState([]);

  const Item = ({item}) => {
    let imgSource;
    (item.image == null) ? 
      imgSource=PlaceholderImage : imgSource=item.image;

    return( 
      <TouchableOpacity style={styles.listItem} onPress={() => setSelectedId(item.id)}>
        <View style={styles.itemContainer}>
          <Image style={styles.imagePreview}
            source={imgSource}
          />
          <Text style={styles.itemText}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity >
    );
  }

  //https://spoonacular.com/food-api/
  //API Key:09254edec163409db736fb4fa15b6b1f
  //https://api.spoonacular.com/recipes/complexSearch?apiKey=09254edec163409db736fb4fa15b6b1f&query=pasta&maxFat=25&number=2

  const getAPIdata = () => {
    ////const url = "https://fakestoreapi.com/products"; 
    ////const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata";
    //  const url = "https://www.themealdb.com/api/json/v1/1/random.php";

    //const url = "https://api.spoonacular.com/recipes/complexSearch?apiKey=09254edec163409db736fb4fa15b6b1f&maxFat=25&number=10"
    const url = "https://api.spoonacular.com/recipes/random?apiKey=09254edec163409db736fb4fa15b6b1f&number=10"

    fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      setMeals(data);
      //console.warn(data); 
    });
  }

  useEffect(()=>{
    getAPIdata()
  },[])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      {/*  ToDo: Remove
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
      */}
      <FlatList
       data={meals.recipes}
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
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'lightgrey',
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
    backgroundColor: 'lightgrey',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 8,
    marginLeft:8,
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
  },
  itemText:{
    textAlign: 'left',
    marginLeft: 10,
    marginRight: 100,
  }
});
