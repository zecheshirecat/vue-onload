/**
 * A lightweight image loader plugin for Vue.js
 *
 * @version 0.1.6
 * @author Charlie LEDUC <contact@graphique.io>
 * @license ISC
 * @requires 'vue'
 */

export default {
  install: function install(Vue, options) {
    var _images = [];
    var classLoading = 'loading';
    var classLoaded = 'loaded';
    if (options) {
      if (options.classLoading) classLoading = options.classLoading;
      if (options.classLoaded) classLoaded = options.classLoaded;
    }

    var findImageFn = function findImageFn(src) {
      if (src && _images.length > 0) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _image = _step.value;

            if (_image.src && _image.src === src) {
              return _image;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
      return false;
    };

    var imgFn = {
      load: function load(resource, callback) {
        var _img = new Image();
        _img.onload = function () {
          _img.width = this.width;
          _img.height = this.height;
          if (findImageFn(_img.src) === false) {
            _images.push(_img);
          }
          if (callback) {
            callback(_img);
          }
        };
        _img.alt = '';
        _img.src = resource;
      },

      set: function set(source, target) {
        target.src = source.src;
        target.width = source.width;
        target.height = source.height;
        target.classList.toggle(classLoading, false);
        target.classList.toggle(classLoaded, true);
      }
    };

    var directiveFn = function directiveFn(el, binding) {
      var resource = binding.value;
      var source = findImageFn(resource);
      if (source === false) {
        el.classList.toggle(classLoading, true);
        el.classList.toggle(classLoaded, false);
        imgFn.load(resource, function (img) {
          imgFn.set(img, el);
        });
      } else {
        imgFn.set(source, el);
      }
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
        for (var i in images) {
          var resource = images[i];
          imgFn.load(resource, function (img) {
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
