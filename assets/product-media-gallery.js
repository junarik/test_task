// @ts-nocheck

var swiperInstance;

function checkArrowsVisibility() {
  const variantSelector = document.querySelector('form[action="/cart/add"] [name="id"]');
  if (!variantSelector) return;

  const currentVariantId = variantSelector.value;
  const images = variantImages[currentVariantId] || [];
  const imageCount = images.length;

  let slidesPerView;
  const screenWidth = window.innerWidth;

  if (screenWidth >= 1024) {
    slidesPerView = window.productMediaGallerySettings.slidesPerViewDesktop || 1;
  } else if (screenWidth >= 768) {
    slidesPerView = window.productMediaGallerySettings.slidesPerViewTablet || 1;
  } else {
    slidesPerView = window.productMediaGallerySettings.slidesPerViewMobile || 1;
  }

  const navNext = document.querySelector('.swiper-button-next');
  const navPrev = document.querySelector('.swiper-button-prev');
  if (!navNext || !navPrev) return;

  if (imageCount <= slidesPerView) {
    navNext.classList.add('swiper-button-hidden');
    navPrev.classList.add('swiper-button-hidden');
  } else {
    navNext.classList.remove('swiper-button-hidden');
    navPrev.classList.remove('swiper-button-hidden');
  }
}

function initializeSwiper() {
  if (swiperInstance) {
    swiperInstance.destroy(true, true);
  }

  swiperInstance = new Swiper('.product-swiper', {
    slidesPerView: window.productMediaGallerySettings.slidesPerViewMobile || 1,
    spaceBetween: window.productMediaGallerySettings.slideGap || 10,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      type: 'fraction',
      enabled: window.productMediaGallerySettings.paginationEnabled || true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      768: {
        slidesPerView: window.productMediaGallerySettings.slidesPerViewTablet || 1,
      },
      1024: {
        slidesPerView: window.productMediaGallerySettings.slidesPerViewDesktop || 1,
      },
    },
  });
}

function updateGallery(variantId) {
  var images = variantImages[variantId] || [];
  var wrapper = document.querySelector('.swiper-wrapper');

  if (!wrapper) {
    console.error('Swiper wrapper not found');
    return;
  }

  wrapper.innerHTML = '';

  if (images.length) {
    images.forEach(function (url) {
      var slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML =
        '<img src="' +
        url +
        '" style="height:600px; width:100%; object-fit:cover;" loading="lazy" alt="Product image">';
      wrapper.appendChild(slide);
    });
  } else {
    var slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML =
      '<div style="height:600px; display:flex; align-items:center; justify-content:center; background:#f5f5f5;">No images available for variant ' +
      variantId +
      '</div>';
    wrapper.appendChild(slide);
  }

  if (swiperInstance) {
    swiperInstance.update();
    swiperInstance.slideTo(0);
  }

  checkArrowsVisibility();
}

document.addEventListener('DOMContentLoaded', function () {
  initializeSwiper();

  const mainVariantInput = document.querySelector('form[action="/cart/add"] [name="id"]');

  if (mainVariantInput) {
    updateGallery(mainVariantInput.value);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
          const newVariantId = mutation.target.value;
          console.log('Variant changed:', newVariantId);
          updateGallery(newVariantId);
        }
      });
    });

    observer.observe(mainVariantInput, {
      attributes: true,
    });
  } else {
    console.error('Main variant selector not found.');
    updateGallery(selectedVariantId);
  }

  window.addEventListener('resize', checkArrowsVisibility);
});