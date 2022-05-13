const express = require('express');
const router = express.Router();
const db = require('../db')

router.post('/getStudent', async function (req, res) {
    rows = await getStudentById(req.body.ucenik)

    if (rows) {
        res.json({
            student: rows
        })
    } else {
        res.json({
            err: "Greška pri dohvatu studenta"
        })
    }
})

router.post('/getMoney', async function (req, res) {
    var listaNovca = []
    if (Boolean(req.body.tip) == true) {
        var tipNovca = req.body.tipNovca.toLowerCase().trim()
        var valuta = req.body.valuta.toLowerCase().trim()
        rows = await getMoneyByType(tipNovca, valuta)
        for (i = 0; i < rows.length; i++)
            listaNovca.push(rows[i])
    } else {
        var novac = req.body.novacZaPrikaz
        var valuta = req.body.valuta.toLowerCase().trim()
        const n = novac.split(',')
        for (i = 0; i < n.length; i++) {
            rows = await getMoneyByNameAndCurrency(n[i].toLowerCase().trim(), valuta)
            listaNovca.push(rows[0])
        }
    }

    if (listaNovca.length != 0) {
        res.json({
            novac: listaNovca
        })
    } else {
        res.json({
            err: "Greška pri dohvatu novca"
        })
    }
})

router.post('/sendLog', async function (req, res) {
    if (req.body.idzadatka != 0) {
        lastLog = await getLatestLog()
        const date1 = lastLog[0].vrijeme
        const date2 = new Date(Date.now());
        trajanje = Math.abs(date2 - date1) / 1000
        rows = await saveLog(req.body.idgrupe, req.body.idzadatka, req.body.iducenika, req.body.odgovor, req.body.tocan, trajanje)
    } else {
        rows = await saveLog(req.body.idgrupe, req.body.idzadatka, req.body.iducenika, req.body.odgovor, req.body.tocan, "00:00:00")
    }

    if (rows) {
        res.json({
            odg: "Odgovor uspješno spremljen"
        })
    } else {
        res.json({
            err: "Greška pri dohvatu studenta"
        })
    }
})

getStudentById = async function (identifikator) {
    const sql = `SELECT *
    FROM ucenik WHERE iducenika ='` + identifikator + `'`;

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

getMoneyByNameAndCurrency = async function (ime, valuta) {
    const sql = `SELECT *
    FROM novac WHERE ime ='` + ime + `' AND valuta = '` + valuta + `'`;

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

getMoneyByType = async function (tipNovca, valuta) {
    let sql = ""
    if (tipNovca == 'oboje') {
        sql = `SELECT *
            FROM novac WHERE (tip = 'kovanica' OR tip = 'novcanica') AND valuta = '` + valuta + `'`;
    } else {
        sql = `SELECT *
            FROM novac WHERE tip ='` + tipNovca + `' AND valuta = '` + valuta + `'`;
    }

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

saveLog = async function (idgrupe, idzadatka, iducenika, odgovor, tocan, trajanje) {
    const sql = `INSERT INTO logs (idgrupe, idzadatka, iducenika, odgovor, tocan, trajanje, vrijeme) 
    VALUES (` + idgrupe + `, ` + idzadatka + `, ` + iducenika + `, '` + odgovor + `', '` + tocan + `', '` + trajanje + `', current_timestamp)`;

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

getLatestLog = async function () {
    const sql = `SELECT * FROM logs
                ORDER BY id DESC
                LIMIT 1`
    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

module.exports = router;