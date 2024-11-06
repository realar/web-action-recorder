// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const exportBtn = document.getElementById('exportBtn');
    const statusDiv = document.getElementById('status');

    // Инициализация состояния кнопок
    chrome.storage.local.get({isRecording: false}, (data) => {
        if (data.isRecording) {
            startBtn.disabled = true;
            stopBtn.disabled = false;
        } else {
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
    });

    startBtn.addEventListener('click', () => {
        // Устанавливаем состояние записи
        chrome.storage.local.set({isRecording: true}, () => {
            startBtn.disabled = true;
            stopBtn.disabled = false;
            statusDiv.textContent = "Запись начата.";
        });
    });

    stopBtn.addEventListener('click', () => {
        // Устанавливаем состояние записи
        chrome.storage.local.set({isRecording: false}, () => {
            startBtn.disabled = false;
            stopBtn.disabled = true;
            statusDiv.textContent = "Запись остановлена.";
        });
    });

    exportBtn.addEventListener('click', () => {
        // Получаем записанные шаги
        chrome.storage.local.get({steps: []}, (data) => {
            if (data.steps.length === 0) {
                alert("Нет записанных шагов для экспорта.");
                return;
            }

            // Формируем HTML-инструкцию
            let instructionHtml = `<h1>Пошаговая Инструкция</h1>`;
            data.steps.forEach((step, index) => {
                instructionHtml += `
                    <div class="step">
                        <h3>Шаг ${index + 1} (${step.timestamp})</h3>
                        <p>${step.description}</p>
                        <img src="${step.screenshot}" alt="Скриншот шага ${index + 1}" />
                    </div>
                `;
            });

            // Создаем файл и скачиваем его
            const blob = new Blob([instructionHtml], {type: 'text/html'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'instruction.html';
            a.click();
            URL.revokeObjectURL(url);
        });
    });
});
