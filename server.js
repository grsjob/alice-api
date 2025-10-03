/** @format */

const express = require("express");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Основной endpoint для Алисы
app.post("/alice", (req, res) => {
  try {
    console.log("Получен запрос от Алисы:", JSON.stringify(req.body, null, 2));

    const request = req.body;

    // Проверяем тип запроса
    if (!request || !request.request) {
      return res.json({
        response: {
          text: "Ошибка в запросе",
          end_session: true,
        },
        version: "1.0",
      });
    }

    // Обрабатываем разные типы запросов
    if (request.request.type === "SimpleUtterance") {
      const command = request.request.command.toLowerCase();

      if (command.includes("гром") || command.includes("молния")) {
        return res.json({
          response: {
            text: "Гром!",
            tts: '<speaker effect="thunder"> Гррром! </speaker>',
            end_session: true,
          },
          version: "1.0",
        });
      }

      if (command.includes("помощь") || command.includes("что ты умеешь")) {
        return res.json({
          response: {
            text: 'Я могу воспроизвести звук грома. Просто скажите "гром" или "молния".',
            tts: "Я могу воспроизвести звук грома. Просто скажите гром или молния.",
            end_session: false,
          },
          version: "1.0",
        });
      }
    }

    // Ответ по умолчанию для первого запуска
    if (
      request.request.type === "ButtonPressed" ||
      request.request.type === ""
    ) {
      return res.json({
        response: {
          text: 'Привет! Я навык "Гром и Молния". Скажите "гром" для звукового эффекта.',
          tts: "Привет! Я навык Гром и Молния. Скажите гром для звукового эффекта.",
          end_session: false,
        },
        version: "1.0",
      });
    }

    // Стандартный ответ
    res.json({
      response: {
        text: 'Скажите "гром" для звука грома.',
        tts: "Скажите гром для звука грома.",
        end_session: false,
      },
      version: "1.0",
    });
  } catch (error) {
    console.error("Ошибка обработки запроса:", error);
    res.json({
      response: {
        text: "Произошла ошибка",
        end_session: true,
      },
      version: "1.0",
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Корневой endpoint
app.get("/", (req, res) => {
  res.send('Сервер для навыка Алисы "Гром и Молния" работает!');
});

// Обработка 404
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
