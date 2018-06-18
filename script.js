/**
 * A lightweight image loader plugin for Vue.js
 *
 * @version 0.1.6
 * @author Charlie LEDUC <contact@graphique.io>
 * @license ISC
 * @requires 'vue'
 */

export default {
  install(Vue, options) {
    var _images = []
    var classLoading = 'loading'
    var classLoaded = 'loaded'
    if (options) {
      if (options.classLoading) classLoading = options.classLoading
      if (options.classLoaded) classLoaded = options.classLoaded
    }

    const findImageFn = function(src) {
      if (src && _images.length > 0) {
        for (let _image of _images) {
          if (_image.src && _image.src === src) {
            return _image
          }
        }
      }
      return false
    }

    const imgFn = {
      load: function(resource, callback) {
        var _img = new Image()
        _img.onload = function() {
          _img.width = this.width
          _img.height = this.height
          if (findImageFn(_img.src) === false) {
            _images.push(_img)
          }
          if (callback) {
            callback(_img)
          }
        }
        _img.alt = ''
        _img.src = resource
      },

      set: function(source, target) {
        target.src = source.src
        target.width = source.width
        target.height = source.height
        target.classList.toggle(classLoading, false)
        target.classList.toggle(classLoaded, true)
      }
    }

    const directiveFn = function(el, binding) {
      var resource = binding.value
      var source = findImageFn(resource)
      if (source === false) {
        el.classList.toggle(classLoading, true)
        el.classList.toggle(classLoaded, false)
        imgFn.load(resource, img => {
          imgFn.set(img, el)
        })
      } else {
        imgFn.set(source, el)
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
          imgFn.load(resource, img => {
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
