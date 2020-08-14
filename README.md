# vue-onload

A lightweight image loader plugin for Vue.js

## Installation

```javascript
npm install vue-onload --save
```

## How to use

Default use in your main.js Vue project

```javascript
import OnLoad from 'vue-onload'

Vue.use(OnLoad)
```

Use the instance methods 'this.$images.preload' in your Vue script to preload an array of image sources.

```javascript
...
mounted: function() {
    this.preload = false
    this.$nextTick(function() {
      this.$images.preload(
        [
          '/static/images/my-image-01.jpg',
          '/static/images/my-image-02.jpg',
          require('@/assets/images/my-image-02.jpg'),
          ...
        ],
        (completed, progress) => {
          // progress indicator from 0 (no image loaded yet) to 1 (all images loaded)
          console.log(Math.round(progress * 100))
          // completed = true when all images are loaded
          if (completed) {
            this.preload = true
          }
        }
      )
    })
  }
...
```

You can use the directive 'v-onload' in your HTML template

```
<template>
  <div>
    <img alt="My Image" class="img" v-onload="/static/images/my-image-01.jpg">
  </div>
</template>
```

Which will be transformed once the resource has been loaded into:

```
<template>
  <div>
    <img alt="My Image" class="img" width="1024" height="768" src="/static/images/my-image-01.jpg">
  </div>
</template>
```

A 'data-src' attribute will be added to replace the directive and will be removed once the image is loaded so CSS selector can be used to display smoothly the element like:

```css
img {
  opacity: 1;
  transition: opacity 0.3s;
}

img[data-src] {
  opacity: 0;
}
```

## License

[ISC](https://opensource.org/licenses/ISC)
