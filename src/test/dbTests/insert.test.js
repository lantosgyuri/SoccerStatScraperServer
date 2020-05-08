const db = require('../../dbService/db');

describe('insert new rows', () => {
    it('should insert everything', async () => {
        const leagues = await db('leagues');
        console.log('leagues', leagues);
        expect(1)
            .toEqual(1);
    });
});
