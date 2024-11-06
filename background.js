// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "record_click") {
        // Получение текущего времени
        const timestamp = new Date().toLocaleString();

        // Сохранение действия в хранилище
        chrome.storage.local.get({steps: []}, (data) => {
            const steps = data.steps;
            steps.push({
                timestamp: timestamp,
                description: request.description,
                screenshot: request.screenshot
            });
            chrome.storage.local.set({steps: steps}, () => {
                sendResponse({status: "success"});
            });
        });

        // Необходимо вернуть true, чтобы асинхронно отправить ответ
        return true;
    }
});
