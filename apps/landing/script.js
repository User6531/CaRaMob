const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const showcaseTabs = Array.from(document.querySelectorAll("[data-showcase-tab]"));
const showcasePanels = Array.from(document.querySelectorAll("[data-showcase-panel]"));

showcaseTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.showcaseTab;

    showcaseTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    showcasePanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.showcasePanel === target);
    });
  });
});

document.querySelectorAll("[data-showcase-thumb]").forEach((thumb) => {
  thumb.addEventListener("click", () => {
    const panel = thumb.closest("[data-showcase-panel]");
    const mainButton = panel?.querySelector("[data-showcase-main]");
    const mainImage = mainButton?.querySelector(".device-frame img");
    const thumbImage = thumb.querySelector("img");

    if (!mainImage || !thumbImage) {
      return;
    }

    mainImage.src = thumbImage.currentSrc || thumbImage.src;
    mainImage.alt = thumbImage.alt || mainImage.alt;

    panel.querySelectorAll("[data-showcase-thumb]").forEach((item) => {
      item.classList.toggle("is-active", item === thumb);
    });
  });
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox?.querySelector(".lightbox-image");
const lightboxCaption = lightbox?.querySelector(".lightbox-caption");
const lightboxCounter = lightbox?.querySelector(".lightbox-counter");
const lightboxItems = Array.from(document.querySelectorAll("[data-lightbox-index]")).map(
  (trigger) => {
    const image = trigger.querySelector("img");
    const panel = trigger.closest("[data-showcase-panel]");
    const caption =
      panel?.querySelector("[data-showcase-main]")?.dataset.caption ||
      image?.alt ||
      "";

    return {
      src: image?.currentSrc || image?.src || "",
      alt: image?.alt || "",
      caption,
    };
  }
);

let lightboxIndex = 0;
let lastFocusedElement = null;

function renderLightboxItem(index) {
  if (!lightboxItems.length || !lightboxImage || !lightboxCaption || !lightboxCounter) {
    return;
  }

  const normalizedIndex = (index + lightboxItems.length) % lightboxItems.length;
  const item = lightboxItems[normalizedIndex];

  lightboxIndex = normalizedIndex;
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  lightboxCaption.textContent = item.caption;
  lightboxCounter.textContent = `${normalizedIndex + 1} / ${lightboxItems.length}`;
}

function openLightbox(index) {
  if (!lightbox || !lightboxItems.length) {
    return;
  }

  lastFocusedElement = document.activeElement;
  renderLightboxItem(index);

  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  lightbox.querySelector(".lightbox-close")?.focus();
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  lightboxImage.removeAttribute("src");
  lastFocusedElement?.focus();
}

function showNextLightboxItem(step) {
  renderLightboxItem(lightboxIndex + step);
}

document.querySelectorAll("[data-lightbox-open]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const panel = trigger.closest("[data-showcase-panel]");
    const activeThumb = panel?.querySelector("[data-showcase-thumb].is-active");
    const index = Number(activeThumb?.dataset.lightboxIndex ?? 0);
    openLightbox(index);
  });
});

lightbox?.querySelectorAll("[data-lightbox-close]").forEach((button) => {
  button.addEventListener("click", closeLightbox);
});

lightbox
  ?.querySelector("[data-lightbox-prev]")
  ?.addEventListener("click", () => showNextLightboxItem(-1));

lightbox
  ?.querySelector("[data-lightbox-next]")
  ?.addEventListener("click", () => showNextLightboxItem(1));

document.addEventListener("keydown", (event) => {
  if (!lightbox || lightbox.hidden) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    showNextLightboxItem(-1);
  }

  if (event.key === "ArrowRight") {
    showNextLightboxItem(1);
  }
});
