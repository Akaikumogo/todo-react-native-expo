import { Text, TouchableOpacity } from 'react-native';

const Button = ({
   text,
   width,
   additionalStyle,
   pressFunction,
   textstyle,
}: {
   text: string;
   width: string;
   additionalStyle: string;
   pressFunction: () => void;
   textstyle: string;
}) => {
   return (
      <TouchableOpacity
         onPress={() => pressFunction()}
         className={`${width} mx-auto py-[15px] flex items-center rounded-md ${additionalStyle} `}
      >
         <Text className={`font-extrabold ${textstyle}`}>{text}</Text>
      </TouchableOpacity>
   );
};

export default Button;
