import { StyleSheet } from "react-native";

export const createGlobalStyles = (colors: any) =>
    StyleSheet.create({
        addProductmainContainer: {
            flex: 1,
            backgroundColor: colors.secondary,
            padding: 10,
        },
        addProductDataContainer: {
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            padding: 5
        },
        horizontalInputContainer:{
            display: "flex",
            flexDirection: "row", 
            gap: 20, 
            width: "50%"
        },
        addProductInputContainer: {
            width: "90%",
            display: "flex",
            flexDirection: "column",
            gap: 10,
        },
        input: {
            borderWidth: 1,
            width: "100%",
            height: "auto",
            color: colors.primary,
            borderColor: colors.primary,
        },
        subtitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.primary,
        },
        title: {
            fontSize: 30,
            fontWeight: 'bold',
            color: colors.primary,
        },
        textForPressing:{
            color: colors.third,
            fontWeight: 'bold',
            fontSize: 15,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            width: '80%',
            padding: 10,
            gap: 20,
            backgroundColor: colors.secondary,
            borderRadius: 10,
        },
        rowContainer:{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
        },
        simpleText:{
            fontSize: 15,
            color: colors.third,
        },
        formContainer:{
            width: '100%',
            height: '100%',
            backgroundColor: colors.secondary,
            marginTop: '60%',
            gap: 30,
            padding: '10%',
            display: 'flex',
            flexDirection: 'column',
        },
        errorText:{
          color: 'red',
          fontWeight: 'bold',
        },
        eyeIcon:{
            position: 'absolute',
            right: 10,
            top: '25%',
            color: colors.primary,
        },
    });