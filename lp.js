"use strict";

const colors = {
  white: '#ffffff',
  primary: '#00A0E3',
  warning: '#ffc400'
}

const getEl = (id) => {
  const element = document.querySelector('.js-' + id);
  if (!element) {
    throw new Error('Element not found: ' + id);
  }
  return element;
};

const tracking = (event, data) => {
  if (window.gtag) {
    {
      window.gtag('event', event, {
        ...data,
        version: configs.version,
      });
    }
  }
};

function handler(){
  console.log('AppJS Loaded!!')
  // Quick navigation
  const header = getEl('header');
  header.style = ' position: sticky; top: 0;'
  const headerHeight = header.clientHeight;
  const navigationList = ['how-it-works','benefits','pricing'];
  const pricingSection =  getEl('section-pricing');
  navigationList.forEach((item) => {
    const navigationItem = getEl('navigation-item-' + item);
    navigationItem.style = `border-bottom: 2px solid transparent; padding-bottom: 4px;`;
    const section = getEl('section-' + item);
    navigationItem.addEventListener('click', () => {
      navigationItem.style.setProperty('border-color', `${colors.warning}`);
      navigationItem.style.setProperty('color', `${colors.warning}`);
      navigationList.filter((i) => i !== item).forEach((i) => {
        const anotherItem = getEl('navigation-item-' + i);
        anotherItem.style.setProperty('border-color', 'transparent');
        anotherItem.style.setProperty('color', `${colors.white}`);
      });
      window.scrollTo({
        top: section.offsetTop - headerHeight,
        behavior: 'smooth'
      });
      tracking('select_content', {
        content_type: item.replace('-', '_'),
        item_id: 'main_navigation',
      });
    });
  });
}

handler();

