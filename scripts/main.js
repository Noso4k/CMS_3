// C:\Users\Owner\Desktop\ПВІ\scripts\main.js

document.addEventListener('DOMContentLoaded', () => {
    // Отримуємо елементи форми для бекенду (зверни увагу на ID)
    const studentFormBackend = document.getElementById('studentFormBackend');
    const studentsTableBody = document.getElementById('student-table-body'); // !!! ВИКОРИСТОВУЄМО ID ТВОЄЇ ІСНУЮЧОЇ ТАБЛИЦІ !!!
    const errorMessageBackend = document.getElementById('errorMessageBackend'); // Для повідомлень про помилки тестової форми

    // Функція для додавання студента в HTML таблицю
    function addStudentToTable(student) {
        const newRow = studentsTableBody.insertRow();
        // Створюємо клітинки для імені, прізвища та групи
        newRow.insertCell(0).textContent = student.firstName; // Name
        newRow.insertCell(1).textContent = student.lastName; // Group (У твоєму шаблоні Group йде другою, тому змінюємо)
        newRow.insertCell(2).textContent = student.group; // Залишаємо для групи

        // Твій існуючий шаблон таблиці має більше колонок: Gender, Birthday, Status, Tools.
        // Щоб уникнути помилок, поки що заповнюємо їх пустими значеннями або заглушками.
        // Якщо ти хочеш, щоб вони теж заповнювались, тобі потрібно буде додати ці поля у форму та на сервер.
        newRow.insertCell(3).textContent = 'N/A'; // Gender
        newRow.insertCell(4).textContent = 'N/A'; // Birthday
        newRow.insertCell(5).textContent = 'N/A'; // Status
        const toolsCell = newRow.insertCell(6); // Tools
        toolsCell.innerHTML = '<i class="fas fa-edit"></i> <i class="fas fa-trash-alt"></i>'; // Прості іконки
    }

    // Функція для завантаження студентів при завантаженні сторінки
    async function loadStudents() {
        try {
            const response = await fetch('http://localhost:3000/students'); // Звернення до твого сервера
            const result = await response.json();

            if (response.ok && result.status === 'success') {
                studentsTableBody.innerHTML = ''; // Очистити таблицю перед завантаженням
                result.data.forEach(student => {
                    addStudentToTable(student);
                });
            } else {
                errorMessageBackend.textContent = result.message || 'Не вдалося завантажити студентів.';
            }
        } catch (error) {
            console.error('Помилка при завантаженні студентів:', error);
            errorMessageBackend.textContent = 'Не вдалося підключитися до сервера для завантаження даних.';
        }
    }

    // Обробник події відправки тестової форми
    if (studentFormBackend) { // Перевірка, чи існує форма
        studentFormBackend.addEventListener('submit', async (event) => {
            event.preventDefault(); // Зупинити стандартну відправку форми браузером

            errorMessageBackend.textContent = ''; // Очистити попередні повідомлення про помилки

            // Збір даних з полів форми (зверни увагу на ID)
            const firstName = document.getElementById('firstNameBackend').value.trim();
            const lastName = document.getElementById('lastNameBackend').value.trim();
            const group = document.getElementById('groupBackend').value.trim();

            // Клієнтська валідація
            if (!firstName || !lastName || !group) {
                errorMessageBackend.textContent = 'Будь ласка, заповніть усі поля тестової форми.';
                return;
            }

            const studentData = {
                firstName: firstName,
                lastName: lastName,
                group: group
            };

            try {
                // Відправка даних на сервер
                const response = await fetch('http://localhost:3000/students', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(studentData)
                });

                const result = await response.json();

                if (response.ok) { // Якщо HTTP статус 2xx (успіх)
                    if (result.status === 'success') {
                        addStudentToTable(result.data); // Додати студента до таблиці
                        studentFormBackend.reset(); // Очистити поля форми
                    } else {
                        errorMessageBackend.textContent = result.message || 'Невідома помилка при додаванні студента.';
                    }
                } else { // Якщо HTTP статус помилки (наприклад, 400, 500)
                    errorMessageBackend.textContent = result.message || `Помилка сервера: ${response.status} ${response.statusText}`;
                    console.error('Серверна помилка:', result);
                }

            } catch (error) {
                console.error('Помилка при відправці даних на сервер:', error);
                errorMessageBackend.textContent = 'Не вдалося підключитися до сервера. Перевірте, чи запущено сервер.';
            }
        });
    }

    // Завантажити студентів при першому завантаженні сторінки
    loadStudents();
});