"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http = require('http');
var bcrypt = require('bcrypt');
var path = require("path");
var bodyParser = require('body-parser');
var users = require('./data').userDB;
var app = (0, express_1.default)();
var server = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express_1.default.static(path.join(__dirname, './public')));
// MIDDLEWARE
app.use(express_1.default.json());
var employeeIdSequence = 0;
var workedHourIdSequence = 0;
var positionIdSequence = 0;
var salaryIdSequence = 0;
var baseWorkingHours = 8;
var baseWorkingDaysPerWeek = 5;
var baseWorkingDaysPerMonth = 23.23;
var payrollExtraHoursPercent = 1.35;
var employees = [];
var workedHours = [];
var positions = [];
var salaries = [];
var entryRegistrations = [];
var accountRegistrations = [];
var acoountLogins = [];
var permits = [];
var payrolls = [];
var baseUrl = 'http://localhost:3000';
var route = "".concat(baseUrl, "/login");
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
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, './public/login.html'));
});
app.post('/register', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var foundUser, hashPassword, newUser, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                foundUser = users.find(function (data) { return request.body.email === data.email; });
                if (!!foundUser) return [3 /*break*/, 2];
                return [4 /*yield*/, bcrypt.hash(request.body.password, 10)];
            case 1:
                hashPassword = _b.sent();
                newUser = {
                    id: Date.now(),
                    username: request.body.username,
                    email: request.body.email,
                    password: hashPassword,
                };
                users.push(newUser);
                console.log('User list', users);
                response.json("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");
                return [3 /*break*/, 3];
            case 2:
                response.json("<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>");
                _b.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                _a = _b.sent();
                response.json({
                    statusCode: 400,
                    statusValue: 'Bad request',
                    message: "Internal server error"
                });
                return [3 /*break*/, 5];
            case 5:
                ;
                return [2 /*return*/];
        }
    });
}); });
app.post('/login', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var foundUser, submittedPass, storedPass, passwordMatch, username, fakePass, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                foundUser = users.find(function (data) { return request.body.email === data.email; });
                if (!foundUser) return [3 /*break*/, 2];
                submittedPass = request.body.password;
                storedPass = foundUser.password;
                return [4 /*yield*/, bcrypt.compare(submittedPass, storedPass)];
            case 1:
                passwordMatch = _b.sent();
                if (passwordMatch) {
                    username = foundUser.username;
                    response.send("<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ".concat(username, "</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>"));
                }
                else {
                    response.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
                }
                return [3 /*break*/, 4];
            case 2:
                fakePass = "$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga";
                return [4 /*yield*/, bcrypt.compare(request.body.password, fakePass)];
            case 3:
                _b.sent();
                response.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>");
                _b.label = 4;
            case 4:
                ;
                return [3 /*break*/, 6];
            case 5:
                _a = _b.sent();
                response.send({
                    statusCode: 400,
                    statusValue: 'Bad request',
                    message: "Internal server error"
                });
                return [3 /*break*/, 6];
            case 6:
                ;
                return [2 /*return*/];
        }
    });
}); });
// Endpoints employeees
app.get('/employee', function (response) {
    response.json(employees);
});
app.get('/employee/:id', function (request, response) {
    var id = parseInt(request.params.id, 10);
    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: "The user with id ".concat(id, " was not found")
        });
    }
    ;
    var employee = employees.find(function (e) { return e.employeeId === id; });
    response.json({
        statusCode: 200,
        statusValue: 'OK',
        data: employee
    });
});
app.get('/employee/:id/hours', function (request, response) {
    var id = parseInt(request.params.id, 10);
    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: "The user with id ".concat(id, " was not found")
        });
    }
    ;
    var employee = employees.find(function (e) { return e.employeeId === id; });
    if (employee !== undefined) {
        var sumBaseWorkedHours = 0;
        var sumExtarWorkedHours = 0;
        for (var i = 0; i <= workedHours.length; i++) {
            if (workedHours[i].employeeId === employee.employeeId) {
                sumBaseWorkedHours = +workedHours[i].baseWorkedHours;
                sumExtarWorkedHours = +workedHours[i].extraWorkedHours;
            }
            ;
        }
        ;
        var totalWorkedHours = sumBaseWorkedHours + sumExtarWorkedHours;
        var employeeHours = {
            employeeId: id,
            username: employee.username,
            fullName: employee.fullName,
            baseWorkedHours: "The total base worked hours was ".concat(sumBaseWorkedHours),
            extraWorkedHours: "The total extra worked hours was ".concat(sumExtarWorkedHours),
            totalWorkedHours: "The total worked hours was ".concat(totalWorkedHours)
        };
        response.json({
            statusCode: 200,
            statusValue: 'OK',
            data: employeeHours
        });
    }
    ;
});
app.get('/employee/:id/salary', function (request, response) {
    var id = parseInt(request.params.id, 10);
    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: "The user with id ".concat(id, " was not found")
        });
    }
    ;
    var employee = employees.find(function (e) { return e.employeeId === id; });
    var salary = employee.pricePerHour * baseWorkingHours * baseWorkingDaysPerMonth;
    response.json({
        statusCode: 200,
        statusValue: 'OK',
        message: "The employee ".concat(employee.fullName, " salary is ").concat(salary, " per month")
    });
});
app.post('/employee', function (request, response) {
    var _a = request.body, username = _a.username, fullName = _a.fullName, idCard = _a.idCard, pricePerHour = _a.pricePerHour, positionId = _a.positionId;
    employeeIdSequence += 1;
    var newEmployee = {
        employeeId: employeeIdSequence,
        username: username,
        fullName: fullName,
        idCard: idCard,
        pricePerHour: pricePerHour,
        positionId: positionId
    };
    employees.push(newEmployee);
    response.json({
        statusCode: 201,
        statusValue: 'New employee created',
        data: newEmployee
    });
});
app.post('/employee/:id/hours', function (request, response) {
    var id = parseInt(request.params.id, 10);
    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: "The user with id ".concat(id, " was not found")
        });
    }
    ;
    workedHourIdSequence += 1;
    var _a = request.body, baseWorkedHours = _a.baseWorkedHours, extraWorkedHours = _a.extraWorkedHours;
    var newWorkedHours = {
        workedHourId: workedHourIdSequence,
        baseWorkedHours: baseWorkedHours,
        extraWorkedHours: extraWorkedHours,
        employeeId: id
    };
    workedHours.push(newWorkedHours);
    response.json({
        statusCode: 201,
        statusValue: 'New hours registered',
        data: newWorkedHours
    });
});
app.put('/employee/:id', function (request, response) {
    var editId = parseInt(request.params.id, 10);
    if (!editId) {
        response.json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: "The user with id ".concat(editId, " was not found")
        });
    }
    ;
    var _a = request.body, pricePerHour = _a.pricePerHour, positionId = _a.positionId;
    var resourceIndex = employees.findIndex(function (e) { return e.employeeId === editId; });
    if (resourceIndex !== -1) {
        employees[resourceIndex] = {
            employeeId: editId,
            username: employees[resourceIndex].username,
            fullName: employees[resourceIndex].fullName,
            idCard: employees[resourceIndex].idCard,
            pricePerHour: pricePerHour,
            positionId: positionId
        };
        response.json({
            statusCode: 200,
            statusValue: 'Employee data modified',
            data: employees[resourceIndex]
        });
    }
    ;
});
app.delete('/employee/:id', function (request, response) {
    var id = parseInt(request.params.id, 10);
    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: "The user with id ".concat(id, " was not found")
        });
    }
    ;
    var employee = employees.find(function (e) { return e.employeeId === id; });
    var index = 0;
    if (employee !== undefined) {
        index = employees.indexOf(employee);
    }
    ;
    employees.splice(index, 1);
    response.json({
        statusCode: 200,
        statusValue: 'The employee was deleted correctly',
        data: employee
    });
});
// Endpoints cargos
app.get('/cargo', function (response) {
    response.json(positions);
});
app.get('/cargo/:id', function (request, response) {
    var id = parseInt(request.params.id, 10);
    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not found',
            message: "The user with id ".concat(id, " was not found")
        });
    }
    ;
    var employee = employees.find(function (e) { return e.employeeId === id; });
    if (employee !== undefined) {
        var employeePositionId_1 = employee.positionId;
        var position = positions.find(function (p) { return p.positionId === employeePositionId_1; });
        if (position !== undefined) {
            var positionName = position.positionName;
            response.json({
                statusCode: 200,
                statusValue: 'OK',
                data: positionName
            });
        }
        ;
    }
    ;
});
app.get('/cargo/:id/empleado', function (request, response) {
    var id = parseInt(request.params.id, 10); // Position ID
    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not found',
            message: "The user with id ".concat(id, " was not found")
        });
    }
    ;
    var position = positions.find(function (p) { return p.positionId === id; });
    if (position !== undefined) {
        var employeesByPosition = [];
        for (var i = 0; i <= employees.length; i++) {
            if (employees[i].positionId === position.positionId) {
                employeesByPosition.push(employees[i]);
            }
            ;
        }
        ;
        response.json({
            statusCode: 200,
            statusValue: 'OK',
            data: employeesByPosition
        });
    }
    ;
});
app.post('/cargo', function (request, response) {
    var _a = request.body, positionName = _a.positionName, isByPass = _a.isByPass, isActive = _a.isActive;
    positionIdSequence = positions.length + 1;
    salaryIdSequence = salaries.length + 1;
    var newPosition = {
        positionId: positionIdSequence,
        positionName: positionName,
        isByPass: isByPass,
        isActive: isActive,
        salaryId: salaryIdSequence
    };
    positions.push(newPosition);
    response.json({
        statusCode: 201,
        statusValue: 'New position created',
        data: newPosition
    });
});
app.post('/cargo/:id', function (request, response) {
    var id = parseInt(request.params.id, 10);
    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not found',
            message: "The user with id ".concat(id, " was not found")
        });
    }
    ;
    var _a = request.body, positionName = _a.positionName, isByPass = _a.isByPass, isActive = _a.isActive;
    positionIdSequence = positions.length + 1;
    salaryIdSequence = salaries.length + 1;
    var newPosition = {
        positionId: positionIdSequence,
        positionName: positionName,
        isByPass: isByPass,
        isActive: isActive,
        salaryId: salaryIdSequence
    };
    var resourceIndex = employees.findIndex(function (e) { return e.employeeId === id; });
    if (resourceIndex !== -1) {
        employees[resourceIndex] = {
            employeeId: id,
            username: employees[resourceIndex].username,
            fullName: employees[resourceIndex].fullName,
            idCard: employees[resourceIndex].idCard,
            pricePerHour: employees[resourceIndex].pricePerHour,
            positionId: newPosition.positionId
        };
    }
    ;
    response.json({
        statusCode: 200,
        statusValue: 'Employee position modified',
        data: employees[resourceIndex]
    });
});
app.put('/cargo/:id', function (request, response) {
    var id = parseInt(request.params.id, 10);
    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not found',
            message: "The user with id ".concat(id, " was not found")
        });
    }
    ;
    var _a = request.body, positionName = _a.positionName, salaryId = _a.salaryId;
    var resourceIndex = positions.findIndex(function (p) { return p.positionId === id; });
    if (resourceIndex !== -1) {
        positions[resourceIndex] = {
            positionId: id,
            positionName: positionName,
            isByPass: positions[resourceIndex].isByPass,
            isActive: positions[resourceIndex].isActive,
            salaryId: salaryId
        };
    }
    ;
    response.json({
        statusCode: 200,
        statusValue: 'Position modified',
        data: positions[resourceIndex]
    });
});
app.delete('/cargo/:id', function (request, response) {
    var id = parseInt(request.params.id, 10);
    if (!id) {
        response.json({
            statusCode: 404,
            statusValue: 'Not found',
            message: "The user with id ".concat(id, " was not found")
        });
    }
    ;
    var position = positions.find(function (p) { return p.positionId === id; });
    var validateEmployeesInPosition = false;
    var index = 0;
    if (position !== undefined) {
        for (var i = 0; i <= employees.length; i++) {
            if (employees[i].positionId === position.positionId) {
                validateEmployeesInPosition = true;
            }
            ;
        }
        ;
        if (validateEmployeesInPosition === false) {
            index = positions.indexOf(position);
            positions.splice(index, 1);
            response.json({
                statusCode: 200,
                statusValue: 'The position was deleted correctly',
                data: position
            });
        }
        ;
    }
    ;
    response.json({
        statusCode: 400,
        statusValue: 'Bad request',
        message: "Can't delete this position because have employees registered"
    });
});
// Endpoints salaries
app.get('/salarios/cargos', function (request, response) {
});
app.post('salarios', function (request, response) {
});
app.delete('/salarios', function (request, response) {
});
// Endpoints ponches
app.get('/ponche', function (request, response) {
});
app.get('/ponche/empleado/:id', function (request, response) {
});
app.get('/ponche/:id/empleado/hours', function (request, response) {
});
app.post('/ponche/:ponche', function (request, response) {
});
// Endpoints nomina
app.get('/nomina', function (request, response) {
});
app.get('/nomina/empleado/:id', function (request, response) {
});
app.post('/nomina/:id', function (request, response) {
    var id = parseInt(request.params.id, 10);
    var workedHours = 0;
    var extraHours = 0;
    var pricePerHour = 0;
    var extraDays = 0;
    var payrollGenerationDate = '';
    var payrollCutDate = '';
    var permitId = 0;
    var totalSalary = pricePerHour * baseWorkingHours * baseWorkingDaysPerMonth;
    var totalExtraHours = pricePerHour * extraHours * extraDays * payrollExtraHoursPercent;
    var employeePayroll = {
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
/*
let setCookie = (name, value, days) => {
let expires = "";
if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

let getCookie = name => {
  let nameEQ = name + "=";
  let ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

Calling cookie

const close = document.getElementById("closeDescarga");
const downloadBanner = document.getElementById("descargaBanner");

close.addEventListener("click", function() {
  setCookie("closedApp", "true", 30);
  downloadBanner.style.display = "none";
});

const closedApp = getCookie("closedApp");

if (closedApp === null) {
  downloadBanner.style.display = "block";
} else {
  downloadBanner.style.display = "none";
}
setTimeout(()=> {
   const datosLogin= getCookie("login")

   datosLogin.expires == Date.now() ? alert("La sesión va expirar, desea continuar"): null
   return;
},10000)
*/
app.listen(3000, function () { return console.log('Server running at port 3000'); });
