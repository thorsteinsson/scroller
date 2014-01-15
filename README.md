# Scroller.js

Scroller.js depends on jQuery and Zepto.touch (for swipe). Each different part of the site should have the class pane and an id. Scroller.js will find all links in the page that start with # and enable scroll behavior for them.

## Example:
Create a new Scroller object and give it a function that will be called when pane is changed.
```html
  <div class="container">
    <div class="pane" id="intro">
      Some content.
    </div>
    <div class="pane" id="middle">
      Even more content.
    </div>
    <div class="pane" id="theend">
      The end!
    </div>
  </div>
  <nav>
    <ul class="menu">
      <li><a href="#intro">Intro</a></li>
      <li><a href="#middle">Middle</a></li>
      <li><a href="#theend">The end</a></li>
    </ul>
  </nav>
```

```js
  var scroller = new Scroller(function(target, targetEl) {
    // Set active class on selected menu item
    $('.menu').find('a[href=' + target + ']')
      .closest('li')
      .addClass('active')
      .siblings()
      .removeClass('active');
  })
```

## Methods

- snapToPane()
- scrollTo(target)
- scrollToNext()
- scrollToPrev()

## License
Copyright (c) 2014 Aegir Thorsteinsson
Licensed under the MIT license.