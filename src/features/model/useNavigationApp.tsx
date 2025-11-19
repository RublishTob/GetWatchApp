import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@app/navigation/Navigation";


export const useNavigationApp = () =>{
    const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return navigator;
};
