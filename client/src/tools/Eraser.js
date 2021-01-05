import Tool from "./Tool";

export default class Eraser extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.listen()
  }

  listen() {
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    this.canvas.onmouseup = this.mouseUpHandler.bind(this)
  }

  mouseUpHandler(e) {
    this.mouseDown = false
    this.socket.send(JSON.stringify({
      method: 'draw',
      id: this.id,
      figure: {
        type: 'finish',
      }
    }))
    this.ctx.beginPath()
  }

  mouseDownHandler(e) {
    this.mouseDown = true
    this.ctx.beginPath()
    this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
      this.socket.send(JSON.stringify({
        method: 'draw',
        id: this.id,
        figure: {
          type: 'eraser',
          x: e.pageX - e.target.offsetLeft,
          y: e.pageY - e.target.offsetTop,
          lineWidth: this.ctx.lineWidth,
        }
      }))
    }
  }

  draw(x, y) {
    let prevStrokeColor = this.ctx.strokeStyle

    this.ctx.strokeStyle = 'white'
    this.ctx.lineTo(x, y)
    this.ctx.stroke()

    this.ctx.strokeStyle = prevStrokeColor
  }


  static staticDraw(ctx, x, y, lineWidth) {
    let prevLineWidth = ctx.lineWidth
    let prevStrokeColor = ctx.strokeStyle

    ctx.lineWidth = lineWidth
    ctx.strokeStyle = 'white'
    ctx.lineTo(x, y)
    ctx.stroke()

    ctx.lineWidth = prevLineWidth
    ctx.strokeStyle = prevStrokeColor
  }
}
