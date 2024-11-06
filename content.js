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

// Обработчик кликов
document.addEventListener('click', async (event) => {
    // Создаем скриншот видимой части страницы
    try {
        const screenshot = await captureScreenshot();
        const description = describeEvent(event);

        // Отправляем данные в фоновый скрипт
        chrome.runtime.sendMessage({
            type: "record_click",
            description: description,
            screenshot: screenshot
        }, (response) => {
            if (response.status !== "success") {
                console.error("Ошибка при сохранении клика.");
            }
        });
    } catch (error) {
        console.error("Ошибка при создании скриншота:", error);
    }
}, true);

// Функция для создания скриншота видимой части страницы
async function captureScreenshot() {
    return new Promise((resolve, reject) => {
        chrome.tabs.captureVisibleTab(null, {format: "png"}, (dataUrl) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(dataUrl);
            }
        });
    });
}
