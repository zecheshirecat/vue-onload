/**
 * A lightweight image loader plugin for Vue.js
 *
 * @version 0.2.0
 * @author Charlie LEDUC <contact@graphique.io>
 * @license ISC
 * @requires 'vue'
 */

export default {
  install: function install(Vue, options) {
    var imgObj = {
      load: function load(resource, callback) {
        var _img = new Image();
        _img.onload = function () {
          _img.width = this.width;
          _img.height = this.height;
          if (callback) {
            callback(_img);
          }
        };
        _img.src = resource;
      },

      set: function set(source, target) {
        target.src = source.src;
        target.width = source.width;
        target.height = source.height;

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
    };

    var directiveFn = function directiveFn(el, binding) {
      var resource = binding.value;

      var rparts = resource && resource.length ? resource.split('/') : [];
      var rfname = rparts.length ? rparts[rparts.length - 1] : '';

      var sparts = el.src && el.src.length ? el.src.split('/') : [];
      var sfname = sparts.length ? sparts[sparts.length - 1] : '';
      if (rfname === sfname) {
        return;
      }

      el.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      el.setAttribute('data-src', resource);

      imgObj.load(resource, function (img) {
        imgObj.set(img, el);
      });
    };

    Vue.directive('onload', {
      inserted: function inserted(el, binding, vnode) {
        if (vnode.tag !== 'img') {
          console.warn('Current node is not an image!');
          return;
        }
        directiveFn(el, binding);
      },
      update: function update(el, binding, vnode, oldVnode) {
        if (vnode.tag !== 'img') {
          console.warn('Current node is not an image!');
          return;
        }
        directiveFn(el, binding);
      }
    });

    Vue.prototype.$images = {
      preload: function preload(images, callback) {
        var l = images.length;
        var n = 0;
        for (var i = 0; i < images.length; i++) {
          var resource = images[i];
          imgObj.load(resource, function (img) {
            n++;
            if (n >= l) {
              if (callback) {
                callback();
              }
            }
          });
        }
      }
    };
  }
};
