import {useEffect, useState} from 'react';
import { StyleSheet, Button, TouchableOpacity, FlatList, Keyboard, Modal } from 'react-native';
import { Image } from 'expo-image';

const PlaceholderImage = require('@/assets/images/no-image.png');

import EditScreenInfo from '@/components/EditScreenInfo';
import MealInfo from '@/components/MealInfo';
import SearchMeal from '@/components/searchMeal';
import MealModal from '@/components/MealModal';
import { Text, View } from '@/components/Themed';

import { Convert, MealType } from "@/components/mealType";

export default function TabOneScreen() {

  const [selectedId, setSelectedId] = useState<string>();
  const [meals, setMeals] = useState([]);
  const [searchText, onChangeText] = useState('Search meal...');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const onSelectMeal = (index: string) => {
    setSelectedId(index);
    for (var myMeal in meals.recipes) {
      //var jsMeal = Convert.mealTypeToJson(myMeal);
      //const jsmeal = Convert.toMealType(myMeal);
      //console.log("meal.id:" , myMeal, " -> index: ", index);
      //console.log(meals.recipes[myMeal]);
      if (meals.recipes[myMeal].id === index) {
        console.log("found");
        setSelectedMeal(meals.recipes[myMeal]);
        setModalVisible(true);
      }
    }
    //console.log("selected: " , meals);
  };

  const Item = ({item}) => {
    let imgSource;
    (item.image == null) ? 
      imgSource=PlaceholderImage : imgSource=item.image;

    return( 
      <TouchableOpacity style={styles.listItem} onPress={() => onSelectMeal(item.id)}>
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

  const buttonClickSearch = () => {
    console.warn("Clicked On Button !!!");
    console.warn(searchText);

    Keyboard.dismiss();
    setMeals([]);
    getAPIdata();
  };

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
      //console.warn(searchText);
      //console.log("after load: " , meals);
    });
  }

  useEffect(()=>{
    getAPIdata()
  },[])

  const openModal = () => { 
    setModalVisible(true); 
  }; 
  const closeModal = () => { 
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <MealModal modalVisible={modalVisible} onClose={closeModal} selectedMeal={selectedMeal} />
      { /* <View style={{flex: 1, backgroundColor: 'red'}} />  */}
      <View style={styles.search}>
        <SearchMeal onSelect={() => console.log("onSelect")} 
                    onClose={() => console.log("onClose")} 
                    onChange={onChangeText} 
                    onSearch={buttonClickSearch}/>
        </View>
      <FlatList style={styles.list}
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
    flexDirection: 'column',
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'powderblue',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  search:{
  },
  list: {
   flex: 1,
  },
  listItem: {
    width: '96%',
    fontSize: 10,
    backgroundColor: 'powderblue',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 8,
    marginLeft:8,
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
  },
});
