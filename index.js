const mysql = require('mysql');
const express = require('express');
const app = express();

app.use(express.json());

let mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employeedb',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err) {
        console.log('DB connection succeded')
    } else {
        console.log('DB connection failed \n Error: ' + JSON.stringify(err, undefined, 2));
    }
});

app.listen(3001, () => console.log('Express server is running at port no. 3001'));


app.get('/employees', (req, res) => {
    mysqlConnection.query('SELECT * FROM Employee', (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        } else {
            console.log(err)
        }
    })
});


app.get('/employees/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM Employee WHERE EmpId = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        } else {
            console.log(err)
        }
    })
});


app.delete('/employees/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM Employee WHERE EmpId = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send('Deleted successfully')
        } else {
            console.log(err)
        }
    })
});

app.post('/employees', (req, res) => {
    let emp = req.body;
    console.log(emp);
    let sql = "SET @EmpId = ?;SET @Name = ?;SET @EmpCode = ?; SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpId,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpId, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err) {
            rows.forEach(element => {
                if (Array.isArray(element)) {
                    res.send('Inserted employee id: '+ element[0].EmpId);
                }
            });
        } else {
            console.log(err)
        }
    })
});

app.put('/employees', (req, res) => {
    let emp = req.body;
    console.log(emp);
    let sql = "SET @EmpId = ?;SET @Name = ?;SET @EmpCode = ?; SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpId,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpId, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err) {
            res.send('Updated successfully')
        } else {
            console.log(err)
        }
    })
});







