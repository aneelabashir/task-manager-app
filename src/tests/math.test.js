const { calculateTip } = require('../math.js');

test('Should calculate the total with tip', () => {
    const total = calculateTip(10, .3);
    expect(total).toBe(13);
})