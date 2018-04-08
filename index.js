/**
 * @license
 * Copyright (c) 2018 Charles-André LEDUC. All rights reserved.
 */

var OnLoad = {
  install: function install(Vue, options) {
    var _images = {};
    var classLoading = 'loading';
    var classLoaded = 'loaded';
    if (options) {
      if (options.classLoading) classLoading = options.classLoading;
      if (options.classLoaded) classLoaded = options.classLoaded;
    }

    var imgFn = {
      load: function load(filename, callback) {
        var _img = new Image();
        _img.onload = function () {
          _img.width = this.width;
          _img.height = this.height;
          _images[filename] = _img;
          if (callback) {
            callback(_img);
          }
        };
        _img.alt = filename;
        _img.src = require('@/assets/img/' + filename);
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
      var name = binding.value;
      var source = _images[name];
      if (source != null) {
        imgFn.set(source, el);
      } else {
        el.classList.toggle(classLoading, true);
        el.classList.toggle(classLoaded, false);
        imgFn.load(name, function (img) {
          imgFn.set(img, el);
        });
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

        var _loop = function _loop() {
          var name = images[i];
          imgFn.load(name, function (img) {
            n++;
            _images[name] = img;
            if (n >= l) {
              if (callback) {
                callback();
              }
            }
          });
        };

        for (var i in images) {
          _loop();
        }
      }
    };
  }
};

export default OnLoad;
