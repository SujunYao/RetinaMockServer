export const guid = (len: number = 32): string => {
    let temp = 'd';
    for (let n = 0; n < len; n++) {
        temp += parseInt((Math.random() * 2).toString(), 10) < 1 ? 'd' : 'f';
    }
    return temp.replace(/[df]/g, (c) => {
        const r = parseInt((Math.random() * 16).toString(), 10);
        const v = c === 'd' ? r : (Math.ceil(r / 3) + 8);
        return v.toString(16);
    });
}

export const randomNum = (max: number, min: number = 0): number => parseInt((Math.random() * max + min).toString(), 10)

export const addDays = (curDate: Date, days: number): Date => {
    let res = curDate
    res.setDate(res.getDate() + days);
    return res;
};

export const reducingDays = (curDate: Date, days: number): Date => {
    let res = curDate
    res.setDate(res.getDate() - days);
    return res;
};

export const getAge = (birthday: Date, curDate: Date = new Date()): number => {
    const diff = birthday.getTime() - curDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export const calcDisResult = ()=>{
    
};
