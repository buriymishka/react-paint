import React, {useEffect, useRef, useState} from 'react';
import '../styles/canvas.scss'
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {useParams} from 'react-router-dom'
import Rect from "../tools/Rect";
import Eraser from "../tools/Eraser";
import axios from 'axios'
import Circle from "../tools/Circle";
import Line from "../tools/Line";
import GL from "../globalVars";
import previewImg from '../assets/img/preview.gif'

const Canvas = observer(() => {

  const [modal, setModal] = useState(true)
  const usernameRef = useRef()
  const canvasRef = useRef()
  const params = useParams()

  useEffect(() => {
    if (canvasState.username) {
      canvasState.setCanvas(canvasRef.current)
      let ctx = canvasRef.current.getContext('2d')
      axios.get(`${GL.HOST}/image?id=${params.id}`)
        .then(res => {
          const img = new Image()
          img.src = res.data
          img.onload = () => {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
            ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
          }
        })

      const socket = new WebSocket(GL.WS_HOST)
      canvasState.setSocket(socket)
      canvasState.setSessionId(params.id)
      toolState.setTool(new Brush(canvasRef.current, socket, params.id))
      socket.onopen = () => {
        socket.send(JSON.stringify({
          id: params.id,
          username: canvasState.username,
          method: 'connection'
        }))
        setInterval(() => {
          socket.send(JSON.stringify({
            method: 'DO_NOT_SLEEP'
          }))
        }, 20000)
      }
      socket.onmessage = (e) => {
        let msg = JSON.parse(e.data)
        switch (msg.method) {
          case 'connection':
            break
          case 'draw':
            drawHandler(msg)
            break
          case 'undo':
            canvasState.undo(true)
            break
          case 'redo':
            canvasState.redo(true)
            break
          case 'pushToUndo':
            canvasState.pushToUndo(canvasRef.current.toDataURL(), true)
            break
        }
      }
    }
  }, [canvasState.username])

  const drawHandler = msg => {
    const figure = msg.figure
    const ctx = canvasRef.current.getContext('2d')

    switch (figure.type) {
      case "brush":
        Brush.staticDraw(ctx, figure.x, figure.y, figure.lineWidth, figure.strokeColor)
        break
      case "eraser":
        Eraser.staticDraw(ctx, figure.x, figure.y, figure.lineWidth)
        break
      case "rect":
        Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.lineWidth, figure.strokeColor)
        break
      case "circle":
        Circle.staticDraw(ctx, figure.x, figure.y, figure.r, figure.color, figure.lineWidth, figure.strokeColor)
        break
      case "line":
        Line.staticDraw(ctx, figure.startX, figure.startY, figure.endX, figure.endY, figure.lineWidth, figure.strokeColor)
        break
      case "finish":
        ctx.beginPath()
        break

    }
  }

  const mouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL())
  }

  const mouseUpHandler = () => {
    axios.post(`${GL.HOST}/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
  }

  const connectHandler = () => {
    if (usernameRef.current.value.length !== 0) {
      canvasState.setUsername(usernameRef.current.value)
      setModal(false)
    }
  }

  return (
    <div className="canvas">
      <Modal show={modal} onHide={() => {
      }}>
        <div><img className="gif" src={previewImg} /></div>
        <Modal.Header>
          <Modal.Title>Введите ваше имя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input required type="text" ref={usernameRef}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => connectHandler()}>
            Войти
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas onMouseUp={() => mouseUpHandler()} onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={600}
              height={400}/>
    </div>
  );
});

export default Canvas;
