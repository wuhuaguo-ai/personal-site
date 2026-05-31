(function () {
  /** 在页脚显示当前年份 */
  function setCurrentYear() {
    var yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  /** 初始化移动端菜单的展开/收起与点击链接后关闭 */
  function initMobileNav() {
    var toggle = document.querySelector(".menu-toggle");
    var mobileNav = document.getElementById("mobile-nav");
    if (!toggle || !mobileNav) {
      return;
    }

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      if (open) {
        mobileNav.setAttribute("hidden", "");
      } else {
        mobileNav.removeAttribute("hidden");
      }
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.setAttribute("hidden", "");
      });
    });
  }

  /** 页内锚点平滑滚动 */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (event) {
        var id = anchor.getAttribute("href");
        if (!id || id === "#") {
          return;
        }
        var target = document.querySelector(id);
        if (!target) {
          return;
        }
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", id);
      });
    });
  }

  /** 滚动时顶栏加深阴影 */
  function initHeaderScroll() {
    var header = document.getElementById("site-header");
    if (!header) {
      return;
    }
    function onScroll() {
      if (window.scrollY > 24) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /** 当前区块对应导航高亮 */
  function initNavHighlight() {
    var sections = document.querySelectorAll("main section[id]");
    var navLinks = document.querySelectorAll('.nav a[href^="#"], .mobile-nav a[href^="#"]');
    if (!sections.length || !navLinks.length) {
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            var href = link.getAttribute("href");
            if (href === "#" + id || (id === "top" && href === "#top")) {
              link.classList.add("is-active");
            } else {
              link.classList.remove("is-active");
            }
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /** 复制微信号 */
  function showToast(message) {
    var toast = document.getElementById("toast");
    if (!toast) {
      return;
    }
    toast.textContent = message;
    toast.removeAttribute("hidden");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      toast.setAttribute("hidden", "");
    }, 2200);
  }

  function initCopyWechat() {
    var btn = document.getElementById("copy-wechat");
    var targetId = btn && btn.getAttribute("data-copy-target");
    var target = targetId && document.getElementById(targetId);
    if (!btn || !target) {
      return;
    }

    btn.addEventListener("click", function () {
      var text = target.textContent.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          showToast("微信号已复制");
        }).catch(function () {
          showToast("复制失败，请手动复制");
        });
      } else {
        showToast("请手动复制：" + text);
      }
    });
  }

  /** 为区块元素添加滚动进入视口时的渐显动画 */
  function initScrollReveal() {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      document.querySelectorAll(".section-head, .card, .timeline-item").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var sections = document.querySelectorAll(".section-head, .card, .timeline-item");
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    sections.forEach(function (el) {
      el.classList.add("reveal");
      obs.observe(el);
    });
  }

  setCurrentYear();
  initMobileNav();
  initSmoothScroll();
  initHeaderScroll();
  initNavHighlight();
  initCopyWechat();
  initScrollReveal();
})();
