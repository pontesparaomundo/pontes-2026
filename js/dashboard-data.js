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
    const tbody = document.getElementById('avisos-tbody');
    if (!tbody || !data || data.length < 2) {
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
                <tr>
                    <td><span class="destinatario-badge">${destinatario}</span></td>
                    <td><div class="aviso-message">${mensagem}</div></td>
                </tr>
            `;
        }
    }

    tbody.innerHTML = html || `
        <tr>
            <td colspan="2" class="text-center text-gray-400 py-8">
                <span class="text-sm">📭 Nenhum aviso no momento</span>
            </td>
        </tr>
    `;
}

function renderAvisosEmpty() {
    const tbody = document.getElementById('avisos-tbody');
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="2" class="text-center text-gray-400 py-8">
                <span class="text-sm">📭 Nenhum aviso no momento</span>
            </td>
        </tr>
    `;
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
    Object.keys(personColumns).forEach(person => {
        const cols = personColumns[person];
        const cleanName = normalizeName(person);
        const container = document.getElementById(`tasks-${cleanName}`);
        if (!container) return;

        let html = '';

        for (let i = 1; i < sheetData.length; i++) {
            const row = sheetData[i];
            if (!row) continue;

            const title = (row[cols.start] || '').toString().trim();
            const description = (row[cols.end] || '').toString().trim();

            if (title) {
                html += `
                    <div class="task-card">
                        <div class="task-card-title">${title}</div>
                        ${description ? `<div class="task-card-description">${description}</div>` : ''}
                    </div>
                `;
            }
        }

        container.innerHTML = html || '<p class="text-xs text-gray-400 text-center py-2">Nenhuma tarefa</p>';
    });
}

function renderTaskCardsEmpty() {
    Object.keys(personColumns).forEach(person => {
        const cleanName = normalizeName(person);
        const container = document.getElementById(`tasks-${cleanName}`);
        if (!container) return;

        container.innerHTML = '<p class="text-xs text-gray-400 text-center py-2">Nenhuma tarefa carregada</p>';
    });
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
