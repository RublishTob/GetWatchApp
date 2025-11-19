import { COLOR} from "@shared/constants/colors";
import { StyleSheet} from "react-native";

export const stylesCommon = StyleSheet.create({
    menu:{
        flexDirection: "row",
        alignItems:"center",
        justifyContent: "center",
        backgroundColor:COLOR.primary,
        borderTopWidth:1,
        borderTopColor:COLOR.secondary,
        height:"15%",
        gap:10,
    },
    containerClient:{
        flex:1,
        columnGap:5,
        backgroundColor:COLOR.primary,
    },
    name:{
        color:COLOR.mainTextColor,
        fontSize:22,
        marginLeft:10,
    },
    text:{
        color:COLOR.mainTextColor,
        fontSize:14,
        marginLeft:10,
    },
    selectedText:{
        color:COLOR.selectmainTextColor,
        fontSize:16,
    },
    infoClient:{
        backgroundColor:COLOR.primary,
        gap:10,
        margin:10,
        borderBottomWidth:1,
        borderBottomColor:COLOR.secondary,
        flexDirection:"row",
    },
    selectedInfoClient:{
        backgroundColor:COLOR.selectSecondary,
    },
    iput:{
        backgroundColor:COLOR.secondary,
        height:40,
        borderRadius: 10,
    },
    item:{
        backgroundColor:COLOR.secondary,
        height:40,
        borderRadius: 10,
    },
});
