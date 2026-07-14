const API_BASE = '/api/members';

const form = document.getElementById('member-form');
const memberIdInput = document.getElementById('member-id');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const membershipTypeInput = document.getElementById('membershipType');
const joiningDateInput = document.getElementById('joiningDate');
const isActiveInput = document.getElementById('isActive');
const submitBtn = document.getElementById('submit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

const searchInput = document.getElementById('search-input');
const filterMembershipType = document.getElementById('filter-membership-type');
const filterActiveStatus = document.getElementById('filter-active-status');

const loadingIndicator = document.getElementById('loading-indicator');
const emptyState = document.getElementById('empty-state');
const tableWrapper = document.querySelector('.table-wrapper');
const tableBody = document.getElementById('members-table-body');
const cardsList = document.getElementById('members-cards');
const memberCount = document.getElementById('member-count');
const notificationRegion = document.getElementById('notification-region');

const fieldIds = ['name', 'email', 'phone', 'membershipType', 'joiningDate'];

let isRequestInProgress = false;
let searchDebounceTimer = null;
let currentMembers = [];

const clearFieldErrors = () => {
  fieldIds.forEach((field) => {
    const input = document.getElementById(field);
    const errorEl = document.getElementById(`${field}-error`);
    input.removeAttribute('aria-invalid');
    if (errorEl) errorEl.textContent = '';
  });
};

const showFieldErrors = (errors) => {
  Object.entries(errors).forEach(([field, message]) => {
    const input = document.getElementById(field);
    const errorEl = document.getElementById(`${field}-error`);
    if (input) input.setAttribute('aria-invalid', 'true');
    if (errorEl) errorEl.textContent = message;
  });
};

const showNotification = (message, type) => {
  const note = document.createElement('div');
  note.className = `notification ${type}`;
  note.textContent = message;
  notificationRegion.appendChild(note);
  setTimeout(() => {
    note.remove();
  }, 4000);
};

const setLoading = (isLoading) => {
  loadingIndicator.hidden = !isLoading;
};

const setButtonsDisabled = (disabled) => {
  submitBtn.disabled = disabled;
  document.querySelectorAll('.row-action-btn').forEach((btn) => {
    btn.disabled = disabled;
  });
};

const resetForm = () => {
  form.reset();
  memberIdInput.value = '';
  isActiveInput.checked = true;
  submitBtn.textContent = 'Add member';
  cancelEditBtn.hidden = true;
  clearFieldErrors();
};

const populateFormForEdit = (member) => {
  memberIdInput.value = member.id;
  nameInput.value = member.name;
  emailInput.value = member.email;
  phoneInput.value = member.phone;
  membershipTypeInput.value = member.membershipType;
  joiningDateInput.value = member.joiningDate.split('T')[0];
  isActiveInput.checked = member.isActive;
  submitBtn.textContent = 'Update member';
  cancelEditBtn.hidden = false;
  clearFieldErrors();
  nameInput.focus();
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const renderMembers = (memberList) => {
  currentMembers = memberList;
  memberCount.textContent = `${memberList.length} member${memberList.length === 1 ? '' : 's'}`;

  if (memberList.length === 0) {
    emptyState.hidden = false;
    tableWrapper.hidden = true;
    tableBody.innerHTML = '';
    cardsList.innerHTML = '';
    return;
  }

  emptyState.hidden = true;
  tableWrapper.hidden = false;

  tableBody.innerHTML = memberList
    .map(
      (member) => `
      <tr>
        <td>${escapeHtml(member.name)}</td>
        <td>${escapeHtml(member.email)}</td>
        <td>${escapeHtml(member.phone)}</td>
        <td>${escapeHtml(member.membershipType)}</td>
        <td>${escapeHtml(member.joiningDate.split('T')[0])}</td>
        <td><span class="status-badge ${member.isActive ? 'active' : 'inactive'}">${member.isActive ? 'Active' : 'Inactive'}</span></td>
        <td>
          <div class="row-actions">
            <button type="button" class="btn-secondary btn-small row-action-btn" data-action="edit" data-id="${escapeHtml(member.id)}" aria-label="Edit ${escapeHtml(member.name)}">Edit</button>
            <button type="button" class="btn-danger btn-small row-action-btn" data-action="delete" data-id="${escapeHtml(member.id)}" aria-label="Delete ${escapeHtml(member.name)}">Delete</button>
          </div>
        </td>
      </tr>
    `
    )
    .join('');

  cardsList.innerHTML = memberList
    .map(
      (member) => `
      <li class="member-card">
        <dl>
          <dt>Name</dt><dd>${escapeHtml(member.name)}</dd>
          <dt>Email</dt><dd>${escapeHtml(member.email)}</dd>
          <dt>Phone</dt><dd>${escapeHtml(member.phone)}</dd>
          <dt>Membership</dt><dd>${escapeHtml(member.membershipType)}</dd>
          <dt>Joined</dt><dd>${escapeHtml(member.joiningDate.split('T')[0])}</dd>
          <dt>Status</dt><dd><span class="status-badge ${member.isActive ? 'active' : 'inactive'}">${member.isActive ? 'Active' : 'Inactive'}</span></dd>
        </dl>
        <div class="row-actions">
          <button type="button" class="btn-secondary btn-small row-action-btn" data-action="edit" data-id="${escapeHtml(member.id)}" aria-label="Edit ${escapeHtml(member.name)}">Edit</button>
          <button type="button" class="btn-danger btn-small row-action-btn" data-action="delete" data-id="${escapeHtml(member.id)}" aria-label="Delete ${escapeHtml(member.name)}">Delete</button>
        </div>
      </li>
    `
    )
    .join('');
};

const buildQueryString = () => {
  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.set('search', searchInput.value.trim());
  if (filterMembershipType.value) params.set('membershipType', filterMembershipType.value);
  if (filterActiveStatus.value) params.set('isActive', filterActiveStatus.value);
  const query = params.toString();
  return query ? `?${query}` : '';
};

const fetchMembers = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${API_BASE}${buildQueryString()}`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      showNotification(result.message || 'Unable to load members', 'error');
      return;
    }

    renderMembers(result.data);
  } catch (error) {
    showNotification('Unable to reach the server. Please try again.', 'error');
  } finally {
    setLoading(false);
  }
};

const submitMember = async (event) => {
  event.preventDefault();

  if (isRequestInProgress) return;

  clearFieldErrors();

  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    membershipType: membershipTypeInput.value,
    joiningDate: joiningDateInput.value,
    isActive: isActiveInput.checked,
  };

  const memberId = memberIdInput.value;
  const isEdit = Boolean(memberId);
  const url = isEdit ? `${API_BASE}/${memberId}` : API_BASE;
  const method = isEdit ? 'PUT' : 'POST';

  isRequestInProgress = true;
  setButtonsDisabled(true);
  setLoading(true);

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      if (result.errors) {
        showFieldErrors(result.errors);
      }
      showNotification(result.message || 'Unable to save member', 'error');
      return;
    }

    showNotification(result.message, 'success');
    resetForm();
    await fetchMembers();
  } catch (error) {
    showNotification('Unable to reach the server. Please try again.', 'error');
  } finally {
    isRequestInProgress = false;
    setButtonsDisabled(false);
    setLoading(false);
  }
};

const deleteMember = async (id, name) => {
  const confirmed = window.confirm(`Are you sure you want to delete ${name}?`);
  if (!confirmed) return;

  if (isRequestInProgress) return;

  isRequestInProgress = true;
  setButtonsDisabled(true);
  setLoading(true);

  try {
    const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    const result = await response.json();

    if (!response.ok || !result.success) {
      showNotification(result.message || 'Unable to delete member', 'error');
      return;
    }

    showNotification(result.message, 'success');
    await fetchMembers();
  } catch (error) {
    showNotification('Unable to reach the server. Please try again.', 'error');
  } finally {
    isRequestInProgress = false;
    setButtonsDisabled(false);
    setLoading(false);
  }
};

const handleTableClick = (event) => {
  const button = event.target.closest('.row-action-btn');
  if (!button) return;

  const { action, id } = button.dataset;
  const member = currentMembers.find((item) => item.id === id);
  if (!member) return;

  if (action === 'edit') {
    populateFormForEdit(member);
  } else if (action === 'delete') {
    deleteMember(id, member.name);
  }
};

const handleSearchInput = () => {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    fetchMembers();
  }, 300);
};

form.addEventListener('submit', submitMember);
cancelEditBtn.addEventListener('click', resetForm);
tableBody.addEventListener('click', handleTableClick);
cardsList.addEventListener('click', handleTableClick);
searchInput.addEventListener('input', handleSearchInput);
filterMembershipType.addEventListener('change', fetchMembers);
filterActiveStatus.addEventListener('change', fetchMembers);

fetchMembers();