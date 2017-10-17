;(() => {

  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };

  const PROTOCOL = 'https://';
  const DCR_PRICE_URL = `${PROTOCOL}min-api.cryptocompare.com/data/pricemultifull?fsyms=DCR&tsyms=BTC,USD,CNY`;
  const duration = 5000;
  const COLOR_UP = 'green', COLOR_DOWN = 'red';

  var btctmpl = $('#price_btc_template').html();
  var usdtmpl = $('#price_usd_template').html();
  var cnytmpl = $('#price_cny_template').html();

  var price_btc, price_usd, price_cny;
  var prev_price_btc, prev_price_usd, prev_price_cny;
  var btc_change_24h, usd_change_24h, cny_change_24h;
  var btc_className, usd_className, cny_className;

  // Initial
  renderPrice();
  intervalPrice(duration);

  function intervalPrice(duration) {
    setInterval(() => {
      renderPrice();
    }, duration);
  }

  function renderPrice() {
    return $.get(DCR_PRICE_URL)
    .then(res => renderTemplete(res));
  }

  function renderTemplete({ RAW: { DCR } }) {
    var { BTC, USD, CNY } = DCR;
    var posusd, poscny;

    price_btc = String(BTC.PRICE); // BTC price
    price_usd = String(USD.PRICE); // USD price
    price_cny = String(CNY.PRICE); // CNY price

    btc_change_24h = String(BTC.CHANGEPCT24HOUR).substring(0, pos(BTC.CHANGEPCT24HOUR));
    usd_change_24h = String(USD.CHANGEPCT24HOUR).substring(0, pos(USD.CHANGEPCT24HOUR));
    cny_change_24h = String(CNY.CHANGEPCT24HOUR).substring(0, pos(CNY.CHANGEPCT24HOUR));

    prev_price_btc = getPrevPrice('prev_price_btc');
    prev_price_usd = getPrevPrice('prev_price_usd');
    prev_price_cny = getPrevPrice('prev_price_cny');

    if (prev_price_btc && prev_price_usd && prev_price_cny) {
      if (prev_price_btc < price_btc ) {
        btc_className = COLOR_UP;
      } else if (prev_price_btc > price_btc) {
        btc_className = COLOR_DOWN;
      } else {
        btc_className = getClassName(btc_change_24h);
      }

      if (prev_price_usd < price_usd) {
        usd_className = COLOR_UP;
      } else if (prev_price_usd > price_usd) {
        usd_className = COLOR_DOWN;
      } else {
        usd_className = getClassName(usd_change_24h);
      }

      if (prev_price_cny < price_cny) {
        cny_className = COLOR_UP;
      } else if (prev_price_cny > price_cny) {
        cny_className = COLOR_DOWN;
      } else {
        cny_className = getClassName(cny_change_24h);
      }

    } else {
      btc_className = getClassName(btc_change_24h);
      usd_className = getClassName(usd_change_24h);
      cny_className = getClassName(cny_change_24h);
    }

    setPrevPrice('prev_price_btc', price_btc);
    setPrevPrice('prev_price_usd', price_usd);
    setPrevPrice('prev_price_cny', price_cny);

    posusd = pos(price_usd), poscny = pos(price_cny);

    price_btc = [ price_btc.slice(0, 6), price_btc.substring(6) ];
    price_usd = [ price_usd.slice(0, posusd), price_usd.substring(posusd, posusd + 2) ];
    price_cny = [ price_cny.slice(0, poscny), price_cny.substring(poscny, poscny + 2) ];

    $('#cssloader').fadeOut('fast');

    _html('price_btc', btctmpl, { price_btc, btc_change_24h, btc_className });
    _html('price_usd', usdtmpl, { price_usd, usd_change_24h, usd_className });
    _html('price_cny', cnytmpl, { price_cny, cny_change_24h, cny_className });
  }

  function getPrevPrice(key) {
    return sessionStorage.getItem(key);
  }

  function setPrevPrice(key, val) {
    return sessionStorage.setItem(key, val);
  }

  function pos(str) {
    return String(str).indexOf('.') + 3;
  }

  function getClassName(percentChange) {
    return percentChange.indexOf('-') === -1 ? COLOR_UP : COLOR_DOWN;
  }

  function _html(target, text, data) {
    return $(`#${target}`).html(_.template(text)(data));
  }

})();
