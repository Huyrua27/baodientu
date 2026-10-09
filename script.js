// 1. Thanh tiến trình cuộn trang (Reading Progress Bar)
window.addEventListener('scroll', () => {
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = scrolled + '%';
  }
});

// 2. Cuộn mượt xuống khu vực Bình luận
function scrollToComments() {
  const commentsArea = document.getElementById('commentsArea');
  if (commentsArea) {
    commentsArea.scrollIntoView({ behavior: 'smooth' });
  }
}

// 3. Sao chép liên kết bài viết
function copyArticleLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    alert('Đã sao chép liên kết bài viết vào bộ nhớ tạm!');
  }).catch(err => {
    console.error('Lỗi khi sao chép link: ', err);
  });
}

// 4. Chia sẻ mạng xã hội
function shareSocial(platform) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  if (platform === 'facebook') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  } else if (platform === 'zalo') {
    window.open(`https://sp.zalo.me/share_inline?link=${url}&title=${title}`, '_blank');
  }
}

// 5. Quản lý Bình luận bằng localStorage
function loadComments() {
  const commentsList = document.getElementById('commentsList');
  const commentCount = document.getElementById('commentCount');
  const commentCountHeader = document.getElementById('commentCountHeader');

  if (!commentsList) return;

  const savedComments = JSON.parse(localStorage.getItem('article_comments')) || [
    { name: "Nguyễn Văn An", text: "Bài viết đọc rất xúc động! Cảm ơn tác giả đã khắc họa chân thực công việc thầm lặng này.", time: "2 giờ trước" },
    { name: "Trần Hoàng", text: "Giao diện báo e-Magazine thiết kế ảnh Hero full-screen ấn tượng quá!", time: "5 giờ trước" }
  ];

  if (commentCount) commentCount.textContent = savedComments.length;
  if (commentCountHeader) commentCountHeader.textContent = savedComments.length;

  commentsList.innerHTML = savedComments.map(c => `
    <div class="comment-item">
      <div class="comment-avatar">${c.name.charAt(0).toUpperCase()}</div>
      <div class="comment-content">
        <div class="comment-author">${c.name} <span class="comment-time">• ${c.time}</span></div>
        <p class="comment-text">${c.text}</p>
      </div>
    </div>
  `).join('');
}

// 6. Hiệu ứng Scroll Reveal & Khởi tạo sự kiện
document.addEventListener("DOMContentLoaded", () => {
  // Khai báo tải bình luận
  loadComments();

  // Xử lý gửi bình luận mới
  const commentForm = document.getElementById('commentForm');
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('userName');
      const textInput = document.getElementById('userComment');

      if (!nameInput.value.trim() || !textInput.value.trim()) return;

      const newComment = {
        name: nameInput.value.trim(),
        text: textInput.value.trim(),
        time: "Vừa xong"
      };

      const savedComments = JSON.parse(localStorage.getItem('article_comments')) || [];
      savedComments.unshift(newComment);

      localStorage.setItem('article_comments', JSON.stringify(savedComments));

      nameInput.value = '';
      textInput.value = '';
      loadComments();
    });
  }

  // Hiệu ứng cuộn hiện dần
  const elementsToAnimate = document.querySelectorAll('.section-heading, .paragraph, .body-media, .pull-quote-block, .qa-interview-card, .video-standalone-section, .audio-standalone-section');
  elementsToAnimate.forEach(el => el.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.15 });

  elementsToAnimate.forEach(el => observer.observe(el));
});