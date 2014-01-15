/*
  Scroller.js v0.1 | @thorsteinsson | MIT Licensed
*/
(function() {
  // Use this easing while auto scrolling
  $.extend($.easing, {
    easeOutQuad: function (x, t, b, c, d) {
      return -c *(t/=d)*(t-2) + b;
    }
  });

  // Add animations to navigation between sections
  function Scroller(scrollFn) {
    this.first = $('.pane:first');
    this.scrollFn = scrollFn;
    this.scrolling = false;
    this.currentPos = 0;
    this.current = '#' + this.first.attr('id');
    this.scrollElem = $('html, body');
    this.height = this.first.height();
    this.time = 1000;

    // Capture events
    $(document).on('click', 'a[href^=#]', _.bind(this.onLinkClick, this))
      .on('keydown', _.bind(this.onKeyDown, this))
      .on('swipeDown', _.bind(this.onSwipeDown, this))
      .on('swipeUp', _.bind(this.onSwipeUp, this));

    $(window).on('scroll', _.bind(this.onScroll, this))
      .on('DOMMouseScroll mousewheel', _.bind(this.onMouseWheel, this))
      .on('hashchange', _.bind(this.onHashchange, this))
      .on('resize', _.debounce(_.bind(this.onResize, this), 500))
      .on('mousedown', _.bind(this.onMouseDown, this));

    // Initial state
    if (location.hash.length > 1) {
      this.current = location.hash;
      this.scrollTo(this.current);
    }
  }

  Scroller.prototype.snapToPane = function() {
    var paneNumber = Math.round(this.currentPos / this.height),
      targetEl = $('.pane').eq(paneNumber);
    if (targetEl.length) {
      this.scrollTo('#' + targetEl.attr('id'));
    }
  };

  Scroller.prototype.scrollTo = function(target) {
    if (this.scrolling) return;

    var targetEl = $(target),
      offset = targetEl.offset().top,
      scroller = this;

    if (this.scrollFn) {
      this.scrollFn(target, targetEl);
    }

    // Auto scroll to the target
    this.scrolling = true;
    this.scrollElem.stop().animate({
      scrollTop: offset
    }, this.time, 'easeOutQuad', function() {
      location.hash = target;

      // Make sure we don't detect the autoscroll events
      setTimeout(function() {
        scroller.scrolling = false;
      }, 20);
    });
  };

  Scroller.prototype.scrollToNext = function() {
    var target = $(this.current).next().attr('id');
    if (target) {
      this.scrollTo('#' + target);
    }
  };

  Scroller.prototype.scrollToPrev = function() {
    var target = $(this.current).prev().attr('id');
    if (target) {
      this.scrollTo('#' + target);
    }
  };

  Scroller.prototype.onScroll = function() {
    if (this.scrolling) return;

    this.currentPos = $(document).scrollTop();

    clearTimeout(this.timer);
    this.timer = setTimeout(_.bind(this.snapToPane, this), 200);
  };

  function getDelta(event) {
    var e = event.originalEvent || window.event;
    var delta = { x: 0, y: 0 };
    if ("wheelDeltaX" in e) {
      delta.x = e.wheelDeltaX / 62;
      delta.y = e.wheelDeltaY / 62;
    } else if ("wheelDelta" in e)
      delta.x = delta.y = e.wheelDelta / 62;
    else if ("detail" in e)
      delta.x = delta.y = -e.detail * 3;
    return delta;
  }

  Scroller.prototype.onMouseDown = function() {
    this.autoScroll = false;
  };

  // Scroll to next panel on scroll
  Scroller.prototype.onMouseWheel = function(event, delta) {
    event.stopPropagation();
    event.preventDefault();
    event.cancelBubble = false;

    if (this.autoScroll) {
      return;
    }

    var wheelDelta = delta || getDelta(event).y;
    if (wheelDelta === 0) { // Can this happen?
      return;
    }
    this.autoScroll = true;
    if (wheelDelta < 0) {
      this.scrollToNext();
    } else if (wheelDelta > 0) {
      this.scrollToPrev();
    }

    clearTimeout(this.timer);
    this.timer = setTimeout(_.bind(this.onMouseDown, this), this.time);

    return false;
  };

  Scroller.prototype.onHashchange = function() {
    if (location.hash.length > 1) {
      this.current = location.hash;
    } else {
      this.current = '#' + this.first.attr('id');
    }
  };

  Scroller.prototype.onResize = function() {
    this.scrolling = true;
    this.height = this.first.height();
    this.scrollElem.scrollTop($(this.current).offset().top);
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(_.bind(function() {
      this.scrolling = false;
    }, this), 100);
  };

  Scroller.prototype.onSwipeDown = function(event) {
    this.scrollToPrev();
  };

  Scroller.prototype.onSwipeUp = function(event) {
    this.scrollToNext();
  };

  Scroller.prototype.onLinkClick = function(event) {
    event.preventDefault();
    this.scrollTo(event.target.hash);
  };

  Scroller.prototype.onKeyDown = function(event) {
    if (event.keyCode == 38) { 
      event.preventDefault();
      this.scrollToPrev();
    } else if (event.keyCode === 40) {
      event.preventDefault();
      this.scrollToNext();
    }
  };

  window.Scroller = Scroller;
})();