

// Get Added Unix epoch time
const addMinutesToCurrentTime = (minutes = 3) => {
    const currentDate = new Date();
    return Math.floor((currentDate.getTime() + (minutes * 60000)) / 1000);
}

module.exports = { addMinutesToCurrentTime }