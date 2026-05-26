const grid = 'rgba(0,0,0,0.05)';
const tick = '#94a3b8';

const d14 = ['May 13','May 14','May 15','May 16','May 17','May 18','May 19','May 20','May 21','May 22','May 23','May 24','May 25','May 26'];
const s14 = [210,185,320,390,420,310,180,230,200,360,400,410,380,347];
const l14 = [8,7,11,13,14,10,6,9,8,12,13,13,12,12];
const d30 = ['Apr 27','Apr 28','Apr 29','Apr 30','May 1','May 2','May 3','May 4','May 5','May 6','May 7','May 8','May 9','May 10','May 11','May 12','May 13','May 14','May 15','May 16','May 17','May 18','May 19','May 20','May 21','May 22','May 23','May 24','May 25','May 26'];
const s30 = [290,270,350,310,380,300,160,250,280,370,410,380,200,220,190,215,210,185,320,390,420,310,180,230,200,360,400,410,380,347];
const l30 = [10,9,12,11,13,10,5,9,10,13,14,12,7,8,7,8,8,7,11,13,14,10,6,9,8,12,13,13,12,12];

function mkT(labels, s, l) {
    return {
        type: 'line',
        data: {
            labels,
            datasets: [
                { label: 'Students', data: s, borderColor: '#1e293b', backgroundColor: 'rgba(30,41,59,0.07)', tension: 0.35, pointRadius: 2, pointHoverRadius: 4, borderWidth: 2, fill: true },
                { label: 'Librarians', data: l, borderColor: '#64748b', backgroundColor: 'rgba(100,116,139,0.07)', tension: 0.35, pointRadius: 2, pointHoverRadius: 4, borderWidth: 2, fill: true, borderDash: [4,3] }
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

const wL = ['Week 1','Week 2','Week 3','Week 4'];
const wP = [92,108,101,105];
const wC = [28,30,26,30];
const mL = ['Feb','Mar','Apr','May'];
const mP = [310,380,420,406];
const mC = [80,95,120,114];

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

let tChart = new Chart(document.getElementById('trafficChart'), mkT(d14, s14, l14));
let rChart = new Chart(document.getElementById('resChart'), mkR(wL, wP, wC));

function setTraffic(p, btn) {
    document.querySelectorAll('.pbtn-group')[0].querySelectorAll('.pbtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tChart.destroy();
    tChart = new Chart(document.getElementById('trafficChart'), mkT(p === '14d' ? d14 : d30, p === '14d' ? s14 : s30, p === '14d' ? l14 : l30));
}

function setRes(p, btn) {
    document.querySelectorAll('.pbtn-group')[1].querySelectorAll('.pbtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    rChart.destroy();
    const isW = p === 'weekly';
    rChart = new Chart(document.getElementById('resChart'), mkR(isW ? wL : mL, isW ? wP : mP, isW ? wC : mC));
}