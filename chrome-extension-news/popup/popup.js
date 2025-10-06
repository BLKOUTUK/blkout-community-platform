// BLKOUT News Curator - Popup Logic
class NewsCurator {
  constructor() {
    this.extractedData = {};
    this.uploadedImages = [];
    this.selectedImages = [];
    this.maxImages = 5;
    this.maxImageSize = 5 * 1024 * 1024; // 5MB
    this.apiEndpoint = 'https://blkout-api-railway-production.up.railway.app/api';
    this.dashboardUrl = 'https://news-blkout.vercel.app/admin';
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
    document.getElementById('newsContentWarning').addEventListener('change', (e) => {
      document.getElementById('warningTextGroup').style.display = e.target.checked ? 'block' : 'none';
    });

    // Load stats
    this.loadStats();
    
    // Auto-extract on load
    this.extractFromPage();
  }

  async extractFromPage() {
    this.showStatus('Extracting article data...');
    
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
    if (data.headline) document.getElementById('newsHeadline').value = data.headline;
    if (data.author) document.getElementById('newsAuthor').value = data.author;
    if (data.publication) document.getElementById('newsPublication').value = data.publication;
    if (data.publishedDate) document.getElementById('newsPublishedDate').value = data.publishedDate;
    if (data.summary) document.getElementById('newsSummary').value = data.summary;
    if (data.content) document.getElementById('newsContent').value = data.content;
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

  async submitToQueue() {
    const articleData = {
      original: this.extractedData,
      edited: {
        headline: document.getElementById('newsHeadline').value.trim(),
        author: document.getElementById('newsAuthor').value.trim(),
        publication: document.getElementById('newsPublication').value.trim(),
        publishedDate: document.getElementById('newsPublishedDate').value,
        summary: document.getElementById('newsSummary').value.trim(),
        content: document.getElementById('newsContent').value.trim(),
        sourceUrl: document.getElementById('newsSourceUrl').value.trim(),
        category: document.getElementById('newsCategory').value,
        tags: document.getElementById('newsTags').value.split(',').map(t => t.trim()).filter(Boolean),
        communityRelevance: document.getElementById('newsCommunityRelevance').value.trim(),
        contentWarning: document.getElementById('newsContentWarning').checked,
        warningText: document.getElementById('newsWarningText').value.trim()
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
      
      const response = await fetch(`${this.apiEndpoint}/news/moderation-queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending_review', ...articleData })
      });

      if (response.ok) {
        this.showSuccess('Article submitted to moderation queue!');
        setTimeout(() => this.showDashboardPrompt(), 1500);
      } else {
        this.saveToLocalStorage('pending_review', articleData);
        this.showSuccess('Article saved locally (will sync when online)');
      }
    } catch (error) {
      console.error('Submit failed:', error);
      this.saveToLocalStorage('pending_review', articleData);
      this.showSuccess('Article saved locally for later submission');
    }
  }

  saveDraft() {
    const articleData = {
      headline: document.getElementById('newsHeadline').value,
      summary: document.getElementById('newsSummary').value
    };
    this.saveToLocalStorage('draft', articleData);
    this.showSuccess('Draft saved');
  }

  saveToLocalStorage(type, data) {
    const key = `news_${type}_${Date.now()}`;
    chrome.storage.local.set({ [key]: data });
  }

  showDashboardPrompt() {
    if (confirm('Article submitted! Open moderation dashboard to review?')) {
      chrome.tabs.create({ url: this.dashboardUrl });
    }
  }

  async loadStats() {
    try {
      const result = await chrome.storage.local.get(['newsStats']);
      if (result.newsStats) {
        document.getElementById('submittedToday').textContent = result.newsStats.submittedToday || 0;
        document.getElementById('approvalRate').textContent =
          result.newsStats.approvalRate ? `${result.newsStats.approvalRate}%` : '--';
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
  new NewsCurator();
});
