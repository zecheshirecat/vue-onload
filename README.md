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

You can pass an optional object for default class names

```javascript
Vue.use(OnLoad, { classLoading: 'img-loading', classLoaded: 'img-loaded' })
```

Use the instance methods 'this.$images.preload' in your Vue script to preload an array of image sources.

```javascript
...
mounted: function() {
    this.preload = false
    this.$nextTick(function() {
      this.$images.preload(
        [
          'my-image-01.jpg',
          'my-image-02.jpg',
          ...
        ],
        () => {
          // callback when all images are loaded
          this.preload = true
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
    <img alt="My Image" class="img" v-onload="my-image-01.jpg">
  </div>
</template>
```

Which will be transformed once the resource has been loaded into:

```
<template>
  <div>
    <img alt="My Image" class="img loaded" src="/static/img/my-image-01.jpg" width="1024" height="768">
  </div>
</template>
```

## Important Note

All resources must be located in your src/assets/img/. I am working on a new option to customize the default resource folder.

## License

[ISC](https://opensource.org/licenses/ISC)
