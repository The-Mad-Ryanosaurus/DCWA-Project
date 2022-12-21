var pmysql = require("promise-mysql")
var pool
pool = pmysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'proj2022'
})
    .then((p) => {
        pool = p
    })
    .catch((e) => {
        console.log("pool error:" + e)
    })

var getEmployees = function () {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM employee")
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

var getEmployeeforUpdate = function (eid) {
    return new Promise((resolve, reject) => {
        pool.query(`select * from employee where eid like "${eid}";`)
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

var updateEmployee = function (employee) {
    return new Promise((resolve, reject) => {
        let temp = `Update employee set ename='${employee.ename}', role='${employee.role}', salary='${employee.salary}' where eid like '${employee.eid}'`;
        console.log(temp);
        pool.query(temp)
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

var getDepartments = function () {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM dept")
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

var deleteDepartment = function (did) {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM dept WHERE did LIKE "${did}";`)
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })

}

module.exports = {
    getEmployees, getDepartments, getEmployeeforUpdate,
    updateEmployee, deleteDepartment
}