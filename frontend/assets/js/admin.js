/**
 * 👨‍💼 ADMIN.JS - Logique du dashboard administrateur
 * Gestion des soumissions, statistiques et graphiques
 */

let statsData = null;
let soumissionsData = [];
let charts = {};
let dataTable = null;

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

/**
 * Initialise le dashboard admin
 */
function initializeAdmin() {
    debugLog('Initialisation du dashboard admin...');
    
    // Charger les données initiales
    loadDashboardData();
    
    // Auto-refresh si configuré
    if (CONFIG.AUTO_REFRESH_INTERVAL > 0) {
        setInterval(refreshData, CONFIG.AUTO_REFRESH_INTERVAL);
        debugLog(`Auto-refresh activé: ${CONFIG.AUTO_REFRESH_INTERVAL}ms`);
    }
}

/**
 * Charge les données du dashboard
 */
async function loadDashboardData() {
    try {
        // Charger les statistiques
        await loadStats();
        
        // Charger les soumissions
        await loadSoumissions();
        
    } catch (error) {
        debugLog('Erreur lors du chargement des données:', error);
        showAlert('Erreur lors du chargement des données', 'danger');
    }
}

/**
 * Charge les statistiques globales
 */
async function loadStats() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/stats`, {
            headers: {
                'x-admin-key': CONFIG.ADMIN_KEY
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            debugLog('Erreur HTTP:', response.status, errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            statsData = result.data;
            displayStats();
            displayCharts();
        } else {
            throw new Error(result.message || 'Erreur inconnue');
        }
    } catch (error) {
        debugLog('Erreur loadStats:', error);
        if (error.message.includes('401') || error.message.includes('403')) {
            showAlert('Authentification échouée. Vérifiez la clé admin dans config.js', 'danger');
        } else {
            showAlert('Erreur lors du chargement des statistiques: ' + error.message, 'danger');
        }
    }
}

/**
 * Affiche les statistiques
 */
function displayStats() {
    if (!statsData) return;
    
    // Cartes de stats
    document.getElementById('stat-total').textContent = statsData.total_soumissions || 0;
    document.getElementById('stat-attente').textContent = statsData.stats_par_statut?.en_attente || 0;
    document.getElementById('stat-confirme').textContent = statsData.stats_par_statut?.confirme || 0;
    document.getElementById('stat-montant').textContent = statsData.total_collecte_formatte || '0 FCFA';
    
    // Dernières soumissions - SECTION SUPPRIMÉE
    /*
    const tbody = document.getElementById('recentesSoumissions');
    tbody.innerHTML = '';
    
    if (statsData.dernieres_soumissions && statsData.dernieres_soumissions.length > 0) {
        statsData.dernieres_soumissions.forEach(soumission => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><code>${soumission.reference}</code></td>
                <td>${soumission.nom_complet}</td>
                <td>${formatMontant(soumission.montant)}</td>
                <td>${CONFIG.PAYMENT_LABELS[soumission.moyen_paiement] || soumission.moyen_paiement}</td>
                <td>${getStatutBadge(soumission.statut)}</td>
                <td>${formatDateShort(soumission.date_soumission)}</td>
            `;
            tbody.appendChild(row);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Aucune soumission</td></tr>';
    }
    */
}

/**
 * Affiche les graphiques
 */
function displayCharts() {
    if (!statsData) return;
    
    // Graphique des statuts
    const ctxStatut = document.getElementById('chartStatut');
    if (ctxStatut) {
        if (charts.statut) charts.statut.destroy();
        
        charts.statut = new Chart(ctxStatut, {
            type: 'doughnut',
            data: {
                labels: ['En attente', 'Confirmé', 'Rejeté', 'Annulé'],
                datasets: [{
                    data: [
                        statsData.stats_par_statut?.en_attente || 0,
                        statsData.stats_par_statut?.confirme || 0,
                        statsData.stats_par_statut?.rejete || 0,
                        statsData.stats_par_statut?.annule || 0
                    ],
                    backgroundColor: ['#ffc107', '#28a745', '#dc3545', '#6c757d']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Graphique par taille de tee-shirt
    const ctxTailles = document.getElementById('chartTailles');
    if (ctxTailles && statsData.stats_par_taille) {
        if (charts.tailles) charts.tailles.destroy();
        
        const tailles = Object.keys(statsData.stats_par_taille);
        const counts = tailles.map(t => statsData.stats_par_taille[t].count);
        
        charts.tailles = new Chart(ctxTailles, {
            type: 'doughnut',
            data: {
                labels: tailles,
                datasets: [{
                    data: counts,
                    backgroundColor: ['#ff8c00', '#2c7b4e', '#ffc107', '#17a2b8', '#dc3545', '#6c757d']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

/**
 * Charge la liste des soumissions
 */
async function loadSoumissions(filters = {}) {
    try {
        // Construire l'URL avec les filtres
        const params = new URLSearchParams();
        if (filters.statut) params.append('statut', filters.statut);
        if (filters.moyen_paiement) params.append('moyen_paiement', filters.moyen_paiement);
        params.append('limit', 1000); // Charger toutes les soumissions
        
        const url = `${CONFIG.API_URL}/admin/soumissions?${params.toString()}`;
        
        const response = await fetch(url, {
            headers: {
                'x-admin-key': CONFIG.ADMIN_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            soumissionsData = result.data;
            displaySoumissions();
        }
    } catch (error) {
        debugLog('Erreur loadSoumissions:', error);
        showAlert('Erreur lors du chargement des soumissions', 'danger');
    }
}

/**
 * Affiche la liste des soumissions dans le tableau
 */
function displaySoumissions() {
    const tbody = document.getElementById('soumissionsList');
    tbody.innerHTML = '';
    
    if (!soumissionsData || soumissionsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" class="text-center text-muted">Aucune soumission trouvée</td></tr>';
        return;
    }
    
    soumissionsData.forEach(soumission => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><code class="small">${soumission.reference}</code></td>
            <td>${soumission.nom}</td>
            <td>${soumission.prenoms}</td>
            <td><small>${soumission.age}</small></td>
            <td><small>${soumission.taille_tee_shirt}</small></td>
            <td>${soumission.telephone}</td>
            <td><strong>${formatMontant(soumission.montant)}</strong></td>
            <td>${soumission.reference_operateur ? `<code class="small">${soumission.reference_operateur}</code>` : '-'}</td>
            <td>${getStatutBadge(soumission.statut)}</td>
            <td><small>${formatDateShort(soumission.date_soumission)}</small></td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-info" onclick="showDetails(${soumission.id})" title="Détails">
                        <i class="bi bi-eye"></i>
                    </button>
                    ${soumission.statut === 'en_attente' ? `
                        <button class="btn btn-success" onclick="openActionModal(${soumission.id}, 'confirme')" title="Valider">
                            <i class="bi bi-check"></i>
                        </button>
                        <button class="btn btn-danger" onclick="openActionModal(${soumission.id}, 'rejete')" title="Rejeter">
                            <i class="bi bi-x"></i>
                        </button>
                    ` : ''}
                    ${soumission.statut !== 'annule' ? `
                        <button class="btn btn-secondary" onclick="annulerSoumission(${soumission.id})" title="Annuler">
                            <i class="bi bi-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Initialiser DataTables
    if (dataTable) {
        dataTable.destroy();
    }
    
    dataTable = $('#tableSoumissions').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json'
        },
        order: [[9, 'desc']], // Trier par date
        pageLength: 25,
        responsive: true
    });
}

/**
 * Affiche les détails d'une soumission
 */
async function showDetails(id) {
    try {
        const response = await fetch(`${CONFIG.API_URL}/admin/soumissions/${id}`, {
            headers: {
                'x-admin-key': CONFIG.ADMIN_KEY
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            const s = result.data;
            
            const content = `
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <strong>Référence:</strong><br>
                        <code>${s.reference}</code>
                    </div>
                    <div class="col-md-6 mb-3">
                        <strong>Statut:</strong><br>
                        ${getStatutBadge(s.statut)}
                    </div>
                </div>
                
                <hr>
                
                <h6>Informations personnelles</h6>
                <div class="row">
                    <div class="col-md-6 mb-2"><strong>Nom:</strong> ${s.nom}</div>
                    <div class="col-md-6 mb-2"><strong>Prénoms:</strong> ${s.prenoms}</div>
                    <div class="col-md-6 mb-2"><strong>Âge:</strong> ${s.age} ans</div>
                    <div class="col-md-6 mb-2"><strong>Taille tee-shirt:</strong> ${s.taille_tee_shirt}</div>
                    <div class="col-md-6 mb-2"><strong>Téléphone:</strong> ${s.telephone}</div>
                    <div class="col-md-6 mb-2"><strong>Numéro paiement:</strong> ${s.numero_paiement}</div>
                </div>
                
                <hr>
                
                <h6>Détails de la contribution</h6>
                <div class="row">
                    <div class="col-md-6 mb-2"><strong>Montant:</strong> <span class="text-success fw-bold">${formatMontant(s.montant)}</span></div>
                    <div class="col-md-6 mb-2"><strong>Moyen:</strong> Wave</div>
                </div>
                
                <hr>
                
                <h6>Informations de paiement</h6>
                <div class="row">
                    <div class="col-md-6 mb-2"><strong>Code transaction:</strong> ${s.reference_operateur ? `<code>${s.reference_operateur}</code>` : '-'}</div>
                </div>
                
                <hr>
                
                <h6>Dates</h6>
                <div class="row">
                    <div class="col-md-6 mb-2"><strong>Soumission:</strong> ${formatDate(s.date_soumission)}</div>
                    <div class="col-md-6 mb-2"><strong>Confirmation:</strong> ${s.date_confirmation ? formatDate(s.date_confirmation) : '-'}</div>
                </div>
                
                ${s.note_admin ? `
                    <hr>
                    <h6>Note admin</h6>
                    <p class="mb-0">${s.note_admin}</p>
                ` : ''}
                
                <hr>
                
                <h6>Informations techniques</h6>
                <div class="row">
                    <div class="col-md-6 mb-2"><strong>IP:</strong> <code>${s.ip_adresse || '-'}</code></div>
                    <div class="col-md-6 mb-2"><strong>User Agent:</strong> <small>${s.user_agent || '-'}</small></div>
                </div>
            `;
            
            document.getElementById('modalDetailsBody').innerHTML = content;
            const modal = new bootstrap.Modal(document.getElementById('modalDetails'));
            modal.show();
        }
    } catch (error) {
        debugLog('Erreur showDetails:', error);
        showAlert('Erreur lors du chargement des détails', 'danger');
    }
}

/**
 * Ouvre le modal pour valider/rejeter
 */
function openActionModal(id, statut) {
    document.getElementById('actionId').value = id;
    document.getElementById('actionStatut').value = statut;
    document.getElementById('actionNote').value = '';
    
    const title = statut === 'confirme' ? 'Valider la soumission' : 'Rejeter la soumission';
    document.getElementById('modalActionTitle').textContent = title;
    
    const btn = document.getElementById('btnConfirmAction');
    btn.className = statut === 'confirme' ? 'btn btn-success' : 'btn btn-danger';
    btn.textContent = statut === 'confirme' ? 'Valider' : 'Rejeter';
    
    const modal = new bootstrap.Modal(document.getElementById('modalAction'));
    modal.show();
}

/**
 * Confirme l'action (valider/rejeter)
 */
async function confirmAction() {
    const id = document.getElementById('actionId').value;
    const statut = document.getElementById('actionStatut').value;
    const note = document.getElementById('actionNote').value.trim();
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/admin/soumissions/${id}/statut`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-key': CONFIG.ADMIN_KEY
            },
            body: JSON.stringify({
                statut: statut,
                note_admin: note || undefined
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert(result.message, 'success');
            
            // Fermer le modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalAction'));
            modal.hide();
            
            // Recharger les données
            refreshData();
        } else {
            showAlert(result.message || 'Erreur lors de l\'action', 'danger');
        }
    } catch (error) {
        debugLog('Erreur confirmAction:', error);
        showAlert(CONFIG.MESSAGES.error.network, 'danger');
    }
}

/**
 * Annule une soumission
 */
async function annulerSoumission(id) {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette soumission ?')) {
        return;
    }
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/admin/soumissions/${id}`, {
            method: 'DELETE',
            headers: {
                'x-admin-key': CONFIG.ADMIN_KEY
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert(result.message, 'success');
            refreshData();
        } else {
            showAlert(result.message || 'Erreur lors de l\'annulation', 'danger');
        }
    } catch (error) {
        debugLog('Erreur annulerSoumission:', error);
        showAlert(CONFIG.MESSAGES.error.network, 'danger');
    }
}

/**
 * Applique les filtres
 */
function applyFilters() {
    const filters = {
        statut: document.getElementById('filterStatut').value,
        moyen_paiement: document.getElementById('filterPaiement').value
    };
    
    loadSoumissions(filters);
}

/**
 * Exporte les soumissions en CSV
 */
async function exportCSV() {
    try {
        const statut = document.getElementById('filterStatut').value;
        const moyenPaiement = document.getElementById('filterPaiement').value;
        
        const params = new URLSearchParams();
        if (statut) params.append('statut', statut);
        if (moyenPaiement) params.append('moyen_paiement', moyenPaiement);
        
        const url = `${CONFIG.API_URL}/admin/export/csv?${params.toString()}`;
        
        const response = await fetch(url, {
            headers: {
                'x-admin-key': CONFIG.ADMIN_KEY
            }
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `soumissions_${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);
            
            showAlert('Export CSV téléchargé avec succès', 'success');
        } else {
            showAlert('Erreur lors de l\'export CSV', 'danger');
        }
    } catch (error) {
        debugLog('Erreur exportCSV:', error);
        showAlert(CONFIG.MESSAGES.error.network, 'danger');
    }
}

/**
 * Charge les statistiques d'une période
 */
async function loadStatsPeriode(periode, event = null) {
    try {
        // Mettre à jour les boutons actifs
        const buttons = document.querySelectorAll('#section-stats .btn-group button');
        buttons.forEach((btn, index) => {
            btn.classList.remove('active');
            // Activer le bouton correspondant à la période
            if ((periode === 'jour' && index === 0) || 
                (periode === 'semaine' && index === 1) || 
                (periode === 'mois' && index === 2)) {
                btn.classList.add('active');
            }
        });
        if (event && event.target) {
            event.target.classList.add('active');
        }
        
        debugLog(`Chargement stats période: ${periode}`);
        debugLog(`URL: ${CONFIG.API_URL}/stats/periode/${periode}`);
        
        const response = await fetch(`${CONFIG.API_URL}/stats/periode/${periode}`, {
            headers: {
                'x-admin-key': CONFIG.ADMIN_KEY
            }
        });
        
        debugLog('Réponse reçue:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            debugLog('Erreur HTTP:', response.status, errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        debugLog('Données reçues:', result);
        
        if (result.success) {
            displayStatsPeriode(result.data);
        } else {
            throw new Error(result.message || 'Erreur inconnue');
        }
    } catch (error) {
        debugLog('Erreur loadStatsPeriode:', error);
        showAlert('Erreur lors du chargement des statistiques de période: ' + error.message, 'danger');
    }
}

/**
 * Affiche les statistiques de période
 */
function displayStatsPeriode(data) {
    // Graphique des tailles
    const ctxTailles = document.getElementById('chartTailles');
    if (ctxTailles && data.stats_par_taille) {
        if (charts.tailles) charts.tailles.destroy();
        
        const tailles = Object.keys(data.stats_par_taille).sort();
        const counts = tailles.map(t => data.stats_par_taille[t].count);
        const colors = [
            '#2c7b4e', '#ff8c00', '#dc3545', '#0d6efd', '#6f42c1', '#20c997'
        ];
        
        charts.tailles = new Chart(ctxTailles, {
            type: 'bar',
            data: {
                labels: tailles,
                datasets: [{
                    label: 'Nombre de personnes',
                    data: counts,
                    backgroundColor: colors.slice(0, tailles.length),
                    borderColor: colors.slice(0, tailles.length),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
    
    // Graphique des âges
    const ctxAges = document.getElementById('chartAges');
    if (ctxAges && data.stats_par_age) {
        if (charts.ages) charts.ages.destroy();
        
        const tranches = ['Moins de 18', '18-25', '26-35', '36-45', '46-55', 'Plus de 55'];
        const counts = tranches.map(t => data.stats_par_age[t] ? data.stats_par_age[t].count : 0);
        const colors = [
            '#6f42c1', '#0d6efd', '#20c997', '#ffc107', '#fd7e14', '#dc3545'
        ];
        
        charts.ages = new Chart(ctxAges, {
            type: 'doughnut',
            data: {
                labels: tranches,
                datasets: [{
                    label: 'Nombre de personnes',
                    data: counts,
                    backgroundColor: colors,
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    title: {
                        display: false
                    }
                }
            }
        });
    }
}

/**
 * Rafraîchit toutes les données
 */
function refreshData() {
    debugLog('Rafraîchissement des données...');
    loadDashboardData();
    showAlert('Données actualisées', 'info');
}

/**
 * Affiche/Masque une section
 */
function showSection(section) {
    // Masquer toutes les sections
    document.querySelectorAll('.content-section').forEach(s => {
        s.classList.add('d-none');
    });
    
    // Afficher la section demandée
    const sectionEl = document.getElementById(`section-${section}`);
    if (sectionEl) {
        sectionEl.classList.remove('d-none');
    }
    
    // Mettre à jour la navigation
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`a[href="#${section}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Charger les données si nécessaire
    if (section === 'stats') {
        loadStatsPeriode('jour');
    }
}

/**
 * Affiche une alerte
 */
function showAlert(message, type = 'info') {
    const container = document.getElementById('alertContainer');
    if (!container) return;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show animate-slide-in`;
    alertDiv.role = 'alert';
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'danger') icon = 'exclamation-triangle';
    if (type === 'warning') icon = 'exclamation-circle';
    
    alertDiv.innerHTML = `
        <i class="bi bi-${icon}"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    container.innerHTML = '';
    container.appendChild(alertDiv);
    
    // Auto-dismiss
    setTimeout(() => {
        alertDiv.remove();
    }, CONFIG.TOAST_DURATION);
}
