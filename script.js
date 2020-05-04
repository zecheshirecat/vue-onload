/**
 * A lightweight image loader plugin for Vue.js
 *
 * @version 0.2.0
 * @author Charlie LEDUC <contact@graphique.io>
 * @license ISC
 * @requires 'vue'
 */

var _loadedImages = []

export default {
  install(Vue, options) {
    const findFn = function(src) {
      if (src && _loadedImages.length > 0) {
        for (var i = 0; i < _loadedImages.length; i++) {
          var _image = _loadedImages[i]
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
            _loadedImages.push(_img)
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

        var aspectClass = 'img-square'
        if (source.width < source.height) {
          aspectClass = 'img-portrait'
        } else {
          if (source.width / source.height >= 10 / 9) {
            aspectClass = 'img-landscape'
          }
        }
        if (!target.classList.contains(aspectClass)) {
          target.classList.add(aspectClass)
        }

        target.removeAttribute('data-src')
      }
    }

    const directiveFn = function(el, binding) {
      var resource = binding.value

      el.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
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
        for (let i = 0; i < images.length; i++) {
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
