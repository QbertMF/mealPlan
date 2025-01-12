import {useEffect, useState, Dispatch, SetStateAction} from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Keyboard, Button, Modal } from 'react-native';
import { Image } from 'expo-image';

const PlaceholderImage = require('@/assets/images/no-image.png');

//import EditScreenInfo from '@/components/EditScreenInfo';
//import MealInfo from '@/components/MealInfo';
import SearchMeal from '@/components/searchMeal';
import MealModal from '@/components/MealModal';
import { Text, View } from '@/components/Themed';

//import { Convert, MealType } from "@/components/mealType";


export default function TabOneScreen() {

  const [selectedId, setSelectedId] = useState<string>();
  const [meals, setMeals] = useState({recipes: []});
  const [searchText, onChangeText] = useState('Search meal...');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<{ id: string } | null>(null);           // currently selected meal from list of meals
  const [favoritMeals, setFavoriteMeals] = useState<Number[]>([]);  // List of favorite meal IDs
  const [isFavorite, setIsFavorite] = useState(false);              // is current selectio a favorite?
  const [loading, setLoading] = useState(false);

  const onSelectMeal = (index: string) => {
    setSelectedId(index);
    const meal = meals.recipes.find((meal) => meal.id === index);
    if (meal) {
      const currIndex = Number(index);
      const isFavorite = favoritMeals.includes(currIndex);
      setIsFavorite(isFavorite);
      setSelectedMeal(meal);
      setModalVisible(true);
    }
  };

  /* 
  * Modal will call this callback when a´favorite icon is pressed
  * toggle favorite state
  * update favorite list
   */
  const onToggleFavorite = () => {
    // get current state of selected meal and its favorite status
    let currFav = !isFavorite;
    let currId = selectedMeal ? Number(selectedMeal.id) : 0;

    setIsFavorite(!isFavorite);

    if (!currFav){
      // remove favorite
      const newFavorites = favoritMeals.filter(e => e !== currId);
      setFavoriteMeals(newFavorites);
    } else {
      // add favorite
        const newFavorites = favoritMeals;
        if (!newFavorites.includes(currId)) {
          newFavorites.push(currId);
          setFavoriteMeals(newFavorites);
      }
    }
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
    fetchRecipes();
  };

  //https://spoonacular.com/food-api/
  //API Key:09254edec163409db736fb4fa15b6b1f
  //https://api.spoonacular.com/recipes/complexSearch?apiKey=09254edec163409db736fb4fa15b6b1f&query=pasta&maxFat=25&number=2
    //const url = "https://api.spoonacular.com/recipes/complexSearch?apiKey=09254edec163409db736fb4fa15b6b1f&maxFat=25&number=10"
    const API_URL = "https://api.spoonacular.com/recipes/random?apiKey=09254edec163409db736fb4fa15b6b1f&number=10"

    const fetchRecipes = async () => {
      setLoading(true);
      try {
          const response = await fetch(API_URL);
          const data = await response.json();
          setMeals((prevMeals) => ({
              recipes: [...prevMeals.recipes, ...data.recipes]
          }));
      } catch (error) {
          console.error(error);
      } finally {
          setLoading(false);
      }
  };

  const renderFooter = () => {
    if (loading) return null;
    return (
        <View style={styles.footer}>
            <Button title="Load More Recipes" onPress={fetchRecipes} disabled={loading} />
        </View>
    );
  };

  useEffect(()=>{
    fetchRecipes()
  },[])

  const openModal = () => { 
    setModalVisible(true); 
  }; 
  const closeModal = () => { 
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <MealModal modalVisible={modalVisible} onClose={closeModal} onToggleFav={onToggleFavorite} selectedMeal={selectedMeal} isFavorite={isFavorite}/>
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
        ListFooterComponent={renderFooter}
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
  footer: {
    padding: 10,
    alignItems: 'center',
},
});
