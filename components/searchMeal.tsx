import { useState } from 'react';
import { StyleSheet, TextInput, Button, Pressable, View } from 'react-native';
import { Image, type ImageSource } from 'expo-image';

type Props = {
  onSelect: (image: ImageSource) => void;
  onClose: () => void;
  onSearch: () => void;
};

export default function SearchMeal({ onSelect, onClose, onChange, onSearch }: Props) {

  //const [text, onChangeText] = useState('Search meal...');

  return (
    <View style={styles.searchContainer}>
      <TextInput  style={styles.textInput}
        onChangeText={text => onChange(text)}
        placeholder="search meal"
        //value={text}
      />
      <Button title = "SEARCH" onPress={onSearch}/>
  
      {/*<Image style={styles.searchButton}
            source={require("../assets/images/search.png")}
      />*/}
    </View>
    );
}

const styles = StyleSheet.create({
  searchContainer: {
    width: '96%',
    fontSize: 10,
    backgroundColor: 'lightgreen',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 8,
    marginLeft: 8,
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    width: '90%',
    height: 40,
    backgroundColor: 'lightblue',
    alignSelf: 'flex-start',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'lightblue',
  },
});