const db = require('../dbService/db');

module.exports = async () => {
    await db.destroy();
};
