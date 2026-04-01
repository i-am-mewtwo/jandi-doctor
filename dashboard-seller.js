/* =========================================
   판매자 대시보드 — JS
========================================= */

const pageNames = {
  home: '홈', products: '상품 관리', requests: '견적 요청',
  proposals: '내 제안', sales: '매출 통계', reviews: '리뷰 관리', profile: '업체 정보'
};

// ── 페이지 전환 ──
function switchPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelector(`.nav-item[data-page="${id}"]`).classList.add('active');
  document.getElementById('topbarTitle').textContent = pageNames[id] || '';
  closeSidebar();
  window.scrollTo(0, 0);
}
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => switchPage(btn.dataset.page));
});

// ── 사이드바 (모바일) ──
const sidebar = document.getElementById('sidebar');
document.getElementById('menuBtn').addEventListener('click', () => sidebar.classList.add('open'));
document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
function closeSidebar() { sidebar.classList.remove('open'); }

// ── 탭 필터 ──
document.querySelectorAll('.tab-filter').forEach(tf => {
  tf.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      tf.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

// ── 상품 등록 모달 ──
function openProductModal(mode) {
  document.getElementById('productModalTitle').textContent = mode === 'edit' ? '상품 수정' : '상품 등록';
  document.getElementById('productModal').classList.add('open');
}
function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
}
document.getElementById('productModal').addEventListener('click', function(e) {
  if (e.target === this) closeProductModal();
});
function submitProduct(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '등록 중...'; btn.disabled = true;
  setTimeout(() => {
    closeProductModal();
    btn.textContent = '등록하기'; btn.disabled = false;
    e.target.reset();
    alert('상품이 등록되었습니다.');
  }, 900);
}

// ── 제안서 작성 모달 ──
function openProposalModal(target) {
  document.getElementById('proposalTarget').textContent = target;
  document.getElementById('proposalModal').classList.add('open');
}
function closeProposalModal() {
  document.getElementById('proposalModal').classList.remove('open');
}
document.getElementById('proposalModal').addEventListener('click', function(e) {
  if (e.target === this) closeProposalModal();
});
function submitProposal(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '제출 중...'; btn.disabled = true;
  setTimeout(() => {
    closeProposalModal();
    btn.textContent = '제안서 제출'; btn.disabled = false;
    e.target.reset();
    // 신규 배지 제거 시뮬레이션
    const badge = document.querySelector('.nav-item[data-page="requests"] .nav-badge');
    if (badge) {
      const count = parseInt(badge.textContent) - 1;
      if (count <= 0) badge.remove();
      else badge.textContent = count;
    }
    alert('제안서가 성공적으로 제출되었습니다!');
  }, 1000);
}

// ── 리뷰 답변 모달 ──
let currentReplyBtn = null;
function openReplyModal(btn) {
  currentReplyBtn = btn;
  document.getElementById('replyModal').classList.add('open');
}
function closeReplyModal() {
  document.getElementById('replyModal').classList.remove('open');
}
document.getElementById('replyModal').addEventListener('click', function(e) {
  if (e.target === this) closeReplyModal();
});
function submitReply(e) {
  e.preventDefault();
  const text = e.target.querySelector('textarea').value;
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '등록 중...'; btn.disabled = true;
  setTimeout(() => {
    closeReplyModal();
    // 답변 삽입
    if (currentReplyBtn) {
      const reviewItem = currentReplyBtn.closest('.review-item');
      currentReplyBtn.remove();
      const reply = document.createElement('div');
      reply.className = 'ri-reply';
      reply.innerHTML = `<strong>사장님 답변</strong><p>${text}</p>`;
      reviewItem.appendChild(reply);
    }
    btn.textContent = '답변 등록'; btn.disabled = false;
    e.target.reset();
  }, 800);
}

// ── ESC 닫기 ──
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeProductModal(); closeProposalModal(); closeReplyModal();
  }
});

// ── 프로필 수정 ──
let isEditing = false;
function toggleEdit() {
  isEditing = !isEditing;
  document.querySelectorAll('.field-val').forEach(v => v.classList.toggle('hidden', isEditing));
  document.querySelectorAll('.field-input').forEach(i => i.classList.toggle('hidden', !isEditing));
  document.getElementById('saveProfileBtn').classList.toggle('hidden', !isEditing);
}
function saveProfile() {
  document.querySelectorAll('.field-row').forEach(row => {
    const val = row.querySelector('.field-val');
    const input = row.querySelector('.field-input');
    if (val && input) val.textContent = input.value || '';
  });
  isEditing = false;
  document.querySelectorAll('.field-val').forEach(v => v.classList.remove('hidden'));
  document.querySelectorAll('.field-input').forEach(i => i.classList.add('hidden'));
  document.getElementById('saveProfileBtn').classList.add('hidden');
}

// ── 로그아웃 ──
document.querySelector('.logout').addEventListener('click', () => {
  if (confirm('로그아웃 하시겠어요?')) window.location.href = 'index.html';
});
