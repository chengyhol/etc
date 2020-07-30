module.exports = {
    replace(str, start, end, char) {
        let arr = [...str];
        arr.forEach((item, index) => {
            if (index >= start && index < end)
                arr[index] = char;
        })
        return arr.join('')
    },
    formatDate(char, date = new Date()) {
        let year = date.getFullYear();
        let month = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth();
        let day = date.getDate();
        return `${year}${char}${month}${char}${day}${char}`;
    },
    getTime(date = new Date()) {
        let year = date.getFullYear();
        let month = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth();
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        return `${year}-${month}-${day},${hour}:${minute}:${second}`;
    }
}