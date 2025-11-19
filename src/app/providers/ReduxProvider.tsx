import {Provider} from "react-redux";
import { Store } from "../store/Store";


interface ReduxProp{
    children: React.ReactNode;
}

export const ReduxProvider = ({children}:ReduxProp) =>{
    return <Provider store={Store}>{children}</Provider>;
};

export default ReduxProvider;
