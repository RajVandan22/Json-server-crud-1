let cl = console.log;
const BASE_URL = `http://localhost:3000`;
const POST_URL = `${BASE_URL}/employees`;

//==================================================================================
const employeeData = document.getElementById('employeeData');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const closeform = [...document.getElementsByClassName('closeForm')];
const employeeform = document.getElementById('employeeForm');
const showForm = document.getElementById('showForm');
const backdrop = document.getElementById('backdrop');
const updateBtn = document.getElementById('updateBtn');
const addBtn = document.getElementById('addBtn');

const nameControl = document.getElementById('name');
const emailControl = document.getElementById('email');
const departmentControl = document.getElementById('department');
const salaryControl = document.getElementById('salary');
const handing = document.getElementById('handing');


//====================================================================================
function snackBar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}
//=====================================================================================
function handleSpinner(flag) {
    if (flag) {
        spinner.classList.add('d-none');
    } else {
        spinner.classList.remove('d-none');
    }
}
//========================================================================================
function fetchEmployeeData() {
    let xhr = new XMLHttpRequest();
    handleSpinner()
    xhr.open("GET", POST_URL);
    xhr.send(null);
    xhr.onload = function () {
        let res = JSON.parse(xhr.response);
        if (xhr.status === 200) {
            creatEmployeesData(res);
            // snackBar('EmployeeData feteched Successfully!!', 'success');

        } else {
            snackBar('Unable to fetch employee data', 'error');
        }
        handleSpinner(true);
    }
    xhr.onerror = function () {
        handleSpinner(true);
        snackBar('Unable to connect to server', 'error');
    };

}
fetchEmployeeData();

//=========================================================================================
function creatEmployeesData(arr) {
    cl('emplo data created');
    let result = '';
    arr.forEach((employee, i) => {
        result += `<tr id=${employee.id}>
                <td>${i + 1}</td>
                <td>${employee.name}</td>
                <td>${employee.email}</td>
                <td>${employee.department}</td>
                <td>₹${employee.salary}</td>
                <td class="action-column">
                    <button class="btn btn-sm btn-primary mr-2" onclick="editEmployee(this)">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEmplyee(this)">Delete</button>
                </td>
            </tr>`
    })

    employeeData.innerHTML = result;
}
function onToggle() {
    showForm.classList.toggle('active');
    backdrop.classList.toggle('active');
    employeeform.reset();
    updateBtn.classList.add('d-none');
    addBtn.classList.remove('d-none');
}

//=============================================================================
function onAddEmployee(eve) {
    eve.preventDefault();
    // cl('hello');
    if (nameControl.value === '' || emailControl.value === '' || departmentControl.value === '' || salaryControl.value === '') {
        snackBar('please filled all field', 'error');
    } else {
        let employee = {
            name: nameControl.value,
            email: emailControl.value,
            department: departmentControl.value,
            salary: salaryControl.value,
        }
        cl(employee);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', POST_URL);
        xhr.send(JSON.stringify(employee));
        xhr.onload = function () {
            if (xhr.status === 200) {
                let res = JSON.parse(xhr.response);
                onToggle();
                let tr = document.createElement(tr);
                tr.id = res.id;
                tr.innerHTML = `<td>${i + 1}</td>
                                <td>${employee.name}</td>
                                <td>${employee.email}</td>
                                <td>${employee.department}</td>
                                <td>₹${employee.salary}</td>
                                <td class="action-column">
                                <button class="btn btn-sm btn-primary mr-2" onclick="editEmployee(this)">Edit</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteEmplyee(this)">Delete</button>
                                </td>`
                employeeData.append(tr);
                snackBar('Employee data Added successfully', 'success');
            } else {
                snackBar('Unable to added employee data', 'error');
            }
            handleSpinner(true);
        }
        xhr.onerror = function () {
            handleSpinner(true);
            snackBar('Unable to connect to server', 'error');
        };
    }
}
//====================================================================================================
function editEmployee(ele) {
    const editId = ele.closest('tr').id;
    cl(editId);
    localStorage.setItem('editid', editId);
    const EDIT_URL = `${POST_URL}/${editId}`
    handleSpinner();
    let xhr = new XMLHttpRequest();
    xhr.open("GET", EDIT_URL);
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status === 200) {
            let res = JSON.parse(xhr.response);
            cl(res);
            onToggle();
            nameControl.value = res.name;
            emailControl.value = res.email;
            departmentControl.value = res.department;
            salaryControl.value = res.salary;
            handing.innerHTML = 'Edit Employee Data';
            addBtn.classList.add('d-none');
            updateBtn.classList.remove('d-none');
        } else {
            snackBar('Unable to get employee data', 'error');
        }
        handleSpinner(true);
    };
    xhr.onerror = function () {
        snackBar('Unable to connect to server', 'error');
        handleSpinner(true);
    };
}
//==============================================================================================
function updateEmployee(ele) {
    let updateId = localStorage.getItem('editid');
    let updatedEmployee = {
        name: nameControl.value,
        email: emailControl.value,
        department: departmentControl.value,
        salary: salaryControl.value,
    };
    const UPDATE_URL = `${POST_URL}/${updateId}`;
    handleSpinner();
    let xhr = new XMLHttpRequest();
    xhr.open("PATCH", UPDATE_URL);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(updatedEmployee));

    xhr.onload = function () {
        if (xhr.status == 200) {
            let tr = document.getElementById(updateId);
            tr.id = updateId;
            tr.innerHTML = `<td>${i + 1}</td>
                                <td>${updateEmployee.name}</td>
                                <td>${updateEmployee.email}</td>
                                <td>${updateEmployee.department}</td>
                                <td>₹${updateEmployee.salary}</td>
                                <td class="action-column">
                                <button class="btn btn-sm btn-primary mr-2" onclick="editEmployee(this)">Edit</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteEmplyee(this)">Delete</button>
                            </td>`
                            
                            snackBar('EmployeeData Update Successfully!!!', 'success');
                            
                        } else {
                            snackBar(`Unable to delete Employee ID ${id}`, 'error');
                        }
                        handleSpinner(true);
    };

    xhr.onerror = function () {
        snackBar('Unable to connect to server', 'error');
        handleSpinner(true);
    };

}
//==============================================================================================
function deleteEmplyee(ele) {
    let deleteId = ele.closest('tr').id

    Swal.fire({
        title: "Are you sure?",
        text: `You want to delete employee ID ${deleteId}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel"
    })
        .then(function (result) {
            if (result.isConfirmed) {
                handleSpinner();
                let xhr = new XMLHttpRequest();
                const Delete_URL = `${POST_URL}/${deleteId}`
                xhr.open('DELETE', Delete_URL);
                xhr.send(null);
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        document.getElementById(deleteId).remove();
                        snackBar("Delete Employee Successfully!!", 'success');
                    } else {
                        snackBar(`Unable to delete Employee ID ${deleteId}`, 'error');
                    }
                    handleSpinner(true);
                }
                xhr.onerror = function () {
                    snackBar('Unable to connect to server', 'error');
                    handleSpinner(true);
                }
            }

        });
}
//===============================================================================================
addEmployeeBtn.addEventListener('click', onToggle);
closeform.forEach(ele => {
    ele.addEventListener('click', onToggle);
})
employeeform.addEventListener('submit', onAddEmployee);
updateBtn.addEventListener('click', updateEmployee);