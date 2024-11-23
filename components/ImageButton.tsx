import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Image, type ImageSource } from 'expo-image';

type Props = {
    imageSrc: string;
    onPress: () => void;
    title?: string;
};

export default function ImageButton({ onPress, imageSrc, title }: Props) {

  return (
    <TouchableOpacity style={styles.touchable} onPress={onPress}>
        <View style={styles.absoluteView}>
            <Text>{title}</Text>
        </View>
        <Image source={imageSrc} style={styles.image}/>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: 4,
  },
  image: {
    width: 32,
    height: 32,
    margin: 4,
    borderRadius: 6,
    borderWidth: 0,
  },
  absoluteView:{
    flex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  }
});
