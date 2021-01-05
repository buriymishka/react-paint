import Tool from "./Tool";

export default class Circle extends Tool {
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
        type: 'circle',
        x: this.startX,
        y: this.startY,
        r: this.r,
        color: this.ctx.fillStyle,
        lineWidth: this.ctx.lineWidth,
        strokeColor: this.ctx.strokeStyle
      }
    }))
    this.ctx.beginPath()
  }

  mouseDownHandler(e) {
    this.mouseDown = true
    this.ctx.beginPath()
    this.startX = e.pageX - e.target.offsetLeft
    this.startY = e.pageY - e.target.offsetTop
    this.saved = this.canvas.toDataURL()
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      let currentX = e.pageX - e.target.offsetLeft
      let currentY = e.pageY - e.target.offsetTop
      let width = currentX - this.startX
      let height = currentY - this.startY
      this.r = Math.sqrt(width**2 + height**2)
      this.draw(this.startX, this.startY, this.r)
    }
  }

  draw(x, y, r) {
    const img = new Image()
    img.src = this.saved
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
      this.ctx.beginPath()
      this.ctx.arc(x, y, r, 0, 2*Math.PI)
      this.ctx.fill()
      this.ctx.stroke()
    }
  }

  static staticDraw(ctx, x, y, r, color, lineWidth, strokeColor) {
    let prevColor = ctx.fillStyle
    let prevLineWidth = ctx.lineWidth
    let prevStrokeColor = ctx.strokeStyle

    ctx.fillStyle = color
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = strokeColor
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2*Math.PI)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()

    ctx.fillStyle = prevColor
    ctx.lineWidth = prevLineWidth
    ctx.strokeStyle = prevStrokeColor
  }

}
