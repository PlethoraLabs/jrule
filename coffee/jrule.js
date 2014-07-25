// Generated by CoffeeScript 1.7.1
(function() {
  var JRule, ready;

  JRule = (function() {
    function JRule(opts) {
      this.opts = opts != null ? opts : {};
      this.setup_border_rulers();
      this.setup_caliper();
      this.mouse_tracker = JRule.MouseTracker.get_tracker();
      if (typeof console !== "undefined" && console !== null) {
        console.log('jrule ready!');
      }
    }

    JRule.prototype.default_opts = function() {};

    JRule.prototype.setup_border_rulers = function() {
      return this.border_rulers = new JRule.BorderRulers();
    };

    JRule.prototype.setup_caliper = function() {
      return this.caliper = new JRule.Caliper();
    };

    JRule.prototype.toggle_crosshairs = function() {
      return this.mouse_tracker.toggle_crosshairs();
    };

    return JRule;

  })();

  JRule.MouseTracker = (function() {
    MouseTracker.get_tracker = function() {
      return this.tracker || (this.tracker = new JRule.MouseTracker());
    };

    function MouseTracker(opts) {
      this.opts = opts != null ? opts : {};
      this.crosshairs = null;
      this.default_opts();
      this.setup_events();
      if (this.opts.show_crosshairs) {
        this.setup_crosshairs();
      }
    }

    MouseTracker.prototype.default_opts = function() {
      var defaults, key, val;
      defaults = {
        show_crosshairs: true
      };
      for (key in defaults) {
        val = defaults[key];
        if (!this.opts.hasOwnProperty(key)) {
          this.opts[key] = val;
        }
      }
      return this.opts;
    };

    MouseTracker.prototype.setup_events = function() {
      return document.addEventListener('mousemove', (function(_this) {
        return function(e) {
          var event;
          _this.mousex = e.clientX;
          _this.mousey = e.clientY;
          event = new Event('jrule:mousemove');
          document.body.dispatchEvent(event);
          if (_this.opts.show_crosshairs) {
            return _this.render_crosshairs();
          }
        };
      })(this));
    };

    MouseTracker.prototype.setup_crosshairs = function() {
      var c, coord, create, _ref, _results;
      this.crosshairs = {};
      create = function(axis) {
        var crosshair;
        crosshair = document.createElement("div");
        crosshair.style.position = "fixed";
        crosshair.style.backgroundColor = "#333";
        crosshair.style.zIndex = 4000;
        crosshair.className = "crosshair";
        if (axis === "x" || axis === "horizontal") {
          crosshair.style.width = "1px";
          crosshair.style.top = 0;
          crosshair.style.bottom = 0;
          crosshair.style.left = "50%";
        } else {
          crosshair.style.height = "1px";
          crosshair.style.left = 0;
          crosshair.style.right = 0;
          crosshair.style.top = "50%";
        }
        return crosshair;
      };
      this.crosshairs.x = create('x');
      this.crosshairs.y = create('y');
      _ref = this.crosshairs;
      _results = [];
      for (coord in _ref) {
        c = _ref[coord];
        _results.push(document.body.appendChild(c));
      }
      return _results;
    };

    MouseTracker.prototype.render_crosshairs = function() {
      if (!this.crosshairs) {
        this.setup_crosshairs();
      }
      this.crosshairs.x.style.left = "" + this.mousex + "px";
      return this.crosshairs.y.style.top = "" + this.mousey + "px";
    };

    MouseTracker.prototype.toggle_crosshairs = function() {
      this.opts.show_crosshairs = !this.opts.show_crosshairs;
      if (!this.opts.show_crosshairs) {
        return this.remove_crosshairs();
      }
    };

    MouseTracker.prototype.remove_crosshairs = function() {
      var c, coord, _ref;
      _ref = this.crosshairs;
      for (coord in _ref) {
        c = _ref[coord];
        document.body.removeChild(c);
      }
      return this.crosshairs = null;
    };

    return MouseTracker;

  })();

  JRule.BorderRulers = (function() {
    function BorderRulers(opts) {
      this.opts = opts != null ? opts : {};
      this.rulers = {};
      this.mouse_ticks = {};
      this.mouse_tracker = JRule.MouseTracker.get_tracker();
      this.default_opts();
      this.setup_rulers();
      this.setup_events();
    }

    BorderRulers.prototype.default_opts = function() {
      var defaults;
      defaults = {
        style: {
          backgroundColor: "#f1f1f1",
          opacity: .5,
          tickColor: "#ccc",
          mouseTickColor: "#00f"
        },
        top: true,
        left: true,
        right: false,
        bottom: false,
        tick_distance: 100,
        rule_size: 25,
        divisions: 8,
        show_mouse: true
      };
      return this.opts = defaults;
    };

    BorderRulers.prototype.get_style = function() {
      return {
        backgroundColor: this.opts.style.backgroundColor,
        opacity: this.opts.style.opacity
      };
    };

    BorderRulers.prototype.setup_rulers = function(force) {
      var create_ruler, left_ruler, name, ruler, top_ruler, _ref, _ref1;
      if (force == null) {
        force = false;
      }
      if (this.setup && !force) {
        return;
      }
      if (this.setup && force) {
        this.destroy();
      }
      create_ruler = (function(_this) {
        return function() {
          var key, rule, val, _ref;
          rule = document.createElement("div");
          _ref = _this.get_style();
          for (key in _ref) {
            val = _ref[key];
            rule.style[key] = val;
          }
          rule.className = "ruler";
          rule.style.position = "fixed";
          rule.style.zIndex = 4000;
          return rule;
        };
      })(this);
      if (this.opts.top) {
        top_ruler = create_ruler();
        top_ruler.style.left = 0;
        top_ruler.style.right = 0;
        top_ruler.style.top = 0;
        top_ruler.style.height = "" + this.opts.rule_size + "px";
        this.rulers.top = top_ruler;
      }
      if (this.opts.left) {
        left_ruler = create_ruler();
        left_ruler.style.left = 0;
        left_ruler.style.top = 0;
        left_ruler.style.bottom = 0;
        left_ruler.style.width = "" + this.opts.rule_size + "px";
        this.rulers.left = left_ruler;
      }
      _ref = this.rulers;
      for (name in _ref) {
        ruler = _ref[name];
        if ((_ref1 = document.body) != null) {
          _ref1.appendChild(ruler);
        }
      }
      this.setup_ticks();
      this.setup = true;
      return this;
    };

    BorderRulers.prototype.setup_events = function() {
      if (this.opts.show_mouse) {
        return document.body.addEventListener('jrule:mousemove', (function(_this) {
          return function(e) {
            return _this.render();
          };
        })(this));
      }
    };

    BorderRulers.prototype.tick_style = function(side) {
      var style;
      style = {
        position: "absolute",
        display: "block",
        backgroundColor: this.opts.style.tickColor
      };
      if (side === "top" || side === "bottom") {
        style.width = "1px";
        style.height = "100%";
      } else {
        style.width = "100%";
        style.height = "1px";
      }
      return style;
    };

    BorderRulers.prototype.setup_ticks = function() {
      var div_pos, division_distance, doc_rect, i, j, mouse_pos, mouse_x_tick, mouse_y_tick, side, tick_distance, tick_pos, ticks, _i, _j, _k, _len, _ref, _ref1;
      doc_rect = document.body.getBoundingClientRect();
      ticks = Math.ceil(doc_rect.width / this.opts.tick_distance);
      tick_distance = Math.round(doc_rect.width / ticks);
      division_distance = Math.round(tick_distance / this.opts.divisions);
      _ref = ['top', 'left'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        side = _ref[_i];
        for (i = _j = 0; 0 <= ticks ? _j < ticks : _j > ticks; i = 0 <= ticks ? ++_j : --_j) {
          tick_pos = i * tick_distance;
          this.draw_tick(side, tick_pos, .8);
          for (j = _k = 0, _ref1 = this.opts.divisions; 0 <= _ref1 ? _k < _ref1 : _k > _ref1; j = 0 <= _ref1 ? ++_k : --_k) {
            div_pos = j * division_distance + tick_pos;
            this.draw_tick(side, div_pos, (j % 2 ? .3 : .5));
          }
        }
      }
      if (this.opts.show_mouse) {
        if (this.rulers.hasOwnProperty('top')) {
          mouse_x_tick = this.create_tick('top', Math.round(doc_rect.width / 2), 1);
          mouse_x_tick.style.backgroundColor = "" + this.opts.style.mouseTickColor;
          this.mouse_ticks.x = mouse_x_tick;
          this.rulers.top.appendChild(this.mouse_ticks.x);
        }
        if (this.rulers.hasOwnProperty('left')) {
          mouse_y_tick = this.create_tick('left', Math.round(doc_rect.width / 2), 1);
          mouse_y_tick.style.backgroundColor = "" + this.opts.style.mouseTickColor;
          this.mouse_ticks.y = mouse_y_tick;
          this.rulers.left.appendChild(this.mouse_ticks.y);
        }
        mouse_pos = document.createElement("div");
        mouse_pos.style.position = "fixed";
        mouse_pos.style.zIndex = 5000;
        mouse_pos.style.left = 0;
        mouse_pos.style.top = 0;
        mouse_pos.style.padding = "6px";
        mouse_pos.style.backgroundColor = "#888";
        mouse_pos.style.color = "#fafafa";
        mouse_pos.style.fontSize = "12px";
        mouse_pos.style.fontFamily = "sans-serif";
        mouse_pos.style.fontWeight = 100;
        this.mouse_pos = mouse_pos;
        return document.body.appendChild(this.mouse_pos);
      }
    };

    BorderRulers.prototype.create_tick = function(side, pos, height) {
      var key, new_tick, val, _ref;
      if (height == null) {
        height = 1;
      }
      new_tick = document.createElement("div");
      _ref = this.tick_style(side);
      for (key in _ref) {
        val = _ref[key];
        new_tick.style[key] = val;
      }
      new_tick.className = "tick";
      if (side === "top" || side === "bottom") {
        new_tick.style.left = "" + pos + "px";
        new_tick.style.height = "" + (100 * height) + "%";
      } else {
        new_tick.style.top = "" + pos + "px";
        new_tick.style.width = "" + (100 * height) + "%";
      }
      return new_tick;
    };

    BorderRulers.prototype.draw_tick = function(side, pos, height) {
      var new_tick;
      if (height == null) {
        height = 1;
      }
      if (this.rulers.hasOwnProperty(side)) {
        new_tick = this.create_tick(side, pos, height);
        return this.rulers[side].appendChild(new_tick);
      } else {
        return false;
      }
    };

    BorderRulers.prototype.destroy = function() {};

    BorderRulers.prototype.render = function() {
      if (this.opts.show_mouse) {
        if (this.mouse_ticks.x) {
          this.mouse_ticks.x.style.left = "" + this.mouse_tracker.mousex + "px";
        }
        if (this.mouse_ticks.y) {
          this.mouse_ticks.y.style.top = "" + this.mouse_tracker.mousey + "px";
        }
        return this.mouse_pos.innerText = "" + this.mouse_tracker.mousex + ", " + this.mouse_tracker.mousey;
      }
    };

    return BorderRulers;

  })();

  JRule.Caliper = (function() {
    function Caliper(opts) {
      this.opts = opts != null ? opts : {};
      this.mouse_tracker = JRule.MouseTracker.get_tracker();
      this.setup_events();
    }

    Caliper.prototype.setup_events = function() {
      document.addEventListener('keydown', (function(_this) {
        return function(e) {
          var keyup_fn;
          if (e.keyCode === 16) {
            _this.measuring = true;
            _this.start_pos = [_this.mouse_tracker.mousex, _this.mouse_tracker.mousey];
            _this.setup_indicators();
            console.log('start pos', _this.start_pos);
            keyup_fn = function() {
              _this.measuring = false;
              _this.end_pos = [_this.mouse_tracker.mousex, _this.mouse_tracker.mousey];
              console.log('end pos', _this.end_pos);
              document.removeEventListener('keyup', keyup_fn);
              return _this.cleanup();
            };
            return document.addEventListener('keyup', keyup_fn);
          }
        };
      })(this));
      return document.body.addEventListener('jrule:mousemove', (function(_this) {
        return function() {
          return _this.render();
        };
      })(this));
    };

    Caliper.prototype.render = function() {
      var height, width, x, y;
      if (this.measuring) {
        x = Math.min(this.mouse_tracker.mousex, this.start_pos[0]);
        y = Math.min(this.mouse_tracker.mousey, this.start_pos[1]);
        width = Math.max(this.mouse_tracker.mousex, this.start_pos[0]) - Math.min(this.mouse_tracker.mousex, this.start_pos[0]);
        height = Math.max(this.mouse_tracker.mousey, this.start_pos[1]) - Math.min(this.mouse_tracker.mousey, this.start_pos[1]);
        this.indicator.style.width = "" + width + "px";
        this.indicator.style.height = "" + height + "px";
        this.indicator.style.left = "" + x + "px";
        this.indicator.style.top = "" + y + "px";
        return this.indicator_size.innerText = "" + width + ", " + height;
      }
    };

    Caliper.prototype.setup_indicators = function() {
      var indicator, indicator_size;
      indicator = document.createElement("div");
      indicator.style.position = "fixed";
      indicator.style.left = "" + this.start_pos[0] + "px";
      indicator.style.top = "" + this.start_pos[1] + "px";
      indicator.style.backgroundColor = "#d8d8d8";
      indicator.style.opacity = ".4";
      indicator.style.zIndex = 3999;
      this.indicator = indicator;
      document.body.appendChild(this.indicator);
      indicator_size = document.createElement("div");
      indicator_size.style.position = "absolute";
      indicator_size.style.right = 0;
      indicator_size.style.bottom = 0;
      indicator_size.style.fontFamily = "sans-serif";
      indicator_size.style.fontSize = "12px";
      indicator_size.style.backgroundColor = "#333";
      indicator_size.style.color = "#fff";
      indicator_size.style.padding = "3px";
      this.indicator_size = indicator_size;
      return this.indicator.appendChild(this.indicator_size);
    };

    Caliper.prototype.cleanup = function() {
      this.indicator.removeChild(this.indicator_size);
      return document.body.removeChild(this.indicator);
    };

    return Caliper;

  })();

  document.JRule = JRule;

  ready = function() {
    return document.jruler = new document.JRule();
  };

  if (document.readyState !== "complete") {
    document.addEventListener('DOMContentLoaded', function() {
      return ready();
    });
  } else {
    ready();
  }

}).call(this);
