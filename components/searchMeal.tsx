import { useState } from 'react';
import { StyleSheet, TextInput, Button, Pressable, View } from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import ImageButton from '@/components/ImageButton';

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
        //onChangeText={text => onChange(text)}
        placeholder="search meal"
        //value={text}
      />
      <ImageButton title={""} onPress={onSearch} imageSrc={require('../assets/images/search.png')}/>   
    </View>
    );
}

const styles = StyleSheet.create({
  searchContainer: {
    width: '96%',
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 8,
    marginLeft: 8,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlignVertical: 'center',
  },
  textInput: {
    width: '88%',
    height: 40,
    alignSelf: 'flex-start',
  },
});