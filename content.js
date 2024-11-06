// content.js

// Функция для создания описания события клика
function describeEvent(event) {
    let description = `Клик по элементу <strong>${event.target.tagName}</strong>`;
    if (event.target.id) {
        description += ` с id <strong>${event.target.id}</strong>`;
    }
    if (event.target.className) {
        description += ` и классом <strong>${event.target.className}</strong>`;
    }
    return description;
}

// Функция для проверки, включена ли запись
function isRecording(callback) {
    chrome.storage.local.get({isRecording: false}, (data) => {
        callback(data.isRecording);
    });
}

// Обработчик кликов
document.addEventListener('click', (event) => {
    isRecording((recording) => {
        if (!recording) return;

        const description = describeEvent(event);

        // Отправляем сообщение в фоновый скрипт для создания скриншота
        chrome.runtime.sendMessage({
            type: "record_click_request",
            description: description
        }, (response) => {
            if (response.status !== "success") {
                console.error("Ошибка при сохранении клика.");
            }
        });
    });
}, true);
