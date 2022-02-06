/*
cara penggunaan untuk open new tab
paydia.open('connect', 'token' {
  onSuccess: {},
  onfailed: {},
  onclosed: {}
});
cara penggunaan untuk iframe plus callback
paydia.load('connect', 'token', {
  onSuccess: {},
  onfailed: {},
  onclosed: {}
});
*/

export var paydia = {
  prefix: '',
  objdiv: null,
  open: function (frame, token, callback={}, iddiv='', env='production') {
    this.init(iddiv, callback, env);
    // frame ('connect', 'payment', 'topup')
    if (frame == 'connect' || frame == 'payment' || frame == 'topup') {
      var fr = frame;
      switch (frame) {
        case 'connect':
          fr = 'login';
          break;
        case 'payment':
          fr = 'bayar';
          break;
        case 'topup':
          fr = 'topup';
          break;
      }
      window.open('https://'+this.prefix+'pwa.paydia.co.id/' + fr.toString() + '/' + token.toString());
    }
  },
  load: function (frame, token, callback={}, iddiv='', env='production') {
    // frame ('connect', 'payment', 'topup')
    if(iddiv=='') iddiv='paydia-id-frame';
    this.init(iddiv, callback, env);
    if (frame == 'connect' || frame == 'payment' || frame == 'topup') {
      var paydiaEl = document.getElementById(iddiv);
      if (!paydiaEl) {
        paydiaEl = document.createElement('div');
        paydiaEl.setAttribute('id', iddiv);
      }
      document.body.appendChild(paydiaEl);
      paydiaEl = document.getElementById(iddiv);
      paydiaEl.style.position = 'fixed';
      paydiaEl.style.width = '100%';
      paydiaEl.style.height = '100%';
      paydiaEl.style.top = '0';
      paydiaEl.style.left = '0';
      paydiaEl.style.zIndex = '9999';
      var fr = frame;
      switch (frame) {
        case 'connect':
          fr = 'login';
          break;
        case 'payment':
          fr = 'bayar';
          break;
        case 'topup':
          fr = 'topup';
          break;
      }
      var iframe = document.createElement('iframe');
      iframe.src = 'https://'+this.prefix+'pwa.paydia.co.id/' + fr.toString() + '/' + token.toString();
      iframe.style='boder: 0px;';
      iframe.width = '100%';
      iframe.height = '100%';
      paydiaEl.appendChild(iframe);
      this.getObj(iddiv);
    }
  },
  close: function() {
    if (this.objdiv) {
      this.objdiv.removeChild(this.objdiv.childNodes[0]);
      document.body.removeChild(this.objdiv);
    }
  },
  getObj: function(iddiv) {
    this.objdiv = document.getElementById(iddiv);
  },
  init: function(iddiv, callback, env) {
    if(env=='sandbox') this.prefix='sb-';
    else if(env=='development') this.prefix='dev-';
    window.addEventListener('message', function (event) {
      switch (event.data.action) {
        case 'onsuccess':
          this.close();
          if(callback.onSuccess) {
            callback.onSuccess();
          }
          break;
        case 'onfailed':
          this.close();
          if(callback.onFailed) {
            callback.onFailed();
          }
          break;
        case 'onclosed':
          this.close();
          if(callback.onClosed) {
            callback.onClosed();
          }
          break;
      }
    }, true);    
  }
};