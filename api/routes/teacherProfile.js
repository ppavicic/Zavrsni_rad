const e = require('express');
const express = require('express');
const router = express.Router();
const db = require('../db');
const { get } = require('./loginStudent');

router.post('/addStudent', async function (req, res) {
    let add = await insertStudent(req.body.ime, req.body.prezime, req.body.idRazreda)
    if (add)
        res.json({
            addingError: undefined,
        })
    else
        res.json({
            addingError: 'Greška pri pohrani u bazu'
        })

})

router.post('/addTask', async function (req, res) {
    let tasks = await getTasks()
    let ima = false
    for (i = 0; i < tasks.length; i++) {
        if (tasks[i].idzad == req.body.id)
            ima = true
        break
    }

    let add = false
    if (!ima) {
        add = await insertTask(req.body.id, req.body.vrsta, req.body.pitanje, req.body.tocanOdg,
            req.body.hint, req.body.tipNovca, req.body.odgovor2, req.body.odgovor3, req.body.odgovor4, req.body.novacZaPrikaz)
    }

    if (add)
        res.json({
            addingError: undefined,
        })
    else
        res.json({
            addingError: 'Već postoji zadatak s takvim ID-em'
        })

})

router.post('/addExercise', async function (req, res) {
    let exercises = await getExercises()
    let ima = false
    for (i = 0; i < exercises.length; i++) {
        if (exercises[i].pokreni === 1) {
            ima = true
            break
        }
    }

    let add = false
    if (!ima || (req.body.pokreni == 0)) {
        add = await insertExercise(req.body.naziv, req.body.namjena, req.body.valuta, req.body.pokreni, req.body.idzadataka)
    }
    if (add)
        res.json({
            addingError: undefined,
        })
    else
        res.json({
            addingError: 'Greška pri pohrani u bazu ili već postoji vježba koja je postavljena za pokrenit'
        })

})

router.post('/getStudents', async function (req, res) {
    rows = await getTeacherStudents(req.body.username)

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

router.get('/getExercises', async function (req, res) {
    rows = await getExercises()

    if (rows) {
        res.json({
            exercises: rows
        })
    } else {
        res.json({
            err: "Greška pri dohvatu vježbi"
        })
    }
})

router.get('/getTasks', async function (req, res) {
    rows = await getTasks()

    if (rows) {
        res.json({
            tasks: rows
        })
    } else {
        res.json({
            err: "Greška pri dohvatu zadataka"
        })
    }
})

router.post('/getClasses', async function (req, res) {
    rows = await getClasses(req.body.skola)

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

router.post('/edit', async function (req, res) {
    data = req.body.data
    let update = false
    if (data === "student") {
        update = await updateStudent(req.body.iducenika, req.body.ime, req.body.prezime)
    } else if (data === "zadatak") {
        update = await updateTask(req.body.id, req.body.vrsta, req.body.pitanje, req.body.tocanOdg,
            req.body.hint, req.body.tipNovca, req.body.odgovor2, req.body.odgovor3, req.body.odgovor4, req.body.novacZaPrikaz)
    } else if (data === "vjezba") {
        let exercises = await getExercises()
        let ima = false
        for (i = 0; i < exercises.length; i++) {
            if (exercises[i].pokreni === 1) {
                ima = true
                break
            }
        }

        if (!ima || (req.body.pokreni == 0)) {
            update = await updateExercise(req.body.id, req.body.naziv, req.body.namjena, req.body.valuta, req.body.pokreni, req.body.idzadataka)
        }
    }

    if (update) {
        res.json({
            updateError: undefined,
        })
    } else {
        res.json({
            updateError: 'Greška pri promjeni'
        })
    }
})

router.post('/getStudent', async function (req, res) {
    row = await getStudentById(req.body.identifikator)

    if (row) {
        res.json({
            student: row
        })
    } else {
        res.json({
            err: "Greška pri dohvatu studenta"
        })
    }
})

router.post('/getTask', async function (req, res) {
    row = await getTaskById(req.body.identifikator)

    if (row) {
        res.json({
            task: row
        })
    } else {
        res.json({
            err: "Greška pri dohvatu zadatka"
        })
    }
})

router.post('/getExercise', async function (req, res) {
    row = await getExerciseById(req.body.identifikator)

    if (row) {
        res.json({
            exercise: row
        })
    } else {
        res.json({
            err: "Greška pri dohvatu vježbe"
        })
    }
})

router.post('/getSolvedExercises', async function (req, res) {
    row = await getSolvedExercisesByStudentId(req.body.studentId)

    if (row) {
        res.json({
            exercises: row
        })
    } else {
        res.json({
            err: "Student nije radio nijednu vježbu"
        })
    }
})

router.post('/getAnswers', async function (req, res) {
    row = await getAnswers(req.body.exerciseId, req.body.studentId)
    row2 = await getExerciseById(req.body.exerciseId)

    console.log(row)
    if (row) {
        res.json({
            answers: row,
            exercise: row2
        })
    } else {
        res.json({
            err: "Greška pri dohvatu rješenja"
        })
    }
})

getAnswers = async function (exerciseId, studentId) {
    const sql = `SELECT *
                 FROM logs LEFT JOIN zadatak
                    ON idzadatka = idzad
                 WHERE iducenika = ` + studentId + ` AND idgrupe = ` + exerciseId +
                `ORDER BY vrijeme`;
    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

getSolvedExercisesByStudentId = async function (studentId) {
    const sql = `SELECT DISTINCT ON (idgrupe) *
                 FROM logs NATURAL JOIN grupa_zadataka
                 WHERE iducenika = ` + studentId;
    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

insertExercise = async function (naziv, namjena, valuta, pokreni, idzadataka) {
    const sql = `INSERT INTO grupa_zadataka (namjena, valuta, pokreni, naziv, zadaci) 
    VALUES ('` + namjena + `', '` + valuta + `', '` + pokreni + `', '` + naziv + `', '` + idzadataka + `')`;

    try {
        const result = await db.query(sql, []);
        return true
    } catch (err) {
        throw err
    }
}

insertTask = async function (id, vrsta, pitanje, tocanOdgovor, hint, tipNovca, odgovor2, odgovor3, odgovor4, novacZaPrikaz) {
    const sql = `INSERT INTO zadatak (idzad, vrsta, pitanje, tocanodgovor, hint, tipnovca, drugiodgovor, treciodgovor, cetvrtiodgovor, novaczaprikaz)
    VALUES ('` + id + `', '` + vrsta + `', '` + pitanje + `', '` + tocanOdgovor + `', '` + hint + `', '` + tipNovca + `', '`
        + odgovor2 + `', '` + odgovor3 + `', '` + odgovor4 + `', '` + novacZaPrikaz + `')`;

    try {
        const result = await db.query(sql, []);
        return true
    } catch (err) {
        throw err
    }
}

insertStudent = async function (ime, prezime, idRazreda) {
    const sql = `INSERT INTO ucenik (ime, prezime, idrazred) 
    VALUES ('` + ime + `', '` + prezime + `', '` + idRazreda + `')`;

    try {
        const result = await db.query(sql, []);
        return true
    } catch (err) {
        throw err
    }
}

getExercises = async function () {
    const sql = `SELECT *
    FROM grupa_zadataka`;

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

getTasks = async function () {
    const sql = `SELECT *
    FROM zadatak`;

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

getTeacherStudents = async function (username) {
    let teacher = await getTeacherByUsername(username)
    const sql = `SELECT *
    FROM ucenik NATURAL JOIN razred
    WHERE iducitelja =`+ teacher[0].iducitelja;

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

getClasses = async function (skola) {
    const sql = `SELECT idrazred, odjeljenje
    FROM razred NATURAL JOIN skola
    WHERE imeskole = '`+ skola + `'`;

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

getTeacherByUsername = async function (username) {
    const sql = `SELECT *
    FROM ucitelj WHERE korisnickoime ='` + username + `'`;

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

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

updateStudent = async function (iducenika, ime, prezime) {
    const sql = `UPDATE ucenik
    SET ime = '` + ime + `', prezime = '` + prezime + `'
    WHERE iducenika ='` + iducenika + `'`;

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

getTaskById = async function (identifikator) {
    const sql = `SELECT *
    FROM zadatak WHERE idzad ='` + identifikator + `'`;

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

updateTask = async function (id, vrsta, pitanje, tocanOdgovor, hint, tipNovca, odgovor2, odgovor3, odgovor4, novacZaPrikaz) {
    console.log(id, vrsta, pitanje, tocanOdgovor, hint)
    const sql = `UPDATE zadatak
    SET pitanje = '` + pitanje + `', tocanodgovor = '` + tocanOdgovor + `', hint = '` + hint + `', tipnovca = '` + tipNovca + `', drugiodgovor = '`
        + odgovor2 + `', treciodgovor = '` + odgovor3 + `', cetvrtiodgovor = '` + odgovor4 + `', novacZaPrikaz = '` + novacZaPrikaz + `'
    WHERE idzad ='` + id + `'`;

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

getExerciseById = async function (identifikator) {
    const sql = `SELECT *
    FROM grupa_zadataka WHERE idgrupe ='` + identifikator + `'`;

    try {
        const result = await db.query(sql, []);
        return result.rows
    } catch (err) {
        console.log(err);
        throw err
    }
}

updateExercise = async function (id, naziv, namjena, valuta, pokreni, idzadataka) {
    const sql = `UPDATE grupa_zadataka
    SET naziv = '` + naziv + `', namjena = '` + namjena + `', valuta = '` + valuta + `', pokreni = '` + pokreni + `', zadaci = '` + idzadataka + `'
    WHERE idgrupe ='` + id + `'`;

    try {
        const result = await db.query(sql, []);
        return true
    } catch (err) {
        console.log(err);
        throw err
    }
}

module.exports = router;