// BLKOUT Events Curator - Popup Logic
class EventsCurator {
  constructor() {
    this.extractedData = {};
    this.uploadedImages = [];
    this.selectedImages = [];
    this.maxImages = 5;
    this.maxImageSize = 5 * 1024 * 1024; // 5MB
    this.apiEndpoint = 'https://blkout-api-railway-production.up.railway.app/api';
    this.dashboardUrl = 'https://events-blkout.vercel.app/admin';
    this.version = '1.0.0';
    this.init();
  }

  init() {
    // Set up event listeners
    document.getElementById('extractBtn').addEventListener('click', () => this.extractFromPage());
    document.getElementById('saveDraftBtn').addEventListener('click', () => this.saveDraft());
    document.getElementById('submitBtn').addEventListener('click', (e) => {
      e.preventDefault();
      this.submitToQueue();
    });
    document.getElementById('imageUpload').addEventListener('change', (e) => this.handleImageUpload(e));
    document.getElementById('eventStartDate').addEventListener('change', () => this.validateDateRange());
    document.getElementById('eventEndDate').addEventListener('change', () => this.validateDateRange());

    // Load stats
    this.loadStats();
    
    // Auto-extract on load
    this.extractFromPage();
  }

  async extractFromPage() {
    this.showStatus('Extracting event data...');
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractPageData' });
      
      if (response) {
        this.extractedData = response;
        this.populateForm(response);
        this.displayExtractedImages();
        this.showSuccess(`Data extracted via ${response.dataSource || 'page content'}`);
      }
    } catch (error) {
      console.error('Extraction failed:', error);
      this.showError('Could not extract data. Please fill manually.');
    }
  }

  populateForm(data) {
    if (data.title) document.getElementById('eventTitle').value = data.title;
    if (data.startDate) document.getElementById('eventStartDate').value = data.startDate;
    if (data.endDate) document.getElementById('eventEndDate').value = data.endDate;
    if (data.location) document.getElementById('eventLocation').value = data.location;
    if (data.organizer) document.getElementById('eventOrganizer').value = data.organizer;
    if (data.description) document.getElementById('eventDescription').value = data.description;
  }

  displayExtractedImages() {
    const imagesGrid = document.getElementById('imagesGrid');
    
    if (!this.extractedData.images || this.extractedData.images.length === 0) {
      imagesGrid.innerHTML = '<div class="no-images">No images found on page</div>';
      return;
    }

    imagesGrid.innerHTML = '';
    this.extractedData.images.slice(0, this.maxImages).forEach((imageUrl, index) => {
      const imageCard = document.createElement('div');
      imageCard.className = 'image-card';
      imageCard.innerHTML = `
        <img src="${imageUrl}" alt="Image ${index + 1}">
        <button class="image-select-btn ${this.selectedImages.includes(imageUrl) ? 'selected' : ''}" 
                data-url="${imageUrl}">
          ${this.selectedImages.includes(imageUrl) ? '✓ Selected' : 'Select'}
        </button>
      `;
      
      imageCard.querySelector('.image-select-btn').addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleImageSelection(imageUrl, e.target);
      });
      
      imagesGrid.appendChild(imageCard);
    });

    // Auto-select first image
    if (this.selectedImages.length === 0 && this.extractedData.images.length > 0) {
      this.selectedImages.push(this.extractedData.images[0]);
    }
  }

  toggleImageSelection(imageUrl, button) {
    const index = this.selectedImages.indexOf(imageUrl);
    const totalImages = this.selectedImages.length + this.uploadedImages.length;

    if (index > -1) {
      this.selectedImages.splice(index, 1);
      button.classList.remove('selected');
      button.textContent = 'Select';
    } else {
      if (totalImages >= this.maxImages) {
        this.showError(`Maximum ${this.maxImages} images allowed`);
        return;
      }
      this.selectedImages.push(imageUrl);
      button.classList.add('selected');
      button.textContent = '✓ Selected';
    }
  }

  async handleImageUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const totalImages = this.selectedImages.length + this.uploadedImages.length + files.length;
    if (totalImages > this.maxImages) {
      this.showError(`Maximum ${this.maxImages} images allowed`);
      return;
    }

    for (const file of files) {
      if (file.size > this.maxImageSize) {
        this.showError(`${file.name} is too large (max 5MB)`);
        continue;
      }

      const base64 = await this.fileToBase64(file);
      this.uploadedImages.push({
        name: file.name,
        size: file.size,
        type: file.type,
        data: base64
      });
    }

    this.displayUploadedImages();
  }

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  displayUploadedImages() {
    const container = document.getElementById('uploadedImages');
    const grid = document.getElementById('uploadedImagesGrid');
    
    if (this.uploadedImages.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';
    grid.innerHTML = '';
    
    this.uploadedImages.forEach((img, index) => {
      const imageCard = document.createElement('div');
      imageCard.className = 'image-card uploaded';
      imageCard.innerHTML = `
        <img src="${img.data}" alt="${img.name}">
        <button class="image-remove-btn" data-index="${index}">Remove</button>
        <div class="image-size">${(img.size / 1024).toFixed(1)} KB</div>
      `;
      
      imageCard.querySelector('.image-remove-btn').addEventListener('click', () => {
        this.uploadedImages.splice(index, 1);
        this.displayUploadedImages();
      });
      
      grid.appendChild(imageCard);
    });
  }

  validateDateRange() {
    const start = document.getElementById('eventStartDate').value;
    const end = document.getElementById('eventEndDate').value;
    
    if (start && end && new Date(end) < new Date(start)) {
      this.showError('End date must be after start date');
      return false;
    }
    return true;
  }

  async submitToQueue() {
    if (!this.validateDateRange()) return;

    const eventData = {
      original: this.extractedData,
      edited: {
        title: document.getElementById('eventTitle').value.trim(),
        startDate: document.getElementById('eventStartDate').value,
        endDate: document.getElementById('eventEndDate').value,
        location: document.getElementById('eventLocation').value.trim(),
        organizer: document.getElementById('eventOrganizer').value.trim(),
        description: document.getElementById('eventDescription').value.trim(),
        capacity: document.getElementById('eventCapacity').value || null,
        price: document.getElementById('eventPrice').value.trim(),
        registrationUrl: document.getElementById('eventRegistration').value.trim(),
        eventType: document.getElementById('eventType').value,
        tags: document.getElementById('eventTags').value.split(',').map(t => t.trim()).filter(Boolean),
        accessibility: document.getElementById('eventAccessibility').value.trim()
      },
      images: {
        selected: this.selectedImages,
        uploaded: this.uploadedImages,
        total: this.selectedImages.length + this.uploadedImages.length
      },
      metadata: {
        sourceUrl: this.extractedData.url,
        extractedAt: new Date().toISOString()
      },
      workflow: {
        stage: 'curator_submission',
        requiresReview: true,
        requiresEdit: true
      }
    };

    try {
      this.showStatus('Submitting to moderation queue...');
      
      const response = await fetch(`${this.apiEndpoint}/events/moderation-queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending_review', ...eventData })
      });

      if (response.ok) {
        this.showSuccess('Event submitted to moderation queue!');
        setTimeout(() => this.showDashboardPrompt(), 1500);
      } else {
        this.saveToLocalStorage('pending_review', eventData);
        this.showSuccess('Event saved locally (will sync when online)');
      }
    } catch (error) {
      console.error('Submit failed:', error);
      this.saveToLocalStorage('pending_review', eventData);
      this.showSuccess('Event saved locally for later submission');
    }
  }

  saveDraft() {
    const eventData = {
      title: document.getElementById('eventTitle').value,
      startDate: document.getElementById('eventStartDate').value
    };
    this.saveToLocalStorage('draft', eventData);
    this.showSuccess('Draft saved');
  }

  saveToLocalStorage(type, data) {
    const key = `events_${type}_${Date.now()}`;
    chrome.storage.local.set({ [key]: data });
  }

  showDashboardPrompt() {
    if (confirm('Event submitted! Open moderation dashboard to review?')) {
      chrome.tabs.create({ url: this.dashboardUrl });
    }
  }

  async loadStats() {
    try {
      const result = await chrome.storage.local.get(['eventsStats']);
      if (result.eventsStats) {
        document.getElementById('submittedToday').textContent = result.eventsStats.submittedToday || 0;
        document.getElementById('approvalRate').textContent = 
          result.eventsStats.approvalRate ? `${result.eventsStats.approvalRate}%` : '--';
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  showStatus(message) {
    const el = document.getElementById('statusMessage');
    el.textContent = message;
    el.style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
  }

  showSuccess(message) {
    this.showStatus(message);
  }

  showError(message) {
    const el = document.getElementById('errorMessage');
    el.textContent = message;
    el.style.display = 'block';
    document.getElementById('statusMessage').style.display = 'none';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new EventsCurator();
});
