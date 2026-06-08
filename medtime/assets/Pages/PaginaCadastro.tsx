import { StyleSheet, Text, View } from 'react-native';
import BotaoCustom from '../Components/Botao';
import Input from '../Components/input';
import Avatar from '../Components/Avatar';

export default function PaginaCadastro() {
  return (
    <View style={styles.container}>
      <Avatar></Avatar>
      <Input></Input>
      <Input></Input>
      <Input></Input>
      <BotaoCustom></BotaoCustom>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00eeffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto:{
    color: 'black',
    fontSize: 50
  }
});
