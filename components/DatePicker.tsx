import DateTimePicker, {
   DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, View, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import dayjs from 'dayjs';
export default function DatePicker({
   value,
   onChange,
}: {
   onChange: (event: DateTimePickerEvent, date?: Date) => void;
   value: Date;
}) {
   const [show, setShow] = useState(Platform.OS === 'ios');

   return Platform.OS === 'ios' ? (
      <DateTimePicker
         testID="dateTimePicker"
         value={value}
         mode="date"
         display="compact"
         onChange={(e, s) => {
            onChange(e, s);
         }}
      />
   ) : (
      <>
         <View className="flex-1 flex pt-[17px]  relative  flex-row items-center">
            <TextInput
               editable={false}
               className="bg-sky-100 w-full"
               label="Todo Date"
               value={dayjs(value).format('DD.MM.YYYY')}
            />

            <Button
               style={{ borderRadius: 5 }}
               textColor="white"
               className="absolute right-[5px] top-[11px] h-[35px] tetx-[28px]  w-[100px] bg-blue-500 "
               onPress={() => setShow(true)}
            >
               Select
            </Button>
         </View>
         {show ? (
            <DateTimePicker
               testID="dateTimePicker"
               value={value}
               mode="date"
               display="default"
               onChange={(e, s) => {
                  onChange(e, s);
                  setShow(false);
               }}
            />
         ) : null}
      </>
   );
}
