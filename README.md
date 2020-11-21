# vue-onload

A lightweight image loader plugin for Vue.js

## Installation

```javascript
npm install vue-onload --save
```

## How to use

Default use in your main.js Vue project

```javascript
import { plugin as OnLoad } from 'vue-onload'
...
createApp(App)
  .use(OnLoad)
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

## Preload

You can import `preload` in your Vue script to preload an array of image sources.

```javascript
import { ref, onMounted } from 'vue'
import { preload } from 'vue-onload'
export default {
  name: 'MyComponent',

  setup(props, context) {
    const loaded = ref(false)

    onMounted(() => {
      loaded.value = false
      const sources = [
        'https://www.website.com/static/example1.png',
        require('@/assets/img/img-1.jpg'),
        require('@/assets/img/img-2.jpg')
      ]
      preload(sources, (completed, count) => {
        if (completed === true) {
          loaded.value = true
        }
      })
    })

    return {
      loaded
    }
  }
}
```

## License

[ISC](https://opensource.org/licenses/ISC)
