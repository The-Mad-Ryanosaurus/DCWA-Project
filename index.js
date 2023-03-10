const e = require('express')
const { check, validationResult } = require('express-validator')
const { ReadConcern } = require("mongodb")
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
let ejs = require('ejs')
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
// END OF IMPORTS

// DAO REQUIREMENTS
var DAOSQL = require("./DAOSQL");
var DAOMongoDB = require("./DAOMongoDB");


app.listen(3004, () => {
    console.log("Server Listening on Port 3004:");
});

app.get('/', (req, res) => {
    console.log("Get Request on /")
    res.render("home");
});

//SQL EMPLOYEE DATABASE
app.get("/EmployeesSQL", (req, res) => {
    DAOSQL.getEmployees()
        .then((emp) => {
            res.render('employeesSQLDB', { employees: emp })
        })
        .catch((error) => {
            if (error.errorno == 1146) {
                res.send("Invalid Table " + error.sqlMessage)
            }
            else (
                res.send(error)
            )
        })
})
//SQL EMPLOYEE EDIT DATABASE
app.get("/EmployeesSQL/edit/:eid", (req, res) => {
    DAOSQL.getEmployeeforUpdate(req.params.eid)
        .then((ee) => {
            res.render('editEmployeeSQL', { editEmployeeSQL: ee[0], errors: undefined })
        })
        .catch((error) => {
            if (error.errorno == 1146) {
                res.send("Invalid Table " + error.sqlMessage)
            }
            else (
                res.send(error)
            )
        })
})
//SQL EMPLOYEE CHECK CRITERIA/EDIT EMPLOYEES
app.post("/EmployeesSQL/edit/",

    [
        // Checks the ID is at least 1 character long
        check("eid").isLength({ min: 1 })
            .withMessage("EID is not Editable!")
    ],
    [
        // Checks the name is 5 characters long
        check("ename").isLength({ min: 5 })
            .withMessage("Please enter full Name:")
    ],
    [
        // Checks the roll isnt the first in the dropdown menu
        check("role").isIn(["Manager", "Employee"])
            .withMessage("Please enter Role")
    ],
    [
        // Checks the salary is greater than 0
        check("salary").isFloat({ gt: 0 })
            .withMessage("Please enter Salary")
    ],
    (req, res) => {
        console.log(req.body)
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render("editEmployeeSQL",
                { errors: errors.errors, editEmployeeSQL: req.body })
        } else {
            DAOSQL.updateEmployee(req.body)
                .then((ue) => {
                    console.log("Success")
                }).catch((error) => {
                    console.log(error)
                })

            res.redirect("/")

        }
    })
//SQL DEPARTMENTS
app.get("/Departments", (req, res) => {
    DAOSQL.getDepartments()
        .then((dep) => {
            res.render('departments', { departments: dep })
        })
        .catch((error) => {
            if (error.errno == 1146) {
                res.send("Invalid table: " + error.sqlMessage)
            }
            else (
                res.send(error)
            )
        })
})
//SQL GET DEPARTMENT AND DELETE
app.get("/Departments/deleteDepartments/:did", (req, res) => {
    DAOSQL.deleteDepartment(req.params.did)
        .then((dd) => {
            res.redirect("/departments")
        })
        .catch((error) => {
            if (error.errno == 1146) {
                res.send("Invalid table: " + error.sqlMessage)
            }
            else {
                res.render("deleteDepartments", { depDID: req.params.did })


            }
        })
})



// MONGODB DATABASE
app.get("/EmployeesMongoDB", (req, res) => {
    DAOMongoDB.findAll()
        .then((data) => {
            res.render("employeesMongoDB", { employeesMongoDB: data })
        })
        .catch((error) => {
            if (error.errorno == 1146) {
                res.send("Invalid Table " + error.sqlMessage)
            }
            else (
                res.send(error)
            )
        })
})

app.get("/EmployeesMongoDB/add", (req, res) => {
    res.render("addEmployeesMongoDB", { addEmployeeMongo: e, errors: undefined })
})

app.post("/EmployeesMongoDB/add",
    [
        check("_id").isLength({ min: 4 })
            .withMessage("EID must be 4 characters")
    ],
    [
        check("phone").isLength({ min: 5 })
            .withMessage("Phone must be >5 characters")
    ],
    [
        check("email").isEmail()
            .withMessage("Email must be a valid email address.")
    ],
    (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render("addEmployeesMongoDB",
                { errors: errors.errors })
        } else {

            // ERROR MESSAGES FOR SQL AND MONGO DATA ENTRIES
            DAOSQL.getEmployeeforUpdate(req.body._id)
                .then((e) => {
                    console.log(e)
                    if (e.length == 0)
                        res.render("errorSQLDB", { empSQL: req.body._id })
                    else {
                        DAOMongoDB.addEmployee(req.body)
                            .then((e) => {
                                console.log("Worked")
                                res.redirect("/EmployeesMongoDB")
                            }).catch((error) => {
                                console.log("Did not work")
                                res.render("errorMongoDB", { empMongo: req.body._id })
                            })
                    }
                }).catch((error) => {
                    console.log(error)

                    res.redirect("/")
                })
        }

    })

