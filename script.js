/* =========================================
   잔디박사 — Interaction & Animation
========================================= */

// ── Header scroll effect ──
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Hamburger menu (mobile) ──
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
  const nav = document.querySelector('.nav-links');
  const actions = document.querySelector('.header-actions');
  const isOpen = nav.classList.toggle('mobile-open');
  actions.classList.toggle('mobile-open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// ── Scroll reveal ──
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

// Add reveal class to target elements
const revealTargets = [
  '.type-card', '.step', '.feature-card',
  '.review-card', '.benefit', '.trust-item',
  '.quote-info', '.quote-form',
  '.spec-text', '.spec-visual',
  '.partner-text', '.partner-benefits'
];

revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    if (i === 1) el.classList.add('reveal-delay-1');
    if (i === 2) el.classList.add('reveal-delay-2');
    if (i === 3) el.classList.add('reveal-delay-3');
    revealObserver.observe(el);
  });
});

// ── Quote form submission ──
document.getElementById('quoteForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const btn = this.querySelector('button[type="submit"]');
  const originalText = btn.textContent;

  btn.textContent = '요청 중...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.textContent = '✓ 견적 요청 완료!';
    btn.style.background = '#40916C';
    btn.style.opacity = '1';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
      this.reset();
    }, 3000);
  }, 1200);
});

// ── Login Modal ──
const loginModal   = document.getElementById('loginModal');
const modalSelect  = document.getElementById('modalSelect');
const modalForm    = document.getElementById('modalForm');
const modalBack    = document.getElementById('modalBack');
const modalRoleBadge = document.getElementById('modalRoleBadge');
const modalFormTitle = document.getElementById('modalFormTitle');

const roleLabel = { buyer: '구매자', seller: '판매자', contractor: '시공사' };
const roleIcon  = { buyer: '🏠', seller: '🏢', contractor: '🔧' };
let currentRole = 'buyer';

function openModal() {
  loginModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  showSelect();
}
function closeModal() {
  loginModal.classList.remove('open');
  document.body.style.overflow = '';
}
function showSelect() {
  modalSelect.classList.remove('hidden');
  modalForm.classList.add('hidden');
}
function showForm(role) {
  currentRole = role;
  modalSelect.classList.add('hidden');
  modalForm.classList.remove('hidden');
  modalRoleBadge.textContent = `${roleIcon[role]} ${roleLabel[role]}`;
  modalRoleBadge.className = `modal-role-badge ${role}`;
  modalFormTitle.textContent = `${roleLabel[role]} 로그인`;
  // reset to login tab
  switchTab('login');
}

document.getElementById('btnLogin').addEventListener('click', openModal);
document.getElementById('modalClose').addEventListener('click', closeModal);
modalBack.addEventListener('click', showSelect);
loginModal.addEventListener('click', e => { if (e.target === loginModal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// 유형 선택
document.querySelectorAll('.login-type-btn').forEach(btn => {
  btn.addEventListener('click', () => showForm(btn.dataset.role));
});

// 탭 전환 (역할에 따라 다른 회원가입 폼 표시)
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
  const isBuyer = currentRole === 'buyer';
  document.getElementById('buyerSignupForm').classList.toggle('hidden', !(tab === 'signup' && isBuyer));
  document.getElementById('bizSignupForm').classList.toggle('hidden', !(tab === 'signup' && !isBuyer));
}
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// 비밀번호 보기/숨기기
document.querySelectorAll('.pw-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    btn.textContent = isText ? '보기' : '숨기기';
  });
});

// 로그인 제출
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = '로그인 중...'; btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ 로그인 성공!';
    setTimeout(closeModal, 1200);
    btn.textContent = '로그인'; btn.disabled = false;
  }, 1000);
});

// 구매자 회원가입 제출
document.getElementById('buyerSignupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = '처리 중...'; btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ 가입 완료! 환영합니다 🎉';
    btn.style.background = '#40916C';
    setTimeout(() => { closeModal(); btn.textContent = '회원가입'; btn.style.background = ''; btn.disabled = false; this.reset(); }, 2000);
  }, 1000);
});

// 판매자/시공사 회원가입 제출
document.getElementById('bizSignupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = '처리 중...'; btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ 신청 완료! 검토 후 연락드립니다.';
    btn.style.background = '#40916C';
    setTimeout(() => { closeModal(); btn.textContent = '회원가입 신청'; btn.style.background = ''; btn.disabled = false; this.reset(); }, 2500);
  }, 1200);
});

// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.4 }
);
sections.forEach(s => sectionObserver.observe(s));

// ── Add active nav link style ──
const style = document.createElement('style');
style.textContent = `
  .nav-links a.active {
    color: var(--green-700);
    background: var(--green-50);
    font-weight: 700;
  }
  @media (max-width: 960px) {
    .nav-links.mobile-open {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 68px; left: 0; right: 0;
      background: rgba(255,255,255,.97);
      backdrop-filter: blur(12px);
      padding: 12px 24px 20px;
      border-bottom: 1px solid var(--gray-100);
      box-shadow: var(--shadow-md);
    }
    .header-actions.mobile-open {
      display: flex;
      position: absolute;
      bottom: 0; left: 0; right: 0;
      padding: 0 24px 20px;
      top: auto;
      background: rgba(255,255,255,.97);
    }
  }
`;
document.head.appendChild(style);
