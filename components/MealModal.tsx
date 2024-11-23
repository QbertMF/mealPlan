import { useState } from 'react';
import { StyleSheet, Button, Modal, Text, View, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import ImageButton from '@/components/ImageButton';

const PlaceholderImage = require('@/assets/images/no-image.png');

const favorite = require('@/assets/images/favorite_yes.png');
const favorite_no = require('@/assets/images/favorite_no.png');

const iconPopular = require('@/assets/images/popular.png');
const iconVegan = require('@/assets/images/vegan.png');
const iconVegetarian = require('@/assets/images/vegetarian.png');
const iconHealthy = require('@/assets/images/healthy.png');
const iconGlutenFree = require('@/assets/images/gluten-free.png');
const iconCheap = require('@/assets/images/cheap.png');

type Props = {
    modalVisible: boolean;
    onClose: () => void;
    onToggleFav: () => void;
    selectedMeal: Var;
    isFavorite: boolean;
};

export default function MealModal({ modalVisible, onClose, onToggleFav, selectedMeal, isFavorite }: Props) {

    let imgSource = PlaceholderImage;
    if ((selectedMeal != null) && (selectedMeal.image != null)) {
        imgSource=selectedMeal.image;
    } 

    let title = "nothing";
    if ((selectedMeal != null) && (selectedMeal.title != null)) {
        title = selectedMeal.title;
    }

    let instructions = "nothing";
    if ((selectedMeal != null) && (selectedMeal.instructions != null)) {
        instructions = selectedMeal.instructions;
    }

    let favIcon = isFavorite ? favorite : favorite_no;

    let isPopular = (selectedMeal != null) && (selectedMeal.veryPopular == true);
    let isVegan = (selectedMeal != null) && (selectedMeal.vegan == true);
    let isVegetarian = (selectedMeal != null) && (selectedMeal.vegetarian == true);
    let isHealthy = (selectedMeal != null) && (selectedMeal.veryHealthy == true);
    let isGlutenFree = (selectedMeal != null) && (selectedMeal.glutenFree == true);
    let isCheap = (selectedMeal != null) && (selectedMeal.cheap == true);

    return (
    <Modal 
        animationType="slide" 
        transparent={true} 
        visible={modalVisible} 
        onRequestClose={onClose} > 
        <ScrollView contentContainerStyle={styles.modalView}>
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
                {isPopular == true && <Image style={styles.imageIcon} source={iconPopular} />}
                {isVegan == true && <Image style={styles.imageIcon} source={iconVegan} />}
                {isVegetarian == true && <Image style={styles.imageIcon} source={iconVegetarian} />}
                {isHealthy == true && <Image style={styles.imageIcon} source={iconHealthy} />}
                {isGlutenFree == true && <Image style={styles.imageIcon} source={iconGlutenFree} />}
                {isCheap == true && <Image style={styles.imageIcon} source={iconCheap} />}
            </View>
            
            <Text style={styles.titleText}>Instructions:</Text>
            <Text style={styles.modalText}>{instructions}</Text>
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
        height: 400,
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
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 5,
    },
    imageIcon: {
        width: 40,
        height: 40,
        margin: 5,
    } 
});