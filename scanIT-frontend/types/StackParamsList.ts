import OCRResult from "./OCRTypes";

export type RootStackParamList = {
    Home: undefined;
    ImageEdit: { photoUri: string };
    ScanImage: { photoUri: string };
    IngredientsCheck: { data: OCRResult};
};