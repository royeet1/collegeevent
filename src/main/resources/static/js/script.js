/* =========================================================
   VERTEX'26 — Technical Symposium
   Script: js/script.js
   Handles: mobile nav toggle, live countdown, form validation
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initNavToggle();
  initCountdown();
  initRegistrationForm();
  initContactForm();
});

/* ---------------------------------------------------------
   Mobile navigation toggle
--------------------------------------------------------- */
function initNavToggle() {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var isOpen = links.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close the menu when a link is tapped (mobile UX)
  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      links.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------------
   Live countdown timer
   Target date is read from the #countdown element's
   data-target attribute (ISO 8601 string).
--------------------------------------------------------- */
function initCountdown() {
  var root = document.getElementById('countdown');
  if (!root) return;

  var targetAttr = root.getAttribute('data-target');
  var target = new Date(targetAttr).getTime();

  var daysEl = document.getElementById('cd-days');
  var hoursEl = document.getElementById('cd-hours');
  var minsEl = document.getElementById('cd-mins');
  var secsEl = document.getElementById('cd-secs');
  var captionEl = document.getElementById('cd-caption');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function tick() {
    var now = Date.now();
    var diff = target - now;

    if (diff <= 0) {
      if (captionEl) captionEl.textContent = 'SYMPOSIUM IS LIVE NOW';
      [daysEl, hoursEl, minsEl, secsEl].forEach(function (el) {
        if (el) el.textContent = '00';
      });
      clearInterval(timer);
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var mins = Math.floor((diff / (1000 * 60)) % 60);
    var secs = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minsEl) minsEl.textContent = pad(mins);
    if (secsEl) secsEl.textContent = pad(secs);
  }

  tick();
  var timer = setInterval(tick, 1000);
}

/* ---------------------------------------------------------
   Registration form validation
--------------------------------------------------------- */
function initRegistrationForm() {
  var form = document.getElementById('registration-form');
  if (!form) return;

  var status = document.getElementById('form-status');

  var validators = {
    fullName: function (v) {
      return v.trim().length >= 3 ? '' : 'Enter your full name (min 3 characters).';
    },
    college: function (v) {
      return v.trim().length >= 3 ? '' : 'Enter your college / institution name.';
    },
    department: function (v) {
      return v !== '' ? '' : 'Select your department.';
    },
    email: function (v) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(v.trim()) ? '' : 'Enter a valid email address.';
    },
    phone: function (v) {
      var re = /^[6-9]\d{9}$/;
      return re.test(v.trim()) ? '' : 'Enter a valid 10-digit phone number.';
    },
    track: function (v) {
      return v !== '' ? '' : 'Select an event track.';
    }
  };

  function showError(field, message) {
    var row = form.querySelector('[data-field="' + field + '"]');
    if (!row) return;
    row.classList.toggle('has-error', !!message);
    var errorEl = row.querySelector('.field-error');
    if (errorEl) errorEl.textContent = message;
  }

  function validateField(name) {
    var input = form.elements[name];
    if (!input || !validators[name]) return true;
    var message = validators[name](input.value);
    showError(name, message);
    return message === '';
  }

  Object.keys(validators).forEach(function (name) {
    var input = form.elements[name];
    if (!input) return;
    input.addEventListener('blur', function () { validateField(name); });
    input.addEventListener('input', function () {
      var row = form.querySelector('[data-field="' + name + '"]');
      if (row && row.classList.contains('has-error')) validateField(name);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var allValid = Object.keys(validators).reduce(function (acc, name) {
      var fieldValid = validateField(name);
      return acc && fieldValid;
    }, true);

    if (!allValid) {
      if (status) {
        status.textContent = 'Please fix the highlighted fields before submitting.';
        status.className = 'form-status show error';
      }
      var firstError = form.querySelector('.has-error input, .has-error select');
      if (firstError) firstError.focus();
      return;
    }

    var name = form.elements.fullName.value.trim();
    if (status) {
      status.textContent = 'Registration received, ' + name + '! A confirmation email is on its way.';
      status.className = 'form-status show success';
    }
    form.reset();
  });
}

/* ---------------------------------------------------------
   Contact / inquiry form validation
--------------------------------------------------------- */
function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = document.getElementById('contact-status');

  var validators = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Enter your name.'; },
    email: function (v) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(v.trim()) ? '' : 'Enter a valid email address.';
    },
    message: function (v) { return v.trim().length >= 10 ? '' : 'Message should be at least 10 characters.'; }
  };

  function showError(field, message) {
    var row = form.querySelector('[data-field="' + field + '"]');
    if (!row) return;
    row.classList.toggle('has-error', !!message);
    var errorEl = row.querySelector('.field-error');
    if (errorEl) errorEl.textContent = message;
  }

  function validateField(name) {
    var input = form.elements[name];
    if (!input || !validators[name]) return true;
    var message = validators[name](input.value);
    showError(name, message);
    return message === '';
  }

  Object.keys(validators).forEach(function (name) {
    var input = form.elements[name];
    if (!input) return;
    input.addEventListener('blur', function () { validateField(name); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var allValid = Object.keys(validators).reduce(function (acc, name) {
      return validateField(name) && acc;
    }, true);

    if (!allValid) {
      if (status) {
        status.textContent = 'Please fix the highlighted fields before submitting.';
        status.className = 'form-status show error';
      }
      return;
    }

    if (status) {
      status.textContent = 'Thanks for reaching out — the organizing team will reply within 24 hours.';
      status.className = 'form-status show success';
    }
    form.reset();
  });
}