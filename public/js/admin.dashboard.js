const grid = 'rgba(0,0,0,0.05)';
const tick = '#94a3b8';

/* ─── Chart helpers ─────────────────────────────────────────────────────── */

function mkT(labels, s, l) {
    return {
        type: 'line',
        data: {
            labels,
            datasets: [
                { label: 'Students',   data: s, borderColor: '#1e293b', backgroundColor: 'rgba(30,41,59,0.07)',   tension: 0.35, pointRadius: 2, pointHoverRadius: 4, borderWidth: 2, fill: true },
                { label: 'Librarians', data: l, borderColor: '#64748b', backgroundColor: 'rgba(100,116,139,0.07)', tension: 0.35, pointRadius: 2, pointHoverRadius: 4, borderWidth: 2, fill: true, borderDash: [4, 3] }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
            scales: {
                x: { ticks: { color: tick, font: { size: 10 }, maxTicksLimit: 8, maxRotation: 40 }, grid: { color: grid } },
                y: { ticks: { color: tick, font: { size: 10 } }, grid: { color: grid }, beginAtZero: true }
            }
        }
    };
}

function mkR(labels, proc, canc) {
    return {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: 'Processed', data: proc, backgroundColor: '#1e293b', borderRadius: 4, borderSkipped: false },
                { label: 'Cancelled', data: canc, backgroundColor: '#94a3b8', borderRadius: 4, borderSkipped: false }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
            scales: {
                x: { ticks: { color: tick, font: { size: 10 }, autoSkip: false, maxRotation: 0 }, grid: { display: false } },
                y: { ticks: { color: tick, font: { size: 10 } }, grid: { color: grid }, beginAtZero: true }
            }
        }
    };
}

/* ─── Chart instances ────────────────────────────────────────────────────── */

let tChart = null;
let rChart = null;

async function loadTrafficChart(days) {
    const res  = await fetch(`/Admin/Chart/Traffic?days=${days}`);
    const data = await res.json();
    if (tChart) tChart.destroy();
    tChart = new Chart(document.getElementById('trafficChart'), mkT(data.labels, data.students, data.librarians));
}

async function loadReservationChart(mode) {
    const res  = await fetch(`/Admin/Chart/Reservations?mode=${mode}`);
    const data = await res.json();

    // Update the summary numbers above the chart
    const totalP = data.processed.reduce((a, b) => a + b, 0);
    const totalC = data.cancelled.reduce((a, b) => a + b, 0);
    const sumPEl = document.getElementById('sumP');
    const sumCEl = document.getElementById('sumC');
    if (sumPEl) sumPEl.textContent = totalP;
    if (sumCEl) sumCEl.textContent = totalC;

    if (rChart) rChart.destroy();
    rChart = new Chart(document.getElementById('resChart'), mkR(data.labels, data.processed, data.cancelled));
}

/* ─── Button callbacks ───────────────────────────────────────────────────── */

function setTraffic(p, btn) {
    document.querySelectorAll('.pbtn-group')[0].querySelectorAll('.pbtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadTrafficChart(p === '14d' ? 14 : 30);
}

function setRes(p, btn) {
    document.querySelectorAll('.pbtn-group')[1].querySelectorAll('.pbtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadReservationChart(p);
}

/* ─── Init on DOM ready ──────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
    loadTrafficChart(14);
    loadReservationChart('weekly');
});