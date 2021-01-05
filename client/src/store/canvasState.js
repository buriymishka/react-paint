import {makeAutoObservable} from "mobx";
import axios from "axios";
import GL from '../globalVars'

class CanvasState {
  canvas = null
  socket = null
  sessionid = null
  undoList = []
  redoList = []
  username = ''

  constructor() {
    makeAutoObservable(this)
  }

  setUsername(username) {
    this.username = username
  }

  setSessionId(id) {
    this.sessionid = id
  }

  setSocket(socket) {
    this.socket = socket
  }

  setCanvas(canvas) {
    this.canvas = canvas
  }

  pushToUndo(data, external = false) {
    this.undoList.push(data)

    if (!external) {
      this.socket.send(JSON.stringify({
        method: 'pushToUndo',
        id: this.sessionid,
      }))
    }
  }

  pushToRedo(data) {
    this.redoList.push(data)
  }

  undo(external = false) {
    if (!external) {
      this.socket.send(JSON.stringify({
        method: 'undo',
        id: this.sessionid,
      }))
    }

    let ctx = this.canvas.getContext('2d')
    if (this.undoList.length > 0) {
      let dataUrl = this.undoList.pop()
      this.redoList.push(this.canvas.toDataURL())
      let img = new Image()
      img.src = dataUrl
      img.onload = () => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)

        axios.post(`${GL.HOST}/image?id=${this.sessionid}`, {img: this.canvas.toDataURL()})
      }
    }
  }

  redo(external = false) {
    if (!external) {
      this.socket.send(JSON.stringify({
        method: 'redo',
        id: this.sessionid,
      }))
    }

    let ctx = this.canvas.getContext('2d')
    if (this.redoList.length > 0) {
      let dataUrl = this.redoList.pop()
      this.undoList.push(this.canvas.toDataURL())
      let img = new Image()
      img.src = dataUrl
      img.onload = () => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)

        axios.post(`${GL.HOST}/image?id=${this.sessionid}`, {img: this.canvas.toDataURL()})
      }
    }
  }

}

export default new CanvasState()
