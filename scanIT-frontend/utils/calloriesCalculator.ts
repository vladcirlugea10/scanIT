export const calculateCalories = (weight: number, height: number, age: number, gender: string) => {
    if(!weight || (weight === 0) || !height || (height === 0) || (age === 0) || !gender){
        return;
    }
    if(gender === 'Male'){
        const BMR = 88.36 + (13.4*weight) + (4.8*height) - (5.7*age);
        return BMR;
    }else if(gender === 'Female'){
        const BMR = 447.6 + (9.2*weight) + (3.1*height) - (4.3*age);
        return BMR.toFixed(2);
    }else{
        return;
    }
}