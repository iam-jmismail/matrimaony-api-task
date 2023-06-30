 const generateOtp = () => {
    const random_number = String(Math.trunc(Math.random() * 100000));
    const result = random_number.length < 6 ? random_number.padEnd(6, Math.trunc(Math.random() * 10)) : random_number
    return Number(result)
}

module.exports = { generateOtp }
