// DOM Elements
const dateDisplay = document.getElementById('currentDate');
const dobInput = document.getElementById('dob');
const ageInput = document.getElementById('age');
const photoPickerBtn = document.getElementById('photo-picker-btn');
const photoModal = document.getElementById('photo-modal');
const closeModal = document.getElementById('close-modal');
const pictureUpload = document.querySelector('.picture-upload');
const profilePicture = document.getElementById('profile-picture');
const imagePreview = document.getElementById('image-preview');
const previewContainer = document.getElementById('preview-container');
const removePhotoBtn = document.getElementById('remove-photo');
const savePhotoBtn = document.getElementById('save-photo');
const submitBtn = document.getElementById('submit-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const toastContainer = document.getElementById('toast-container');
const healthInsuranceCheckbox = document.getElementById('health-insurance');
const insuranceProviderSelect = document.getElementById('insurance-provider');
const navTabs = document.querySelectorAll('.nav-tab');
const resetBtn = document.querySelector('.btn-secondary');
const autosaveIndicator = document.querySelector('.autosave-indicator');
const allFormInputs = document.querySelectorAll('input, select');

// Update current date in header
function updateDateDisplay() {
    const now = new Date();
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString('en-GB', options);
}

// Calculate age from DOB
function calculateAge(birthDate) {
    const today = new Date();
    const dob = new Date(birthDate);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    return age;
}

// Show toast notification
function showToast(type, title, message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass;
    switch(type) {
        case 'success':
            iconClass = 'fas fa-check-circle';
            break;
        case 'error':
            iconClass = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            iconClass = 'fas fa-exclamation-triangle';
            break;
        default:
            iconClass = 'fas fa-info-circle';
    }
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Add click event for close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    });
    
    // Show toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Form validation
function validateForm() {
    const requiredFields = document.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--danger-color)';
            field.style.backgroundColor = 'rgba(224, 49, 49, 0.05)';
            
            // Add error message if not exists
            const fieldContainer = field.closest('.form-field');
            if (!fieldContainer.querySelector('.field-error')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'field-error';
                errorMsg.textContent = 'This field is required';
                fieldContainer.appendChild(errorMsg);
            }
            
            // Scroll to first invalid field
            if (isValid) {
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                field.focus();
            }
            
            isValid = false;
        } else {
            field.style.borderColor = '';
            field.style.backgroundColor = '';
            
            // Remove error message if exists
            const fieldContainer = field.closest('.form-field');
            const errorMsg = fieldContainer.querySelector('.field-error');
            if (errorMsg) {
                fieldContainer.removeChild(errorMsg);
            }
        }
    });
    
    return isValid;
}

// Submit form
function submitForm() {
    if (!validateForm()) {
        showToast('error', 'Validation Error', 'Please fill in all required fields.');
        return;
    }
    
    // Show loading overlay
    loadingOverlay.style.display = 'flex';
    
    // Simulate API call
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
        showToast('success', 'Success', 'Patient registered successfully!');
        
        // Update progress steps
        updateProgressSteps(4, true);
        
        // Clear form or redirect as needed
        // resetForm();
    }, 1500);
}

// Reset form
function resetForm() {
    const allInputs = document.querySelectorAll('input:not([type="checkbox"]), select');
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    
    allInputs.forEach(input => {
        input.value = '';
        input.style.borderColor = '';
        input.style.backgroundColor = '';
    });
    
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Remove error messages
    const errorMsgs = document.querySelectorAll('.field-error');
    errorMsgs.forEach(msg => msg.remove());
    
    // Reset insurance provider
    insuranceProviderSelect.disabled = true;
    
    // Reset progress steps
    updateProgressSteps(1);
    
    // Clear local storage
    localStorage.removeItem('patientFormData');
    
    // Reset photo
    if (previewContainer.style.display !== 'none') {
        profilePicture.value = '';
        imagePreview.src = '';
        pictureUpload.style.display = 'block';
        previewContainer.style.display = 'none';
    }
    
    // Remove consent indicator if exists
    const consentIndicator = document.getElementById('consent-indicator');
    if (consentIndicator) {
        consentIndicator.remove();
    }
    
    showToast('info', 'Form Reset', 'All fields have been cleared.');
}

// Enhanced Form Field Focus Effects
function enhanceFormFieldFocus() {
    const formFields = document.querySelectorAll('.form-field');
    
    formFields.forEach(field => {
        const input = field.querySelector('input, select');
        const label = field.querySelector('label');
        
        if (input) {
            // Add dynamic placeholder handling
            if (input && label) {
                // Create a label if it doesn't exist
                if (!label) {
                    const newLabel = document.createElement('label');
                    newLabel.setAttribute('for', input.id);
                    newLabel.textContent = input.placeholder;
                    field.appendChild(newLabel);
                }
            }
            
            input.addEventListener('focus', () => {
                field.classList.add('focused');
                // Show label when field is focused
                if (label) {
                    label.style.opacity = '1';
                }
            });
            
            input.addEventListener('blur', () => {
                field.classList.remove('focused');
                // Hide label when field is not focused and empty
                if (label && !input.value) {
                    label.style.opacity = '0';
                }
            });
            
            // Check initial state
            if (input.value && label) {
                label.style.opacity = '1';
            }
        }
    });
}

// Make Form Sections Collapsible
function makeFormSectionsCollapsible() {
    const sectionHeaders = document.querySelectorAll('.section-header');
    
    sectionHeaders.forEach(header => {
        // Add toggle icon
        const toggleIcon = document.createElement('i');
        toggleIcon.className = 'fas fa-chevron-down section-toggle';
        header.appendChild(toggleIcon);
        
        // Get corresponding content
        const section = header.closest('.form-section');
        const content = section.querySelector('.section-content');
        
        // Add click event
        header.addEventListener('click', (e) => {
            // Don't toggle if clicking on the photo picker icon
            if (e.target.closest('.photo-picker-icon')) {
                return;
            }
            
            // Toggle content visibility
            content.style.display = content.style.display === 'none' ? 'grid' : 'none';
            
            // Toggle icon
            toggleIcon.classList.toggle('fa-chevron-down');
            toggleIcon.classList.toggle('fa-chevron-up');
        });
    });
}

// Update Progress Steps
function updateProgressSteps(activeStep, completed = false) {
    const steps = document.querySelectorAll('.progress-step');
    
    steps.forEach((step, index) => {
        // Clear previous states
        step.classList.remove('active', 'completed');
        
        // Set active step
        if (index + 1 === activeStep) {
            step.classList.add('active');
        }
        
        // Set completed steps
        if (index + 1 < activeStep || (index + 1 === activeStep && completed)) {
            step.classList.add('completed');
        }
    });
}

// Create Consent Form Modal
function createConsentModal() {
    // Get the modal container
    const consentModal = document.getElementById('consent-modal');
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    modalHeader.innerHTML = `
        <h2>Patient Consent Form</h2>
        <button class="modal-close" id="close-consent-modal">&times;</button>
    `;
    
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalBody.innerHTML = `
        <div class="consent-options">
            <div class="consent-option" id="upload-consent">
                <i class="fas fa-upload"></i>
                <h3>Upload Existing Form</h3>
                <p>Upload a scanned or digital consent form</p>
                <input type="file" id="consent-file" accept=".pdf,.doc,.docx,.jpg,.png" style="display: none;">
            </div>
            
            <div class="consent-option" id="create-consent">
                <i class="fas fa-file-signature"></i>
                <h3>Create New Form</h3>
                <p>Generate a new consent form for this patient</p>
            </div>
        </div>
        
        <div id="consent-form-preview" style="display: none;">
            <h3>Consent Form Preview</h3>
            <div class="consent-preview-content">
                <div class="consent-form-template">
                    <h4>PATIENT CONSENT FOR TREATMENT</h4>
                    <p>I, <span class="patient-name">[Patient Name]</span>, hereby authorize the medical staff at AuroiTech Hospital to perform the necessary medical treatment, diagnostic procedures, and/or surgical procedures as deemed necessary for my health and well-being.</p>
                    
                    <p>I understand that:</p>
                    <ul>
                        <li>The practice of medicine is not an exact science and no guarantees have been made to me about the results of treatments or examinations.</li>
                        <li>I have the right to make decisions regarding my healthcare and to discuss the proposed treatment and any alternatives.</li>
                        <li>I have the right to refuse any treatment.</li>
                    </ul>
                    
                    <div class="signature-area">
                        <div class="signature-line">
                            <p>Patient Signature: ________________________</p>
                        </div>
                        <div class="signature-line">
                            <p>Date: <span class="current-date">[Current Date]</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="consent-actions">
                <button class="btn btn-secondary" id="back-to-options">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <button class="btn btn-primary" id="save-consent">
                    <i class="fas fa-save"></i> Save & Attach to Patient
                </button>
            </div>
        </div>
    `;
    
    // Assemble modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    consentModal.appendChild(modalContent);
    
    // Add event listeners
    document.getElementById('close-consent-modal').addEventListener('click', () => {
        consentModal.style.display = 'none';
    });
    
    // Close when clicking outside
    consentModal.addEventListener('click', (e) => {
        if (e.target === consentModal) {
            consentModal.style.display = 'none';
        }
    });
    
    // Upload consent form
    const uploadConsentBtn = document.getElementById('upload-consent');
    const consentFileInput = document.getElementById('consent-file');
    
    uploadConsentBtn.addEventListener('click', () => {
        consentFileInput.click();
    });
    
    consentFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const fileName = e.target.files[0].name;
            showConsentPreview();
            showToast('success', 'File Selected', `"${fileName}" has been selected.`);
        }
    });
    
    // Create new consent form
    document.getElementById('create-consent').addEventListener('click', () => {
        showConsentPreview();
        
        // Update patient name in the template if available
        const firstName = document.getElementById('first-name').value || '[First Name]';
        const lastName = document.getElementById('last-name').value || '[Last Name]';
        const patientName = firstName + ' ' + lastName;
        
        document.querySelector('.patient-name').textContent = patientName;
        
        // Update current date
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.querySelector('.current-date').textContent = formattedDate;
    });
    
    // Back button
    document.getElementById('back-to-options').addEventListener('click', () => {
        document.getElementById('consent-form-preview').style.display = 'none';
        document.querySelector('.consent-options').style.display = 'flex';
    });
    
    // Save consent
    document.getElementById('save-consent').addEventListener('click', () => {
        consentModal.style.display = 'none';
        showToast('success', 'Consent Form Saved', 'Patient consent form has been saved and attached to the record.');
        
        // Add a visual indicator that the consent form is attached
        addConsentAttachmentIndicator();
        
        // Update progress to visit information
        updateProgressSteps(3, true);
    });
}

// Show consent preview, hide options
function showConsentPreview() {
    document.getElementById('consent-form-preview').style.display = 'block';
    document.querySelector('.consent-options').style.display = 'none';
}

// Add consent form attachment indicator
function addConsentAttachmentIndicator() {
    const visitSection = document.querySelector('.form-section:nth-child(3)');
    if (visitSection) {
        // Remove existing indicator if present
        const existingIndicator = document.getElementById('consent-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Create indicator
        const indicator = document.createElement('div');
        indicator.id = 'consent-indicator';
        indicator.className = 'consent-indicator';
        indicator.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Consent form attached</span>
            <button class="btn-icon" id="view-consent">
                <i class="fas fa-eye"></i>
            </button>
        `;
        
        // Add to section after the consent button
        const consentBtn = visitSection.querySelector('.consent-btn');
        if (consentBtn) {
            consentBtn.parentNode.insertBefore(indicator, consentBtn.nextSibling);
        }
        
        // Add view event
        document.getElementById('view-consent').addEventListener('click', () => {
            const consentModal = document.getElementById('consent-modal');
            if (consentModal) {
                consentModal.style.display = 'flex';
                showConsentPreview();
            }
        });
    }
}

// Add consent button to Visit Information section
function addConsentButton() {
    const visitSection = document.querySelector('.form-section:nth-child(3)');
    if (visitSection) {
        const sectionContent = visitSection.querySelector('.section-content');
        
        // Create consent button
        const consentBtn = document.createElement('button');
        consentBtn.className = 'consent-btn';
        consentBtn.innerHTML = '<i class="fas fa-file-signature"></i> Manage Consent Form';
        
        // Add to section
        sectionContent.appendChild(consentBtn);
        
        // Connect button to modal
        consentBtn.addEventListener('click', () => {
            const consentModal = document.getElementById('consent-modal');
            consentModal.style.display = 'flex';
            
            // Reset to options view when opening
            document.getElementById('consent-form-preview').style.display = 'none';
            document.querySelector('.consent-options').style.display = 'flex';
        });
    }
}

// Add Form Autosave Feature
function addFormAutosave() {
    const allInputs = document.querySelectorAll('input, select');
    
    let autosaveTimeout;
    
    // Add event listeners to all form fields
    allInputs.forEach(input => {
        input.addEventListener('change', triggerAutosave);
        if (input.type !== 'checkbox') {
            input.addEventListener('input', triggerAutosave);
        }
    });
    
    function triggerAutosave() {
        // Clear previous timeout
        clearTimeout(autosaveTimeout);
        
        // Show autosave indicator
        autosaveIndicator.style.opacity = '1';
        autosaveIndicator.innerHTML = `
            <i class="fas fa-save"></i>
            <span>Autosaving...</span>
        `;
        
        // Set new timeout
        autosaveTimeout = setTimeout(() => {
            // Save form data to localStorage
            saveFormData();
            
            // Indicate save complete
            autosaveIndicator.innerHTML = `
                <i class="fas fa-check"></i>
                <span>Saved</span>
            `;
            
            // Hide indicator after a delay
            setTimeout(() => {
                autosaveIndicator.style.opacity = '0';
            }, 1500);
        }, 1000);
    }
    
    function saveFormData() {
        const formData = {};
        
        allInputs.forEach(input => {
            if (input.type === 'checkbox') {
                formData[input.id] = input.checked;
            } else {
                formData[input.id] = input.value;
            }
        });
        
        localStorage.setItem('patientFormData', JSON.stringify(formData));
    }
    
    // Load saved data on page load
    function loadSavedFormData() {
        const savedData = localStorage.getItem('patientFormData');
        
        if (savedData) {
            const formData = JSON.parse(savedData);
            
            Object.keys(formData).forEach(key => {
                const input = document.getElementById(key);
                
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = formData[key];
                    } else {
                        input.value = formData[key];
                    }
                }
            });
            
            // Calculate age if DOB is saved
            const dobInput = document.getElementById('dob');
            const ageInput = document.getElementById('age');
            
            if (dobInput.value && ageInput) {
                const age = calculateAge(dobInput.value);
                ageInput.value = age;
            }
            
            // Update insurance provider select based on checkbox
            const healthInsuranceCheckbox = document.getElementById('health-insurance');
            const insuranceProviderSelect = document.getElementById('insurance-provider');
            
            if (healthInsuranceCheckbox && insuranceProviderSelect) {
                insuranceProviderSelect.disabled = !healthInsuranceCheckbox.checked;
            }
            
            showToast('info', 'Form Restored', 'Your previously saved form data has been loaded.');
        }
    }
    
    // Load saved data on page load
    loadSavedFormData();
}

// Update form validation based on selected tabs
function updateFormSectionValidation() {
    const progressSteps = document.querySelectorAll('.progress-step');
    
    progressSteps.forEach((step, index) => {
        step.addEventListener('click', () => {
            // Validate current section before moving
            const currentActiveStep = document.querySelector('.progress-step.active');
            const currentIndex = Array.from(progressSteps).indexOf(currentActiveStep);
            
            // Only validate if moving forward
            if (index > currentIndex) {
                // Define sections to validate based on current step
                let sectionsToValidate = [];
                
                switch(currentIndex) {
                    case 0: // Personal Information
                        sectionsToValidate = ['first-name', 'last-name', 'dob', 'gender'];
                        break;
                    case 1: // Address
                        sectionsToValidate = ['country', 'state', 'city', 'pincode', 'mobile'];
                        break;
                    case 2: // Visit
                        sectionsToValidate = ['purpose-visit'];
                        break;
                    case 3: // Payment
                        sectionsToValidate = ['patient-category'];
                        break;
                }
                
                let isValid = true;
                sectionsToValidate.forEach(id => {
                    const field = document.getElementById(id);
                    if (field && field.required && !field.value.trim()) {
                        isValid = false;
                        
                        // Highlight the field
                        field.style.borderColor = 'var(--danger-color)';
                        field.style.backgroundColor = 'rgba(224, 49, 49, 0.05)';
                        
                        // Add error message
                        const fieldContainer = field.closest('.form-field');
                        if (!fieldContainer.querySelector('.field-error')) {
                            const errorMsg = document.createElement('div');
                            errorMsg.className = 'field-error';
                            errorMsg.textContent = 'This field is required';
                            fieldContainer.appendChild(errorMsg);
                        }
                    }
                });
                
                if (!isValid) {
                    showToast('error', 'Validation Error', 'Please complete the required fields before proceeding.');
                    return;
                }
            }
            
            // Update active step
            updateProgressSteps(index + 1);
            
            // Show corresponding section
            showFormSection(index);
        });
    });
}

// Show form section based on step
function showFormSection(index) {
    const formSections = document.querySelectorAll('.form-section');
    
    formSections.forEach((section, i) => {
        const content = section.querySelector('.section-content');
        
        // Show all sections for now, but could implement to show only relevant sections
        // For simplicity, we're just making sure all sections are visible
        if (content.style.display === 'none') {
            content.style.display = 'grid';
            
            // Toggle icon if needed
            const toggleIcon = section.querySelector('.section-toggle');
            if (toggleIcon && toggleIcon.classList.contains('fa-chevron-up')) {
                toggleIcon.classList.remove('fa-chevron-up');
                toggleIcon.classList.add('fa-chevron-down');
            }
        }
        
        // Scroll to the section that should be visible based on progress
        if (index === 0 && i === 0) { // Personal
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (index === 1 && i === 1) { // Address
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (index === 2 && i === 2) { // Visit
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (index === 3 && i === 3) { // Payment
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// Photo upload functionality
function setupPhotoUpload() {
    // Photo modal
    photoPickerBtn.addEventListener('click', () => {
        photoModal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', () => {
        photoModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    photoModal.addEventListener('click', (e) => {
        if (e.target === photoModal) {
            photoModal.style.display = 'none';
        }
    });
    
    // Photo upload
    pictureUpload.addEventListener('click', () => {
        profilePicture.click();
    });
    
    profilePicture.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                imagePreview.src = event.target.result;
                pictureUpload.style.display = 'none';
                previewContainer.style.display = 'block';
            };
            
            reader.readAsDataURL(e.target.files[0]);
        }
    });
    
    // Remove photo
    removePhotoBtn.addEventListener('click', () => {
        profilePicture.value = '';
        imagePreview.src = '';
        pictureUpload.style.display = 'block';
        previewContainer.style.display = 'none';
    });
    
    // Save photo
    savePhotoBtn.addEventListener('click', () => {
        photoModal.style.display = 'none';
        showToast('success', 'Photo Added', 'Profile photo has been updated.');
    });
    
    // Add drag and drop for photo upload
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        pictureUpload.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        pictureUpload.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        pictureUpload.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        pictureUpload.classList.add('highlight');
    }
    
    function unhighlight() {
        pictureUpload.classList.remove('highlight');
    }
    
    pictureUpload.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files && files[0]) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                imagePreview.src = event.target.result;
                pictureUpload.style.display = 'none';
                previewContainer.style.display = 'block';
            };
            
            reader.readAsDataURL(files[0]);
        }
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Update date display
    updateDateDisplay();
    
    // Create consent modal
    createConsentModal();
    
    // Add consent button
    addConsentButton();
    
    // Setup photo upload
    setupPhotoUpload();
    
    // Enhanced form field focus
    enhanceFormFieldFocus();
    
    // Make form sections collapsible
    makeFormSectionsCollapsible();
    
    // Add form autosave
    addFormAutosave();
    
    // Update progress steps validation
    updateFormSectionValidation();
    
    // DOB and Age calculation
    dobInput.addEventListener('change', (e) => {
        if (e.target.value) {
            const age = calculateAge(e.target.value);
            ageInput.value = age;
        } else {
            ageInput.value = '';
        }
    });
    
    // Health insurance toggle
    healthInsuranceCheckbox.addEventListener('change', (e) => {
        insuranceProviderSelect.disabled = !e.target.checked;
        if (e.target.checked) {
            insuranceProviderSelect.focus();
        }
    });
    
    // Submit button
    submitBtn.addEventListener('click', submitForm);
    
    // Reset button
    resetBtn.addEventListener('click', resetForm);
    
    // Tab navigation
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelector('.nav-tab.active').classList.remove('active');
            tab.classList.add('active');
            
            // Show toast
            showToast('info', 'Navigation', `Navigating to ${tab.textContent.trim()} page`);
        });
    });
});