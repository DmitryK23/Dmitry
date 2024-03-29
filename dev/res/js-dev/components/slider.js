import * as swiper from 'patterns/tx-slider';

function who() {
  return document.querySelector('.js-slider');
}

export default function slider() {
  let container;
  let parent;
  let slides;
  let dots;
  let gallery;
  let pagination;
  let dotsList;
  let body;
  let timeout;

  function findElements() {
    container = document.querySelector('.js-slider');
    parent = container.parentElement;
    slides = [].slice.call(container.querySelectorAll('.heroSlide'));
    body = document.body;
  }

  function initSlider() {
    dots = swiper.dots(slides.length, 'js-sliderDots heroPagination', 'js-sliderDot heroDot');
    gallery = swiper.init(container, dots, 'js-sliderDot');
    parent.appendChild(dots);
    pagination = parent.querySelector('.js-sliderDots');
    dotsList = [].slice.call(parent.querySelectorAll('.js-sliderDot'));
    gallery.slide(0);
    body.classList.add('withoutScroll');
  }

  function findDot(target) {
    const index = dotsList.indexOf(target);
    if (index >= 0) gallery.slide(index);
  }

  function onDot(event) {
    const { target } = event;
    findDot(target);
  }

  function selectWay(way) {
    if (way && gallery.current() !== 2) {
      timeout = setTimeout(() => document.addEventListener('wheel', onWheel, false), 800);
      gallery.next();
    } else if (way && gallery.current() === 2) {
      window.scrollTo({
          top: window.innerHeight,
          behavior: "smooth"
      });
      body.classList.remove('withoutScroll');
      clearTimeout(timeout);
      document.removeEventListener('wheel', onWheel, false);
      document.removeEventListener('keydown', onKey);
    } else {
      gallery.prev();
      timeout = setTimeout(() => document.addEventListener('wheel', onWheel, false), 800);
    }
  }

  function onKey(event) {
    event.preventDefault();
    const { keyCode } = event;
    if (keyCode === 40) selectWay(keyCode);
    else if (keyCode === 38) selectWay(false);
  }

  function unsubscribeWheel() {
    document.removeEventListener('wheel', onWheel, false);
  }

  function onWheel(event) {
    unsubscribeWheel();
    event.preventDefault();
    const { deltaY } = event;
    selectWay(deltaY > 0);
  }

  function resetEvents() {
    document.addEventListener('keydown', onKey);
    document.addEventListener('wheel', onWheel, false);
    body.classList.add('withoutScroll');
  }

  function onScroll(event) {
    if (window.pageYOffset === 0) resetEvents();
  }

  function subscribe() {
    pagination.addEventListener('click', onDot);
    pagination.addEventListener('touchstart', onDot);
    document.addEventListener('keydown', onKey);
    document.addEventListener('wheel', onWheel, false);
    document.addEventListener('scroll', onScroll);
  }

  function init() {
    if (who()) {
      findElements();
      initSlider();
      subscribe();
    }
  }

  init();
}