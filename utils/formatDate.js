const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

function formatDate(date) {

    const monthNum = new Date(date).getMonth();
    const month = months[monthNum];
    let day;
    if(new Date(date).getDate() === 1) day = `1st`;
    if(new Date(date).getDate() === 2) day = `2nd`;
    if(new Date(date).getDate() === 3) day = `3rd`;
    if(new Date(date).getDate() > 3) day = `${new Date(date).getDate()}th`;
    const year = new Date(date).getFullYear();

    let hours = new Date(date).getHours() % 12 ? new Date(date).getHours() % 12 : 12;
    let minutes = new Date(date).getMinutes() < 10 ? '0' + new Date(date).getMinutes() : new Date(date).getMinutes();

    let newFormat = new Date(date).getHours() >= 12 ? 'PM' : 'AM';


    return `${month} ${day}, ${year} at ${hours}:${minutes}${newFormat}`;
}

module.exports = formatDate;