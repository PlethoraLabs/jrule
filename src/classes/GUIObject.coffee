class JRule.GUIObject
  constructor: (@opts={}) ->
    @default_opts()
    @create()

    @setup_events()

  destroy: ->
    underhand.remove_events @events
    document.body.removeChild @container
    @destroyed = true

  default_opts: ->

  setup_events: ->
    @events ||= []

    underhand.add_events @events, @container

  classes: ->
    []

  create: ->
    d = document.createElement "div"
    d.className = @classes().join(' ')
    @container = d
    document.body.appendChild @container

    underhand.apply_styles @container, @style()

  style: ->
    {
      position: "fixed"
      backgroundColor: "rgba(0, 0, 0, .6)"
      padding: "8px 12px"
      fontSize: "14px"
      fontFamily: "sans-serif"
      color: "#fff"
      cursor: "pointer"
      zIndex: JRule.zIndex + 10
    }

  show: ->
    @container.style.display = "block"
    @visible = true

  hide: ->
    @container.style.display = "none"
    @visible = false

  toggle: ->
    if @visible then @hide() else @show()










