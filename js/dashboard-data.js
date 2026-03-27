const personColumns = {
    'Thaísa': { start: 0, end: 1 },
    'Flávia': { start: 2, end: 3 },
    'Gabriel': { start: 4, end: 5 },
    'David': { start: 6, end: 7 },
    'Helena': { start: 8, end: 9 },
    'Hedy': { start: 10, end: 11 },
    'Magno': { start: 12, end: 13 },
    'Álex': { start: 14, end: 15 }
};

const taskPeople = ['David', 'Thaísa', 'Álex', 'Helena', 'Gabriel', 'Hedy', 'Magno'];
const taskDataByPerson = {};

function normalizeName(name) {
    return name.toLowerCase().replace(/[áéíóú]/g, m => ({ á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' }[m]));
}

async function fetchAvisosFromSheets() {
    const spreadsheetId = '1Jb5yegqoojAUeSrZjireF0WiPsFfOimP';
    const gid = '66095086';
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;

    try {
        const response = await fetch(csvUrl);
        const csvText = await response.text();

        Papa.parse(csvText, {
            header: false,
            skipEmptyLines: true,
            complete: results => renderAvisosTable(results.data),
            error: () => renderAvisosEmpty()
        });
    } catch (error) {
        console.log('Erro ao buscar avisos:', error);
        renderAvisosEmpty();
    }
}

function renderAvisosTable(data) {
    const container = document.getElementById('avisos-postits');
    if (!container || !data || data.length < 2) {
        renderAvisosEmpty();
        return;
    }

    let html = '';
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length < 2) continue;

        const destinatario = (row[0] || '').toString().trim();
        const mensagem = (row[1] || '').toString().trim();

        if (destinatario && mensagem) {
            html += `
                <article class="aviso-postit">
                    <button type="button" class="aviso-close" aria-label="Fechar aviso" onclick="this.closest('.aviso-postit').remove()">×</button>
                    <p class="aviso-destinatario">${destinatario}</p>
                    <p class="aviso-message">${mensagem}</p>
                </article>
            `;
        }
    }

    container.innerHTML = html || '<div class="aviso-postit aviso-postit-loading"><p class="text-sm text-gray-500">📭 Nenhum aviso no momento</p></div>';
}

function renderAvisosEmpty() {
    const container = document.getElementById('avisos-postits');
    if (!container) return;
    container.innerHTML = '<div class="aviso-postit aviso-postit-loading"><p class="text-sm text-gray-500">📭 Nenhum aviso no momento</p></div>';
}

async function fetchTasksFromSheets() {
    const spreadsheetId = '1Jb5yegqoojAUeSrZjireF0WiPsFfOimP';
    const gid = '630481648';
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;

    try {
        const response = await fetch(csvUrl);
        const csvText = await response.text();

        Papa.parse(csvText, {
            header: false,
            skipEmptyLines: false,
            complete: results => {
                if (results.data && results.data.length > 0) {
                    renderTaskCardsFromData(results.data);
                } else {
                    renderTaskCardsEmpty();
                }
            },
            error: () => renderTaskCardsEmpty()
        });
    } catch (error) {
        console.log('Erro ao buscar tarefas:', error);
        renderTaskCardsEmpty();
    }
}

function renderTaskCardsFromData(sheetData) {
    taskPeople.forEach(person => {
        const cols = personColumns[person];
        if (!cols) return;

        const tasks = [];

        for (let i = 1; i < sheetData.length; i++) {
            const row = sheetData[i];
            if (!row) continue;

            const title = (row[cols.start] || '').toString().trim();
            const description = (row[cols.end] || '').toString().trim();

            if (title) {
                tasks.push({ title, description });
            }
        }

        taskDataByPerson[person] = tasks;
    });

    initializeTaskSelector();
}

function renderTaskCardsEmpty() {
    taskPeople.forEach(person => {
        taskDataByPerson[person] = [];
    });
    initializeTaskSelector();
}

function initializeTaskSelector() {
    const select = document.getElementById('task-person-select');
    const container = document.getElementById('tasks-selected-container');
    if (!select || !container) return;

    const currentValue = select.value;

    select.innerHTML = '<option value="">Selecione...</option>';
    taskPeople.forEach(person => {
        const count = (taskDataByPerson[person] || []).length;
        const option = document.createElement('option');
        option.value = person;
        option.textContent = `${person} (${count})`;
        select.appendChild(option);
    });

    if (currentValue && taskPeople.includes(currentValue)) {
        select.value = currentValue;
    }

    if (!select.dataset.bound) {
        select.addEventListener('change', () => {
            renderSelectedPersonTasks(select.value);
        });
        select.dataset.bound = 'true';
    }

    renderSelectedPersonTasks(select.value);
}

function renderSelectedPersonTasks(person) {
    const container = document.getElementById('tasks-selected-container');
    if (!container) return;

    if (!person) {
        container.innerHTML = '<p class="text-sm text-gray-400">Selecione um servidor para visualizar as tarefas atribuídas.</p>';
        return;
    }

    const tasks = taskDataByPerson[person] || [];
    if (!tasks.length) {
        container.innerHTML = '<p class="text-sm text-gray-400">Nenhuma tarefa atribuída para este servidor.</p>';
        return;
    }

    const html = tasks.map(task => `
        <div class="task-card">
            <div class="task-card-title">${task.title}</div>
            ${task.description ? `<div class="task-card-description">${task.description}</div>` : ''}
        </div>
    `).join('');

    container.innerHTML = `<div class="tasks-container">${html}</div>`;
}

async function fetchTarefasFromSheets() {
    const spreadsheetId = '1Jb5yegqoojAUeSrZjireF0WiPsFfOimP';
    const gid = '720205678';
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;

    try {
        const response = await fetch(csvUrl);
        const csvText = await response.text();

        Papa.parse(csvText, {
            header: false,
            skipEmptyLines: true,
            complete: results => renderTarefasCards(results.data),
            error: () => renderTarefasVazio()
        });
    } catch (error) {
        console.log('Erro ao buscar radar de prazos:', error);
        renderTarefasVazio();
    }
}

function renderTarefasCards(data) {
    const container = document.getElementById('tarefas-container');
    if (!container || !data || data.length < 2) {
        renderTarefasVazio();
        return;
    }

    let html = '';
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length < 4) continue;

        const tarefa = (row[0] || '').toString().trim();
        const responsavel = (row[1] || '').toString().trim();
        const prazo = (row[2] || '').toString().trim();
        const status = (row[3] || '').toString().trim().toUpperCase();

        if (!tarefa) continue;

        let cssClass = 'normal';
        let icone = '🟢';

        if (status.includes('URGENTE')) {
            cssClass = 'urgente';
            icone = '🔴';
        } else if (status.includes('ATENÇÃO') || status.includes('ATENCAO')) {
            cssClass = 'atencao';
            icone = '🟠';
        }

        html += `
            <div class="tarefa-card ${cssClass}">
                <div class="flex items-center justify-between mb-2">
                    <span class="tarefa-titulo">${icone} ${tarefa}</span>
                    <span class="tarefa-status">${status}</span>
                </div>
                <div class="tarefa-info">
                    <div class="tarefa-info-item"><span class="tarefa-info-label">Responsável:</span><br>${responsavel || 'Não atribuído'}</div>
                    <div class="tarefa-info-item"><span class="tarefa-info-label">Prazo:</span><br>${prazo || 'Sem prazo'}</div>
                </div>
            </div>
        `;
    }

    container.innerHTML = html || '<div class="tarefas-vazio">📭 Nenhuma tarefa no momento</div>';
}

function renderTarefasVazio() {
    const container = document.getElementById('tarefas-container');
    if (!container) return;

    container.innerHTML = '<div class="tarefas-vazio">📭 Nenhuma tarefa no momento</div>';
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTasksFromSheets();
    fetchAvisosFromSheets();
    fetchTarefasFromSheets();
});
