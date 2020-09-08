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