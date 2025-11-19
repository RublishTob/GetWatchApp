import {useState} from "react";

export const useSelectClient = ( selectId:string, itemId:string) =>{
    const [isSelected, setSelected] = useState(false);

    if (itemId === selectId?.toString()) {
        setSelected(true);
        return isSelected;
    }

    setSelected(false);
    return isSelected;

};
