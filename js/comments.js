// Comments System Module
class CommentsSystem {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.storageKey = options.storageKey || 'comments_system';
    this.articleId = options.articleId || 'default';
    this.maxComments = options.maxComments || 100;
    
    this.init();
  }

  init() {
    if (!this.container) {
      console.error('Comments container not found:', this.containerId);
      return;
    }

    this.render();
    this.bindEvents();
    this.loadComments();
  }

  render() {
    this.container.innerHTML = `
      <section class="comments-section">
        <h3 class="comments-title">
          Comments <span class="comment-count">(0)</span>
        </h3>

        <!-- Success Message -->
        <div class="success-message" id="successMessage">
          Your comment has been submitted successfully!
        </div>

        <!-- Comment Form -->
        <div class="comment-form">
          <h4 class="form-title">Leave a Comment</h4>
          <form id="commentForm">
            <div class="form-row">
              <div class="form-group">
                <label for="name" class="form-label">Name *</label>
                <input type="text" id="name" name="name" class="form-input" required>
              </div>
              <div class="form-group">
                <label for="email" class="form-label">Email *</label>
                <input type="email" id="email" name="email" class="form-input" required>
              </div>
            </div>
            <div class="form-group">
              <label for="comment" class="form-label">Comment *</label>
              <textarea id="comment" name="comment" class="form-textarea" placeholder="Share your thoughts..." required></textarea>
            </div>
            <button type="submit" class="submit-btn" id="submitBtn">
              <span class="btn-text">Post Comment</span>
              <span class="btn-loading" style="display: none;">Posting...</span>
            </button>
          </form>
        </div>

        <!-- Comments List -->
        <div class="comments-list" id="commentsList">
          <!-- Comments will be loaded dynamically from localStorage -->
        </div>
      </section>
    `;

    // Add CSS styles if not already present
    this.addStyles();
  }

  addStyles() {
    if (document.getElementById('comments-styles')) {
      return; // Styles already added
    }

    const style = document.createElement('style');
    style.id = 'comments-styles';
    style.textContent = `
      /* Comments Section */
      .comments-section {
        margin-top: 60px;
        padding-top: 40px;
        border-top: 1px solid #eee;
      }

      .comments-title {
        font-size: 1.8rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 30px;
        text-align: center;
      }

      .comment-count {
        color: #666;
        font-size: 1rem;
        font-weight: normal;
      }

      /* Comment Form */
      .comment-form {
        background: #f8f9fa;
        padding: 30px;
        border-radius: 10px;
        margin-bottom: 40px;
      }

      .form-title {
        font-size: 1.3rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 20px;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-label {
        display: block;
        font-weight: 600;
        color: #333;
        margin-bottom: 8px;
      }

      .form-input,
      .form-textarea {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #e1e5e9;
        border-radius: 6px;
        font-size: 1rem;
        font-family: inherit;
        transition: border-color 0.3s ease;
        box-sizing: border-box;
      }

      .form-input:focus,
      .form-textarea:focus {
        outline: none;
        border-color: #0074c2;
      }

      .form-textarea {
        min-height: 120px;
        resize: vertical;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }

      .submit-btn {
        background: #0074c2;
        color: white;
        border: none;
        padding: 12px 30px;
        font-size: 1rem;
        font-weight: 600;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .submit-btn:hover {
        background: #0056b3;
        transform: translateY(-2px);
      }

      .submit-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
        transform: none;
      }

      /* Comments List */
      .comments-list {
        margin-top: 40px;
      }

      .comment-item {
        background: white;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        padding: 25px;
        margin-bottom: 20px;
        transition: box-shadow 0.3s ease;
      }

      .comment-item:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .comment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }

      .comment-author {
        font-weight: 600;
        color: #333;
        font-size: 1.1rem;
      }

      .comment-date {
        color: #666;
        font-size: 0.9rem;
      }

      .comment-content {
        color: #333;
        line-height: 1.6;
        font-size: 1rem;
      }

      .comment-actions {
        margin-top: 15px;
        display: flex;
        gap: 15px;
      }

      .action-btn {
        background: none;
        border: none;
        color: #0074c2;
        font-size: 0.9rem;
        cursor: pointer;
        padding: 5px 0;
        transition: color 0.3s ease;
      }

      .action-btn:hover {
        color: #0056b3;
        text-decoration: underline;
      }

      .like-btn {
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .like-count {
        color: #666;
      }

      .like-btn.liked {
        color: #e74c3c;
      }

      .like-btn.liked .like-count {
        color: #e74c3c;
      }

      /* Reply Form */
      .reply-form {
        margin-top: 15px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 6px;
        display: none;
      }

      .reply-form.active {
        display: block;
      }

      .reply-textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #e1e5e9;
        border-radius: 4px;
        font-size: 0.9rem;
        font-family: inherit;
        min-height: 80px;
        resize: vertical;
        margin-bottom: 10px;
      }

      .reply-buttons {
        display: flex;
        gap: 10px;
      }

      .reply-submit {
        background: #0074c2;
        color: white;
        border: none;
        padding: 8px 16px;
        font-size: 0.9rem;
        border-radius: 4px;
        cursor: pointer;
      }

      .reply-cancel {
        background: #6c757d;
        color: white;
        border: none;
        padding: 8px 16px;
        font-size: 0.9rem;
        border-radius: 4px;
        cursor: pointer;
      }

      /* Success Message */
      .success-message {
        background: #d4edda;
        color: #155724;
        padding: 15px;
        border-radius: 6px;
        margin-bottom: 20px;
        display: none;
      }

      .success-message.show {
        display: block;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .form-row {
          grid-template-columns: 1fr;
          gap: 15px;
        }

        .comment-form {
          padding: 20px;
        }

        .comment-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }

        .comment-actions {
          flex-wrap: wrap;
        }
      }

      @media (max-width: 480px) {
        .comment-form {
          padding: 15px;
        }

        .comment-item {
          padding: 20px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  bindEvents() {
    const commentForm = this.container.querySelector('#commentForm');
    const commentsList = this.container.querySelector('#commentsList');

    // Comment form submission
    commentForm.addEventListener('submit', (e) => this.handleCommentSubmit(e));

    // Like button functionality
    commentsList.addEventListener('click', (e) => this.handleLikeClick(e));

    // Reply button functionality
    commentsList.addEventListener('click', (e) => this.handleReplyClick(e));

    // Reply form submission
    commentsList.addEventListener('click', (e) => this.handleReplySubmit(e));
  }

  handleCommentSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const comment = formData.get('comment');

    const submitBtn = this.container.querySelector('#submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    // Create new comment object
    const newCommentData = {
      id: Date.now(),
      name: name,
      email: email,
      comment: comment,
      date: new Date().toISOString(),
      likes: 0,
      liked: false,
      replies: []
    };

    // Save to localStorage
    this.saveComment(newCommentData);

    // Simulate API call
    setTimeout(() => {
      // Create new comment element
      const newComment = this.createCommentElement(newCommentData);
      
      // Add to the beginning of comments list
      const commentsList = this.container.querySelector('#commentsList');
      commentsList.insertBefore(newComment, commentsList.firstChild);
      
      // Update comment count
      this.updateCommentCount();
      
      // Show success message
      this.showSuccessMessage();
      
      // Reset form
      e.target.reset();
      
      // Reset button state
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    }, 1500);
  }

  handleLikeClick(e) {
    if (e.target.closest('.like-btn')) {
      const likeBtn = e.target.closest('.like-btn');
      const commentItem = likeBtn.closest('.comment-item');
      const commentId = parseInt(commentItem.getAttribute('data-comment-id'));
      const likeCount = likeBtn.querySelector('.like-count');
      const currentLikes = parseInt(likeCount.textContent);
      
      if (likeBtn.classList.contains('liked')) {
        likeBtn.classList.remove('liked');
        likeCount.textContent = currentLikes - 1;
        this.updateCommentLike(commentId, currentLikes - 1, false);
      } else {
        likeBtn.classList.add('liked');
        likeCount.textContent = currentLikes + 1;
        this.updateCommentLike(commentId, currentLikes + 1, true);
      }
    }
  }

  handleReplyClick(e) {
    if (e.target.closest('.reply-btn')) {
      const commentItem = e.target.closest('.comment-item');
      const replyForm = commentItem.querySelector('.reply-form');
      
      // Close all other reply forms
      this.container.querySelectorAll('.reply-form').forEach(form => {
        if (form !== replyForm) {
          form.classList.remove('active');
        }
      });
      
      // Toggle current reply form
      replyForm.classList.toggle('active');
      
      if (replyForm.classList.contains('active')) {
        replyForm.querySelector('.reply-textarea').focus();
      }
    }
  }

  handleReplySubmit(e) {
    if (e.target.classList.contains('reply-submit')) {
      const replyForm = e.target.closest('.reply-form');
      const textarea = replyForm.querySelector('.reply-textarea');
      const replyText = textarea.value.trim();
      
      if (replyText) {
        const commentItem = replyForm.closest('.comment-item');
        const commentId = parseInt(commentItem.getAttribute('data-comment-id'));
        
        // Create reply data
        const replyData = {
          id: Date.now(),
          text: replyText,
          date: new Date().toISOString()
        };
        
        // Save reply to localStorage
        this.saveReply(commentId, replyData);
        
        // Create reply element
        const replyElement = this.createReplyElement(replyData);
        
        // Add reply after the comment content
        const commentContent = commentItem.querySelector('.comment-content');
        commentContent.appendChild(replyElement);
        
        // Clear and hide reply form
        textarea.value = '';
        replyForm.classList.remove('active');
      }
    }
    
    if (e.target.classList.contains('reply-cancel')) {
      const replyForm = e.target.closest('.reply-form');
      replyForm.querySelector('.reply-textarea').value = '';
      replyForm.classList.remove('active');
    }
  }

  // Local Storage Functions
  saveComment(commentData) {
    const comments = this.getComments();
    comments.unshift(commentData); // Add to beginning
    
    // Limit number of comments
    if (comments.length > this.maxComments) {
      comments.splice(this.maxComments);
    }
    
    localStorage.setItem(this.getStorageKey(), JSON.stringify(comments));
  }

  getComments() {
    const stored = localStorage.getItem(this.getStorageKey());
    if (stored) {
      return JSON.parse(stored);
    }
    return this.getDefaultComments();
  }

  getStorageKey() {
    return `${this.storageKey}_${this.articleId}`;
  }

  updateCommentLike(commentId, likes, liked) {
    const comments = this.getComments();
    const commentIndex = comments.findIndex(c => c.id === commentId);
    if (commentIndex !== -1) {
      comments[commentIndex].likes = likes;
      comments[commentIndex].liked = liked;
      localStorage.setItem(this.getStorageKey(), JSON.stringify(comments));
    }
  }

  saveReply(commentId, replyData) {
    const comments = this.getComments();
    const commentIndex = comments.findIndex(c => c.id === commentId);
    if (commentIndex !== -1) {
      if (!comments[commentIndex].replies) {
        comments[commentIndex].replies = [];
      }
      comments[commentIndex].replies.push(replyData);
      localStorage.setItem(this.getStorageKey(), JSON.stringify(comments));
    }
  }

  getDefaultComments() {
    return [
      {
        id: 1,
        name: "John Smith",
        email: "john@example.com",
        comment: "Great article! I've been looking for information about CNC sheet metal machinery and this provides excellent insights. The R&D focus is particularly impressive.",
        date: "2024-03-15T10:30:00.000Z",
        likes: 5,
        liked: false,
        replies: []
      },
      {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah@example.com",
        comment: "The 20 years of experience really shows in the quality of their products. I'm interested in learning more about their custom solutions for metal forming needs.",
        date: "2024-03-12T14:20:00.000Z",
        likes: 3,
        liked: false,
        replies: []
      },
      {
        id: 3,
        name: "Mike Chen",
        email: "mike@example.com",
        comment: "Excellent overview of Rucheng Technology's capabilities. The international quality management systems and global standards compliance are crucial for our industry.",
        date: "2024-03-10T09:15:00.000Z",
        likes: 7,
        liked: true,
        replies: []
      }
    ];
  }

  loadComments() {
    const comments = this.getComments();
    const commentsList = this.container.querySelector('#commentsList');
    commentsList.innerHTML = '';
    
    comments.forEach(commentData => {
      const commentElement = this.createCommentElement(commentData);
      commentsList.appendChild(commentElement);
    });
    
    this.updateCommentCount();
  }

  createCommentElement(commentData) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment-item';
    commentDiv.setAttribute('data-comment-id', commentData.id);
    
    const commentDate = new Date(commentData.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const likeClass = commentData.liked ? 'liked' : '';
    
    commentDiv.innerHTML = `
      <div class="comment-header">
        <div class="comment-author">${commentData.name}</div>
        <div class="comment-date">${commentDate}</div>
      </div>
      <div class="comment-content">
        ${commentData.comment}
        ${commentData.replies.map(reply => this.createReplyHTML(reply)).join('')}
      </div>
      <div class="comment-actions">
        <button class="action-btn like-btn ${likeClass}" data-likes="${commentData.likes}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span class="like-count">${commentData.likes}</span>
        </button>
        <button class="action-btn reply-btn">Reply</button>
      </div>
      <div class="reply-form">
        <textarea class="reply-textarea" placeholder="Write your reply..."></textarea>
        <div class="reply-buttons">
          <button class="reply-submit">Submit Reply</button>
          <button class="reply-cancel">Cancel</button>
        </div>
      </div>
    `;
    
    return commentDiv;
  }

  createReplyElement(replyData) {
    const replyDiv = document.createElement('div');
    replyDiv.className = 'reply-item';
    replyDiv.style.cssText = `
      margin-top: 15px;
      padding: 15px;
      background: #f8f9fa;
      border-left: 3px solid #0074c2;
      border-radius: 0 6px 6px 0;
    `;
    
    const replyDate = new Date(replyData.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    replyDiv.innerHTML = `
      <div style="font-weight: 600; color: #333; margin-bottom: 5px;">You replied</div>
      <div style="color: #333; line-height: 1.5;">${replyData.text}</div>
      <div style="color: #666; font-size: 0.9rem; margin-top: 8px;">${replyDate}</div>
    `;
    
    return replyDiv;
  }

  createReplyHTML(replyData) {
    const replyDate = new Date(replyData.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return `
      <div class="reply-item" style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-left: 3px solid #0074c2; border-radius: 0 6px 6px 0;">
        <div style="font-weight: 600; color: #333; margin-bottom: 5px;">You replied</div>
        <div style="color: #333; line-height: 1.5;">${replyData.text}</div>
        <div style="color: #666; font-size: 0.9rem; margin-top: 8px;">${replyDate}</div>
      </div>
    `;
  }

  updateCommentCount() {
    const commentCount = this.container.querySelector('.comment-count');
    const currentCount = this.container.querySelectorAll('.comment-item').length;
    commentCount.textContent = `(${currentCount})`;
  }

  showSuccessMessage() {
    const successMessage = this.container.querySelector('#successMessage');
    successMessage.classList.add('show');
    setTimeout(() => {
      successMessage.classList.remove('show');
    }, 3000);
  }

  // Public methods for external use
  scrollToComments() {
    this.container.scrollIntoView({
      behavior: 'smooth'
    });
    this.container.querySelector('#name').focus();
  }

  clearComments() {
    localStorage.removeItem(this.getStorageKey());
    this.loadComments();
  }

  getCommentCount() {
    return this.container.querySelectorAll('.comment-item').length;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CommentsSystem;
} else {
  window.CommentsSystem = CommentsSystem;
} 