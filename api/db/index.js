const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'zavrsni',
    password: 'bazepodataka',
    port: 5432,
    ssl: process.env.DATABASE_URL ? true : false
});

module.exports = {
    query: (text, params) => {
        const start = Date.now();
        return pool.query(text, params)
            .then(res => {
                const duration = Date.now() - start;
                //console.log('executed query', {text, params, duration, rows: res.rows});
                return res;
            });
    },
    pool: pool
}