;(() => {

  // underscore template settings
  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };

  const PROTOCOL = 'https://';
  const USD_CNY_RATE_URL = `${PROTOCOL}api.fixer.io/latest?base=USD&symbols=CNY`;
  const DCR_PRICE_URL = `${PROTOCOL}api.coinmarketcap.com/v1/ticker/decred`;
  const duration = 4000;

  // HTML templates
  var priceBTCTemplate = $('#price_btc_template').html();
  var priceUSDTemplate = $('#price_usd_template').html();
  var priceCNYTemplate = $('#price_cny_template').html();
  var percentChange24HTemplate = $('#percent_change_24h_template').html();

  // targets
  var ePriceBTC, ePriceUSD, ePriceCNY, ePercentChange24H

  // prices & class name;
  var prev_price_btc, prev_price_usd, prev_price_cny;
  var price_btc_className, price_usd_className, price_cny_className;

  var price_btc, price_usd, price_cny, percent_change_24h;
  var isPercentChange24HUp;

  // colors
  const COLOR_UP = 'green', COLOR_DOWN = 'red';

  // Initial
  // get USD_CNY rate
  var usd_cny_rate;

  getUSDCNYRate()
  .then(() => {
    renderPrice();
    intervalPrice(duration);
  });

  // Interval
  function intervalPrice(duration) {
    setInterval(() => {
      renderPrice();
    }, duration);
  }

  function getUSDCNYRate() {
    return $.get(USD_CNY_RATE_URL)
    .then(({ rates: { CNY } }) => {
      return usd_cny_rate = CNY;
    });
  }

  // render price
  function renderPrice() {
    return $.get(DCR_PRICE_URL)
    .then(res => renderTemplete(res[0]));
  }

  // render template
  function renderTemplete(data) {
    price_btc = data.price_btc; // BTC price
    price_usd = data.price_usd; // USD price
    price_cny = String(data.price_usd * usd_cny_rate); // CNY price
    percent_change_24h = data.percent_change_24h; // percent change 24h

    isPercentChange24HUp = percent_change_24h.indexOf('-') === -1;

    // 如果已经有价格
    if (prev_price_btc &&
          prev_price_usd &&
          prev_price_cny) {

      // price_btc
      if (prev_price_btc > price_btc) {
        price_btc_className = COLOR_DOWN;
      } else if (prev_price_btc < price_btc) {
        price_btc_className = COLOR_UP;
      }

      // price_usd
      if (prev_price_btc > price_btc) {
        price_btc_className = COLOR_DOWN;
      } else if (prev_price_btc < price_btc) {
        price_btc_className = COLOR_UP;
      }

      // price_cny
      if (prev_price_cny > price_cny) {
        price_cny_className = COLOR_DOWN;
      } else if (prev_price_cny < price_cny) {
        price_cny_className = COLOR_UP;
      }
    }
    
    // 第一次请求
    else {
      price_btc_className = getClassName(isPercentChange24HUp);
      price_usd_className = getClassName(isPercentChange24HUp);
      price_cny_className = getClassName(isPercentChange24HUp);
    }

    prev_price_btc = price_btc;
    prev_price_usd = price_usd;
    prev_price_cny = price_cny;

    var posPriceUSD = findPos(price_usd), posPriceCNY = findPos(price_cny);

    price_btc = [ price_btc.slice(0, 6), price_btc.slice(6) ];
    price_usd = [ price_usd.slice(0, posPriceUSD), price_usd.slice(posPriceUSD) ];
    price_cny = [ price_cny.slice(0, posPriceCNY), price_cny.slice(posPriceCNY, posPriceCNY + 2) ];
    price_btc_className = price_btc_className;
    price_usd_className = price_usd_className;
    price_cny_className = price_btc_className;

    $('#cssloader').fadeOut('fast');
    $('#price_btc').html(_t(priceBTCTemplate)({ price_btc, price_btc_className }));
    $('#price_usd').html(_t(priceUSDTemplate)({ price_usd, price_usd_className }));
    $('#price_cny').html(_t(priceCNYTemplate)({ price_cny, price_cny_className }));
    $('#percent_change_24h').html(_t(percentChange24HTemplate)({ percent_change_24h }));
  }

  function findPos(str) {
    return str.indexOf('.') + 3;
  }

  function getClassName(isPercentChange24HUp) {
    return isPercentChange24HUp ? COLOR_UP : COLOR_DOWN;
  }

  function _t(text) {
    return _.template(text);
  }

})();
