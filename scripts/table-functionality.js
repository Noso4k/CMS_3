document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById("student-table-body");
    const modal = document.querySelector("#confirmDeleteModal");
    const deleteMessage = modal.querySelector("#modal__text strong");
    const selectAllCheckbox = document.querySelector("#select-all");
    const formWindow = document.querySelector("#form-modal");
    const formTitle = formWindow.querySelector("h2");
    const form = formWindow.querySelector("form");

    function makeEmptyBuffer(){
        let emptyObject = {
          id: "",
          group_id: "",
          firstName: "",
          lastName: "",
          gender_id: "",
          birthday: "",
          status: false
        };
        return emptyObject;
     }
    
    const overlay = document.querySelector('.overlay-form');

    function updateSelectAllState() {
        const studentCheckboxes = tableBody.querySelectorAll(".student-table__checkbox");
        selectAllCheckbox.checked = studentCheckboxes.length > 0 && [...studentCheckboxes].every(checkbox => checkbox.checked);
    }

    selectAllCheckbox.addEventListener("change", function() {
        const isChecked = this.checked;
        tableBody.querySelectorAll(".student-table__checkbox").forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    });

    tableBody.addEventListener("change", function(event) {
        if (event.target.classList.contains("student-table__checkbox")) {
            updateSelectAllState();
        }
    });

    function getNewRowElementFromBuffer(bufferObj) {
        const newRow = document.createElement('tr');
        newRow.setAttribute("data-id", bufferObj.id);

        //без інектів
        const status = bufferObj.status ? "status-active" : "status-inactive";

        newRow.innerHTML = `
            <tr data-id="${bufferObj.id}">
                <th><input type="checkbox" class="student-table__checkbox"></th>
                <td data-fname="${bufferObj.firstName}" data-lname="${bufferObj.lastName}">${bufferObj.firstName} ${bufferObj.lastName}</td>
                <td data-group="${bufferObj.group_id}">${document.querySelector('#group option[value="' + bufferObj.group_id + '"]').textContent}</td>
               <td data-gender="${bufferObj.gender_id}">${document.querySelector('#gender option[value="' + bufferObj.gender_id + '"]').textContent[0]}</td>
                <td data-birth="${transformDateFormat(bufferObj.birthday)}">${transformDateFormat(bufferObj.birthday)}</td>
                <td>
                    <span class="status-indicator ${status}"></span>
                </td>
                <td>
                    <button data-id="${bufferObj.id}" class="student-table__button student-table__button--form">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button data-id="${bufferObj.id}" class="student-table__button student-table__button--delete">
                        <i class="fa-solid fa-xmark fa-lg"></i>
                    </button>
                </td>
            </tr>
        `;
        console.log(bufferObj.id);
        return newRow;
    }

    function addStudent(bufferObj) {
        const newRow = getNewRowElementFromBuffer(bufferObj);
        tableBody.appendChild(newRow);
        paginateTable();
    }

    function editStudent(bufferObj) {
        const row = tableBody.querySelector(`tr[data-id="${bufferObj.id}"]`);
        const newRow = getNewRowElementFromBuffer(bufferObj);
        if (row) {
            //зайти в рядок змінити
            tableBody.replaceChild(newRow, row);
        }
        paginateTable();
    }

    function deleteStudent(row) {
        row.remove();
        updateSelectAllState();
        paginateTable();
    }

    function on(eventType, selector, callback, context = document) {
        context.addEventListener(eventType, function(event) {
            const targetElement = event.target.closest(selector);
            if (targetElement && context.contains(targetElement)) {
                callback.call(targetElement, event);
            }
        });
    }
    
    on("click", ".student-table__button--form", function() {
        const studentId = this.getAttribute("data-id");
        openForm(studentId);
    });
    
    on("click", ".student-table__button--delete", function() {
        const studentId = this.getAttribute("data-id");
        const row = studentId ? tableBody.querySelector(`tr[data-id="${studentId}"]`) : null;
        if (row) {
            rowToDelete = row;
            deleteMessage.textContent = row.cells[1].textContent;
            modal.style.display = "block";
        }
    });

    on("click", ".modal-content__button--confirm",function() {
        if (rowToDelete) {
            deleteStudent(rowToDelete);
            rowToDelete = null;
            paginateTable();
        }
        modal.style.display = "none";
    });
    
    on("click", ".modal-content__button--cancel",function() {
        rowToDelete = null;
        modal.style.display = "none";
    });

    function showForm() {
        formWindow.style.display = "block";
        overlay.style.display = "block";
        formWindow.style.opacity = "1";
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
    }

    function closeForm() {
        formWindow.style.opacity = "0";
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        setTimeout(() => {
            formWindow.style.display = "none";
            overlay.style.display = "none";
        }, 300);
    }

    function getStudentValuesTable(bufferObj, row) {
        bufferObj.id = row.getAttribute("data-id");
        bufferObj.group_id = row.querySelector("td[data-group]").getAttribute("data-group");
        bufferObj.firstName = row.querySelector("td[data-fname]").getAttribute("data-fname");
        bufferObj.lastName = row.querySelector("td[data-lname]").getAttribute("data-lname");
        bufferObj.gender_id = row.querySelector("td[data-gender]").getAttribute("data-gender");
        let birthday = row.querySelector("td[data-birth]").getAttribute("data-birth");
        bufferObj.birthday = transformDateFormatToISO(birthday); 
        bufferObj.status = row.querySelector(".status-indicator").classList.contains("status-active");
    }
    function transformDateFormat(dateString) {
        let dateObject = new Date(dateString);
    
        let day = dateObject.getDate();
        let month = dateObject.getMonth() + 1;
        let year = dateObject.getFullYear();
    
        return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
    }
    function transformDateFormatToISO(dateString) {
        let parts = dateString.split('.');
    
        return parts[2] + '-' + parts[1].padStart(2, '0') + '-' + parts[0].padStart(2, '0');
    }

    function fillFormFromObject(bufferObj) {
        form.querySelector("#studentId").value = bufferObj.id;
        form.querySelector("#firstName").value = bufferObj.firstName;
        form.querySelector("#lastName").value = bufferObj.lastName;
        form.querySelector("#group").value = bufferObj.group_id;
        form.querySelector("#gender").value = bufferObj.gender_id;
        form.querySelector("#birthday").value = bufferObj.birthday;
        form.querySelector("#status").value = bufferObj.status ? "1" : "2";        
    }

    function openForm(studentId) {
        console.log(studentId);
        studentBuffer = makeEmptyBuffer();
        formTitle.textContent = "Add Student";
        if (studentId) {
            const row = tableBody.querySelector(`tr[data-id="${studentId}"]`);
            if (row) {
                getStudentValuesTable(studentBuffer, row);
                formTitle.textContent = "Edit Student";
            }
        } 
        fillFormFromObject(studentBuffer);
        showForm();
    }

    let studentId=1;
    
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        let bufferObj = {
            id: document.querySelector("#studentId").value || (studentId).toString(),
            firstName: document.querySelector("#firstName").value.trim(),
            lastName: document.querySelector("#lastName").value.trim(),
            group_id: document.querySelector("#group").value, 
            gender_id: document.querySelector("#gender").value,
            birthday: document.querySelector("#birthday").value.split("-").reverse().join("."),
            status: document.querySelector("#status").value === "1"
        };  

        console.log(bufferObj);
        if (tableBody.querySelector(`tr[data-id="${bufferObj.id}"]`)) {
            editStudent(bufferObj);
        } else {
            addStudent(bufferObj);
            studentId++;
        }

        const jsonString = JSON.stringify(bufferObj, null, 2); 
        console.log(jsonString);
        closeForm();
    });
    on("click", ".form-modal__close", closeForm);
});

/*
func(){
id=1;
document.getLastChild();
if(tr){
id+1;
}
}
*/