import { View, Text, Animated, Platform, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import { NativeWindStyleSheet } from 'nativewind';

import DatePicker from '@/components/DatePicker';
import dayjs from 'dayjs';
NativeWindStyleSheet.setOutput({
   default: 'native',
});
export default function index() {
   const [drawerOpen, setDrawerOpen] = useState({
      open: false,
      type: 'add',
   });
   const [todo, setTodo] = useState({
      todoTitle: '',
      todoDate: new Date(),
      todoStatus: 'not_started',
   });
   const [editItemIndex, setEditItemIndex] = useState(0);
   const onChange = (_event: any, selectedDate: any) => {
      const currentDate = selectedDate || new Date();
      setTodo((p) => ({
         ...p,
         todoDate: currentDate,
      })); // Tanlangan sana
   };
   const animatedValue = useRef(new Animated.Value(0)).current;

   const toggleDrawer = () => {
      setDrawerOpen((p) => ({ ...p, open: !p.open }));
      Animated.timing(animatedValue, {
         toValue: drawerOpen.open ? 0 : 1,
         duration: 300,
         useNativeDriver: true,
      }).start();
      setTodo({
         todoTitle: '',
         todoDate: new Date(),
         todoStatus: 'not_started',
      });
   };

   const drawerBackgroundColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['white', 'white'],
   });

   const drawerTranslateX = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-1000, 0],
   });
   const [todoArr, serTodoArr] = useState<
      {
         todoTitle: string;
         todoDate: Date;
         todoStatus: string;
      }[]
   >([]);
   useEffect(() => {
      const fetchTodo = async () => {
         try {
            const storedTodo = await AsyncStorage.getItem('todo');

            if (storedTodo) {
               serTodoArr(JSON.parse(storedTodo)); // Assuming the stored todo is an array
            }
         } catch (error) {
            console.error('Error loading todo:', error);
         }
      };

      fetchTodo();
   }, [todo]);
   return (
      <View
         className={`w-screen relative h-screen bg-gray-100 ${
            Platform.OS === 'ios' ? 'py-[50px]' : 'py-[20px]'
         }`}
      >
         {drawerOpen.open && (
            <Animated.View
               className={`w-screen h-screen absolute z-50  transition-all duration-500 flex flex-1  flex-col justify-between ${
                  Platform.OS === 'ios' ? 'py-[50px]' : 'py-[20px]'
               } `}
               style={{
                  backgroundColor: drawerBackgroundColor,
                  transform: [{ translateX: drawerTranslateX }],
               }}
            >
               <View className="w-full h-[95%]  ">
                  <View className="w-full flex items-center justify-center">
                     <Text className="text-2xl font-bold">
                        {drawerOpen.type === 'add'
                           ? 'Add new Todo'
                           : drawerOpen.type === 'edit'
                           ? 'Edit Todo'
                           : ''}
                     </Text>
                  </View>
                  <View className="w-full h-[400px] p-4">
                     <TextInput
                        className="bg-sky-100"
                        label="Todo Title"
                        value={todo.todoTitle}
                        onChangeText={(text) =>
                           setTodo(() => ({ ...todo, todoTitle: text }))
                        }
                     />
                     {Platform.OS === 'ios' ? (
                        <View className="h-[50px]  bg-sky-100">
                           <RNPickerSelect
                              style={{
                                 inputIOS: {
                                    marginTop: 15,
                                    marginLeft: 15,
                                    fontSize: 16,
                                 },
                              }}
                              onValueChange={(value) =>
                                 setTodo((p) => ({ ...p, todoStatus: value }))
                              }
                              value={todo.todoStatus}
                              items={[
                                 { label: 'Not Started', value: 'not_started' },
                                 { label: 'In Progress', value: 'in_progress' },
                                 { label: 'Finished', value: 'finished' },
                              ]}
                              placeholder={{
                                 label: 'Todo Status',
                                 value: null,
                              }}
                           />
                        </View>
                     ) : (
                        <View className="border-b-[0.8px]">
                           <RNPickerSelect
                              style={{
                                 inputAndroid: {
                                    backgroundColor: '#e0f2fe',
                                 },
                              }}
                              onValueChange={(value) =>
                                 setTodo((p) => ({ ...p, todoStatus: value }))
                              }
                              items={[
                                 { label: 'Not Started', value: 'not_started' },
                                 { label: 'In Progress', value: 'in_progress' },
                                 { label: 'Finished', value: 'finished' },
                              ]}
                              placeholder={{
                                 label: 'Todo Status',
                                 value: null,
                              }}
                           />
                        </View>
                     )}
                     <View className="w-full h-[40px]">
                        <DatePicker onChange={onChange} value={todo.todoDate} />
                     </View>
                  </View>
               </View>
               <View
                  className={
                     ' flex-row flex-1 flex  items-center justify-center gap-[10px] h-[5%] '
                  }
               >
                  <Button
                     textColor="white"
                     className="w-[40%] h-[40px] bg-gray-500  text-white"
                     mode="elevated"
                     onPress={toggleDrawer}
                  >
                     Cancel
                  </Button>
                  {drawerOpen.type === 'add' ? (
                     <Button
                        textColor="white"
                        className="w-[40%] h-[40px] bg-green-500  text-white"
                        mode="elevated"
                        onPress={() => {
                           AsyncStorage.setItem(
                              `todo`,
                              JSON.stringify([
                                 {
                                    ...todo,
                                    todoStatus: todo.todoStatus === '',
                                 },
                                 ...(todoArr || []),
                              ]),
                           );
                           toggleDrawer();
                        }}
                     >
                        Add todo
                     </Button>
                  ) : (
                     <Button
                        textColor="white"
                        className="w-[40%] h-[40px] bg-yellow-500  text-white"
                        mode="elevated"
                        onPress={() => {
                           const newTodoArr = [...todoArr];
                           newTodoArr[editItemIndex] = todo;
                           AsyncStorage.setItem(
                              `todo`,
                              JSON.stringify(newTodoArr),
                           );
                           toggleDrawer();
                        }}
                     >
                        Edit todo
                     </Button>
                  )}
               </View>
            </Animated.View>
         )}

         <View className="w-full h-[100%] ">
            <Text className="text-center pt-[10px] font-bold text-2xl">
               {' '}
               YOUR TODO
            </Text>
            <ScrollView className="w-full h-[95%] p-4">
               {todoArr?.map((item, index) => (
                  <View
                     key={index}
                     className="bg-white rounded-lg shadow-md mb-4 p-4 flex-1 flex-row"
                     style={{
                        elevation: 5, // For Android shadow
                        shadowColor: '#000', // For iOS shadow
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.5,
                     }}
                  >
                     <View className="w-[89%]">
                        <Text className="text-xl font-bold">
                           {item.todoTitle}
                        </Text>
                        <Text className="text-gray-600">
                           Due Date: {dayjs(item.todoDate).format('DD.MM.YYYY')}
                        </Text>
                        <Text className="text-gray-500">
                           Status: {item.todoStatus}
                        </Text>
                     </View>
                     <View className="flex-1 flex-col items-center gap-4 justify-start">
                        <Text
                           textColor="white"
                           mode="elevated"
                           onPress={() => {
                              setDrawerOpen({ open: true, type: 'edit' });
                              setTodo({
                                 ...item,
                                 todoDate: new Date(item.todoDate),
                              });
                              setEditItemIndex(index);
                           }}
                           className="text-left t  text-yellow-500 w-full"
                        >
                           Edit
                        </Text>
                        <Text
                           onPress={() => {
                              const newTodoArr = [...todoArr];
                              newTodoArr.splice(index, 1);
                              AsyncStorage.setItem(
                                 `todo`,
                                 JSON.stringify(newTodoArr),
                              );
                           }}
                           className=" text-red-500 text-left w-full"
                        >
                           Delete
                        </Text>
                     </View>
                  </View>
               ))}
            </ScrollView>
            <Button
               textColor="white"
               className="w-[80%] bg-blue-500 mx-auto text-white"
               mode="elevated"
               onPress={toggleDrawer}
            >
               Add todo +
            </Button>
         </View>
      </View>
   );
}
