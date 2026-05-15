/* nav.js : mobile menu + dropdown toggle */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    });
  }

  /* Dropdown items : click to toggle on mobile */
  document.querySelectorAll('.has-dropdown').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 880) {
        e.preventDefault();
        const li = link.closest('li');
        li.classList.toggle('open');
      }
    });
  });

  /* Mark active nav item */
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.site-nav a').forEach(function (a) {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path) {
      a.closest('li')?.classList.add('active');
    }
  });
})();
