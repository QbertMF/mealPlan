import { StyleSheet, Modal, Text, View, ScrollView, FlatList, ImageBackground, TouchableOpacity} from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import ImageButton from '@/components/ImageButton';

const PlaceholderImage = require('@/assets/images/no-image.png');

const favorite = require('@/assets/images/favorite_yes.png');
const favorite_no = require('@/assets/images/favorite_no2.png');

const iconPopular = require('@/assets/images/popular.png');
const iconVegan = require('@/assets/images/vegan.png');
const iconVegetarian = require('@/assets/images/vegetarian.png');
const iconHealthy = require('@/assets/images/healthy.png');
const iconGlutenFree = require('@/assets/images/gluten-free.png');
const iconCheap = require('@/assets/images/cheap.png');
const iconPreparation = require('@/assets/images/preparation-time.png');
const iconServings = require('@/assets/images/servings.png');

type Props = {
    modalVisible: boolean;
    onClose: () => void;
    onToggleFav: () => void;
    selectedMeal: any;
    isFavorite: boolean;
};

export default function MealModal({ modalVisible, onClose, onToggleFav, selectedMeal, isFavorite }: Props) {

    const imgSource = selectedMeal?.image ?? PlaceholderImage;
    const title = selectedMeal?.title ?? "nothing";
    const instructions = selectedMeal?.instructions?.replace(/<[^>]+>/g, '') ?? "nothing";
    const summary = selectedMeal?.summary?.replace(/<[^>]+>/g, '') ?? "nothing";
    const preparationTimeMinutes = selectedMeal?.readyInMinutes ?? null;
    const servings = selectedMeal?.servings ?? null;
    const favIcon = isFavorite ? favorite : favorite_no;
    const isPopular = selectedMeal?.veryPopular ?? false;
    const isVegan = selectedMeal?.vegan ?? false;
    const isVegetarian = selectedMeal?.vegetarian ?? false;
    const isHealthy = selectedMeal?.veryHealthy ?? false;
    const isGlutenFree = selectedMeal?.glutenFree ?? false;
    const isCheap = selectedMeal?.cheap ?? false;

    // Render Ingrediences
    const IngredienceItem = ({ingredience}) => {
        if (!ingredience) { 
            return null; // Handle undefined ingredience 
        }

        const imgSource = ingredience.image ? { uri: `https://img.spoonacular.com/ingredients_100x100/${ingredience.image}` } : PlaceholderImage;

        //console.log("Zutaten:");
        //console.log(ingredience);

        return( 
            <View style={styles.instStepContainer}>
              <Image style={styles.ingrediencePreview} source={imgSource}/>
              <Text style={styles.ingredienceText}> {ingredience.original} </Text>
            </View>
        );
      }

    return (
    <Modal 
        animationType="slide" 
        transparent={true} 
        visible={modalVisible} 
        onRequestClose={onClose} > 
        <ScrollView contentContainerStyle={styles.modalView}
                    nestedScrollEnabled={true}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{title}</Text>
                <View style={{alignSelf: 'flex-end'}}>
                    <ImageButton  title={""} onPress={onClose} imageSrc={require('../assets/images/close.png')}/>
                </View>
            </View>
            
            <ImageBackground style={styles.imagePreview} source={{uri: imgSource}} >
                <TouchableOpacity onPress={onToggleFav}>
                    <Image style={styles.favoriteIcon} source={favIcon} />
                </TouchableOpacity>
            </ImageBackground>
            
            <View style={styles.iconContainer}>
                {isPopular && <Image style={styles.imageIcon} source={iconPopular} />}
                {isVegan && <Image style={styles.imageIcon} source={iconVegan} />}
                {isVegetarian && <Image style={styles.imageIcon} source={iconVegetarian} />}
                {isHealthy && <Image style={styles.imageIcon} source={iconHealthy} />}
                {isGlutenFree && <Image style={styles.imageIcon} source={iconGlutenFree} />}
                {isCheap && <Image style={styles.imageIcon} source={iconCheap} />}
            </View>

            <View style={styles.statisticsContainer}>
                {preparationTimeMinutes != null && 
                    <View style={styles.statisticsContainer}>
                        <Image style={styles.statisticsIcon} source={iconPreparation} />
                        <Text style={styles.statisticsText}>{preparationTimeMinutes}</Text>
                        <Text style={styles.statisticsText}>min</Text>
                    </View>}

                {servings != null &&
                    <View style={styles.statisticsContainer}>
                        <Image style={styles.statisticsIcon} source={iconServings} />
                        <Text style={styles.statisticsText}>{servings}</Text>
                    </View>}   
            </View>

            <Text style={styles.titleText}>Summary:</Text>
            <Text style={styles.modalText}>{summary}</Text>

            <Text style={styles.titleText}>Instructions:</Text>
            <Text style={styles.modalText}>{instructions}</Text>
  
            <Text style={styles.titleText}>Ingrediences:</Text>
            { selectedMeal != null &&
            <FlatList style={styles.instStepList}
                data={selectedMeal.extendedIngredients}
                renderItem={({item}) => <IngredienceItem ingredience={item} />}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false}
            />
            }
            
        </ScrollView>
      </Modal>
    );
}

const styles = StyleSheet.create({
    modalView: { 
        margin: 5, 
        backgroundColor: 'white', 
        borderRadius: 20, 
        padding: 15, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2, }, 
        shadowOpacity: 0.25, 
        shadowRadius: 4, 
        elevation: 5, 
    }, 
    titleText: {
        width: '80%',
        textAlign: 'left',
        textAlignVertical: 'center',
        fontWeight: 'bold',
    },
    modalText: { 
        marginBottom: 15, 
        textAlign: 'left', 
    },
    imagePreview: {
        flex : 1,
        width: '100%',
        height: 250,
        borderRadius: 20,
        zIndex: 1,
    },
    favoriteIcon:{
        width: 40,
        height: 40,
        zIndex: 10,
        alignSelf: 'flex-end',
        margin: 15,
    },
    titleContainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    iconContainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#F0F0F0', //'powderblue',
        marginBottom: 2,
        marginTop: 2,
        borderWidth: 0,             // border switched off
        borderColor: 'black',
        borderRadius: 10,
    },
    imageIcon: {
        width: 40,
        height: 40,
        margin: 5,
    },
    statisticsContainer:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#F0F0F0', //'powderblue',
        marginBottom: 2,
        marginTop: 2,
        borderWidth: 0,             // border switched off
        borderColor: 'black',
        borderRadius: 10,
    },
    statisticsText: {
        marginLeft: 5,
        textAlignVertical: 'center',
    },
    statisticsIcon: {
        width: 40,
        height: 40,
    },
    webContainer:{
        width: '100%',
        height: 300,
        fontSize: 40,
    },
    instStepList: {
        flex: 1,
    },
    instStepContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#F0F0F0', //'powderblue',
        marginBottom: 5,
        borderRadius: 10,
    },
    ingredienceText:{
        textAlign: 'left',
        textAlignVertical: 'center',
        marginLeft: 10,
        marginRight: 60,
    },
        ingrediencePreview:{
        width: 50,
        height: 50,
        borderRadius: 10,
        margin: 5,
        resizeMode:'stretch',
    }
});