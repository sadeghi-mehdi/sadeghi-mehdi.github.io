/**
 * Academic personal site — loads content from data/*.json
 * Edit JSON files to update the site; no build step required.
 */

(function () {
  "use strict";

  const DATA_BASE = "data/";

  const LINK_LABELS = {
    pdf: "PDF",
    doi: "DOI",
    code: "Code",
    project: "Project",
    repo: "Repository",
    demo: "Demo",
    docs: "Docs",
    download: "Download",
  };

  /**
   * @param {string} path
   * @returns {Promise<unknown>}
   */
  async function fetchJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    return response.json();
  }

  /**
   * @param {string} tag
   * @param {string} [className]
   * @param {string} [text]
   * @returns {HTMLElement}
   */
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /**
   * @param {HTMLElement} container
   * @param {string} message
   */
  function showError(container, message) {
    container.innerHTML = "";
    container.appendChild(el("p", "error-message", message));
  }

  /**
   * @param {Record<string, string>} links
   * @returns {HTMLElement}
   */
  function buildActionButtons(links) {
    const actions = el("div", "card-actions");
    if (!links) return actions;

    Object.keys(LINK_LABELS).forEach(function (key) {
      const url = (links[key] || "").trim();
      if (!url) return;

      const label = LINK_LABELS[key];
      const anchor = document.createElement("a");
      anchor.className = "btn";
      anchor.href = url;
      anchor.textContent = label;

      if (url.endsWith(".pdf") || key === "pdf" || key === "download") {
        anchor.setAttribute("download", "");
      }
      if (url.startsWith("http")) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      }

      actions.appendChild(anchor);
    });

    return actions;
  }

  /**
   * @param {object} item
   * @returns {HTMLElement}
   */
  function buildPublicationCard(item) {
    const card = el("article", "card");
    card.appendChild(el("h3", null, item.title || "Untitled"));

    if (item.abstract && item.abstract.trim()) {
      card.appendChild(el("p", "card-abstract", item.abstract));
    }

    const meta = el("p", "card-meta");
    if (item.authors) {
      const authors = el("span", "card-authors", item.authors);
      meta.appendChild(authors);
      meta.appendChild(document.createTextNode(" — "));
    }
    const venueParts = [item.venue, item.year].filter(Boolean);
    meta.appendChild(document.createTextNode(venueParts.join(", ")));
    card.appendChild(meta);
    
    card.appendChild(buildActionButtons(item.links));
    
    return card;
  }

  /**
   * @param {object} item
   * @returns {HTMLElement}
   */
  function buildSoftwareCard(item) {
    const card = el("article", "card");
    card.appendChild(el("h3", null, item.name || "Untitled"));

    if (item.description) {
      card.appendChild(el("p", "card-abstract", item.description));
    }

    if (item.tags && item.tags.length) {
      const tagList = el("ul", "card-tags");
      item.tags.forEach(function (tag) {
        tagList.appendChild(el("li", null, tag));
      });
      card.appendChild(tagList);
    }

    card.appendChild(buildActionButtons(item.links));
    return card;
  }

  /**
   * @param {HTMLElement} container
   * @param {object[]} items
   * @param {function} builder
   * @param {string} emptyMessage
   */
  function renderCardList(container, items, builder, emptyMessage) {
    container.innerHTML = "";
    if (!items || !items.length) {
      container.appendChild(el("p", "loading-message", emptyMessage));
      return;
    }
    items.forEach(function (item) {
      container.appendChild(builder(item));
    });
  }

  /**
   * @param {object} site
   */
  function renderSite(site) {
    document.title = site.name + " — Homepage";

    const brand = document.querySelector("[data-brand-name]");
    if (brand) brand.textContent = site.name;

    const footerName = document.querySelector("[data-footer-name]");
    if (footerName) footerName.textContent = site.name;

    const heroName = document.querySelector("[data-hero-name]");
    if (heroName) heroName.textContent = site.name;

    const heroTitle = document.querySelector("[data-hero-title]");
    if (heroTitle) heroTitle.textContent = site.title || "";

    const heroAffiliation = document.querySelector("[data-hero-affiliation]");
    if (heroAffiliation) {
      heroAffiliation.textContent = site.affiliation || "";
      heroAffiliation.hidden = !site.affiliation;
    }

    const heroTagline = document.querySelector("[data-hero-tagline]");
    if (heroTagline) heroTagline.textContent = site.tagline || "";

    const heroImage = document.querySelector("[data-hero-image]");
    if (heroImage && site.profileImage) {
      heroImage.src = site.profileImage;
      heroImage.alt = "Portrait of " + site.name;
    }

    const about = document.querySelector("[data-about-content]");
    if (about) {
      about.innerHTML = "";
      const paragraphs = site.bio || [];
      if (!paragraphs.length) {
        about.appendChild(el("p", null, "Add your bio in data/site.json."));
      } else {
        paragraphs.forEach(function (text) {
          about.appendChild(el("p", null, text));
        });
      }
    }

    const interests = document.querySelector("[data-research-interests]");
    if (interests) {
      interests.innerHTML = "";
      const list = site.researchInterests || [];
      if (!list.length) {
        interests.appendChild(el("li", null, "Add interests in data/site.json."));
      } else {
        list.forEach(function (interest) {
          interests.appendChild(el("li", null, interest));
        });
      }
    }

    const cvLink = document.querySelector("[data-cv-link]");
    const cvNote = document.querySelector("[data-cv-note]");
    if (cvLink && site.cv) {
      cvLink.href = site.cv;
      const isPdf = /\.pdf$/i.test(site.cv);
      cvLink.textContent = isPdf ? "Download CV (PDF)" : "View CV information";
      if (!isPdf) cvLink.removeAttribute("download");
      if (cvNote) cvNote.classList.toggle("is-hidden", isPdf);
    }

    const contact = document.querySelector("[data-contact]");
    if (contact && site.contact) {
      contact.innerHTML = "";
      const entries = [
        { key: "email", label: "Email", href: "mailto:" + site.contact.email, text: site.contact.email },
        { key: "orcid", label: "ORCID", href: site.contact.orcid, text: "ORCID profile" },
        { key: "scholar", label: "Google Scholar", href: site.contact.scholar, text: "Google Scholar" },
        { key: "github", label: "GitHub", href: site.contact.github, text: "GitHub" },
        { key: "linkedin", label: "LinkedIn", href: site.contact.linkedin, text: "LinkedIn" },
      ];

      let added = false;
      entries.forEach(function (entry) {
        const value = site.contact[entry.key];
        if (!value || !String(value).trim()) return;

        const li = el("li");
        li.appendChild(el("span", "contact-label", entry.label));

        const link = document.createElement("a");
        link.href = entry.key === "email" ? "mailto:" + value : value;
        link.textContent = entry.key === "email" ? value : entry.text;
        if (entry.key !== "email") {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        li.appendChild(link);
        contact.appendChild(li);
        added = true;
      });

      if (!added) {
        contact.appendChild(el("li", null, "Add contact links in data/site.json."));
      }
    }
  }

  /**
   * @param {object} gallery
   */
  function renderGallery(gallery) {
    const container = document.querySelector("[data-gallery]");
    if (!container) return;

    container.innerHTML = "";
    const images = (gallery && gallery.images) || [];

    if (!images.length) {
      container.appendChild(el("p", "loading-message", "No gallery images yet."));
      return;
    }

    images.forEach(function (image) {
      const figure = el("figure", "gallery-item");
      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.alt || "";
      img.loading = "lazy";
      figure.appendChild(img);

      if (image.caption) {
        figure.appendChild(el("figcaption", null, image.caption));
      }

      container.appendChild(figure);
    });
  }

  function initNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;

    function closeMenu() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }

    function openMenu() {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
    }

    toggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  function initFooterYear() {
    const yearEl = document.querySelector("[data-footer-year]");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  async function init() {
    initNavigation();
    initFooterYear();

    try {
      const site = await fetchJSON(DATA_BASE + "site.json");
      renderSite(site);
    } catch (err) {
      const about = document.querySelector("[data-about-content]");
      if (about) showError(about, "Could not load profile data. Check data/site.json.");
      console.error(err);
    }

    const listLoads = [
      {
        url: DATA_BASE + "publications.json",
        selector: "[data-publications]",
        builder: buildPublicationCard,
        empty: "No publications listed yet.",
        key: "items",
      },
      {
        url: DATA_BASE + "reports.json",
        selector: "[data-reports]",
        builder: buildPublicationCard,
        empty: "No reports listed yet.",
        key: "items",
      },
      {
        url: DATA_BASE + "software.json",
        selector: "[data-software]",
        builder: buildSoftwareCard,
        empty: "No software listed yet.",
        key: "items",
      },
    ];

    await Promise.all(
      listLoads.map(async function (config) {
        const container = document.querySelector(config.selector);
        if (!container) return;

        try {
          const data = await fetchJSON(config.url);
          renderCardList(container, data[config.key], config.builder, config.empty);
        } catch (err) {
          showError(container, "Content could not be loaded. Check " + config.url + ".");
          console.error(err);
        }
      })
    );

    try {
      const gallery = await fetchJSON(DATA_BASE + "gallery.json");
      renderGallery(gallery);
    } catch (err) {
      const gallery = document.querySelector("[data-gallery]");
      if (gallery) showError(gallery, "Gallery could not be loaded. Check data/gallery.json.");
      console.error(err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
