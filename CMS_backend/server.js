// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Додаємо middleware для CORS

const app = express();
const PORT = 3000; // Порт, на якому буде працювати сервер. Можеш змінити, якщо 3000 зайнятий.

// === КОНФІГУРАЦІЯ MIDDLEWARE ===
// Дозволяємо запити з інших доменів (дуже важливо для тестування з браузера)
// В продакшені тут потрібно буде обмежити домен твого сайту.
app.use(cors());

// Парсимо JSON-тіло запиту (коли ти відправляєш дані з форми у JSON)
app.use(bodyParser.json());

// === НАШЕ "СХОВИЩЕ" ДАНИХ (для простоти, без бази даних) ===
// Це просто масив, який буде зберігати студентів, поки сервер працює.
// Якщо ти перезапустиш сервер, дані очистяться.
let students = [];
let nextStudentId = 1; // Для унікальних ID студентів

// === МАРШРУТИ (ENDPOINTS) СЕРВЕРА ===

// 1. GET-маршрут: Отримати список всіх студентів
// Коли браузер звертається до http://localhost:3000/students методом GET
app.get('/students', (req, res) => {
    console.log('GET /students request received');
    res.status(200).json({
        status: 'success',
        data: students
    });
});

// 2. POST-маршрут: Додати нового студента
// Коли браузер відправляє форму на http://localhost:3000/students методом POST
app.post('/students', (req, res) => {
    console.log('POST /students request received. Body:', req.body);
    const { firstName, lastName, group } = req.body;

    // --- СЕРВЕРНА ВАЛІДАЦІЯ ДАНИХ ---
    // Перевіряємо наявність всіх обов'язкових полів
    if (!firstName || !lastName || !group) {
        console.warn('Validation error: Missing required fields');
        return res.status(400).json({ // 400 Bad Request
            status: 'error',
            message: 'Будь ласка, надайте всі поля: ім\'я, прізвище, група.'
        });
    }

    // Перевірка типу та мінімальної довжини
    if (typeof firstName !== 'string' || firstName.trim().length < 2) {
        console.warn('Validation error: Invalid firstName');
        return res.status(400).json({
            status: 'error',
            message: 'Ім\'я повинно бути рядком і мати мінімум 2 символи.'
        });
    }
    if (typeof lastName !== 'string' || lastName.trim().length < 2) {
        console.warn('Validation error: Invalid lastName');
        return res.status(400).json({
            status: 'error',
            message: 'Прізвище повинно бути рядком і мати мінімум 2 символи.'
        });
    }
    if (typeof group !== 'string' || group.trim().length < 2) {
        console.warn('Validation error: Invalid group');
        return res.status(400).json({
            status: 'error',
            message: 'Група повинна бути рядком і мати мінімум 2 символи.'
        });
    }

    // Якщо всі валідації пройшли успішно, створюємо нового студента
    const newStudent = {
        id: nextStudentId++, // Автоматично збільшуємо ID
        firstName: firstName.trim(), // Видаляємо зайві пробіли
        lastName: lastName.trim(),
        group: group.trim()
    };

    students.push(newStudent); // Додаємо студента до нашого масиву

    console.log('New student added:', newStudent);
    // Відправляємо успішну відповідь з даними доданого студента
    res.status(200).json({ // 200 OK
        status: 'success',
        message: 'Студент успішно доданий!',
        data: newStudent
    });
});

// === ЗАПУСК СЕРВЕРА ===
app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
    console.log('Готовий приймати запити...');
});