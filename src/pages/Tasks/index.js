import { StatusBar } from 'expo-status-bar';
import React, {
  useState,
  useEffect
} from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  AsyncStorage
} from 'react-native';
import {
  Ionicons,
  MaterialIcons
} from "@expo/vector-icons";
import styles from './styles.js';

export default function Tasks() {

  //const [task,setTask] = useState([ 'teste1', 'teste2', 'teste3']);
  const [task,setTask] = useState([]);
  const [newTask, setNewTask] = useState('');
  
  async function addTask(){
    if (newTask == ''){
      return;
    }

    const search = task.filter(task => task == newTask);
    if (search.length !== 0){
      Alert.alert("Atenção","Nome da tarefa repetido.");
      return;
    }

    setTask([ ...task,  newTask]);
    setNewTask('');
    Keyboard.dismiss();
  }

  async function removeTask(item){
    Alert.alert(
      "",
      "Remover a tarefa ?",
      [
        {
          text: "Cancel",
          onPress: () => {
            return
          },
          style: 'cancel'
        },
        {
          text: "Ok",
          onPress: () => {
            setTask(task.filter(tasks => tasks !== item));
          }
        }
      ],
      {
        cancelable: false
      }
    )
  }

  /*
  #debug
  useEffect(() => {
    console.log(newTask);
  }, [newTask]);
  */

  useEffect(() => {
    async function carregarDados(){
      const task = await AsyncStorage.getItem("keyTask")

      if (task){
        setTask(JSON.parse(task));
      }
    }
    carregarDados();
  }, [])

  useEffect(() => {
    async function salvarDados(){
      AsyncStorage.setItem("keyTask", JSON.stringify(task))
    }
    salvarDados();
  }, [task])

  const header = () => {
    return (
      <View style={styles.headerStyle}>
        <Text style={styles.titleStyle}>Lista de tarefas</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={0}
      behavior="padding"
      style={{ flex: 1 }}
      enabled={ Platform.OS == 'ios'}
    >
      <View style={styles.container} >
        <View style={styles.Body} >
          <FlatList 
            style={styles.FlatList} 
            data={task}
            ListHeaderComponent={header}
            stickyHeaderIndices={[0]}
            keyExtractor={item => item.toString()}
            showsVerticalScrollIndicator={true}
            renderItem={({ item }) => (
              <View style={styles.ContainerView}>
                <Text style={styles.Texto}>{ item }</Text>
                <TouchableOpacity
                    onPress={() => removeTask(item)}
                >
                    <MaterialIcons 
                      name="delete-forever"
                      size={25}
                      color="#f64c75"
                    />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        <View style={styles.Form}>
          <TextInput 
            style={styles.Input} 
            placeholderTextColor="#999"
            placeholder="Adicione uma tarefa"
            autoCorrect={true}
            maxLength={25}
            onChangeText={text => setNewTask(text)}
            value={newTask}
          />
          <TouchableOpacity 
            style={styles.Button} 
            onPress={() => addTask()}
          >
            <Ionicons 
              name="ios-add" 
              size={25}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
  