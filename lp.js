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
        version: appConfigs.abTestingVersion,
      });
    }
  }
};

function handler(){
  console.log('AppJS Loaded!!',{
    abVersion: appConfigs.abTestingVersion,
  })
  const isVersionA = appConfigs.abTestingVersion === 0;
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
        content_type: item.replaceAll('-', '_'),
        item_id: 'main_navigation',
      });
    });
  });
  

  // Start Trial, Try it now, Start free trial button
  const buttonList = ['start-trial','try-it-now','start-free-trial'];
  buttonList.forEach((item) => {
    const button = getEl(item + '-button');
    button.addEventListener('click', (event) => {
      event.preventDefault();
    const sku = button.getAttribute('href')[button.getAttribute('href').length-1];
    if(isVersionA) {
        window.scrollTo({
          top: pricingSection.offsetTop - headerHeight,
          behavior: 'smooth'
        });
    } else {
      window.location.href = '/cart/?sku=' + sku + '&version=' + appConfigs.version;
    }
      tracking('select_content', {
        content_type: 'start_trial',
        item_id: item.replaceAll('-', '_'),
      });
    });
  });

  // SKU button
  const skuButton = getEl('sku-item');
  skuButton.addEventListener('click', (event) => {
    event.preventDefault();
    const data = skuButton.getAttribute('href');
    const sku = data.match(/sku\/=(.*?)&/)[1];
    const price = data.match(/price=(\d+(\.\d+)?)/)[1];
    const type = data.match(/type=(\w.+)/)[1];
    window.location.href = '/cart/?sku=' + sku + '&version=' + appConfigs.version;
    tracking('add_to_cart', {
      currency: 'USD',
      value: price || 0,
      items: [
        {
          item_id: sku,
          item_name: type,
        },
      ],
    });
  });
  
  // Contact us button
  const contactUsButton = getEl('contact-us-button');
  contactUsButton.addEventListener('click', (event) => {
    tracking('select_content', {
      content_type: 'contact_us',
      item_id: 'contact_us_cta',
    });
  });
}

handler();
