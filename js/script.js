/* GameChanger site interactions */

(function () {
  const doc = document.documentElement;
  const nav = document.getElementById("site-nav");
  const progress = document.getElementById("scroll-progress");
  const cursor = document.getElementById("gc-cursor");
  const toggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  const heroBg = document.getElementById("hero-bg");
  const spineLetters = document.querySelectorAll("[data-spine-letter]");
  const reveals = document.querySelectorAll("[data-reveal]");

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canHover && cursor) {
    document.body.classList.add("has-custom-cursor");
  }

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const pct = Math.min(100, (y / max) * 100);

    if (nav && nav.classList.contains("site-nav--fixed")) {
      nav.classList.toggle("is-scrolled", y > 60);
    }

    if (progress) {
      progress.style.width = pct + "%";
    }

    if (heroBg && !reduceMotion) {
      heroBg.style.transform = "translateY(" + y * 0.25 + "px)";
    }

    if (spineLetters.length && !reduceMotion) {
      spineLetters.forEach(function (el, i) {
        const progressLetter = Math.max(0, Math.min(1, (y - i * 22) / 220));
        el.style.opacity = String(1 - progressLetter);
        el.style.transform = "translateY(" + progressLetter * 26 + "px)";
      });
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (canHover && cursor) {
    window.addEventListener(
      "mousemove",
      function (e) {
        cursor.style.transform =
          "translate3d(" + e.clientX + "px," + e.clientY + "px,0) translate(-50%,-50%)";
      },
      { passive: true }
    );

    document.addEventListener("mouseover", function (e) {
      const hot = e.target.closest && e.target.closest("a, button");
      cursor.classList.toggle("is-hover", !!hot);
    });
  }

  if (toggle && navLinks && nav) {
    toggle.addEventListener("click", function () {
      const open = !navLinks.classList.contains("is-open");
      navLinks.classList.toggle("is-open", open);
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
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
      src: "images/assets/positioning-article.jpg",
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
      src: "images/assets/presence-article.jpg",
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
      src: "images/assets/influence-article.jpg",
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
      src: "images/assets/discipline-article.png",
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
      src: "images/assets/perception-article.png",
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
      src: "images/assets/scale-article.png",
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
