/**
 * @license
 * Copyright (c) 2018 Charles-André LEDUC. All rights reserved.
 */

const OnLoad = {
  install(Vue, options) {
    var _images = {}
    var classLoading = 'loading'
    var classLoaded = 'loaded'
    if (options) {
      if (options.classLoading) classLoading = options.classLoading
      if (options.classLoaded) classLoaded = options.classLoaded
    }

    const imgFn = {
      load: function(filename, callback) {
        const _img = new Image()
        _img.onload = function() {
          _img.width = this.width
          _img.height = this.height
          _images[filename] = _img
          if (callback) {
            callback(_img)
          }
        }
        _img.alt = filename
        _img.src = require('@/assets/img/' + filename)
      },

      set: function(source, target) {
        target.src = source.src
        target.width = source.width
        target.height = source.height
        target.classList.toggle(classLoading, false)
        target.classList.toggle(classLoaded, true)
      }
    }

    Vue.directive('onload', {
      inserted: function(el, binding, vnode) {
        if (vnode.tag !== 'img') {
          console.warn('Current node is not an image!')
          return
        }

        const name = binding.value
        var source = _images[name]
        if (source != null) {
          imgFn.set(source, el)
        } else {
          el.classList.toggle(classLoading, true)
          el.classList.toggle(classLoaded, false)
          imgFn.load(name, img => {
            imgFn.set(img, el)
          })
        }
      }
    })

    Vue.prototype.$images = {
      preload: function(images, callback) {
        const l = images.length
        var n = 0
        for (var i in images) {
          const name = images[i]
          imgFn.load(name, img => {
            n++
            _images[name] = img
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

export default OnLoad
