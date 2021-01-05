import React from 'react';
import '../styles/toolbar.scss'
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import canvasState from "../store/canvasState";
import Rect from "../tools/Rect";
import Circle from "../tools/Circle";
import Line from "../tools/Line";
import Eraser from "../tools/Eraser";

const Toolbar = () => {

  const changeColor = e => {
    toolState.setFillColor(e.target.value)
  }

  const download = () => {
    const dataUrl = canvasState.canvas.toDataURL()
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = canvasState.sessionid + '.jpg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="toolbar">
      <button className="toolbar__btn brush" onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
      <button className="toolbar__btn rect" onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
      <button className="toolbar__btn circle" onClick={() => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
      <button className="toolbar__btn eraser" onClick={() => toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
      <button className="toolbar__btn line" onClick={() => toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
      <input type="color" onChange={e => changeColor(e)} style={{marginLeft: 10}}/>
      <button className="toolbar__btn undo" onClick={() => canvasState.undo()}/>
      <button className="toolbar__btn redo" onClick={() => canvasState.redo()}/>
      <button className="toolbar__btn save" onClick={() => download()}/>
    </div>
  );
};

export default Toolbar;
