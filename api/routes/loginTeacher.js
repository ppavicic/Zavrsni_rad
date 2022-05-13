const express = require('express');
const router = express.Router();
const db = require('../db')


router.post('/', async function (req, res) {

    let user = undefined
    let pass = undefined
    user = await fetchByUsername(req.body.korisnickoime)
    if(user){
        pass = await checkPassword(user, req.body.lozinka)
    }
    
    if (user && pass) {
        res.json({
            loginError: undefined,
            username: user.get('username'),
            skola: user.get('skola')
        })
    } else {
        res.json({
            loginError: 'Korisničko ime ili lozinka nisu ispravni.'
        })
    }
})

fetchByUsername = async function (korisnickoime) {
    const sql = `SELECT *
    FROM ucitelj WHERE korisnickoime = '` + korisnickoime + `'`;
    const sql2 = `SELECT *
    FROM razred NATURAL JOIN skola WHERE iducitelja = ( SELECT iducitelja 
                                                        FROM ucitelj 
                                                        WHERE korisnickoime='` + korisnickoime + `')`;
    try {
        const result = await db.query(sql, []);
        const result2 = await db.query(sql2, []);
        if (result.rows.length > 0) {
            let user = new Map()
            user.set('username', result.rows[0].korisnickoime);
            user.set('lozinka', result.rows[0].lozinka);
            user.set('ime', result.rows[0].ime);
            user.set('prezime', result.rows[0].prezime);
            user.set('skola', result2.rows[0].imeskole)
            return user
        }
    } catch (err) {
        console.log(err);
        throw err
    }
}

checkPassword = async function (user, lozinka) {
    if (user.get('lozinka') === lozinka)
        return true
    else
        return false
}

module.exports = router;