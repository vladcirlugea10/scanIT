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
    Auth: undefined;
};

export type AuthStackParams = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    ResetPassword: { email: string };
};