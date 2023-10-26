import React, { useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import './styles.css'

type Props = {
  value?: number
}

const ReactCirclePlayer = ({ value = 0 }: Props) => {
  const playerRef = useRef<ReactPlayer>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [counter, setCounter] = useState(value)
  const [isPlaying, setIsPlaying] = useState(false)

  const onMinus = () => {
    setCounter((prev) => prev - 1)
  }

  const onPlus = () => {
    setCounter((prev) => prev + 1)
  }

  const onClickAudioEnded = () => {
    setIsPlaying(false)
  }

  return (
    <div>
      <h1>Counter: {counter}</h1>
      <button onClick={onMinus}>-</button>
      <button onClick={onPlus}>+</button>
      <ReactPlayer
        ref={playerRef}
        url='https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
        playing={isPlaying}
        onEnded={onClickAudioEnded}
      >
        <div className='rc-player'>
          <div className='rc-player-inner'>
            <svg className='rc-ring-container'>
              <circle shapeRendering='geometricPrecision' className='rc-ring rc-ring__duration' />
              <circle shapeRendering='geometricPrecision' className='rc-ring rc-ring__loaded' />
              <circle shapeRendering='geometricPrecision' className='rc-ring rc-ring__played' />
            </svg>
            <button ref={buttonRef} type='button' className='rc-play-button' />
          </div>
        </div>
      </ReactPlayer>
    </div>
  )
}

export default ReactCirclePlayer
