/**
 * A lightweight image loader plugin for Vue.js
 *
 * @version 3.0.0
 * @author Charlie LEDUC <contact@graphique.io>
 * @license ISC
 * @requires 'vue'
 */

function _load(resource, callback) {
  var _img = new Image();
  _img.onload = function () {
    _img.width = this.width;
    _img.height = this.height;
    callback(_img);
  };
  _img.src = resource;
}

function _set(source, target) {
  target.src = source.src;
  target.width = source.width;
  target.height = source.height;

  var list = ['img-square', 'img-portrait', 'img-landscape'];
  list.forEach(function (c) {
    target.classList.remove(c);
  });

  var aspectClass = 'img-square';
  if (source.width < source.height) {
    aspectClass = 'img-portrait';
  } else {
    if (source.width / source.height >= 10 / 9) {
      aspectClass = 'img-landscape';
    }
  }
  if (!target.classList.contains(aspectClass)) {
    target.classList.add(aspectClass);
  }

  target.removeAttribute('data-src');
}

function _directiveFn(el, binding, vnode, prevNode) {
  var resource = binding.value;
  if (resource === el.src) {
    return;
  }

  el.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  el.setAttribute('data-src', resource);

  _load(resource, function (img) {
    _set(img, el);
  });
}

function preload(images, callback) {
  var l = images.length;
  var n = 0;
  var completed = false;
  if (images.length) {
    for (var i = 0; i < images.length; i++) {
      var resource = images[i];
      _load(resource, function (img) {
        n++;
        if (typeof callback === 'function') {
          callback(completed, n / l);
          if (n >= l) {
            completed = true;
            callback(completed, 1);
          }
        }
      });
    }
  } else {
    if (typeof callback === 'function') {
      completed = true;
      callback(completed, 1);
    }
  }
}

var plugin = {
  install: function install(app, options) {
    app.directive('onload', {
      mounted: function mounted(el, binding, vnode, prevNode) {
        if (vnode.type !== 'img') {
          console.warn('Current node is not an image!');
          return;
        }
        _directiveFn(el, binding, vnode, prevNode);
      },
      update: function update(el, binding, vnode, prevNode) {
        if (vnode.type !== 'img') {
          console.warn('Current node is not an image!');
          return;
        }
        _directiveFn(el, binding, vnode, prevNode);
      }
    });
  }
};

export { preload, plugin };
