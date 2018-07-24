/**
 * A lightweight image loader plugin for Vue.js
 *
 * @version 0.2.0
 * @author Charlie LEDUC <contact@graphique.io>
 * @license ISC
 * @requires 'vue'
 */

export default {
  install(Vue, options) {
    var _images = []

    const findFn = function(src) {
      if (src && _images.length > 0) {
        for (var i = 0; i < _images.length; i++) {
          var _image = _images[i]
          if (_image.src && _image.src === src) {
            return _image
          }
        }
      }
      return false
    }

    const imgObj = {
      load: function(resource, callback) {
        var _img = new Image()
        _img.onload = function() {
          _img.width = this.width
          _img.height = this.height
          if (!findFn(_img.src)) {
            _images.push(_img)
          }
          if (callback) {
            callback(_img)
          }
        }
        _img.src = resource
      },

      set: function(source, target) {
        target.src = source.src
        target.width = source.width
        target.height = source.height
        target.removeAttribute('data-src')
      }
    }

    const directiveFn = function(el, binding) {
      var resource = binding.value
      el.setAttribute('data-src', resource)

      var source = findFn(resource)
      if (!source) {
        imgObj.load(resource, img => {
          imgObj.set(img, el)
        })
      } else {
        imgObj.set(source, el)
      }
    }

    Vue.directive('onload', {
      inserted: function(el, binding, vnode) {
        if (vnode.tag !== 'img') {
          console.warn('Current node is not an image!')
          return
        }
        directiveFn(el, binding)
      },
      update: function(el, binding, vnode, oldVnode) {
        if (vnode.tag !== 'img') {
          console.warn('Current node is not an image!')
          return
        }
        directiveFn(el, binding)
      }
    })

    Vue.prototype.$images = {
      preload: function(images, callback) {
        let l = images.length
        let n = 0
        for (let i in images) {
          var resource = images[i]
          imgObj.load(resource, img => {
            n++
            if (n >= l) {
              if (callback) {
                callback()
              }
            }
          })
        }
      }
    }
  }
}
