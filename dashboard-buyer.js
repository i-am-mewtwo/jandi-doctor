/* =========================================
   구매자 대시보드 — JS
========================================= */

// ── 페이지 전환 ──
const pageNames = { home:'홈', quotes:'견적 요청', proposals:'받은 제안', progress:'시공 현황', reviews:'리뷰 관리', profile:'내 프로필' };

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
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    this.closest('.tab-filter').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── 제안 비교 체크박스 ──
function updateCompare() {
  const checked = document.querySelectorAll('.prop-check:checked').length;
  const bar = document.getElementById('compareBar');
  if (checked >= 2) {
    bar.style.display = 'flex';
    document.getElementById('compareCount').textContent = `${checked}개 선택됨`;
  } else {
    bar.style.display = 'none';
  }
}

function compareSelected() {
  const cards = [...document.querySelectorAll('.prop-check:checked')]
    .map(cb => cb.closest('.prop-card').querySelector('.prop-company strong').textContent);
  alert(`비교: ${cards.join(' vs ')}\n\n(실제 서비스에서는 상세 비교 화면이 표시됩니다)`);
}

// ── 제안 수락 ──
function acceptProposal(btn) {
  const company = btn.closest('.prop-card').querySelector('.prop-company strong').textContent;
  if (confirm(`${company}의 제안을 수락하시겠어요?`)) {
    btn.textContent = '✓ 수락됨';
    btn.style.background = '#40916C';
    btn.disabled = true;
    setTimeout(() => switchPage('progress'), 1000);
  }
}

// ── 리뷰 모달 ──
function openReviewModal() {
  document.getElementById('reviewModal').classList.add('open');
}
function closeReviewModal() {
  document.getElementById('reviewModal').classList.remove('open');
}
document.getElementById('reviewModal').addEventListener('click', function(e) {
  if (e.target === this) closeReviewModal();
});

// 별점 선택
document.querySelectorAll('.star-selector').forEach(selector => {
  const stars = selector.querySelectorAll('span');
  stars.forEach((star, i) => {
    star.addEventListener('mouseover', () => {
      stars.forEach((s, j) => s.classList.toggle('active', j <= i));
    });
    star.addEventListener('click', () => {
      selector.dataset.value = star.dataset.val;
      stars.forEach((s, j) => {
        s.classList.toggle('active', j <= i);
        s.dataset.selected = j <= i ? 'true' : 'false';
      });
    });
  });
  selector.addEventListener('mouseleave', () => {
    const selected = parseInt(selector.dataset.value || 0);
    stars.forEach((s, j) => s.classList.toggle('active', j < selected));
  });
});

// 리뷰 제출
function submitReview(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '등록 중...'; btn.disabled = true;
  setTimeout(() => {
    closeReviewModal();
    // 작성 가능 리뷰 카드 제거 효과
    const rrc = document.querySelector('.review-request-card');
    if (rrc) { rrc.style.opacity = '0'; setTimeout(() => rrc.remove(), 400); }
    // 배지 제거
    const badge = document.querySelector('.nav-item[data-page="reviews"] .nav-badge');
    if (badge) badge.remove();
    btn.textContent = '리뷰 등록하기'; btn.disabled = false;
  }, 1000);
}

// ── 프로필 수정 ──
let isEditing = false;
function toggleEdit() {
  isEditing = !isEditing;
  const vals = document.querySelectorAll('.field-val');
  const inputs = document.querySelectorAll('.field-input');
  const editBtn = document.getElementById('editProfileBtn');
  const saveBtn = document.getElementById('saveProfileBtn');
  vals.forEach(v => v.classList.toggle('hidden', isEditing));
  inputs.forEach(i => i.classList.toggle('hidden', !isEditing));
  editBtn.textContent = isEditing ? '취소' : '수정하기';
  saveBtn.classList.toggle('hidden', !isEditing);
}

function saveProfile() {
  document.querySelectorAll('.field-row').forEach(row => {
    const val = row.querySelector('.field-val');
    const input = row.querySelector('.field-input');
    if (val && input) val.textContent = input.value || input.options?.[input.selectedIndex]?.text || input.value;
  });
  isEditing = false;
  document.querySelectorAll('.field-val').forEach(v => v.classList.remove('hidden'));
  document.querySelectorAll('.field-input').forEach(i => i.classList.add('hidden'));
  document.getElementById('editProfileBtn').textContent = '수정하기';
  document.getElementById('saveProfileBtn').classList.add('hidden');
}

// ── 로그아웃 ──
document.querySelector('.logout').addEventListener('click', () => {
  if (confirm('로그아웃 하시겠어요?')) window.location.href = 'index.html';
});
