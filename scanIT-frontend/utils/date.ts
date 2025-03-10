export const formatDateToString = (date: Date | null) => {
    if(!date){
        return '';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

export const calculateDays = (date: Date | undefined) => {
    if(!date){
        return;
    }
    const today = new Date();
    const accountCreated = new Date(date);
    const diffTime = Math.abs(today.getTime() - accountCreated.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

export const calculateAge = (date: Date) => {
    if(!date){
        return;
    }
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if(month < 0 || (month === 0 && today.getDate() < birthDate.getDate())){
        age--;
    }
    return age;
}