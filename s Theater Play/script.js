document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSchedule();
  initReservationForm();
  initFooterYear();
});

function logAnalytics(message, detail) {
  if (detail !== undefined) {
    console.log(`[Analytics] ${message}`, detail);
  } else {
    console.log(`[Analytics] ${message}`);
  }
}

function sanitizeInput(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim();
}

function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setMobileNavState(!isOpen, toggle, mobileNav);
  });

  mobileNav.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMobileNavState(false, toggle, mobileNav);
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      setMobileNavState(false, toggle, mobileNav);
    }
  });
}

function setMobileNavState(open, toggle, mobileNav) {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');

  if (open) {
    mobileNav.hidden = false;
    logAnalytics('Mobile navigation opened');
  } else {
    mobileNav.hidden = true;
  }
}

const performances = [
  { id: 1, date: 'Oct 18', time: '7:30 PM', type: 'Opening Night', status: 'Available' },
  { id: 2, date: 'Oct 19', time: '7:30 PM', type: 'Evening Performance', status: 'Available' },
  { id: 3, date: 'Oct 20', time: '3:00 PM', type: 'Matinee', status: 'Available' },
  { id: 4, date: 'Oct 24', time: '7:30 PM', type: 'Evening Performance', status: 'Limited Availability' },
  { id: 5, date: 'Oct 25', time: '7:30 PM', type: 'Evening Performance', status: 'Sold Out' },
  { id: 6, date: 'Oct 27', time: '3:00 PM', type: 'Final Matinee', status: 'Available' }
];

function initSchedule() {
  const searchInput = document.getElementById('schedule-search-input');
  const scheduleList = document.getElementById('schedule-list');
  const emptyState = document.getElementById('schedule-empty-state');
  const searchStatus = document.getElementById('schedule-search-status');

  if (!searchInput || !scheduleList || !emptyState) return;

  renderPerformances(performances, scheduleList, emptyState, searchStatus);

  searchInput.addEventListener('input', (event) => {
    const rawValue = event.target.value;
    const sanitizedValue = sanitizeInput(rawValue);
    const filtered = filterPerformances(performances, sanitizedValue);

    renderPerformances(filtered, scheduleList, emptyState, searchStatus);
    logAnalytics('Schedule search completed', { query: sanitizedValue, resultCount: filtered.length });
  });
}

function filterPerformances(list, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery === '') {
    return list;
  }

  return list.filter((performance) => {
    const haystack = `${performance.date} ${performance.time} ${performance.type} ${performance.status}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

function renderPerformances(list, scheduleList, emptyState, searchStatus) {
  scheduleList.textContent = '';

  if (!list || list.length === 0) {
    emptyState.hidden = false;
    scheduleList.hidden = true;
    if (searchStatus) {
      searchStatus.textContent = 'No performances found.';
    }
    return;
  }

  emptyState.hidden = true;
  scheduleList.hidden = false;

  list.forEach((performance) => {
    scheduleList.appendChild(buildPerformanceItem(performance));
  });

  if (searchStatus) {
    searchStatus.textContent = `${list.length} performance${list.length === 1 ? '' : 's'} shown.`;
  }
}

function buildPerformanceItem(performance) {
  const item = document.createElement('li');
  item.className = 'schedule-item';

  item.appendChild(buildScheduleField('Date', performance.date));
  item.appendChild(buildScheduleField('Time', performance.time));
  item.appendChild(buildScheduleField('Type', performance.type));

  const statusWrapper = document.createElement('div');
  const statusPill = document.createElement('span');
  statusPill.className = 'status-pill';
  statusPill.dataset.status = performance.status.toLowerCase().replace(/\s+/g, '-');
  statusPill.textContent = performance.status;
  statusWrapper.appendChild(statusPill);
  item.appendChild(statusWrapper);

  return item;
}

function buildScheduleField(labelText, valueText) {
  const wrapper = document.createElement('div');

  const label = document.createElement('span');
  label.className = 'schedule-item-label';
  label.textContent = labelText;

  const value = document.createElement('span');
  value.className = 'schedule-item-value';
  value.textContent = valueText;

  wrapper.appendChild(label);
  wrapper.appendChild(value);
  return wrapper;
}

function initReservationForm() {
  const form = document.getElementById('reservation-form');
  if (!form) return;

  const fields = {
    fullName: document.getElementById('full-name'),
    email: document.getElementById('email'),
    preferredPerformance: document.getElementById('preferred-performance'),
    seatCount: document.getElementById('seat-count'),
    message: document.getElementById('message')
  };

  const errorElements = {
    fullName: document.getElementById('full-name-error'),
    email: document.getElementById('email-error'),
    preferredPerformance: document.getElementById('preferred-performance-error'),
    seatCount: document.getElementById('seat-count-error'),
    message: document.getElementById('message-error')
  };

  const submitButton = document.getElementById('submit-button');
  const submitLabel = document.getElementById('submit-button-label');
  const spinner = document.getElementById('submit-spinner');
  const formStatus = document.getElementById('form-status');

  let isSubmitting = false;

  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    if (!field) return;
    field.addEventListener('input', () => clearFieldError(field, errorElements[key]));
    field.addEventListener('change', () => clearFieldError(field, errorElements[key]));
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const validation = validateForm(fields, errorElements);

    if (!validation.isValid) {
      if (validation.firstInvalidField) {
        validation.firstInvalidField.focus();
      }
      formStatus.dataset.state = 'error';
      formStatus.textContent = 'Please correct the highlighted fields and try again.';
      return;
    }

    const reservationData = {
      fullName: sanitizeInput(fields.fullName.value),
      email: sanitizeInput(fields.email.value),
      preferredPerformance: sanitizeInput(fields.preferredPerformance.value),
      seatCount: Number(fields.seatCount.value),
      message: sanitizeInput(fields.message.value)
    };

    isSubmitting = true;
    showLoadingState(submitButton, submitLabel, spinner, formStatus);

    try {
      await simulateReservationSubmission(reservationData);

      formStatus.dataset.state = 'success';
      formStatus.textContent = 'Your reservation request has been received. Our box office will confirm shortly.';
      logAnalytics('User interacted with Static Landing Page', { action: 'reservation_submitted' });
      form.reset();
    } catch (error) {
      formStatus.dataset.state = 'error';
      formStatus.textContent = 'We could not submit your request right now. Please try again.';
      logAnalytics('Reservation submission failed');
    } finally {
      isSubmitting = false;
      hideLoadingState(submitButton, submitLabel, spinner);
    }
  });
}

function validateForm(fields, errorElements) {
  let isValid = true;
  let firstInvalidField = null;

  const nameResult = validateFullName(fields.fullName.value);
  if (!applyValidationResult(fields.fullName, errorElements.fullName, nameResult)) {
    isValid = false;
    firstInvalidField = firstInvalidField || fields.fullName;
  }

  const emailResult = validateEmail(fields.email.value);
  if (!applyValidationResult(fields.email, errorElements.email, emailResult)) {
    isValid = false;
    firstInvalidField = firstInvalidField || fields.email;
  }

  const performanceResult = validatePreferredPerformance(fields.preferredPerformance.value);
  if (!applyValidationResult(fields.preferredPerformance, errorElements.preferredPerformance, performanceResult)) {
    isValid = false;
    firstInvalidField = firstInvalidField || fields.preferredPerformance;
  }

  const seatResult = validateSeatCount(fields.seatCount.value);
  if (!applyValidationResult(fields.seatCount, errorElements.seatCount, seatResult)) {
    isValid = false;
    firstInvalidField = firstInvalidField || fields.seatCount;
  }

  const messageResult = validateMessage(fields.message.value);
  if (!applyValidationResult(fields.message, errorElements.message, messageResult)) {
    isValid = false;
    firstInvalidField = firstInvalidField || fields.message;
  }

  return { isValid, firstInvalidField };
}

function applyValidationResult(field, errorElement, result) {
  if (result.valid) {
    clearFieldError(field, errorElement);
    return true;
  }
  setFieldError(field, errorElement, result.message);
  return false;
}

function validateFullName(value) {
  const trimmed = (value || '').trim();
  if (trimmed.length === 0) {
    return { valid: false, message: 'Full name is required.' };
  }
  if (trimmed.length < 2) {
    return { valid: false, message: 'Full name must be at least 2 characters.' };
  }
  return { valid: true };
}

function validateEmail(value) {
  const trimmed = (value || '').trim();
  if (trimmed.length === 0) {
    return { valid: false, message: 'Email address is required.' };
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmed)) {
    return { valid: false, message: 'Enter a valid email address.' };
  }
  return { valid: true };
}

function validatePreferredPerformance(value) {
  if (!value || value.trim().length === 0) {
    return { valid: false, message: 'Please select a preferred performance.' };
  }
  return { valid: true };
}

function validateSeatCount(value) {
  const trimmed = (value || '').toString().trim();
  if (trimmed.length === 0) {
    return { valid: false, message: 'Number of seats is required.' };
  }
  const numericValue = Number(trimmed);
  if (!Number.isInteger(numericValue)) {
    return { valid: false, message: 'Number of seats must be a whole number.' };
  }
  if (numericValue < 1 || numericValue > 10) {
    return { valid: false, message: 'Number of seats must be between 1 and 10.' };
  }
  return { valid: true };
}

function validateMessage(value) {
  const trimmed = (value || '').trim();
  if (trimmed.length > 500) {
    return { valid: false, message: 'Message must be 500 characters or fewer.' };
  }
  return { valid: true };
}

function setFieldError(field, errorElement, message) {
  const wrapper = field.closest('.form-field');
  if (wrapper) wrapper.classList.add('has-error');

  field.setAttribute('aria-invalid', 'true');

  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearFieldError(field, errorElement) {
  const wrapper = field.closest('.form-field');
  if (wrapper) wrapper.classList.remove('has-error');

  field.setAttribute('aria-invalid', 'false');

  if (errorElement) {
    errorElement.textContent = '';
  }
}

function showLoadingState(submitButton, submitLabel, spinner, formStatus) {
  submitButton.disabled = true;
  submitButton.setAttribute('aria-busy', 'true');
  spinner.hidden = false;
  submitLabel.textContent = 'Submitting request...';
  formStatus.dataset.state = '';
  formStatus.textContent = 'Submitting your reservation request. Please wait.';
}

function hideLoadingState(submitButton, submitLabel, spinner) {
  submitButton.disabled = false;
  submitButton.setAttribute('aria-busy', 'false');
  spinner.hidden = true;
  submitLabel.textContent = 'Submit Reservation Request';
}

function simulateReservationSubmission(reservationData) {
  return new Promise((resolve, reject) => {
    const simulatedLatencyMs = 1400;

    setTimeout(() => {
      const shouldSimulateFailure = false;

      if (shouldSimulateFailure) {
        reject(new Error('Simulated network failure'));
      } else {
        resolve(reservationData);
      }
    }, simulatedLatencyMs);
  });
}

function initFooterYear() {
  const copyrightElement = document.getElementById('footer-copyright');
  if (!copyrightElement) return;

  const currentYear = new Date().getFullYear();
  copyrightElement.textContent = `© ${currentYear} Theater Play. All rights reserved.`;
}