import OCRResult from "./OCRTypes";

export type RootStackParamList = {
    Home: undefined;
    ImageEdit: { photoUri: string };
    ScanImage: { photoUri: string };
    IngredientsCheck: { data: OCRResult};
    BarcodeResults: { product: Product };
    Profile: undefined;
    PersonalInformation: undefined;
    AccountInformation: undefined;
    ChangeLanguage: undefined;
    AddProduct: undefined;
    EditProduct: { barcode: string, product: Product | null };
    AddedProducts: undefined;
    EditedProducts: undefined;
    Auth: undefined;
};

export type AuthStackParams = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    ResetPassword: { email: string };
};