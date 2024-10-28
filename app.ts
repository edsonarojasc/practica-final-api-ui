import express, { Request, Response } from 'express';
import axios from 'axios';

const http = require('http');
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');
const users = require('./data').userDB;

const app = express();

const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'./public')));

// MIDDLEWARE

app.use(express.json());

type Employee = { 
    employeeId: number,
    username: string,
    fullName: string,
    idCard: string,
    pricePerHour: number,
    positionId: number
};

type WorkedHour = {
    workedHourId: number,
    baseWorkedHours: number,
    extraWorkedHours: number,
    employeeId: number
};

type EntryRegister = {
    entryRegisterId: number,
    entryTime: string,
    departureTime: string,
    isActive: boolean,
    employeeId: string
};

type Position = {
    positionId: number,
    positionName: string,
    isByPass: boolean,
    isActive: boolean,
    salaryId: number
};

type Salary = {
    salaryId: number,
    salary: number
};

type AccountRegister = {
    user: string,
    password: number,
    firstName: string,
    lastName: string
};

type AccountLogin = {
    user: string,
    password: number,
    token: number,
    creationTime: any,
    expirationTime: any,
    sid: any,
    permits: string
};

type Permit = {
    permitId: number,
    permit: string,
    isActive: boolean
};

type Payroll = {
    payrollId: number,
    workedHours: number,
    extraHours: number,
    totalSalary: number,
    totalExtraHours: number,
    totalPayroll: number,
    payrollGenerationDate: any,
    payrollCutDate: any,
    permitId: number
};

let employeeIdSequence: number = 0;
let workedHourIdSequence: number = 0;
let positionIdSequence: number = 0;
let salaryIdSequence: number = 0;

const baseWorkingHours:number = 8;
const baseWorkingDaysPerWeek: number = 5;
const baseWorkingDaysPerMonth: number = 23.23;
const payrollExtraHoursPercent: number = 1.35;

let employees: Employee[] = [];
let workedHours: WorkedHour[] = [];
let positions: Position[] = [];
let salaries: Salary[] = [];
let entryRegistrations: EntryRegister[] = [];
let accountRegistrations: AccountRegister[] = [];
let acoountLogins: AccountLogin[] = [];
let permits: Permit[] = [];
let payrolls: Payroll[] = [];

const baseUrl = 'http://localhost:3000';
const route = `${baseUrl}/login`;

// DATA

positions = [
    { positionId: 1, positionName: 'Director', isByPass: true, isActive: true, salaryId: 1 },
    { positionId: 2, positionName: 'Gerente', isByPass: true, isActive: true, salaryId: 2 },
    { positionId: 3, positionName: 'Encargado', isByPass: false, isActive: true, salaryId: 3 },
    { positionId: 4, positionName: 'Coordinador', isByPass: false, isActive: true, salaryId: 4 },
    { positionId: 5, positionName: 'Analista', isByPass: false, isActive: true, salaryId: 5 },
    { positionId: 6, positionName: 'Empleado', isByPass: false, isActive: true, salaryId: 6 }
];

salaries = [
    { salaryId: 1, salary: 120000 },
    { salaryId: 2, salary: 100000 },
    { salaryId: 3, salary: 80000 },
    { salaryId: 4, salary: 60000 },
    { salaryId: 5, salary: 45000 },
    { salaryId: 6, salary: 30000 },
];

// ENDPOINTS:

// Endpoints accounts

app.get('/',(request: Request,response: Response) => {
    response.sendFile(path.join(__dirname,'./public/login.html'));
});

app.post('/register', async (request: Request, response: Response) => {
    try {
        let foundUser = users.find((data) => request.body.email === data.email);

        if (!foundUser) {
            let hashPassword = await bcrypt.hash(request.body.password, 10);
    
            let newUser = {
                id: Date.now(),
                username: request.body.username,
                email: request.body.email,
                password: hashPassword,
            };

            users.push(newUser);
            
            console.log('User list', users);
    
            response.json("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");
        } else {
            response.json("<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>");
        }
    } catch {
        response.json({
            statusCode: 400,
            statusValue: 'Bad request',
            message: "Internal server error"
        });
    };
});

app.post('/login', async (request: Request, response: Response) => {
    try {
        let foundUser = users.find((data) => request.body.email === data.email);
        if (foundUser) {
    
            let submittedPass = request.body.password; 
            let storedPass = foundUser.password; 
    
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                let username = foundUser.username;
                response.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${username}</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`);
            } else {
                response.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
            }
        } else {
    
            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(request.body.password, fakePass);
    
            response.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>");
        };
    } catch {
        response.send({
            statusCode: 400,
            statusValue: 'Bad request',
            message: "Internal server error"
        });
    };
});

// Endpoints employeees

app.get('/employee', (response: Response) => {
    response.json(employees);
});

app.get('/employee/:id', (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);

    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: `The user with id ${id} was not found`
        });
    };

    const employee = employees.find( (e: Employee) => e.employeeId === id );

    response.json({
        statusCode: 200,
        statusValue: 'OK',
        data: employee
    });
});

app.get('/employee/:id/hours', (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);

    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: `The user with id ${id} was not found`
        });
    };

    const employee = employees.find( (e: Employee) => e.employeeId === id );

    if (employee !== undefined) {
        let sumBaseWorkedHours: number = 0;
        let sumExtarWorkedHours: number = 0;

        for (let i = 0; i <= workedHours.length; i++) {
            if (workedHours[i].employeeId === employee.employeeId) {
                sumBaseWorkedHours =+ workedHours[i].baseWorkedHours;
                sumExtarWorkedHours =+ workedHours[i].extraWorkedHours;
            };
        };

        const totalWorkedHours = sumBaseWorkedHours + sumExtarWorkedHours;

        const employeeHours = {
            employeeId: id,
            username: employee.username,
            fullName: employee.fullName,
            baseWorkedHours: `The total base worked hours was ${sumBaseWorkedHours}`,
            extraWorkedHours: `The total extra worked hours was ${sumExtarWorkedHours}`,
            totalWorkedHours: `The total worked hours was ${totalWorkedHours}`
        };

        response.json({
            statusCode: 200,
            statusValue: 'OK',
            data: employeeHours
        });
    };
});

app.get('/employee/:id/salary', (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    
    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: `The user with id ${id} was not found`
        });
    };

    const employee: any = employees.find( (e: Employee) => e.employeeId === id );
    const salary: number = employee.pricePerHour * baseWorkingHours * baseWorkingDaysPerMonth;

    response.json({
        statusCode: 200,
        statusValue: 'OK',
        message: `The employee ${employee.fullName} salary is ${salary} per month`
    });
});

app.post('/employee', (request: Request, response: Response) => {
    const { username, fullName, idCard, pricePerHour, positionId } = request.body;

    employeeIdSequence += 1;

    const newEmployee: Employee = {
        employeeId: employeeIdSequence,
        username,
        fullName,
        idCard,
        pricePerHour,
        positionId
    };

    employees.push(newEmployee);

    response.json({
        statusCode: 201,
        statusValue: 'New employee created',
        data: newEmployee
    });
});

app.post('/employee/:id/hours', (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    
    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: `The user with id ${id} was not found`
        });
    };

    workedHourIdSequence += 1;
 
    const { baseWorkedHours, extraWorkedHours } = request.body;

    const newWorkedHours: WorkedHour = {
        workedHourId: workedHourIdSequence,
        baseWorkedHours,
        extraWorkedHours,
        employeeId: id
    };

    workedHours.push(newWorkedHours);

    response.json({
        statusCode: 201,
        statusValue: 'New hours registered',
        data: newWorkedHours
    }); 
});

app.put('/employee/:id', (request: Request, response: Response) => {
    const editId: number = parseInt(request.params.id, 10);
 
    if (!editId) {
        response.json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: `The user with id ${editId} was not found`
        });
    };

    const { pricePerHour, positionId } = request.body;

    const resourceIndex = employees.findIndex( (e: Employee) => e.employeeId === editId );

    if (resourceIndex !== -1) {
        employees[resourceIndex] = {
            employeeId: editId,
            username: employees[resourceIndex].username,
            fullName: employees[resourceIndex].fullName,
            idCard: employees[resourceIndex].idCard,
            pricePerHour,
            positionId
        };

        response.json({
            statusCode: 200,
            statusValue: 'Employee data modified',
            data: employees[resourceIndex]
        });
    };
});

app.delete('/employee/:id', (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    
    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: `The user with id ${id} was not found`
        });
    };

    const employee = employees.find( (e: Employee) => e.employeeId === id );
    let index: number = 0;
    
    if (employee !== undefined) {
        index = employees.indexOf(employee);
    };
    
    employees.splice(index, 1);

    response.json({
        statusCode: 200,
        statusValue: 'The employee was deleted correctly',
        data: employee
    });
});

// Endpoints cargos

app.get('/cargo', (response: Response) => {
    response.json(positions);
});

app.get('/cargo/:id', (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);

    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not found',
            message: `The user with id ${id} was not found`
        });
    };

    const employee = employees.find( (e: Employee) => e.employeeId === id )

    if (employee !== undefined) {
        const employeePositionId: number = employee.positionId;

        const position = positions.find( (p: Position) => p.positionId === employeePositionId );

        if(position !== undefined) {
            const positionName: string = position.positionName;
        
            response.json({
                statusCode: 200,
                statusValue: 'OK',
                data: positionName
            });
        };
    };
});

app.get('/cargo/:id/empleado', (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10) // Position ID

    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not found',
            message: `The user with id ${id} was not found`
        });
    };

    const position = positions.find( (p: Position) => p.positionId === id );

    if (position !== undefined) {
        let employeesByPosition: Employee[] = [];

        for (let i = 0; i <= employees.length; i++) {
            if (employees[i].positionId === position.positionId) {
                employeesByPosition.push(employees[i]);
            };
        };

        response.json({
            statusCode: 200,
            statusValue: 'OK',
            data: employeesByPosition    
        });
    };
});

app.post('/cargo', (request: Request, response: Response) => {
    const { positionName, isByPass, isActive } = request.body;

    positionIdSequence = positions.length + 1;
    salaryIdSequence = salaries.length + 1; 

    const newPosition: Position = {
        positionId: positionIdSequence,
        positionName,
        isByPass,
        isActive,
        salaryId: salaryIdSequence
    };

    positions.push(newPosition);

    response.json({
        statusCode: 201,
        statusValue: 'New position created',
        data: newPosition
    });
});

app.post('/cargo/:id', (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);

    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not found',
            message: `The user with id ${id} was not found`
        });
    };

    const { positionName, isByPass, isActive } = request.body;

    positionIdSequence = positions.length + 1;
    salaryIdSequence = salaries.length + 1;

    const newPosition: Position = {
        positionId: positionIdSequence,
        positionName,
        isByPass,
        isActive,
        salaryId: salaryIdSequence
    };

    const resourceIndex = employees.findIndex( (e: Employee) => e.employeeId === id );

    if (resourceIndex !== -1) {
        employees[resourceIndex] = {
            employeeId: id,
            username: employees[resourceIndex].username,
            fullName: employees[resourceIndex].fullName,
            idCard: employees[resourceIndex].idCard,
            pricePerHour: employees[resourceIndex].pricePerHour,
            positionId: newPosition.positionId
        };
    };

    response.json({
        statusCode: 200,
        statusValue: 'Employee position modified',
        data: employees[resourceIndex]
    });
});

app.put('/cargo/:id', (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);

    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not found',
            message: `The user with id ${id} was not found`
        });
    };

    const { positionName, salaryId } = request.body;

    const resourceIndex = positions.findIndex( (p: Position) => p.positionId === id);

    if (resourceIndex !== -1) {
        positions[resourceIndex] = {
            positionId: id,
            positionName,
            isByPass: positions[resourceIndex].isByPass,
            isActive: positions[resourceIndex].isActive,
            salaryId            
        };
    };

    response.json({
        statusCode: 200,
        statusValue: 'Position modified',
        data: positions[resourceIndex]
    });
});

app.delete('/cargo/:id', (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);

    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not found',
            message: `The user with id ${id} was not found`
        });
    };

    const position = positions.find( (p: Position) => p.positionId === id );

    let validateEmployeesInPosition: boolean = false;
    let index: number = 0;

    if (position !== undefined) {
        for (let i = 0; i <= employees.length; i++) {
            if(employees[i].positionId === position.positionId) {
                validateEmployeesInPosition = true;
            };
        };
    
        if (validateEmployeesInPosition === false) {
            index = positions.indexOf(position);
    
            positions.splice(index, 1);

            response.json({
                statusCode: 200,
                statusValue: 'The position was deleted correctly',
                data: position
            });
        };
    };

    response.json({
        statusCode: 400,
        statusValue: 'Bad request',
        message: "Can't delete this position because have employees registered"
    });
});

// Endpoints salaries

app.get('/salarios/cargos', (request: Request, response: Response) => {

});

app.post('salarios', (request:Request, response: Response) => {

});

app.delete('/salarios', (request: Request, response: Response) => {

});

// Endpoints ponches

app.get('/ponche', (request: Request, response: Response) => {

});

app.get('/ponche/empleado/:id', (request: Request, response: Response) => {

});

app.get('/ponche/:id/empleado/hours', (request: Request, response: Response) => {

});

app.post('/ponche/:ponche', (request:Request, response: Response) => {

});

// Endpoints nomina

app.get('/nomina', (request: Request, response: Response) => {

});

app.get('/nomina/empleado/:id', (request:Request, response: Response) => {

});

app.post('/nomina/:id', (request:Request, response: Response) => {
    const id = parseInt(request.params.id, 10);
    const workedHours: number = 0;
    const extraHours: number = 0;
    const pricePerHour: number = 0;
    const extraDays: number = 0;
    const payrollGenerationDate: any = '';
    const payrollCutDate: any = '';
    const permitId: number = 0;

    const totalSalary: number = pricePerHour * baseWorkingHours * baseWorkingDaysPerMonth; 
    const totalExtraHours: number = pricePerHour * extraHours * extraDays * payrollExtraHoursPercent;

    const employeePayroll: Payroll = {
        payrollId: id,
        workedHours: workedHours,
        extraHours: extraHours,
        totalSalary: totalSalary,
        totalExtraHours: totalExtraHours,
        totalPayroll: totalSalary + totalExtraHours,
        payrollGenerationDate: payrollGenerationDate,
        payrollCutDate: payrollCutDate,
        permitId: permitId
    };

    payrolls.push(employeePayroll);

    response.json({
        statusCode: 200,
        statusValue: '',
        data: employeePayroll
    });
});

app.listen(3000, () => console.log('Server running at port 3000'));