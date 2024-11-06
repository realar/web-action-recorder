// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "record_click_request") {
        const description = request.description;
        const timestamp = new Date().toLocaleString();

        // Создаем скриншот видимой части вкладки
        chrome.tabs.captureVisibleTab(sender.tab.windowId, {format: "png"}, (dataUrl) => {
            if (chrome.runtime.lastError) {
                console.error("Ошибка при создании скриншота:", chrome.runtime.lastError);
                sendResponse({status: "failure"});
                return;
            }

            // Сохранение действия в хранилище
            chrome.storage.local.get({steps: []}, (data) => {
                const steps = data.steps;
                steps.push({
                    timestamp: timestamp,
                    description: description,
                    screenshot: dataUrl
                });
                chrome.storage.local.set({steps: steps}, () => {
                    sendResponse({status: "success"});
                });
            });
        });

        // Необходимо вернуть true, чтобы асинхронно отправить ответ
        return true;
    }
});
