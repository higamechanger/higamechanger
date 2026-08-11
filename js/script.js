/* GameChanger — interactions & motion */

(function () {
  const doc = document.documentElement;
  const body = document.body;
  const nav = document.getElementById("site-nav");
  const progress = document.getElementById("scroll-progress");
  const cursor = document.getElementById("gc-cursor");
  const toggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  const heroBg = document.getElementById("hero-bg");
  const spineLetters = document.querySelectorAll("[data-spine-letter]");
  const reveals = document.querySelectorAll("[data-reveal]");
  const revealItems = document.querySelectorAll("[data-reveal-item]");
  const mediaReveals = document.querySelectorAll("[data-media-reveal]");
  const magneticEls = document.querySelectorAll("[data-magnetic]");
  const countEls = document.querySelectorAll("[data-count]");
  const sectionSpies = document.querySelectorAll("[data-spy]");
  const portrait = document.querySelector(".about-portrait img");

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const navOffset = 88;

  let scrollY = window.scrollY || 0;
  let ticking = false;

  body.classList.add("is-ready");

  if (canHover && cursor && !reduceMotion) {
    body.classList.add("has-custom-cursor");
  }

  document.addEventListener("click", function (e) {
    const link = e.target.closest && e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
    if (navLinks && navLinks.classList.contains("is-open")) {
      closeMenu();
    }
  });

  if (canHover && cursor && !reduceMotion) {
    const mouse = { x: -100, y: -100 };
    const cur = { x: -100, y: -100 };

    window.addEventListener(
      "mousemove",
      function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      },
      { passive: true }
    );

    document.addEventListener("mouseover", function (e) {
      const hot = e.target.closest && e.target.closest("a, button, .cta-btn, .article-card, .include-card, .phase-row");
      cursor.classList.toggle("is-hover", !!hot);
      cursor.classList.toggle("is-view", !!(hot && hot.classList && hot.classList.contains("article-card")));
    });

    magneticEls.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        const rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = "translate3d(" + dx * 0.1 + "px," + dy * 0.12 + "px,0)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
      });
    });

    (function loopCursor() {
      cur.x += (mouse.x - cur.x) * 0.18;
      cur.y += (mouse.y - cur.y) * 0.18;
      cursor.style.transform =
        "translate3d(" + cur.x + "px," + cur.y + "px,0) translate(-50%,-50%)";
      requestAnimationFrame(loopCursor);
    })();
  }

  function updateScroll() {
    const y = scrollY;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const pct = Math.min(100, (y / max) * 100);

    if (nav && nav.classList.contains("site-nav--fixed")) {
      nav.classList.toggle("is-scrolled", y > 40);
    }

    if (progress) {
      progress.style.width = pct + "%";
    }

    if (heroBg && !reduceMotion) {
      heroBg.style.transform = "translate3d(0," + y * 0.12 + "px,0)";
    }

    if (portrait && !reduceMotion) {
      const rect = portrait.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const mid = rect.top + rect.height / 2 - window.innerHeight / 2;
        portrait.style.transform = "translate3d(0," + mid * -0.04 + "px,0) scale(1.03)";
      }
    }

    if (spineLetters.length && !reduceMotion) {
      if (body.classList.contains("spine-live")) {
        spineLetters.forEach(function (el, i) {
          const p = Math.max(0, Math.min(1, (y - i * 18) / 200));
          const ease = p * p * (3 - 2 * p);
          el.style.opacity = String(1 - ease * 0.92);
          el.style.transform = "translate3d(0," + ease * 32 + "px,0)";
        });
      }
    }

    if (sectionSpies.length && navLinks) {
      let current = "";
      sectionSpies.forEach(function (sec) {
        const top = sec.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.35) {
          current = sec.id;
        }
      });
      navLinks.querySelectorAll(".nav-link[href^='#']").forEach(function (link) {
        const href = link.getAttribute("href").slice(1);
        link.classList.toggle("is-active", href === current);
      });
    }

    ticking = false;
  }

  function onScroll() {
    scrollY = window.scrollY || window.pageYOffset;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateScroll);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  updateScroll();

  if (spineLetters.length && !reduceMotion) {
    setTimeout(function () {
      body.classList.add("spine-live");
      spineLetters.forEach(function (el) {
        el.style.animation = "none";
        el.style.opacity = "1";
        el.style.transform = "translate3d(0,0,0)";
      });
      onScroll();
    }, 1400);
  } else if (spineLetters.length) {
    body.classList.add("spine-live");
  }

  function closeMenu() {
    if (!navLinks || !nav || !toggle) return;
    navLinks.classList.remove("is-open");
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  }

  if (toggle && navLinks && nav) {
    toggle.addEventListener("click", function () {
      const open = !navLinks.classList.contains("is-open");
      navLinks.classList.toggle("is-open", open);
      nav.classList.toggle("is-open", open);
      body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (!link.getAttribute("href") || link.getAttribute("href").charAt(0) !== "#") {
          closeMenu();
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  function revealEl(el) {
    el.classList.add("is-visible");
  }

  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          revealEl(entry.target);

          const kids = entry.target.querySelectorAll("[data-reveal-child]");
          kids.forEach(function (kid, i) {
            kid.style.transitionDelay = 0.08 + i * 0.08 + "s";
            kid.classList.add("is-visible");
          });

          entry.target.querySelectorAll("[data-media-reveal]").forEach(function (media) {
            media.classList.add("is-revealed");
          });

          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -12% 0px" }
    );

    reveals.forEach(function (el) {
      io.observe(el);
    });

    const itemIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = el.getAttribute("data-delay");
          if (delay) el.style.transitionDelay = delay;
          revealEl(el);
          itemIo.unobserve(el);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -12% 0px" }
    );

    revealItems.forEach(function (el) {
      itemIo.observe(el);
    });

    const mediaIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          mediaIo.unobserve(entry.target);
        });
      },
      { threshold: 0.18 }
    );

    mediaReveals.forEach(function (el) {
      mediaIo.observe(el);
    });
  } else {
    reveals.forEach(revealEl);
    revealItems.forEach(revealEl);
    mediaReveals.forEach(function (el) {
      el.classList.add("is-revealed");
    });
    document.querySelectorAll("[data-reveal-child]").forEach(revealEl);
  }

  function animateCount(el, delay) {
    const raw = el.getAttribute("data-count") || "0";
    const prefix = el.getAttribute("data-prefix") || "";
    const suffix = el.getAttribute("data-suffix") || "";
    const target = parseFloat(raw);
    if (isNaN(target)) {
      el.textContent = prefix + raw + suffix;
      return;
    }

    el.textContent = prefix + (String(raw).indexOf(".") !== -1 ? "0.0" : "0") + suffix;

    function run() {
      if (reduceMotion) {
        el.textContent = prefix + raw + suffix;
        return;
      }
      const isFloat = String(raw).indexOf(".") !== -1;
      const duration = 1400;
      const start = performance.now();

      function frame(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = target * eased;
        el.textContent =
          prefix + (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
        if (t < 1) requestAnimationFrame(frame);
        else el.textContent = prefix + raw + suffix;
      }

      requestAnimationFrame(frame);
    }

    if (delay) {
      setTimeout(run, delay);
    } else {
      run();
    }
  }

  function startCounts(root) {
    const els = root
      ? root.querySelectorAll("[data-count]")
      : countEls;
    els.forEach(function (el, i) {
      if (el.dataset.counted) return;
      el.dataset.counted = "1";
      animateCount(el, 120 + i * 140);
    });
  }

  if (countEls.length) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      const statsBlocks = document.querySelectorAll(".about-stats");
      const countIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            startCounts(entry.target);
            countIo.unobserve(entry.target);
          });
        },
        { threshold: 0.35, rootMargin: "0px 0px -8% 0px" }
      );

      if (statsBlocks.length) {
        statsBlocks.forEach(function (block) {
          countIo.observe(block);
        });
      } else {
        countEls.forEach(function (el) {
          countIo.observe(el);
        });
      }
    } else {
      startCounts(null);
    }
  }
})();

/* Article page renderer */
(function () {
  const root = document.getElementById("article-root");
  if (!root) return;

  const articles = {
    positioning: {
      tag: "Positioning",
      readTime: "6 min read",
      src: "images/assets/positioning-article.jpg?v=27",
      title: "Nobody Actually Wants Followers.",
      paragraphs: [
        "They want what followers are supposed to create — opportunity, not applause.",
        "Most executives chase visibility because it's measurable. A follower count, an impression, a like. But visibility without positioning is just noise with an audience.",
        "The leaders who actually move — into boardrooms, onto stages, into rooms they weren't invited to before — didn't get there by being seen the most. They got there by being the clearest.",
        "Clarity is what turns an audience into opportunity. It's the difference between being known and being chosen."
      ]
    },
    presence: {
      tag: "Presence",
      readTime: "5 min read",
      src: "images/assets/presence-article.jpg?v=27",
      title: "The Difference Ladder.",
      paragraphs: [
        'Nobody follows "experienced." They follow a point of view.',
        "Experience is table stakes at the level most executives operate. It's assumed, not differentiating. What separates the leaders who compound influence from the ones who plateau is a specific, ownable point of view — one only they could hold.",
        "Building that point of view isn't about saying something new. It's about saying the thing only your experience allows you to say, and saying it consistently enough that it becomes yours."
      ]
    },
    influence: {
      tag: "Influence",
      readTime: "7 min read",
      src: "images/assets/influence-article.jpg?v=29",
      title: "Build What Only You Can Own.",
      paragraphs: [
        "The rarest leadership skill isn't vision. It's movement.",
        "Plenty of executives can articulate where their industry is headed. Few can build the platform that gets them there first, and fewer still can make that platform unmistakably theirs.",
        "Ownership is what makes a brand compound instead of expire. Borrowed positioning erodes the moment someone else copies it. Ownable positioning gets stronger the more it's repeated — because it was never available to anyone else in the first place."
      ]
    },
    discipline: {
      tag: "Discipline",
      readTime: "5 min read",
      src: "images/assets/discipline-article.jpg?v=28",
      title: "The Off-Season Is Where Brands Are Won.",
      paragraphs: [
        "The work nobody sees is the work that compounds.",
        "Every executive brand that looks effortless in public was built somewhere private — in the reps nobody applauded, the drafts nobody read, the positioning work done long before there was an audience.",
        "Discipline isn't a personality trait here. It's a system: the unglamorous, repeatable work of showing up in the same voice, on the same territory, long enough for it to become recognizable.",
        "There is no shortcut to that recognition. There is only the off-season, done well."
      ]
    },
    perception: {
      tag: "Presence",
      readTime: "5 min read",
      src: "images/assets/perception-article.jpg?v=28",
      title: "Stop Managing Perception. Start Owning It.",
      paragraphs: [
        "Reactive leaders manage their image. Category leaders define it.",
        "Perception management is a defensive posture — reacting to how you're seen, correcting the record, hoping the narrative settles somewhere flattering. It's exhausting, and it never compounds.",
        "Ownership is the opposite. It means deciding, in advance, what you stand for — then building every piece of your presence, from your bio to your platform, to reinforce that one thing.",
        "The leaders who feel most in control of their reputation aren't the ones managing it hardest. They're the ones who defined it first."
      ]
    },
    scale: {
      tag: "Scale",
      readTime: "6 min read",
      src: "images/assets/scale-article.jpg?v=28",
      title: "The Platforms That Compound.",
      paragraphs: [
        "One system, applied consistently, beats ten tactics applied once.",
        "Most brand-building advice is a list of tactics: post here, network there, speak at this event. Tactics generate a spike. They rarely generate scale.",
        "Scale comes from platforms — the repeatable structures that keep producing visibility and opportunity long after the initial effort. A content system. A speaking platform. A signature body of work.",
        "Build the platform once, run it consistently, and influence compounds on its own schedule."
      ]
    }
  };

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("a") || "positioning";
  const article = articles[slug] || articles.positioning;

  document.title = article.title + " — GameChanger Review";

  const img = root.querySelector("[data-article-img]");
  const tag = root.querySelector("[data-article-tag]");
  const read = root.querySelector("[data-article-read]");
  const title = root.querySelector("[data-article-title]");
  const body = root.querySelector("[data-article-body]");

  if (img) {
    img.src = article.src;
    img.alt = article.title;
  }
  if (tag) tag.textContent = article.tag;
  if (read) read.textContent = "· " + article.readTime;
  if (title) title.textContent = article.title;
  if (body) {
    body.innerHTML = article.paragraphs
      .map(function (p) {
        return "<p>" + p + "</p>";
      })
      .join("");
  }
})();
