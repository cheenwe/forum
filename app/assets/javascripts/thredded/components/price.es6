(() => {

  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };

  let $price_btc_template = $('#JS__price_btc_template').html();
  let $price_usd_template = $('#JS__price_usd_template').html();
  let $price_cny_template = $('#JS__price_cny_template').html();
  let $percent_change_24h_template = $('#JS__percent_change_24h_template').html();

  let last_price_btc, last_price_usd, last_price_cny;
  let price_btc_trend = 'default', price_usd_trend = 'default', price_cny_trend = 'default';

  $.get('https://api.fixer.io/latest?base=USD&symbols=CNY')
  .then((res) => {

    const usd_cny_rate = res.rates.CNY;

    setInterval(() => {

      // Fixme
      let $price_btc = $('#JS__price_btc');
      let $price_usd = $('#JS__price_usd');
      let $price_cny = $('#JS__price_cny');
      let $percent_change_24h = $('#JS__percent_change_24h');

      $.get('https://api.coinmarketcap.com/v1/ticker/decred/')
      .then((res) => {
        let data = res[0];

        let price_btc = data.price_btc;
        let price_usd = data.price_usd;
        let price_cny = String(data.price_usd * usd_cny_rate);
        let percent_change_24h = data.percent_change_24h;

        let isPercentChange24hUp = percent_change_24h.indexOf('-') === -1;

        if (last_price_btc) {
          if (last_price_btc > price_btc) {
            price_btc_trend = 'red';
          } 
          
          if (last_price_btc < price_btc) {
            price_btc_trend = 'green';
          }
        } else {
          price_btc_trend = isPercentChange24hUp ? 'green' : 'red';
        }

        last_price_btc = price_btc;

        if (last_price_usd) {
          if (last_price_usd > price_usd) {
            price_usd_trend = 'red';
          }
          
          if (last_price_usd < price_usd) {
            price_usd_trend = 'green';
          }
        } else {
          price_usd_trend = isPercentChange24hUp ? 'green' : 'red';
        }

        last_price_usd = price_usd;

        if (last_price_cny) {
          if (last_price_cny > price_cny) {
            price_cny_trend = 'red';
          }
          
          if (last_price_cny < price_cny) {
            price_cny_trend = 'green';
          }
        } else {
          price_cny_trend = isPercentChange24hUp ? 'green' : 'red';
        }

        last_price_cny = price_cny;

        price_btc = [ price_btc.slice(0, 6), price_btc.slice(6) ];
        price_usd = [ price_usd.slice(0, 5), price_usd.slice(5) ];
        price_cny = [ price_cny.slice(0, 5), price_cny.slice(6, 8) ];
        price_btc_trend = price_btc_trend;
        price_usd_trend = price_usd_trend;
        price_cny_trend = price_btc_trend;
        // percent_change_24h = percent_change_24h;

        $price_btc.html(_.template($price_btc_template)({ price_btc, price_btc_trend }));
        $price_usd.html(_.template($price_usd_template)({ price_usd, price_usd_trend }));
        $price_cny.html(_.template($price_cny_template)({ price_cny, price_cny_trend }));
        $percent_change_24h.html(_.template($percent_change_24h_template)({ percent_change_24h }));

      });

    }, 4000);

  });

})();
