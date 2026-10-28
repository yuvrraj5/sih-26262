/* =============================================
   AICTE SAMPARK — Application Logic
   script.js
   ============================================= */

'use strict';

// ─────────────────────────────────────────────
// CONSTANTS & STATE
// ─────────────────────────────────────────────
const ROLES = {
  applicant: { label: 'Institution Applicant', short: 'APP', avatar: 'IA' },
  regional:  { label: 'Regional Officer',      short: 'RO',  avatar: 'RO' },
  bureau:    { label: 'Bureau Officer',         short: 'BO',  avatar: 'BO' },
  evc:       { label: 'EVC / Committee Member', short: 'EVC', avatar: 'EV' },
  admin:     { label: 'AICTE Administrator',    short: 'ADM', avatar: 'AA' },
};

const NAV_CONFIG = {
  applicant: [
    { id: 'applicant-dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'my-applications',     icon: '📄', label: 'My Applications' },
    { id: 'upload-documents',    icon: '📤', label: 'Upload Documents' },
    { id: 'fdr-tracking',        icon: '🏦', label: 'FDR & Lease Tracking' },
    { id: 'undertakings',        icon: '📝', label: 'Undertakings' },
    { id: 'notifications',       icon: '🔔', label: 'Notifications' },
    { id: 'settings',            icon: '⚙️',  label: 'Settings' },
  ],
  regional: [
    { id: 'officer-overview',    icon: '🏠', label: 'Overview' },
    { id: 'app-queue',           icon: '📋', label: 'Application Queue' },
    { id: 'doc-verification',    icon: '🔍', label: 'Document Verification' },
    { id: 'compliance',          icon: '✅', label: 'Compliance Monitoring' },
    { id: 'expiry-alerts',       icon: '⚠️',  label: 'Expiry Alerts' },
    { id: 'notifications',       icon: '🔔', label: 'Notifications' },
    { id: 'audit-logs',          icon: '📋', label: 'Audit Logs' },
  ],
  bureau: [
    { id: 'officer-overview',    icon: '🏠', label: 'Overview' },
    { id: 'app-queue',           icon: '📋', label: 'Application Queue' },
    { id: 'doc-verification',    icon: '🔍', label: 'Document Verification' },
    { id: 'evc-scheduling',      icon: '📅', label: 'EVC Scheduling' },
    { id: 'compliance',          icon: '✅', label: 'Compliance Monitoring' },
    { id: 'expiry-alerts',       icon: '⚠️',  label: 'Expiry Alerts' },
    { id: 'reports',             icon: '📊', label: 'Reports' },
    { id: 'audit-logs',          icon: '🗒️',  label: 'Audit Logs' },
  ],
  evc: [
    { id: 'evc-overview',        icon: '🏠', label: 'My Visits' },
    { id: 'evc-report',          icon: '📝', label: 'Submit Report' },
    { id: 'notifications',       icon: '🔔', label: 'Notifications' },
    { id: 'audit-logs',          icon: '🗒️',  label: 'Audit Logs' },
  ],
  admin: [
    { id: 'officer-overview',    icon: '🏠', label: 'Overview' },
    { id: 'app-queue',           icon: '📋', label: 'All Applications' },
    { id: 'doc-verification',    icon: '🔍', label: 'Document Verification' },
    { id: 'evc-scheduling',      icon: '📅', label: 'EVC Scheduling' },
    { id: 'compliance',          icon: '✅', label: 'Compliance Monitoring' },
    { id: 'expiry-alerts',       icon: '⚠️',  label: 'Expiry Alerts' },
    { id: 'reports',             icon: '📊', label: 'Reports' },
    { id: 'audit-logs',          icon: '🗒️',  label: 'Audit Logs' },
    { id: 'notifications',       icon: '🔔', label: 'Notifications' },
  ],
};

// Page titles
const PAGE_TITLES = {
  'applicant-dashboard': ['My Dashboard', 'Application overview'],
  'my-applications':     ['My Applications', 'All submitted applications'],
  'new-application':     ['New Application', 'Submit a new application'],
  'upload-documents':    ['Upload Documents', 'Submit compliance documents'],
  'fdr-tracking':        ['FDR & Lease Tracking', 'Monitor document maturity'],
  'undertakings':        ['Undertakings', 'Regulatory compliance undertakings'],
  'notifications':       ['Notifications', 'Alerts and updates'],
  'settings':            ['Settings', 'Account preferences'],
  'officer-overview':    ['Overview', 'System-wide summary'],
  'app-queue':           ['Application Queue', 'Applications pending review'],
  'doc-verification':    ['Document Verification', 'Review submitted documents'],
  'evc-scheduling':      ['EVC Scheduling', 'Expert Visiting Committee visits'],
  'compliance':          ['Compliance Monitoring', 'Regulatory compliance tracking'],
  'expiry-alerts':       ['Expiry Alerts', 'Document expiry monitoring'],
  'reports':             ['Reports & Analytics', 'Statistics and performance'],
  'audit-logs':          ['Audit Logs', 'System activity trail'],
  'evc-overview':        ['My Visits', 'Assigned EVC visits'],
  'evc-report':          ['Inspection Report', 'Submit visit findings'],
};

let currentRole = null;
let currentPage = null;
let confirmCallback = null;
let remarkCallback = null;

// ─────────────────────────────────────────────
// SEED / DEMO DATA
// ─────────────────────────────────────────────
const SEED_APPLICATIONS = [
  {
    id: 'AICTE/2025/NIA/001',
    type: 'New Institution Approval',
    institution: 'Bharat Institute of Technology & Sciences',
    state: 'Telangana',
    programme: 'B.Tech CSE, B.Tech ECE, MBA',
    submittedDate: '2025-03-10',
    stage: 'Bureau Office',
    status: 'Under Review',
    pendencyDays: 48,
    year: '2026-27',
    remarks: 'Awaiting site verification',
    history: [
      { date: '2025-03-10', action: 'Application Submitted', by: 'Applicant' },
      { date: '2025-03-15', action: 'Forwarded to Regional Office', by: 'Regional Officer' },
      { date: '2025-03-28', action: 'Forwarded to Bureau', by: 'Bureau Officer' },
    ]
  },
  {
    id: 'AICTE/2025/EOA/002',
    type: 'Extension of Approval',
    institution: 'Sri Venkateshwara Engineering College',
    state: 'Andhra Pradesh',
    programme: 'B.Tech CSE, B.Tech Mech',
    submittedDate: '2025-02-20',
    stage: 'Final Review',
    status: 'Under Review',
    pendencyDays: 66,
    year: '2026-27',
    remarks: '',
    history: [
      { date: '2025-02-20', action: 'Application Submitted', by: 'Applicant' },
      { date: '2025-02-27', action: 'Document Verified', by: 'Regional Officer' },
      { date: '2025-03-10', action: 'EVC Scheduled', by: 'Bureau Officer' },
      { date: '2025-04-01', action: 'EVC Visit Completed', by: 'EVC Member' },
    ]
  },
  {
    id: 'AICTE/2025/II/003',
    type: 'Increase in Intake',
    institution: 'Poona College of Engineering',
    state: 'Maharashtra',
    programme: 'B.Tech CSE (60→120 seats)',
    submittedDate: '2025-04-05',
    stage: 'Regional Office',
    status: 'Returned for Correction',
    pendencyDays: 22,
    year: '2026-27',
    remarks: 'FDR document needs renewal',
    history: [
      { date: '2025-04-05', action: 'Application Submitted', by: 'Applicant' },
      { date: '2025-04-12', action: 'Returned for Correction', by: 'Regional Officer', note: 'FDR document needs renewal' },
    ]
  },
  {
    id: 'AICTE/2025/NP/004',
    type: 'New Programme',
    institution: 'Garden City University',
    state: 'Karnataka',
    programme: 'M.Tech VLSI Design',
    submittedDate: '2025-01-15',
    stage: 'Approved',
    status: 'Approved',
    pendencyDays: 0,
    year: '2025-26',
    remarks: 'Approved with conditions',
    history: [
      { date: '2025-01-15', action: 'Application Submitted', by: 'Applicant' },
      { date: '2025-01-22', action: 'Document Verified', by: 'Regional Officer' },
      { date: '2025-02-01', action: 'EVC Visit Completed', by: 'EVC Member' },
      { date: '2025-02-10', action: 'Approved', by: 'Bureau Officer' },
    ]
  },
  {
    id: 'AICTE/2025/NIA/005',
    type: 'New Institution Approval',
    institution: 'Rajputana Institute of Management',
    state: 'Rajasthan',
    programme: 'MBA, PGDM',
    submittedDate: '2025-05-01',
    stage: 'Regional Office',
    status: 'Submitted',
    pendencyDays: 8,
    year: '2026-27',
    remarks: '',
    history: [
      { date: '2025-05-01', action: 'Application Submitted', by: 'Applicant' },
    ]
  },
  {
    id: 'AICTE/2025/FDR/006',
    type: 'FDR Submission',
    institution: 'Sunrise Polytechnic Institute',
    state: 'Gujarat',
    programme: 'Diploma Engineering',
    submittedDate: '2025-04-18',
    stage: 'Document Verification',
    status: 'Pending',
    pendencyDays: 19,
    year: '2025-26',
    remarks: '',
    history: [
      { date: '2025-04-18', action: 'Application Submitted', by: 'Applicant' },
    ]
  },
  {
    id: 'AICTE/2025/CN/007',
    type: 'Change in Name',
    institution: 'Delhi Technical Institute',
    state: 'Delhi',
    programme: 'Institution Name Change',
    submittedDate: '2025-03-25',
    stage: 'Bureau Office',
    status: 'Under Review',
    pendencyDays: 34,
    year: '2025-26',
    remarks: '',
    history: [
      { date: '2025-03-25', action: 'Application Submitted', by: 'Applicant' },
      { date: '2025-04-02', action: 'Forwarded to Bureau', by: 'Regional Officer' },
    ]
  },
];

const SEED_DOCUMENTS = [
  {
    id: 'DOC001',
    type: 'FDR (Fixed Deposit Receipt)',
    number: 'FDR/SBI/2024/001842',
    institution: 'Bharat Institute of Technology & Sciences',
    bank: 'State Bank of India',
    amount: 5000000,
    issueDate: '2024-01-15',
    expiryDate: '2026-01-15',
    status: 'Verified',
    remarks: '',
  },
  {
    id: 'DOC002',
    type: 'Lease Deed',
    number: 'LD/AP/2023/007',
    institution: 'Sri Venkateshwara Engineering College',
    bank: 'Sub-Registrar Office, Tirupati',
    amount: 0,
    issueDate: '2023-06-01',
    expiryDate: '2028-05-31',
    status: 'Verified',
    remarks: '',
  },
  {
    id: 'DOC003',
    type: 'FDR (Fixed Deposit Receipt)',
    number: 'FDR/PNB/2025/003311',
    institution: 'Poona College of Engineering',
    bank: 'Punjab National Bank',
    amount: 2500000,
    issueDate: '2025-03-01',
    expiryDate: '2025-11-15',  // expiring soon
    status: 'Pending Verification',
    remarks: 'Please verify urgently',
  },
  {
    id: 'DOC004',
    type: 'Bank Guarantee',
    number: 'BG/HDFC/2024/00982',
    institution: 'Garden City University',
    bank: 'HDFC Bank Ltd.',
    amount: 1000000,
    issueDate: '2024-07-10',
    expiryDate: '2024-10-10',  // expired
    status: 'Expired',
    remarks: '',
  },
  {
    id: 'DOC005',
    type: 'Fire NOC',
    number: 'NOC/RJ/FD/2025/045',
    institution: 'Rajputana Institute of Management',
    bank: 'Fire Department, Jaipur',
    amount: 0,
    issueDate: '2025-01-20',
    expiryDate: '2026-01-19',
    status: 'Pending Verification',
    remarks: '',
  },
];

const SEED_UNDERTAKINGS = [
  {
    id: 'UT001',
    institution: 'Bharat Institute of Technology & Sciences',
    type: 'Anti-Ragging Undertaking',
    dueDate: '2025-07-31',
    submitted: true,
    submittedDate: '2025-07-15',
    compliance: 'Compliant',
  },
  {
    id: 'UT002',
    institution: 'Sri Venkateshwara Engineering College',
    type: 'Tuition Fee Compliance',
    dueDate: '2025-06-30',
    submitted: false,
    submittedDate: null,
    compliance: 'Non-Compliant',
  },
  {
    id: 'UT003',
    institution: 'Poona College of Engineering',
    type: 'Faculty Qualification Compliance',
    dueDate: '2025-08-15',
    submitted: true,
    submittedDate: '2025-08-10',
    compliance: 'Compliant',
  },
  {
    id: 'UT004',
    institution: 'Garden City University',
    type: 'Website Disclosure',
    dueDate: '2025-05-31',
    submitted: false,
    submittedDate: null,
    compliance: 'Overdue',
  },
  {
    id: 'UT005',
    institution: 'Rajputana Institute of Management',
    type: 'Grievance Redressal',
    dueDate: '2025-09-01',
    submitted: false,
    submittedDate: null,
    compliance: 'Pending',
  },
];

const SEED_EVC = [
  {
    id: 'EVC001',
    institution: 'Bharat Institute of Technology & Sciences',
    appId: 'AICTE/2025/NIA/001',
    date: '2025-06-15',
    time: '10:00',
    members: 'Dr. A. Krishnamurthy, Dr. S. Patel',
    mode: 'Physical Visit',
    status: 'Scheduled',
    remarks: '',
  },
  {
    id: 'EVC002',
    institution: 'Sri Venkateshwara Engineering College',
    appId: 'AICTE/2025/EOA/002',
    date: '2025-04-01',
    time: '09:30',
    members: 'Dr. R. Sharma, Prof. B. Menon',
    mode: 'Physical Visit',
    status: 'Completed',
    remarks: 'Visit completed. Report submitted.',
  },
  {
    id: 'EVC003',
    institution: 'Garden City University',
    appId: 'AICTE/2025/NP/004',
    date: '2025-02-01',
    time: '11:00',
    members: 'Dr. A. Krishnamurthy, Dr. V. Singh',
    mode: 'Physical Visit',
    status: 'Completed',
    remarks: 'Satisfactory',
  },
];

const SEED_NOTIFICATIONS = [
  {
    id: 'N001',
    type: 'Status Update',
    title: 'Application Forwarded',
    msg: 'Application AICTE/2025/NIA/001 has been forwarded to Bureau Office for review.',
    date: '2025-05-10',
    read: false,
    icon: '📄',
  },
  {
    id: 'N002',
    type: 'Expiry Alert',
    title: 'FDR Expiring Soon',
    msg: 'FDR/PNB/2025/003311 for Poona College of Engineering expires on 15-Nov-2025. Please initiate renewal.',
    date: '2025-05-08',
    read: false,
    icon: '⚠️',
  },
  {
    id: 'N003',
    type: 'Correction Required',
    title: 'Application Returned',
    msg: 'Application AICTE/2025/II/003 has been returned for correction. Remark: FDR document needs renewal.',
    date: '2025-04-12',
    read: true,
    icon: '↩️',
  },
  {
    id: 'N004',
    type: 'EVC Scheduled',
    title: 'EVC Visit Scheduled',
    msg: 'An Expert Visiting Committee visit has been scheduled for Bharat Institute of Technology & Sciences on 15-Jun-2025.',
    date: '2025-05-02',
    read: false,
    icon: '📅',
  },
  {
    id: 'N005',
    type: 'Undertaking Alert',
    title: 'Undertaking Overdue',
    msg: 'Website Disclosure undertaking for Garden City University was due on 31-May-2025 and has not been submitted.',
    date: '2025-06-01',
    read: false,
    icon: '🔴',
  },
  {
    id: 'N006',
    type: 'Status Update',
    title: 'Application Approved',
    msg: 'Application AICTE/2025/NP/004 for Garden City University has been approved.',
    date: '2025-02-10',
    read: true,
    icon: '✅',
  },
];

const SEED_AUDIT_LOGS = [
  { ts: '2025-05-01 09:15:22', role: 'Applicant', action: 'submit',   related: 'AICTE/2025/NIA/005', remarks: 'New application submitted' },
  { ts: '2025-04-18 14:30:05', role: 'Applicant', action: 'upload',   related: 'DOC005', remarks: 'Fire NOC uploaded' },
  { ts: '2025-04-12 11:02:44', role: 'Regional Officer', action: 'return', related: 'AICTE/2025/II/003', remarks: 'FDR document needs renewal' },
  { ts: '2025-04-05 10:00:00', role: 'Applicant', action: 'submit',   related: 'AICTE/2025/II/003', remarks: 'Application for intake increase' },
  { ts: '2025-04-02 16:20:11', role: 'Regional Officer', action: 'forward', related: 'AICTE/2025/CN/007', remarks: 'Forwarded to Bureau after initial review' },
  { ts: '2025-03-28 10:10:30', role: 'Bureau Officer', action: 'forward', related: 'AICTE/2025/NIA/001', remarks: 'Forwarded to Bureau Office' },
  { ts: '2025-03-25 09:00:00', role: 'Applicant', action: 'submit',   related: 'AICTE/2025/CN/007', remarks: 'Change of name application' },
  { ts: '2025-03-15 15:45:00', role: 'Regional Officer', action: 'forward', related: 'AICTE/2025/NIA/001', remarks: 'Initial verification complete' },
  { ts: '2025-03-10 08:30:00', role: 'Applicant', action: 'submit',   related: 'AICTE/2025/NIA/001', remarks: 'New institution approval application' },
  { ts: '2025-02-27 12:20:00', role: 'Regional Officer', action: 'verify',  related: 'DOC001 / AICTE/2025/EOA/002', remarks: 'Documents verified' },
  { ts: '2025-02-20 09:00:00', role: 'Applicant', action: 'submit',   related: 'AICTE/2025/EOA/002', remarks: 'Extension of approval submitted' },
  { ts: '2025-02-10 14:00:00', role: 'Bureau Officer', action: 'approve', related: 'AICTE/2025/NP/004', remarks: 'Approved with standard conditions' },
  { ts: '2025-02-01 10:00:00', role: 'EVC Member', action: 'schedule', related: 'EVC003 / AICTE/2025/NP/004', remarks: 'Site visit conducted' },
  { ts: '2025-01-22 13:30:00', role: 'Regional Officer', action: 'verify',  related: 'AICTE/2025/NP/004', remarks: 'All documents in order' },
  { ts: '2025-01-15 09:00:00', role: 'Applicant', action: 'submit',   related: 'AICTE/2025/NP/004', remarks: 'New programme application' },
];

// ─────────────────────────────────────────────
// LOCAL STORAGE HELPERS
// ─────────────────────────────────────────────
const LS_KEY = 'aicte_sampark_data';

function loadData() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return null;
}

function saveData(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch (e) { /* ignore */ }
}

function initData() {
  let data = loadData();
  if (!data) {
    data = {
      applications: [...SEED_APPLICATIONS],
      documents: [...SEED_DOCUMENTS],
      undertakings: [...SEED_UNDERTAKINGS],
      evcSchedules: [...SEED_EVC],
      notifications: [...SEED_NOTIFICATIONS],
      auditLogs: [...SEED_AUDIT_LOGS],
      settings: { instName: '', email: '', phone: '', state: '' },
    };
    saveData(data);
  }
  return data;
}

let DB = initData();

function persist() { saveData(DB); }

// ─────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────
function genId(prefix) {
  return prefix + '_' + Date.now().toString(36).toUpperCase();
}

function today() { return new Date().toISOString().split('T')[0]; }

function formatDate(d) {
  if (!d) return '—';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const now = new Date(); now.setHours(0,0,0,0);
  const d   = new Date(dateStr + 'T00:00:00');
  return Math.round((d - now) / 86400000);
}

function calcPendency(submittedDate) {
  const now = new Date(); now.setHours(0,0,0,0);
  const d   = new Date(submittedDate + 'T00:00:00');
  return Math.max(0, Math.round((now - d) / 86400000));
}

function statusBadge(status) {
  const map = {
    'Submitted':             'badge-blue',
    'Under Review':          'badge-orange',
    'Returned for Correction':'badge-red',
    'Returned':              'badge-red',
    'Approved':              'badge-green',
    'Pending':               'badge-grey',
    'Verified':              'badge-green',
    'Pending Verification':  'badge-orange',
    'Expired':               'badge-red',
    'Active':                'badge-green',
    'Compliant':             'badge-green',
    'Non-Compliant':         'badge-red',
    'Overdue':               'badge-red',
    'Scheduled':             'badge-blue',
    'Completed':             'badge-green',
    'Cancelled':             'badge-grey',
    'Draft':                 'badge-grey',
  };
  const cls = map[status] || 'badge-grey';
  return `<span class="badge ${cls}">${status}</span>`;
}

function expiryBadge(dateStr) {
  const days = daysUntil(dateStr);
  if (days === null) return '<span class="text-light">—</span>';
  if (days < 0)  return `<span class="badge badge-red">Expired (${Math.abs(days)}d ago)</span>`;
  if (days <= 30) return `<span class="badge badge-orange">⚠️ ${days}d left</span>`;
  if (days <= 90) return `<span class="badge badge-teal">${days}d left</span>`;
  return `<span class="badge badge-green">${days}d left</span>`;
}

function docStatusBadge(doc) {
  const days = daysUntil(doc.expiryDate);
  if (days !== null && days < 0) return statusBadge('Expired');
  if (days !== null && days <= 30) return statusBadge('Expiring Soon');
  return statusBadge(doc.status);
}

function escHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function amountFmt(n) {
  if (!n || n === 0) return '—';
  return '₹' + Number(n).toLocaleString('en-IN');
}

function actionChip(action) {
  const map = {
    submit:   ['chip-submit',  'Submit'],
    upload:   ['chip-upload',  'Upload'],
    verify:   ['chip-verify',  'Verify'],
    forward:  ['chip-forward', 'Forward'],
    return:   ['chip-return',  'Return'],
    schedule: ['chip-schedule','Schedule'],
    approve:  ['chip-approve', 'Approve'],
    login:    ['chip-login',   'Login'],
    remark:   ['chip-remark',  'Remark'],
  };
  const [cls, lbl] = map[action] || ['chip-submit', action];
  return `<span class="audit-action-chip ${cls}">${lbl}</span>`;
}

function nowTs() {
  return new Date().toLocaleString('en-IN', { hour12: false,
    year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', second:'2-digit' }).replace(',', '');
}

function addAuditLog(action, related, remarks) {
  const roleLabel = currentRole ? ROLES[currentRole].label : 'System';
  DB.auditLogs.unshift({ ts: nowTs(), role: roleLabel, action, related, remarks });
  persist();
}

function addNotification(type, title, msg) {
  DB.notifications.unshift({
    id: genId('N'),
    type, title, msg,
    date: today(),
    read: false,
    icon: type === 'Expiry Alert' ? '⚠️' : type === 'Status Update' ? '📄' : type === 'EVC Scheduled' ? '📅' : '🔔',
  });
  persist();
  updateNotifBadge();
}

// ─────────────────────────────────────────────
// ROLE SELECTION
// ─────────────────────────────────────────────
function selectRole(role) {
  currentRole = role;
  document.getElementById('role-screen').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');

  document.getElementById('sidebar-role-name').textContent = ROLES[role].label;
  document.getElementById('sidebar-role-label').textContent = ROLES[role].short;
  document.getElementById('user-avatar').textContent = ROLES[role].avatar;

  buildNav(role);
  updateNotifBadge();

  // Navigate to default page for role
  const defaultPage = NAV_CONFIG[role][0].id;
  navigate(defaultPage);

  addAuditLog('login', '—', `${ROLES[role].label} logged in`);
}

function switchRole() {
  currentRole = null;
  currentPage = null;
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('role-screen').classList.remove('hidden');
  // hide sidebar on mobile
  document.getElementById('sidebar').classList.remove('open');
}

// ─────────────────────────────────────────────
// SIDEBAR NAV
// ─────────────────────────────────────────────
function buildNav(role) {
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = '';
  const items = NAV_CONFIG[role] || [];
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'nav-item';
    el.id = 'nav-' + item.id;
    el.innerHTML = `<span class="nav-icon">${item.icon}</span> <span>${item.label}</span>`;
    el.onclick = () => navigate(item.id);
    nav.appendChild(el);
  });
}

function navigate(pageId) {
  // Hide all pages
  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));

  // Show requested page
  const el = document.getElementById('page-' + pageId);
  if (el) {
    el.classList.add('active');
    currentPage = pageId;
  }

  // Update nav highlight
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navEl = document.getElementById('nav-' + pageId);
  if (navEl) navEl.classList.add('active');

  // Update header
  const [title, sub] = PAGE_TITLES[pageId] || [pageId, ''];
  document.getElementById('header-page-title').textContent = title;
  document.getElementById('header-page-sub').textContent = sub;

  // Close sidebar on mobile
  if (window.innerWidth < 900) {
    document.getElementById('sidebar').classList.remove('open');
  }

  // Render page content
  renderPage(pageId);
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ─────────────────────────────────────────────
// PAGE RENDERERS
// ─────────────────────────────────────────────
function renderPage(pageId) {
  switch (pageId) {
    case 'applicant-dashboard':  renderApplicantDashboard(); break;
    case 'my-applications':      renderMyApplications();     break;
    case 'upload-documents':     renderDocuments();          break;
    case 'fdr-tracking':         renderFdrTracking();        break;
    case 'undertakings':         renderUndertakings();       break;
    case 'notifications':        renderNotifications();      break;
    case 'officer-overview':     renderOfficerOverview();    break;
    case 'app-queue':            renderAppQueue();           break;
    case 'doc-verification':     renderDocVerification();    break;
    case 'evc-scheduling':       renderEvcScheduling();      break;
    case 'compliance':           renderCompliance();         break;
    case 'expiry-alerts':        renderExpiryAlerts();       break;
    case 'reports':              renderReports();            break;
    case 'audit-logs':           renderAuditLogs();          break;
    case 'evc-overview':         renderEvcOverview();        break;
    default: break;
  }
}

// ─────────────────────────────────────────────
// APPLICANT DASHBOARD
// ─────────────────────────────────────────────
function renderApplicantDashboard() {
  const apps = DB.applications;
  const total   = apps.length;
  const pending  = apps.filter(a => ['Submitted','Under Review','Pending'].includes(a.status)).length;
  const returned = apps.filter(a => a.status === 'Returned for Correction').length;
  const expiring = DB.documents.filter(d => { const days = daysUntil(d.expiryDate); return days !== null && days >= 0 && days <= 30; }).length;

  document.getElementById('app-stat-grid').innerHTML = `
    <div class="stat-card accent-navy">
      <div class="stat-icon">📄</div>
      <div class="stat-label">Total Applications</div>
      <div class="stat-value">${total}</div>
      <div class="stat-change">All time submissions</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">⏳</div>
      <div class="stat-label">Pending / Under Review</div>
      <div class="stat-value">${pending}</div>
      <div class="stat-change">Awaiting AICTE decision</div>
    </div>
    <div class="stat-card accent-orange">
      <div class="stat-icon">↩️</div>
      <div class="stat-label">Returned for Correction</div>
      <div class="stat-value">${returned}</div>
      <div class="stat-change">Action required</div>
    </div>
    <div class="stat-card accent-red">
      <div class="stat-icon">⚠️</div>
      <div class="stat-label">Upcoming Expiries</div>
      <div class="stat-value">${expiring}</div>
      <div class="stat-change">Within 30 days</div>
    </div>
  `;

  const tbody = document.getElementById('recent-apps-tbody');
  const recent = apps.slice(0, 5);
  tbody.innerHTML = recent.map(a => `
    <tr>
      <td><strong>${escHtml(a.id)}</strong></td>
      <td>${escHtml(a.type)}</td>
      <td>${formatDate(a.submittedDate)}</td>
      <td>${escHtml(a.stage)}</td>
      <td>${statusBadge(a.status)}</td>
      <td>
        <div class="action-group">
          <button class="btn btn-secondary btn-xs" onclick="viewApplication('${escHtml(a.id)}')">View</button>
        </div>
      </td>
    </tr>
  `).join('');

  // Pending Actions
  const actions = [];
  apps.filter(a => a.status === 'Returned for Correction').forEach(a => {
    actions.push(`<div class="alert alert-warn">↩️ <strong>${a.id}</strong>: ${a.remarks || 'Please review and resubmit'}</div>`);
  });
  const expDocs = DB.documents.filter(d => { const days = daysUntil(d.expiryDate); return days !== null && days >= 0 && days <= 30; });
  expDocs.forEach(d => {
    actions.push(`<div class="alert alert-warn mt-1">⚠️ <strong>${d.number}</strong> expires in ${daysUntil(d.expiryDate)} days — please initiate renewal</div>`);
  });

  const pending_uts = DB.undertakings.filter(u => !u.submitted && (u.compliance === 'Pending' || u.compliance === 'Overdue'));
  pending_uts.forEach(u => {
    actions.push(`<div class="alert alert-error mt-1">🔴 Undertaking due: <strong>${u.type}</strong> (${u.institution}) — Due ${formatDate(u.dueDate)}</div>`);
  });

  document.getElementById('pending-actions-list').innerHTML =
    actions.length ? actions.join('') : '<div class="empty-state"><p>✅ No pending actions at this time.</p></div>';
}

// ─────────────────────────────────────────────
// MY APPLICATIONS
// ─────────────────────────────────────────────
function renderMyApplications() {
  filterApplications();
}

function filterApplications() {
  const search = (document.getElementById('app-search')?.value || '').toLowerCase();
  const statusF = document.getElementById('app-status-filter')?.value || '';
  const tbody = document.getElementById('my-apps-tbody');
  if (!tbody) return;

  let filtered = DB.applications.filter(a => {
    const matchSearch = !search || a.id.toLowerCase().includes(search) || a.type.toLowerCase().includes(search) || a.institution.toLowerCase().includes(search);
    const matchStatus = !statusF || a.status === statusF || (statusF === 'Returned' && a.status === 'Returned for Correction');
    return matchSearch && matchStatus;
  });

  tbody.innerHTML = filtered.length === 0
    ? `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">📭</div><p>No applications found.</p></div></td></tr>`
    : filtered.map(a => {
        const pendency = calcPendency(a.submittedDate);
        const pendCls = pendency > 30 ? 'expiry-warn' : '';
        return `<tr>
          <td><strong>${escHtml(a.id)}</strong></td>
          <td>${escHtml(a.type)}</td>
          <td>${formatDate(a.submittedDate)}</td>
          <td><span class="badge badge-navy">${escHtml(a.stage)}</span></td>
          <td>${statusBadge(a.status)}</td>
          <td><span class="${pendCls}">${pendency}d</span></td>
          <td>
            <div class="action-group">
              <button class="btn btn-secondary btn-xs" onclick="viewApplication('${escHtml(a.id)}')">View</button>
              ${a.status === 'Returned for Correction' ? `<button class="btn btn-primary btn-xs" onclick="navigate('upload-documents')">Fix &amp; Resubmit</button>` : ''}
            </div>
          </td>
        </tr>`;
      }).join('');
}

// ─────────────────────────────────────────────
// VIEW APPLICATION MODAL
// ─────────────────────────────────────────────
function viewApplication(id) {
  const app = DB.applications.find(a => a.id === id);
  if (!app) return;

  document.getElementById('view-app-body').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      <div><div class="form-label text-sm">Application ID</div><div class="font-bold text-navy">${escHtml(app.id)}</div></div>
      <div><div class="form-label text-sm">Type</div><div>${escHtml(app.type)}</div></div>
      <div><div class="form-label text-sm">Institution</div><div>${escHtml(app.institution)}</div></div>
      <div><div class="form-label text-sm">State</div><div>${escHtml(app.state)}</div></div>
      <div><div class="form-label text-sm">Academic Year</div><div>${escHtml(app.year)}</div></div>
      <div><div class="form-label text-sm">Submitted</div><div>${formatDate(app.submittedDate)}</div></div>
      <div><div class="form-label text-sm">Current Stage</div><div><span class="badge badge-navy">${escHtml(app.stage)}</span></div></div>
      <div><div class="form-label text-sm">Status</div><div>${statusBadge(app.status)}</div></div>
      <div style="grid-column:1/-1"><div class="form-label text-sm">Programme(s)</div><div>${escHtml(app.programme)}</div></div>
      ${app.remarks ? `<div style="grid-column:1/-1"><div class="form-label text-sm">Remarks</div><div class="alert alert-warn">${escHtml(app.remarks)}</div></div>` : ''}
    </div>
    <h4 style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:8px">Application History</h4>
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr><th>Date</th><th>Action</th><th>By</th><th>Note</th></tr></thead>
        <tbody>
          ${(app.history || []).map(h => `
            <tr>
              <td>${formatDate(h.date)}</td>
              <td>${escHtml(h.action)}</td>
              <td>${escHtml(h.by)}</td>
              <td>${escHtml(h.note || '—')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  document.getElementById('view-app-overlay').classList.remove('hidden');
}

// ─────────────────────────────────────────────
// NEW APPLICATION
// ─────────────────────────────────────────────
function submitNewApplication(e) {
  e.preventDefault();
  const type     = document.getElementById('na-type').value;
  const inst     = document.getElementById('na-inst').value.trim();
  const state    = document.getElementById('na-state').value;
  const year     = document.getElementById('na-year').value;
  const prog     = document.getElementById('na-prog').value.trim();
  const remarks  = document.getElementById('na-remarks').value.trim();

  confirmAction('Submit Application', `Submit a new "${type}" application for <strong>${escHtml(inst)}</strong>?`, '📤', () => {
    const id = `AICTE/${new Date().getFullYear()}/${type.substring(0,2).toUpperCase()}/${String(DB.applications.length + 1).padStart(3,'0')}`;
    const app = {
      id, type, institution: inst, state, programme: prog, year,
      submittedDate: today(),
      stage: 'Regional Office',
      status: 'Submitted',
      pendencyDays: 0,
      remarks,
      history: [{ date: today(), action: 'Application Submitted', by: 'Applicant' }],
    };
    DB.applications.unshift(app);
    addNotification('Status Update', 'Application Submitted', `Application ${id} submitted successfully and is now under review at Regional Office.`);
    addAuditLog('submit', id, `${type} submitted for ${inst}`);
    persist();
    showToast(`Application ${id} submitted successfully!`, 'success');
    document.getElementById('new-app-form').reset();
    navigate('my-applications');
  });
}

// ─────────────────────────────────────────────
// DOCUMENT UPLOAD
// ─────────────────────────────────────────────
function renderDocuments() {
  const tbody = document.getElementById('docs-tbody');
  if (!tbody) return;
  tbody.innerHTML = DB.documents.map(d => `
    <tr>
      <td>${escHtml(d.type)}</td>
      <td><strong>${escHtml(d.number)}</strong></td>
      <td>${escHtml(d.institution)}</td>
      <td>${formatDate(d.issueDate)}</td>
      <td>${d.expiryDate ? formatDate(d.expiryDate) : '—'}</td>
      <td>${docStatusBadge(d)}</td>
      <td>
        <button class="btn btn-danger btn-xs" onclick="deleteDocument('${escHtml(d.id)}')">Remove</button>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="7"><div class="empty-state"><p>No documents uploaded yet.</p></div></td></tr>`;
}

function fileSelected(input) {
  const nm = document.getElementById('selected-file-name');
  if (input.files && input.files[0]) {
    nm.textContent = '📎 ' + input.files[0].name;
    nm.classList.remove('hidden');
  }
}

function toggleOcrSection() {
  const type = document.getElementById('doc-type').value;
  const ocrEl = document.getElementById('ocr-section');
  if (['FDR (Fixed Deposit Receipt)', 'Bank Guarantee', 'Lease Deed'].includes(type)) {
    ocrEl.classList.remove('hidden');
  } else {
    ocrEl.classList.add('hidden');
  }
}

function checkExpiry() {
  const expiryDate = document.getElementById('doc-expiry-date').value;
  const warnEl = document.getElementById('expiry-warning');
  if (!expiryDate) { warnEl.classList.add('hidden'); return; }
  const days = daysUntil(expiryDate);
  if (days !== null && days >= 0 && days <= 30) {
    warnEl.classList.remove('hidden');
  } else {
    warnEl.classList.add('hidden');
  }
}

function runDemoOCR() {
  const type    = document.getElementById('doc-type').value || 'FDR';
  const bank    = document.getElementById('doc-bank').value || 'State Bank of India';
  const number  = document.getElementById('doc-number').value || 'FDR/SBI/2025/DEMO';
  const amount  = document.getElementById('doc-amount').value || '50,00,000';
  const issue   = document.getElementById('doc-issue-date').value;
  const expiry  = document.getElementById('doc-expiry-date').value;

  document.getElementById('ocr-results').classList.remove('hidden');
  document.getElementById('ocr-results').innerHTML = `
    <div class="ocr-row"><span class="ocr-key">Document Type:</span><span class="ocr-val">${escHtml(type)}</span></div>
    <div class="ocr-row"><span class="ocr-key">Issuing Bank:</span><span class="ocr-val">${escHtml(bank)}</span></div>
    <div class="ocr-row"><span class="ocr-key">Document Number:</span><span class="ocr-val">${escHtml(number)}</span></div>
    <div class="ocr-row"><span class="ocr-key">Amount (Detected):</span><span class="ocr-val">₹ ${Number(amount).toLocaleString('en-IN') || amount}</span></div>
    <div class="ocr-row"><span class="ocr-key">Issue Date:</span><span class="ocr-val">${issue ? formatDate(issue) : 'Not detected'}</span></div>
    <div class="ocr-row"><span class="ocr-key">Expiry / Maturity:</span><span class="ocr-val">${expiry ? formatDate(expiry) : 'Not detected'}</span></div>
    <div class="ocr-row"><span class="ocr-key">Confidence Score:</span><span class="ocr-val">94.2% (Simulated)</span></div>
    <div class="ocr-row"><span class="ocr-key">NeSL Verification:</span><span class="ocr-val"><em>Not performed (demo only)</em></span></div>
  `;
  showToast('Demo OCR simulation complete. Please verify details manually.', 'info');
}

function saveDraftDocument() {
  showToast('Document saved as draft. You can continue later.', 'info');
}

function submitDocument(e) {
  e.preventDefault();
  const type    = document.getElementById('doc-type').value;
  const inst    = document.getElementById('doc-inst').value.trim();
  const number  = document.getElementById('doc-number').value.trim();
  const bank    = document.getElementById('doc-bank').value.trim();
  const amount  = document.getElementById('doc-amount').value;
  const issue   = document.getElementById('doc-issue-date').value;
  const expiry  = document.getElementById('doc-expiry-date').value;
  const remarks = document.getElementById('doc-remarks').value.trim();

  confirmAction('Submit Document', `Submit <strong>${escHtml(type)}</strong> for verification?`, '📤', () => {
    const doc = {
      id: genId('DOC'),
      type, number, institution: inst, bank,
      amount: amount ? parseFloat(amount) : 0,
      issueDate: issue, expiryDate: expiry,
      status: 'Pending Verification', remarks,
    };
    DB.documents.unshift(doc);
    addNotification('Status Update', 'Document Submitted', `${type} (${number}) submitted for verification.`);
    addAuditLog('upload', `${number} / ${inst}`, `${type} submitted for verification`);
    persist();
    showToast('Document submitted for verification!', 'success');
    document.getElementById('upload-doc-form').reset();
    document.getElementById('selected-file-name').classList.add('hidden');
    document.getElementById('expiry-warning').classList.add('hidden');
    document.getElementById('ocr-section').classList.add('hidden');
    document.getElementById('ocr-results').classList.add('hidden');
    renderDocuments();
  });
}

function deleteDocument(id) {
  confirmAction('Remove Document', 'Remove this document record?', '🗑️', () => {
    DB.documents = DB.documents.filter(d => d.id !== id);
    persist();
    renderDocuments();
    showToast('Document removed.', 'info');
  });
}

// ─────────────────────────────────────────────
// FDR TRACKING
// ─────────────────────────────────────────────
function renderFdrTracking() {
  const docs = DB.documents.filter(d =>
    ['FDR (Fixed Deposit Receipt)', 'Lease Deed', 'Bank Guarantee'].includes(d.type)
  );

  const total    = docs.length;
  const active   = docs.filter(d => { const days = daysUntil(d.expiryDate); return days !== null && days > 30; }).length;
  const expiring = docs.filter(d => { const days = daysUntil(d.expiryDate); return days !== null && days >= 0 && days <= 30; }).length;
  const expired  = docs.filter(d => { const days = daysUntil(d.expiryDate); return days !== null && days < 0; }).length;

  document.getElementById('fdr-stat-grid').innerHTML = `
    <div class="stat-card accent-navy"><div class="stat-icon">🏦</div><div class="stat-label">Total FDR/Lease</div><div class="stat-value">${total}</div></div>
    <div class="stat-card accent-green"><div class="stat-icon">✅</div><div class="stat-label">Active</div><div class="stat-value">${active}</div></div>
    <div class="stat-card accent-orange"><div class="stat-icon">⚠️</div><div class="stat-label">Expiring Soon</div><div class="stat-value">${expiring}</div><div class="stat-change">Within 30 days</div></div>
    <div class="stat-card accent-red"><div class="stat-icon">❌</div><div class="stat-label">Expired</div><div class="stat-value">${expired}</div></div>
  `;

  renderFdrTable();
}

function renderFdrTable() {
  const filter = document.getElementById('fdr-status-filter')?.value || '';
  let docs = DB.documents.filter(d =>
    ['FDR (Fixed Deposit Receipt)', 'Lease Deed', 'Bank Guarantee'].includes(d.type)
  );

  if (filter) {
    docs = docs.filter(d => {
      const days = daysUntil(d.expiryDate);
      if (filter === 'Active')    return days !== null && days > 30;
      if (filter === 'Expiring')  return days !== null && days >= 0 && days <= 30;
      if (filter === 'Expired')   return days !== null && days < 0;
      return true;
    });
  }

  const tbody = document.getElementById('fdr-tbody');
  tbody.innerHTML = docs.map(d => {
    const days = daysUntil(d.expiryDate);
    let rowCls = '';
    if (days !== null && days < 0) rowCls = 'overdue-row';
    else if (days !== null && days <= 30) rowCls = 'due-soon-row';

    return `<tr class="${rowCls}">
      <td>${escHtml(d.type)}</td>
      <td><strong>${escHtml(d.number)}</strong></td>
      <td>${escHtml(d.institution)}</td>
      <td>${escHtml(d.bank)}</td>
      <td>${amountFmt(d.amount)}</td>
      <td>${d.expiryDate ? formatDate(d.expiryDate) : '—'}</td>
      <td>${docStatusBadge(d)}</td>
      <td>${expiryBadge(d.expiryDate)}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="8"><div class="empty-state"><p>No FDR/Lease records found.</p></div></td></tr>`;
}

// ─────────────────────────────────────────────
// UNDERTAKINGS
// ─────────────────────────────────────────────
function renderUndertakings() {
  const tbody = document.getElementById('undertakings-tbody');
  if (!tbody) return;

  tbody.innerHTML = DB.undertakings.map(u => {
    const days = daysUntil(u.dueDate);
    let rowCls = '';
    if (!u.submitted && days !== null && days < 0) rowCls = 'overdue-row';
    else if (!u.submitted && days !== null && days <= 30) rowCls = 'due-soon-row';

    return `<tr class="${rowCls}">
      <td>${escHtml(u.institution)}</td>
      <td>${escHtml(u.type)}</td>
      <td>${formatDate(u.dueDate)} ${(!u.submitted && days !== null && days < 0) ? '<span class="expiry-warn"> (OVERDUE)</span>' : ''}</td>
      <td>${u.submitted ? `<span class="badge badge-green">✓ ${formatDate(u.submittedDate)}</span>` : '<span class="badge badge-grey">Not Submitted</span>'}</td>
      <td>${statusBadge(u.compliance)}</td>
      <td>
        ${!u.submitted ? `<button class="btn btn-primary btn-xs" onclick="submitUndertakingById('${u.id}')">Submit Now</button>` : '<span class="text-light text-sm">—</span>'}
      </td>
    </tr>`;
  }).join('') || `<tr><td colspan="6"><div class="empty-state"><p>No undertakings found.</p></div></td></tr>`;
}

function openSubmitUndertaking() {
  document.getElementById('undertaking-form-card').classList.remove('hidden');
  document.getElementById('ut-inst').value = '';
  document.getElementById('ut-type').value = '';
  document.getElementById('ut-due').value = '';
  document.getElementById('ut-decl').value = '';
}

function submitUndertaking(e) {
  e.preventDefault();
  const type  = document.getElementById('ut-type').value;
  const inst  = document.getElementById('ut-inst').value.trim();
  const due   = document.getElementById('ut-due').value;

  confirmAction('Submit Undertaking', `Submit <strong>${escHtml(type)}</strong> undertaking for <strong>${escHtml(inst)}</strong>?`, '📝', () => {
    const ut = {
      id: genId('UT'),
      institution: inst, type, dueDate: due,
      submitted: true, submittedDate: today(), compliance: 'Compliant',
    };
    DB.undertakings.unshift(ut);
    addAuditLog('submit', `UT-${type}/${inst}`, `Undertaking submitted`);
    addNotification('Status Update', 'Undertaking Submitted', `${type} undertaking for ${inst} has been submitted.`);
    persist();
    showToast('Undertaking submitted successfully!', 'success');
    document.getElementById('undertaking-form-card').classList.add('hidden');
    document.getElementById('undertaking-form').reset();
    renderUndertakings();
  });
}

function submitUndertakingById(id) {
  const ut = DB.undertakings.find(u => u.id === id);
  if (!ut) return;
  confirmAction('Submit Undertaking', `Mark <strong>${escHtml(ut.type)}</strong> for <strong>${escHtml(ut.institution)}</strong> as submitted?`, '📝', () => {
    ut.submitted = true;
    ut.submittedDate = today();
    ut.compliance = 'Compliant';
    addAuditLog('submit', `${ut.id}`, `Undertaking submitted: ${ut.type}`);
    persist();
    showToast('Undertaking submitted!', 'success');
    renderUndertakings();
  });
}

// ─────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────
function renderNotifications() {
  const list = document.getElementById('notifications-list');
  if (!list) return;

  if (DB.notifications.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">🔔</div><p>No notifications yet.</p></div>`;
    return;
  }

  list.innerHTML = DB.notifications.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}" id="notif-${n.id}">
      <div class="notif-dot"></div>
      <div class="notif-content">
        <div class="notif-title">${n.icon} ${escHtml(n.title)}</div>
        <div class="notif-msg">${escHtml(n.msg)}</div>
        <div class="notif-meta">${escHtml(n.type)} · ${formatDate(n.date)}</div>
      </div>
      <div class="notif-actions">
        ${!n.read ? `<button class="btn btn-secondary btn-xs" onclick="markRead('${n.id}')">Mark Read</button>` : '<span class="text-sm text-light">Read</span>'}
      </div>
    </div>
  `).join('');
}

function markRead(id) {
  const n = DB.notifications.find(x => x.id === id);
  if (n) { n.read = true; persist(); }
  renderNotifications();
  updateNotifBadge();
}

function markAllRead() {
  DB.notifications.forEach(n => n.read = true);
  persist();
  renderNotifications();
  updateNotifBadge();
  showToast('All notifications marked as read.', 'info');
}

function updateNotifBadge() {
  const count = DB.notifications.filter(n => !n.read).length;
  const badge = document.getElementById('notif-count');
  if (!badge) return;
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

// ─────────────────────────────────────────────
// OFFICER OVERVIEW
// ─────────────────────────────────────────────
function renderOfficerOverview() {
  const apps = DB.applications;
  const pending  = apps.filter(a => ['Submitted','Under Review','Pending'].includes(a.status)).length;
  const overdue  = apps.filter(a => calcPendency(a.submittedDate) > 30 && a.status !== 'Approved').length;
  const processed= apps.filter(a => a.status === 'Approved').length;
  const total    = apps.length;

  // EVC upcoming
  const upcoming = DB.evcSchedules.filter(e => e.status === 'Scheduled').length;

  document.getElementById('officer-stat-grid').innerHTML = `
    <div class="stat-card accent-orange"><div class="stat-icon">⏳</div><div class="stat-label">Pending Reviews</div><div class="stat-value">${pending}</div></div>
    <div class="stat-card accent-red"><div class="stat-icon">🔴</div><div class="stat-label">Overdue (&gt;30d)</div><div class="stat-value">${overdue}</div></div>
    <div class="stat-card"><div class="stat-icon">📅</div><div class="stat-label">Upcoming EVC Visits</div><div class="stat-value">${upcoming}</div></div>
    <div class="stat-card accent-green"><div class="stat-icon">✅</div><div class="stat-label">Total Processed</div><div class="stat-value">${processed}</div></div>
    <div class="stat-card accent-navy"><div class="stat-icon">📄</div><div class="stat-label">Total Applications</div><div class="stat-value">${total}</div></div>
  `;

  // Stage chart
  const stages = {};
  apps.forEach(a => { stages[a.stage] = (stages[a.stage] || 0) + 1; });
  document.getElementById('stage-chart').innerHTML = Object.entries(stages).map(([s, c]) =>
    buildBarItem(s, c, total, 'navy')
  ).join('');

  // Status chart
  const statuses = {};
  apps.forEach(a => { statuses[a.status] = (statuses[a.status] || 0) + 1; });
  document.getElementById('status-chart').innerHTML = Object.entries(statuses).map(([s, c]) =>
    buildBarItem(s, c, total, 'teal')
  ).join('');

  // Overdue table
  const overdueTbody = document.getElementById('overdue-tbody');
  const overdueApps = apps.filter(a => calcPendency(a.submittedDate) > 30 && a.status !== 'Approved');
  overdueTbody.innerHTML = overdueApps.map(a => `
    <tr class="overdue-row">
      <td>${escHtml(a.institution)}</td>
      <td><strong>${escHtml(a.id)}</strong></td>
      <td>${escHtml(a.type)}</td>
      <td>${escHtml(a.stage)}</td>
      <td class="expiry-warn">${calcPendency(a.submittedDate)} days</td>
      <td><button class="btn btn-secondary btn-xs" onclick="viewApplication('${escHtml(a.id)}')">View</button></td>
    </tr>
  `).join('') || `<tr><td colspan="6"><div class="empty-state"><p>No overdue applications.</p></div></td></tr>`;
}

function buildBarItem(label, count, total, color) {
  const pct = total > 0 ? Math.round(count / total * 100) : 0;
  return `
    <div class="chart-bar-item">
      <div class="chart-bar-label" title="${escHtml(label)}">${escHtml(label.substring(0,18))}${label.length>18?'…':''}</div>
      <div class="chart-bar-track"><div class="chart-bar-fill ${color}" style="width:${pct}%"></div></div>
      <div class="chart-bar-val">${count}</div>
    </div>
  `;
}

// ─────────────────────────────────────────────
// APPLICATION QUEUE
// ─────────────────────────────────────────────
function renderAppQueue() { filterQueue(); }

function filterQueue() {
  const search  = (document.getElementById('queue-search')?.value || '').toLowerCase();
  const typeF   = document.getElementById('queue-type-filter')?.value || '';
  const stageF  = document.getElementById('queue-stage-filter')?.value || '';
  const tbody   = document.getElementById('queue-tbody');
  if (!tbody) return;

  let filtered = DB.applications.filter(a => {
    const matchSearch = !search || a.id.toLowerCase().includes(search) || a.institution.toLowerCase().includes(search);
    const matchType   = !typeF  || a.type === typeF;
    const matchStage  = !stageF || a.stage === stageF;
    return matchSearch && matchType && matchStage;
  });

  tbody.innerHTML = filtered.length === 0
    ? `<tr><td colspan="8"><div class="empty-state"><div class="empty-icon">📭</div><p>No applications found.</p></div></td></tr>`
    : filtered.map(a => {
        const pendency = calcPendency(a.submittedDate);
        const pendCls = pendency > 30 ? 'expiry-warn' : '';
        return `<tr>
          <td>${escHtml(a.institution)}</td>
          <td><strong>${escHtml(a.id)}</strong></td>
          <td>${escHtml(a.type)}</td>
          <td>${formatDate(a.submittedDate)}</td>
          <td><span class="badge badge-navy">${escHtml(a.stage)}</span></td>
          <td><span class="${pendCls}">${pendency}d</span></td>
          <td>${statusBadge(a.status)}</td>
          <td>
            <div class="action-group">
              <button class="btn btn-secondary btn-xs" onclick="viewApplication('${escHtml(a.id)}')">View</button>
              <button class="btn btn-primary btn-xs" onclick="officerVerifyDoc('${escHtml(a.id)}')">Verify</button>
              <button class="btn btn-navy btn-xs" onclick="forwardApplication('${escHtml(a.id)}')">Forward</button>
              <button class="btn btn-danger btn-xs" onclick="returnApplication('${escHtml(a.id)}')">Return</button>
            </div>
          </td>
        </tr>`;
      }).join('');
}

function officerVerifyDoc(appId) {
  const app = DB.applications.find(a => a.id === appId);
  if (!app) return;
  confirmAction('Verify Documents', `Mark documents for <strong>${escHtml(app.institution)}</strong> as verified?`, '🔍', () => {
    app.status = 'Under Review';
    app.history.push({ date: today(), action: 'Document Verified', by: ROLES[currentRole].label });
    addAuditLog('verify', appId, `Documents verified for ${app.institution}`);
    addNotification('Status Update', 'Documents Verified', `Documents for application ${appId} have been verified.`);
    persist();
    showToast(`Documents verified for ${app.institution}`, 'success');
    filterQueue();
  });
}

function forwardApplication(appId) {
  const app = DB.applications.find(a => a.id === appId);
  if (!app) return;

  const stageMap = {
    'Regional Office': 'Bureau Office',
    'Bureau Office': 'EVC Scheduled',
    'EVC Scheduled': 'Final Review',
    'Final Review': 'Approved',
  };

  const nextStage = stageMap[app.stage];
  if (!nextStage) {
    showToast('Application is already at the final stage.', 'warn');
    return;
  }

  openRemarkModal(`Forward to ${nextStage}`, (remark) => {
    confirmAction('Forward Application', `Forward <strong>${escHtml(app.id)}</strong> from <strong>${escHtml(app.stage)}</strong> to <strong>${nextStage}</strong>?`, '➡️', () => {
      const prevStage = app.stage;
      app.stage = nextStage;
      if (nextStage === 'Approved') {
        app.status = 'Approved';
        addNotification('Status Update', 'Application Approved', `Application ${appId} for ${app.institution} has been approved.`);
      } else {
        addNotification('Status Update', 'Application Forwarded', `Application ${appId} forwarded to ${nextStage}.`);
      }
      app.history.push({ date: today(), action: `Forwarded to ${nextStage}`, by: ROLES[currentRole].label, note: remark });
      addAuditLog('forward', appId, `${prevStage} → ${nextStage}. ${remark}`);
      persist();
      showToast(`Application forwarded to ${nextStage}`, 'success');
      filterQueue();
    });
  });
}

function returnApplication(appId) {
  const app = DB.applications.find(a => a.id === appId);
  if (!app) return;

  openRemarkModal('Return for Correction', (remark) => {
    confirmAction('Return Application', `Return <strong>${escHtml(app.id)}</strong> for correction?`, '↩️', () => {
      app.status = 'Returned for Correction';
      app.remarks = remark;
      app.history.push({ date: today(), action: 'Returned for Correction', by: ROLES[currentRole].label, note: remark });
      addAuditLog('return', appId, remark);
      addNotification('Correction Required', 'Application Returned', `Application ${appId} returned for correction. Reason: ${remark}`);
      persist();
      showToast(`Application returned for correction.`, 'warn');
      filterQueue();
    });
  });
}

// ─────────────────────────────────────────────
// DOCUMENT VERIFICATION (Officer)
// ─────────────────────────────────────────────
function renderDocVerification() {
  const tbody = document.getElementById('doc-verify-tbody');
  if (!tbody) return;

  tbody.innerHTML = DB.documents.map(d => `
    <tr>
      <td>${escHtml(d.type)}</td>
      <td><strong>${escHtml(d.number)}</strong></td>
      <td>${escHtml(d.institution)}</td>
      <td>${escHtml(d.bank)}</td>
      <td>${amountFmt(d.amount)}</td>
      <td>${d.expiryDate ? formatDate(d.expiryDate) : '—'}</td>
      <td>${docStatusBadge(d)}</td>
      <td>
        <div class="action-group">
          ${d.status === 'Pending Verification' ? `
            <button class="btn btn-success btn-xs" onclick="verifyDoc('${d.id}')">✓ Verify</button>
            <button class="btn btn-danger btn-xs" onclick="rejectDoc('${d.id}')">✕ Reject</button>
          ` : `<span class="text-sm text-light">${d.status}</span>`}
        </div>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="8"><div class="empty-state"><p>No documents to verify.</p></div></td></tr>`;
}

function verifyDoc(id) {
  const doc = DB.documents.find(d => d.id === id);
  if (!doc) return;
  confirmAction('Verify Document', `Mark <strong>${escHtml(doc.number)}</strong> as Verified?`, '✅', () => {
    doc.status = 'Verified';
    addAuditLog('verify', doc.number, `Document verified: ${doc.type} for ${doc.institution}`);
    addNotification('Status Update', 'Document Verified', `${doc.type} (${doc.number}) has been verified.`);
    persist();
    showToast('Document verified!', 'success');
    renderDocVerification();
  });
}

function rejectDoc(id) {
  const doc = DB.documents.find(d => d.id === id);
  if (!doc) return;
  openRemarkModal('Reject Document', (remark) => {
    confirmAction('Reject Document', `Reject <strong>${escHtml(doc.number)}</strong>?`, '❌', () => {
      doc.status = 'Rejected';
      doc.remarks = remark;
      addAuditLog('return', doc.number, `Rejected: ${remark}`);
      persist();
      showToast('Document rejected.', 'error');
      renderDocVerification();
    });
  });
}

// ─────────────────────────────────────────────
// EVC SCHEDULING
// ─────────────────────────────────────────────
function renderEvcScheduling() {
  const tbody = document.getElementById('evc-tbody');
  if (!tbody) return;

  tbody.innerHTML = DB.evcSchedules.map(e => `
    <tr>
      <td>${escHtml(e.institution)}</td>
      <td><strong>${escHtml(e.appId)}</strong></td>
      <td>${formatDate(e.date)}</td>
      <td>${e.time}</td>
      <td>${escHtml(e.members || '—')}</td>
      <td>${escHtml(e.mode)}</td>
      <td>${statusBadge(e.status)}</td>
      <td>
        <div class="action-group">
          ${e.status === 'Scheduled' ? `
            <button class="btn btn-success btn-xs" onclick="completeEvc('${e.id}')">✓ Complete</button>
            <button class="btn btn-danger btn-xs" onclick="cancelEvc('${e.id}')">Cancel</button>
          ` : `<span class="text-sm text-light">${e.status}</span>`}
        </div>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="8"><div class="empty-state"><p>No EVC visits scheduled yet.</p></div></td></tr>`;
}

function openEvcForm() {
  document.getElementById('evc-form-card').classList.remove('hidden');
  document.getElementById('evc-form').reset();
}

function submitEvcSchedule(e) {
  e.preventDefault();
  const inst    = document.getElementById('evc-inst').value.trim();
  const appId   = document.getElementById('evc-appid').value.trim();
  const date    = document.getElementById('evc-date').value;
  const time    = document.getElementById('evc-time').value;
  const members = document.getElementById('evc-members').value.trim();
  const mode    = document.getElementById('evc-mode').value;
  const remarks = document.getElementById('evc-remarks').value.trim();

  confirmAction('Schedule EVC', `Schedule EVC visit for <strong>${escHtml(inst)}</strong> on <strong>${formatDate(date)}</strong>?`, '📅', () => {
    const ev = { id: genId('EVC'), institution: inst, appId, date, time, members, mode, status: 'Scheduled', remarks };
    DB.evcSchedules.unshift(ev);

    // Update application stage
    const app = DB.applications.find(a => a.id === appId);
    if (app) {
      app.stage = 'EVC Scheduled';
      app.history.push({ date: today(), action: 'EVC Visit Scheduled', by: ROLES[currentRole].label });
    }

    addAuditLog('schedule', `EVC for ${appId}`, `EVC scheduled for ${inst} on ${formatDate(date)}`);
    addNotification('EVC Scheduled', 'EVC Visit Scheduled', `Expert Visiting Committee visit scheduled for ${inst} on ${formatDate(date)}.`);
    persist();
    showToast('EVC visit scheduled!', 'success');
    document.getElementById('evc-form-card').classList.add('hidden');
    renderEvcScheduling();
  });
}

function completeEvc(id) {
  const ev = DB.evcSchedules.find(e => e.id === id);
  if (!ev) return;
  confirmAction('Mark as Completed', `Mark EVC visit for <strong>${escHtml(ev.institution)}</strong> as completed?`, '✅', () => {
    ev.status = 'Completed';
    const app = DB.applications.find(a => a.id === ev.appId);
    if (app) app.history.push({ date: today(), action: 'EVC Visit Completed', by: ROLES[currentRole].label });
    addAuditLog('schedule', ev.id, `EVC visit completed for ${ev.institution}`);
    persist();
    showToast('EVC visit marked as completed.', 'success');
    renderEvcScheduling();
  });
}

function cancelEvc(id) {
  const ev = DB.evcSchedules.find(e => e.id === id);
  if (!ev) return;
  confirmAction('Cancel EVC', `Cancel EVC visit for <strong>${escHtml(ev.institution)}</strong>?`, '❌', () => {
    ev.status = 'Cancelled';
    addAuditLog('schedule', ev.id, `EVC visit cancelled for ${ev.institution}`);
    persist();
    showToast('EVC visit cancelled.', 'warn');
    renderEvcScheduling();
  });
}

// ─────────────────────────────────────────────
// COMPLIANCE MONITORING
// ─────────────────────────────────────────────
function renderCompliance() {
  const tbody = document.getElementById('compliance-tbody');
  if (!tbody) return;

  tbody.innerHTML = DB.undertakings.map(u => {
    const days = daysUntil(u.dueDate);
    let rowCls = '';
    if (!u.submitted && days !== null && days < 0) rowCls = 'overdue-row';
    else if (!u.submitted && days !== null && days <= 7) rowCls = 'due-soon-row';

    return `<tr class="${rowCls}">
      <td>${escHtml(u.institution)}</td>
      <td>${escHtml(u.type)}</td>
      <td>${formatDate(u.dueDate)}</td>
      <td>${u.submitted ? `<span class="badge badge-green">✓ ${formatDate(u.submittedDate)}</span>` : '<span class="badge badge-grey">Not Submitted</span>'}</td>
      <td>${statusBadge(u.compliance)}</td>
      <td>
        <div class="action-group">
          ${u.compliance === 'Non-Compliant' || u.compliance === 'Overdue' ?
            `<button class="btn btn-danger btn-xs" onclick="sendComplianceNotice('${u.id}')">📤 Notice</button>` : '—'}
        </div>
      </td>
    </tr>`;
  }).join('') || `<tr><td colspan="6"><div class="empty-state"><p>No undertakings found.</p></div></td></tr>`;
}

function sendComplianceNotice(id) {
  const u = DB.undertakings.find(x => x.id === id);
  if (!u) return;
  confirmAction('Send Compliance Notice', `Send a compliance notice to <strong>${escHtml(u.institution)}</strong> for <strong>${escHtml(u.type)}</strong>?`, '📤', () => {
    addAuditLog('remark', u.id, `Compliance notice sent to ${u.institution} for ${u.type}`);
    addNotification('Undertaking Alert', 'Compliance Notice Sent', `A notice has been issued to ${u.institution} for ${u.type}.`);
    persist();
    showToast('Compliance notice issued.', 'success');
  });
}

// ─────────────────────────────────────────────
// EXPIRY ALERTS
// ─────────────────────────────────────────────
function renderExpiryAlerts() {
  const docs = DB.documents;
  const expired  = docs.filter(d => { const days = daysUntil(d.expiryDate); return days !== null && days < 0; });
  const expiring = docs.filter(d => { const days = daysUntil(d.expiryDate); return days !== null && days >= 0 && days <= 30; });
  const soon     = docs.filter(d => { const days = daysUntil(d.expiryDate); return days !== null && days > 30 && days <= 90; });
  const active   = docs.filter(d => { const days = daysUntil(d.expiryDate); return days !== null && days > 90; });

  document.getElementById('expiry-stat-grid').innerHTML = `
    <div class="stat-card accent-red"><div class="stat-icon">❌</div><div class="stat-label">Expired</div><div class="stat-value">${expired.length}</div></div>
    <div class="stat-card accent-orange"><div class="stat-icon">⚠️</div><div class="stat-label">Expiring ≤30 days</div><div class="stat-value">${expiring.length}</div></div>
    <div class="stat-card"><div class="stat-icon">🕐</div><div class="stat-label">Due in 31–90 days</div><div class="stat-value">${soon.length}</div></div>
    <div class="stat-card accent-green"><div class="stat-icon">✅</div><div class="stat-label">Active (&gt;90 days)</div><div class="stat-value">${active.length}</div></div>
  `;

  const sorted = [...docs].sort((a, b) => {
    const da = daysUntil(a.expiryDate) ?? 9999;
    const db = daysUntil(b.expiryDate) ?? 9999;
    return da - db;
  });

  document.getElementById('expiry-tbody').innerHTML = sorted.map(d => {
    const days = daysUntil(d.expiryDate);
    let rowCls = '';
    if (days !== null && days < 0) rowCls = 'overdue-row';
    else if (days !== null && days <= 30) rowCls = 'due-soon-row';

    return `<tr class="${rowCls}">
      <td>${escHtml(d.type)}</td>
      <td><strong>${escHtml(d.number)}</strong></td>
      <td>${escHtml(d.institution)}</td>
      <td>${escHtml(d.bank)}</td>
      <td>${amountFmt(d.amount)}</td>
      <td>${d.expiryDate ? formatDate(d.expiryDate) : '—'}</td>
      <td>${expiryBadge(d.expiryDate)}</td>
      <td>${docStatusBadge(d)}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="8"><div class="empty-state"><p>No documents found.</p></div></td></tr>`;
}

// ─────────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────────
function renderReports() {
  const apps = DB.applications;
  const total     = apps.length;
  const approved  = apps.filter(a => a.status === 'Approved').length;
  const pending   = apps.filter(a => ['Submitted','Under Review'].includes(a.status)).length;
  const returned  = apps.filter(a => a.status === 'Returned for Correction').length;

  document.getElementById('report-stat-grid').innerHTML = `
    <div class="stat-card accent-navy"><div class="stat-icon">📄</div><div class="stat-label">Total Applications</div><div class="stat-value">${total}</div></div>
    <div class="stat-card accent-green"><div class="stat-icon">✅</div><div class="stat-label">Approved</div><div class="stat-value">${approved}</div></div>
    <div class="stat-card accent-orange"><div class="stat-icon">⏳</div><div class="stat-label">Pending</div><div class="stat-value">${pending}</div></div>
    <div class="stat-card accent-red"><div class="stat-icon">↩️</div><div class="stat-label">Returned</div><div class="stat-value">${returned}</div></div>
  `;

  // Types chart
  const types = {};
  apps.forEach(a => { types[a.type] = (types[a.type] || 0) + 1; });
  document.getElementById('report-type-chart').innerHTML =
    Object.entries(types).map(([k, v]) => buildBarItem(k, v, total, 'teal')).join('');

  // State chart
  const states = {};
  apps.forEach(a => { states[a.state] = (states[a.state] || 0) + 1; });
  document.getElementById('report-state-chart').innerHTML =
    Object.entries(states).sort((a,b) => b[1]-a[1]).map(([k, v]) => buildBarItem(k, v, total, 'navy')).join('');

  // Performance bars
  const avgPendency = Math.round(apps.filter(a=>a.status!=='Approved').reduce((s,a)=>s+calcPendency(a.submittedDate),0) / Math.max(1, apps.filter(a=>a.status!=='Approved').length));
  const approvalRate = Math.round(approved / Math.max(1, total) * 100);
  const docVerifRate = Math.round(DB.documents.filter(d=>d.status==='Verified').length / Math.max(1, DB.documents.length) * 100);

  document.getElementById('perf-bars').innerHTML = `
    <div class="progress-bar-wrap">
      <div class="progress-label"><span>Approval Rate</span><span>${approvalRate}%</span></div>
      <div class="progress-track"><div class="progress-fill green" style="width:${approvalRate}%"></div></div>
    </div>
    <div class="progress-bar-wrap">
      <div class="progress-label"><span>Document Verification Rate</span><span>${docVerifRate}%</span></div>
      <div class="progress-track"><div class="progress-fill" style="width:${docVerifRate}%"></div></div>
    </div>
    <div class="progress-bar-wrap">
      <div class="progress-label"><span>Avg. Pendency (days)</span><span>${avgPendency}d</span></div>
      <div class="progress-track"><div class="progress-fill orange" style="width:${Math.min(100, avgPendency/60*100)}%"></div></div>
    </div>
    <div class="progress-bar-wrap">
      <div class="progress-label"><span>Undertaking Compliance Rate</span>
        <span>${Math.round(DB.undertakings.filter(u=>u.submitted).length/Math.max(1,DB.undertakings.length)*100)}%</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill navy" style="width:${Math.round(DB.undertakings.filter(u=>u.submitted).length/Math.max(1,DB.undertakings.length)*100)}%"></div>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────
// AUDIT LOGS
// ─────────────────────────────────────────────
function renderAuditLogs() { filterAuditLogs(); }

function filterAuditLogs() {
  const search = (document.getElementById('audit-search')?.value || '').toLowerCase();
  const roleF  = document.getElementById('audit-role-filter')?.value || '';
  const tbody  = document.getElementById('audit-tbody');
  if (!tbody) return;

  let filtered = DB.auditLogs.filter(l => {
    const matchSearch = !search || l.ts.includes(search) || l.role.toLowerCase().includes(search) ||
      l.related.toLowerCase().includes(search) || l.remarks.toLowerCase().includes(search);
    const matchRole = !roleF || l.role.includes(roleF);
    return matchSearch && matchRole;
  });

  tbody.innerHTML = filtered.length === 0
    ? `<tr><td colspan="5"><div class="empty-state"><p>No audit logs found.</p></div></td></tr>`
    : filtered.map(l => `
        <tr>
          <td style="white-space:nowrap;font-family:monospace;font-size:11px">${escHtml(l.ts)}</td>
          <td><span class="badge badge-navy">${escHtml(l.role)}</span></td>
          <td>${actionChip(l.action)}</td>
          <td>${escHtml(l.related)}</td>
          <td style="max-width:200px;font-size:12px">${escHtml(l.remarks)}</td>
        </tr>
      `).join('');
}

// ─────────────────────────────────────────────
// EVC OVERVIEW
// ─────────────────────────────────────────────
function renderEvcOverview() {
  const visits = DB.evcSchedules;
  const scheduled = visits.filter(e => e.status === 'Scheduled').length;
  const completed = visits.filter(e => e.status === 'Completed').length;
  const cancelled = visits.filter(e => e.status === 'Cancelled').length;

  document.getElementById('evc-stat-grid').innerHTML = `
    <div class="stat-card accent-navy"><div class="stat-icon">📅</div><div class="stat-label">Scheduled</div><div class="stat-value">${scheduled}</div></div>
    <div class="stat-card accent-green"><div class="stat-icon">✅</div><div class="stat-label">Completed</div><div class="stat-value">${completed}</div></div>
    <div class="stat-card accent-red"><div class="stat-icon">❌</div><div class="stat-label">Cancelled</div><div class="stat-value">${cancelled}</div></div>
    <div class="stat-card"><div class="stat-icon">🔢</div><div class="stat-label">Total Visits</div><div class="stat-value">${visits.length}</div></div>
  `;

  const tbody = document.getElementById('evc-assigned-tbody');
  if (!tbody) return;

  tbody.innerHTML = visits.map(e => `
    <tr>
      <td>${escHtml(e.institution)}</td>
      <td><strong>${escHtml(e.appId)}</strong></td>
      <td>${formatDate(e.date)}</td>
      <td>${e.time}</td>
      <td>${escHtml(e.mode)}</td>
      <td>${statusBadge(e.status)}</td>
      <td>
        ${e.status === 'Scheduled'
          ? `<button class="btn btn-primary btn-xs" onclick="navigate('evc-report')">Submit Report</button>`
          : `<span class="text-sm text-light">${e.status}</span>`}
      </td>
    </tr>
  `).join('') || `<tr><td colspan="7"><div class="empty-state"><p>No visits assigned.</p></div></td></tr>`;
}

function submitEvcReport(e) {
  e.preventDefault();
  const appId = document.getElementById('rpt-appid').value.trim();
  const inst  = document.getElementById('rpt-inst').value.trim();
  const rec   = document.getElementById('rpt-rec').value;
  const obs   = document.getElementById('rpt-obs').value.trim();

  confirmAction('Submit Report', `Submit inspection report for <strong>${escHtml(inst)}</strong> with recommendation: <strong>${rec}</strong>?`, '📝', () => {
    const app = DB.applications.find(a => a.id === appId);
    if (app) {
      app.history.push({ date: today(), action: 'Inspection Report Submitted', by: 'EVC Member', note: `Recommendation: ${rec}` });
    }

    const ev = DB.evcSchedules.find(x => x.appId === appId);
    if (ev) ev.status = 'Completed';

    addAuditLog('remark', `EVC/${appId}`, `Inspection report submitted. Recommendation: ${rec}. ${obs}`);
    addNotification('Status Update', 'EVC Report Submitted', `Inspection report for ${appId} (${inst}) submitted. Recommendation: ${rec}.`);
    persist();
    showToast('Inspection report submitted!', 'success');
    document.getElementById('evc-report-form').reset();
    navigate('evc-overview');
  });
}

// ─────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────
function saveSettings() {
  DB.settings.instName = document.getElementById('set-inst-name').value.trim();
  DB.settings.email    = document.getElementById('set-email').value.trim();
  DB.settings.phone    = document.getElementById('set-phone').value.trim();
  DB.settings.state    = document.getElementById('set-state').value.trim();
  persist();
  showToast('Settings saved!', 'success');
}

// ─────────────────────────────────────────────
// MODALS
// ─────────────────────────────────────────────
function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

function confirmAction(title, msg, icon, cb) {
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-msg').innerHTML = msg;
  document.getElementById('confirm-icon').textContent = icon || '⚠️';
  confirmCallback = cb;
  document.getElementById('confirm-overlay').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('confirm-ok').onclick = () => {
    closeModal('confirm-overlay');
    if (typeof confirmCallback === 'function') confirmCallback();
    confirmCallback = null;
  };
  document.getElementById('confirm-cancel').onclick = () => {
    closeModal('confirm-overlay');
    confirmCallback = null;
  };
});

function openRemarkModal(title, cb) {
  document.getElementById('remark-title').textContent = title;
  document.getElementById('remark-text').value = '';
  remarkCallback = cb;
  document.getElementById('remark-overlay').classList.remove('hidden');
  document.getElementById('remark-submit').onclick = () => {
    const remark = document.getElementById('remark-text').value.trim();
    if (!remark) {
      document.getElementById('remark-text').classList.add('error');
      document.getElementById('remark-hint').textContent = 'Please enter remarks before proceeding.';
      return;
    }
    document.getElementById('remark-text').classList.remove('error');
    document.getElementById('remark-hint').textContent = '';
    closeModal('remark-overlay');
    if (typeof remarkCallback === 'function') remarkCallback(remark);
    remarkCallback = null;
  };
}

// Close modals when clicking overlay
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(o => { if (o === e.target) o.classList.add('hidden'); });
  }
});

// ─────────────────────────────────────────────
// TOAST NOTIFICATIONS
// ─────────────────────────────────────────────
function showToast(msg, type = 'info') {
  const icons = { success: '✅', error: '❌', warn: '⚠️', info: 'ℹ️' };
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-msg">${escHtml(msg)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .4s';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateNotifBadge();
});
