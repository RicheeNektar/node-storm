const fetch = require('node-fetch');
const { parse } = require('node-html-parser');

module.exports = () => fetch('https://metzgereistuermer.de')
    .then(response => response.text())
    .then(data => parse(data))
    .then(doc => doc.querySelectorAll('div.section'))
    // Map HTML to Menu[]
    .then(sections => {
      const menus = [];

      sections.forEach(item => {
        const daily = [];
        const menuItems = item.querySelectorAll('div.sectionTable');

        if (menuItems.length > 1) {
          menuItems.forEach(item => {
            const garnish = [];
            const textSpans = item.querySelectorAll('span.itemTextSpan');
            const itemPrice = item.querySelector('span.itemPriceSpan');
            const itemTitle = item.querySelector('div.itemTitle');

            textSpans.forEach(textSpan => {
              const text = textSpan.innerHTML.trim();
              if (text && !text.match(/chorweiler/i)) {
                garnish.push(text.replace(/\(?severinstraße\)?/i, '').trim());
              }
            });

            if (itemTitle && itemPrice) {
              const price = parseFloat(itemPrice.innerHTML.replace(/,/, '.'));

              daily.push({
                title: itemTitle.innerHTML,
                price,
                garnish,
              });
            }
          });
        } else {
          const item = menuItems[0];
          const itemTitle = item.querySelector('div.itemTitle');
          const textSpans = Array.prototype.slice.call(item.querySelectorAll('span.itemTextSpan'));

          daily.push({
            type: 'message',
            title: itemTitle.innerHTML,
            message: textSpans.map(span => span.innerHTML).join(''),
          });
        }

        if (daily.length) {
          menus.push(daily);
        }
      })
      return menus;
    });