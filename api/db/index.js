const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',//'zijpnndlshtqnn', //
    host: 'localhost', //'ec2-34-201-95-176.compute-1.amazonaws.com', //'localhost'
    database: 'zavrsni', //'d2mr4v10612lvf', //'zavrsni'
    password: 'bazepodataka', //'2f7d953810834a9016c4814ca19d1577387f9e23c6ad132c6cf9976d958ff020', //'bazepodataka'
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