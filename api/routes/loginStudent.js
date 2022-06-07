const express = require('express');
const router = express.Router();
const db = require('../db')

router.post('/', async function (req, res) {

    let user = undefined
    if (!isNaN(req.body.iducenik) && !isNaN(req.body.idrazred) && !isNaN(req.body.idskole)) {
        user = await checkStudent(req.body.iducenik, req.body.idrazred, req.body.idskole, req.body.idvjezbe)
    }

    if (user) {
        res.json({
            loginError: undefined,
            ime: user[0].ime,
            prezime: user[0].prezime
        })
    } else {
        res.json({
            loginError: 'Prijava nije uspjela ili ste već radili ovu vježbu.'
        })
    }
})

router.get('/getExercise', async function (req, res) {
    rows = await getExerciseToSolve()
    if (rows.length != 0) {
        let zadaciIzVjezbe = rows[0].zadaci
        let idzadataka = zadaciIzVjezbe.split(',')
        let zadaci = []
        let zadaciSlikovnoUnos = []
        let zadaciOdabir = []
        let zadaciUnos = []
        let zadaciSlikovnoOdabir = []
        for (i = 0; i < idzadataka.length; i++) {
            rows2 = await getTaskById(idzadataka[i])
            if (rows2[0].vrsta === "slikovnoUnos") {
                zadaciSlikovnoUnos.push(rows2[0])
            } else if (rows2[0].vrsta === "odabir") {
                zadaciOdabir.push(rows2[0])
            } else if (rows2[0].vrsta === "unos") {
                zadaciUnos.push(rows2[0])
            } else if (rows2[0].vrsta === "slikovnoOdabir") {
                zadaciSlikovnoOdabir.push(rows2[0])
            }
        }

        if (zadaciSlikovnoUnos.length != 0) {
            for (j = 0; j < zadaciSlikovnoUnos.length; j++) {
                zadaci.push(zadaciSlikovnoUnos[j])
            }
        }
        if (zadaciOdabir.length != 0) {
            for (j = 0; j < zadaciOdabir.length; j++) {
                zadaci.push(zadaciOdabir[j])
            }
        }
        if (zadaciUnos.length != 0) {
            for (j = 0; j < zadaciUnos.length; j++) {
                zadaci.push(zadaciUnos[j])
            }
        }
        if (zadaciSlikovnoOdabir.length != 0) {
            for (j = 0; j < zadaciSlikovnoOdabir.length; j++) {
                zadaci.push(zadaciSlikovnoOdabir[j])
            }
        }
    }
    if (rows.length != 0) {
        res.json({
            exercise: rows,
            tasks: zadaci
        })
    } else {
        res.json({
            err: "Greška pri dohvatu škola"
        })
    }
})

router.get('/getSchools', async function (req, res) {
    rows = await getAllSchools()

    if (rows) {
        res.json({
            schools: rows
        })
    } else {
        res.json({
            err: "Greška pri dohvatu škola"
        })
    }
})

router.post('/getClasses', async function (req, res) {
    rows = await getClassesBySchoolId(req.body.idskole)

    if (rows) {
        res.json({
            classes: rows
        })
    } else {
        res.json({
            err: "Greška pri dohvatu razreda"
        })
    }
})

router.post('/getStudents', async function (req, res) {
    rows = await getStudentsBySchoolAndClass(req.body.idskole, req.body.idrazred)

    if (rows) {
        res.json({
            students: rows
        })
    } else {
        res.json({
            err: "Greška pri dohvatu studenata"
        })
    }
})

checkStudent = async function (iducenik, idrazred, idskole, idgrupe) {
    const sql = `SELECT * FROM ucenik NATURAL JOIN razred
                WHERE iducenika = ` + iducenik + `AND idrazred =` + idrazred + `AND idskole =` + idskole;

    const sql2 = `SELECT * FROM logs
                WHERE iducenika = ` + iducenik + `AND idgrupe =` + idgrupe;
    try {
        const result = await db.query(sql, []);
        const result2 = await db.query(sql2, []);

        if (result.rows.length > 0 && result2.rows.length == 0) {
            return result.rows
        }
    } catch (err) {
        console.log(err);
        throw err
    }
}

getAllSchools = async function () {
    const sql = `SELECT * FROM skola`;

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

getClassesBySchoolId = async function (idskole) {
    const sql = `SELECT * FROM razred
        WHERE idskole = ` + idskole;

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

getStudentsBySchoolAndClass = async function (idskole, idrazred) {
    const sql = `SELECT * FROM ucenik NATURAL JOIN razred
    WHERE idrazred = ` + idrazred + ` AND idskole =` + idskole;

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

getExerciseToSolve = async function () {
    const sql = `SELECT * FROM grupa_zadataka
    WHERE pokreni = 1`

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

getTaskById = async function (idzadatka) {
    const sql = `SELECT * FROM zadatak
    WHERE idzad = ` + idzadatka

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

module.exports = router;