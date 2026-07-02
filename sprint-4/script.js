const API_KEY = "";

const AI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    icon: "✦",
    description: "Clean indigo accent, sans-serif, balanced spacing.",
    cssClass: "tpl-modern",
    accent: "#4f46e5",
    closing: "Sincerely,",
  },
  {
    id: "classic",
    name: "Classic",
    icon: "🖋️",
    description: "Traditional serif letterhead, formal tone.",
    cssClass: "tpl-classic",
    accent: "#33322f",
    closing: "Respectfully,",
  },
  {
    id: "minimal",
    name: "Minimal",
    icon: "▫️",
    description: "Understated rule, generous line height.",
    cssClass: "tpl-minimal",
    accent: "#9491ab",
    closing: "Best regards,",
  },
  {
    id: "creative",
    name: "Creative",
    icon: "🎨",
    description: "Bold gradient header bar, confident tone.",
    cssClass: "tpl-creative",
    accent: "#ec4899",
    closing: "Warm regards,",
  },
  {
    id: "executive",
    name: "Executive",
    icon: "👔",
    description: "Deep navy, elegant serif, polished and formal.",
    cssClass: "tpl-executive",
    accent: "#1e3a5f",
    closing: "Sincerely,",
  },
];

const TEMPLATE_STORAGE_KEY = "clg_selected_template";
let selectedTemplateId = "modern";

const navbar = document.getElementById("navbar");
const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");
const themeToggle = document.getElementById("themeToggle");

const form = document.getElementById("generatorForm");
const candidateNameInput = document.getElementById("candidateName");
const jobRoleInput = document.getElementById("jobRole");
const targetCompanyInput = document.getElementById("targetCompany");
const keySkillsInput = document.getElementById("keySkills");

const resumeUploadInput = document.getElementById("resumeUpload");
const fileDrop = document.getElementById("fileDrop");
const fileDropText = document.getElementById("fileDropText");
const resumeStatus = document.getElementById("resumeStatus");

const generateBtn = document.getElementById("generateBtn");
const btnSpinner = document.getElementById("btnSpinner");
const btnLabel = document.getElementById("btnLabel");

const outputPlaceholder = document.getElementById("outputPlaceholder");
const letterDoc = document.getElementById("letterDoc");
const letterMetaName = document.getElementById("letterMetaName");
const letterMetaDate = document.getElementById("letterMetaDate");
const outputText = document.getElementById("outputText");
const charCount = document.getElementById("charCount");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const copiedToast = document.getElementById("copiedToast");

const selectedTemplateName = document.getElementById("selectedTemplateName");
const outputTemplateBadge = document.getElementById("outputTemplateBadge");
const changeTemplateBtn = document.getElementById("changeTemplateBtn");
const exploreTemplatesHeroBtn = document.getElementById("exploreTemplatesHeroBtn");
const templateModal = document.getElementById("templateModal");
const templateModalBackdrop = document.getElementById("templateModalBackdrop");
const templateModalClose = document.getElementById("templateModalClose");
const templateGrid = document.getElementById("templateGrid");

let lastGeneratedLetter = null;

let resumeText = "";

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function initNavbar() {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  });

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    hamburger.classList.toggle("active");
  });

  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.classList.remove("active");
    });
  });
}

function initTheme() {
  const savedTheme = localStorage.getItem("clg_theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
  }

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("clg_theme", isDark ? "dark" : "light");
  });
}

function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

function validateField(input, errorId) {
  const errorEl = document.getElementById(errorId);
  const value = input.value.trim();
  const isValid = value.length > 0;

  input.classList.toggle("invalid", !isValid);
  if (errorEl) errorEl.classList.toggle("active", !isValid);

  return isValid;
}

function validateForm() {
  const validName = validateField(candidateNameInput, "err-candidateName");
  const validRole = validateField(jobRoleInput, "err-jobRole");
  const validCompany = validateField(targetCompanyInput, "err-targetCompany");
  const validSkills = validateField(keySkillsInput, "err-keySkills");

  return validName && validRole && validCompany && validSkills;
}

function initLiveValidation() {
  const fields = [
    [candidateNameInput, "err-candidateName"],
    [jobRoleInput, "err-jobRole"],
    [targetCompanyInput, "err-targetCompany"],
    [keySkillsInput, "err-keySkills"],
  ];

  fields.forEach(([input, errorId]) => {
    input.addEventListener("input", () => {
      if (input.value.trim().length > 0) {
        input.classList.remove("invalid");
        document.getElementById(errorId).classList.remove("active");
      }
    });
  });
}

function buildCoverLetter({ name, role, company, skills }, template) {
  const skillsList = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");

  const resumeContext = resumeText
    ? `\n\nAdditionally, my background — as reflected in my resume — includes relevant experience that further supports my candidacy.`
    : "";

  const closing = (template && template.closing) || "Sincerely,";

  return `Dear Hiring Manager at ${company},

My name is ${name}, and I am excited to apply for the ${role} position at ${company}. I have followed your organization's work and would welcome the opportunity to contribute my skills to your team.

My strengths include ${skillsList || "a strong and versatile skill set"}, which I believe align well with the requirements of this role. I am confident that my background and enthusiasm make me a strong fit for ${company}.${resumeContext}

Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team.

${closing}
${name}`;
}

async function generateWithAI(formData) {

  const prompt = `
    Write a professional cover letter for ${formData.name},
    applying for the ${formData.role} role at ${formData.company}.
    Key skills: ${formData.skills}.
    Resume context: ${resumeText || "N/A"}
  `;

  const template = getTemplateById(selectedTemplateId);
  return buildCoverLetter(formData, template);
}

async function extractResumeText(file) {

  return `[Extracted resume text placeholder for "${file.name}" — integrate pdf.js or a server-side pdf-parse endpoint here.]`;
}

function initResumeUpload() {
  resumeUploadInput.addEventListener("change", async () => {
    const file = resumeUploadInput.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      resumeStatus.textContent = "Please upload a PDF file only.";
      resumeStatus.style.color = "var(--color-error)";
      resumeUploadInput.value = "";
      resumeText = "";
      return;
    }

    fileDropText.textContent = file.name;
    resumeStatus.textContent = "Processing resume…";
    resumeStatus.style.color = "var(--color-text-faint)";

    resumeText = await extractResumeText(file);

    resumeStatus.textContent = "Resume processed and ready to use.";
    resumeStatus.style.color = "var(--color-success)";
  });

  ["dragenter", "dragover"].forEach((evt) => {
    fileDrop.addEventListener(evt, (e) => {
      e.preventDefault();
      fileDrop.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach((evt) => {
    fileDrop.addEventListener(evt, (e) => {
      e.preventDefault();
      fileDrop.classList.remove("dragover");
    });
  });
}

function setLoadingState(isLoading) {
  generateBtn.disabled = isLoading;
  btnSpinner.classList.toggle("active", isLoading);
  btnLabel.textContent = isLoading ? "Generating..." : "Generate Cover Letter";
}

function renderOutput(letter, formData) {
  const template = getTemplateById(selectedTemplateId);

  outputPlaceholder.hidden = true;
  letterDoc.hidden = false;

  letterDoc.className = "letter-doc";
  letterDoc.classList.add(template.cssClass);

  letterMetaName.textContent = formData.name;
  letterMetaDate.textContent = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  outputText.textContent = letter;

  charCount.textContent = `${letter.length} characters`;
  copyBtn.disabled = false;
  clearBtn.disabled = false;

  updateTemplateBadge();

  lastGeneratedLetter = { ...formData, body: letter };
}

function clearOutput() {
  letterDoc.hidden = true;
  outputText.textContent = "";
  outputPlaceholder.hidden = false;

  charCount.textContent = "0 characters";
  copyBtn.disabled = true;
  clearBtn.disabled = true;

  lastGeneratedLetter = null;
}

function getTemplateById(id) {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}

function renderTemplateGrid() {
  templateGrid.innerHTML = "";

  TEMPLATES.forEach((tpl) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "template-card" + (tpl.id === selectedTemplateId ? " active" : "");
    card.style.setProperty("--tpl-preview-accent", tpl.accent);
    card.setAttribute("data-template-id", tpl.id);
    card.setAttribute("aria-pressed", tpl.id === selectedTemplateId ? "true" : "false");

    card.innerHTML = `
      <div class="template-preview">
        <div class="template-preview-bar"></div>
        <div class="template-preview-line w90"></div>
        <div class="template-preview-line w80"></div>
        <div class="template-preview-line w60"></div>
      </div>
      <div class="template-card-name">${tpl.icon} ${tpl.name}</div>
      <div class="template-card-desc">${tpl.description}</div>
      <div class="template-card-check">✓ Selected</div>
    `;

    card.addEventListener("click", () => selectTemplate(tpl.id));
    templateGrid.appendChild(card);
  });
}

function updateTemplateBadge() {
  const tpl = getTemplateById(selectedTemplateId);
  selectedTemplateName.textContent = tpl.name;
  outputTemplateBadge.textContent = `${tpl.icon} ${tpl.name}`;
}

function selectTemplate(id) {
  selectedTemplateId = id;
  localStorage.setItem(TEMPLATE_STORAGE_KEY, id);

  updateTemplateBadge();
  renderTemplateGrid();
  closeTemplateModal();

  if (lastGeneratedLetter) {
    renderOutput(lastGeneratedLetter.body, lastGeneratedLetter);
  }
}

function openTemplateModal() {
  templateModal.classList.add("open");
  templateModal.setAttribute("aria-hidden", "false");
}

function closeTemplateModal() {
  templateModal.classList.remove("open");
  templateModal.setAttribute("aria-hidden", "true");
}

function initTemplateGallery() {

  const saved = localStorage.getItem(TEMPLATE_STORAGE_KEY);
  if (saved && getTemplateById(saved)) {
    selectedTemplateId = saved;
  }

  renderTemplateGrid();
  updateTemplateBadge();

  changeTemplateBtn.addEventListener("click", openTemplateModal);
  exploreTemplatesHeroBtn.addEventListener("click", openTemplateModal);
  templateModalClose.addEventListener("click", closeTemplateModal);
  templateModalBackdrop.addEventListener("click", closeTemplateModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && templateModal.classList.contains("open")) {
      closeTemplateModal();
    }
  });
}

function initOutputActions() {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(outputText.textContent);
      copiedToast.classList.add("show");
      setTimeout(() => copiedToast.classList.remove("show"), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  });

  clearBtn.addEventListener("click", clearOutput);
}

const FORM_STORAGE_KEY = "clg_form_values";

function saveFormValues() {
  const values = {
    candidateName: candidateNameInput.value,
    jobRole: jobRoleInput.value,
    targetCompany: targetCompanyInput.value,
    keySkills: keySkillsInput.value,
  };
  localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(values));
}

function restoreFormValues() {
  const saved = localStorage.getItem(FORM_STORAGE_KEY);
  if (!saved) return;

  try {
    const values = JSON.parse(saved);
    candidateNameInput.value = values.candidateName || "";
    jobRoleInput.value = values.jobRole || "";
    targetCompanyInput.value = values.targetCompany || "";
    keySkillsInput.value = values.keySkills || "";
  } catch (err) {
    console.error("Failed to restore saved form values:", err);
  }
}

function initFormPersistence() {
  restoreFormValues();

  const debouncedSave = debounce(saveFormValues, 400);
  [candidateNameInput, jobRoleInput, targetCompanyInput, keySkillsInput].forEach(
    (input) => input.addEventListener("input", debouncedSave)
  );
}

function initGeneratorForm() {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = {
      name: candidateNameInput.value.trim(),
      role: jobRoleInput.value.trim(),
      company: targetCompanyInput.value.trim(),
      skills: keySkillsInput.value.trim(),
    };

    setLoadingState(true);

    setTimeout(async () => {
      const letter = await generateWithAI(formData);
      renderOutput(letter, formData);
      setLoadingState(false);
    }, 2000);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initTheme();
  initScrollReveal();
  initTemplateGallery();
  initLiveValidation();
  initResumeUpload();
  initOutputActions();
  initFormPersistence();
  initGeneratorForm();
});