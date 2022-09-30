const calculateTip = (total, tipPercent = .25) => {
    return (total + (total * tipPercent));
}


module.exports = {
    calculateTip
}