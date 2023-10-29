import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { CiPlay1, CiPause1 } from 'react-icons/ci'

interface AriaLabels {
  PLAY_BUTTON: string
}

interface Props {
  ariaLabels?: AriaLabels | null
  color?: string
  icon?: React.ReactNode
  iconColor?: string
  loaded?: number
  progressSize?: number
  played?: number
  playing: boolean
  size?: number
  onSeek?: (rotation: number) => void
  onTogglePlaying?: () => void
  title: string
}

const generateStyles = (variables: { [key: string]: string | number }) => {
  const style: any = {}
  for (const key in variables) {
    style[key] = variables[key]
  }
  return style
}

const getCircleCenterCoords = ({ x, y, width }: { x: number; y: number; width: number }) => {
  const radius = width / 2
  return { x: x + radius, y: y + radius }
}

const getRotationForPoint = (vertex: { x: number; y: number }, point: { x: number; y: number }) => {
  const adjacent = vertex.y - point.y
  const opposite = point.x - vertex.x
  const centralAngle = Math.atan(opposite / adjacent)
  const mod = point.y > vertex.y ? Math.PI : 2 * Math.PI
  const rotation = centralAngle + mod > 2 * Math.PI ? centralAngle : centralAngle + mod
  return rotation / (2 * Math.PI)
}

const getDefaultLabels = (playing: boolean) => ({
  PLAY_BUTTON: playing ? 'Pause' : 'Play',
})

const PlayIcon: React.FC<{ playing: boolean, iconColor: string }> = ({ playing, iconColor }) => (
  <span className={`rc-play-icon${playing ? ' pause' : ''}`}>
    {playing ? <CiPause1 color={iconColor} fontSize={45} /> : <CiPlay1 color={iconColor} fontSize={45} />}
  </span>
)

const ReactCirclePlayer = ({
  ariaLabels,
  color = '#ec2b52',
  icon,
  iconColor = '#ffffff',
  loaded = 0,
  progressSize = 12,
  played = 0,
  playing,
  size = 230,
  onSeek,
  onTogglePlaying,
  title,
}: Props) => {
  const playerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const labels = ariaLabels || getDefaultLabels(playing)

  const cssVariables = {
    '--rc-color': color,
    '--rc-play-icon-color': iconColor || '',
    '--rc-progress-loaded': loaded,
    '--rc-progress-played': played,
    '--rc-progress-size': `${progressSize}px`,
    '--rc-size': `${size}px`,
  }
  const customStyles = generateStyles(cssVariables)

  const onSeekClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (buttonRef.current && buttonRef.current.contains(e.target as Node)) {
      return
    }

    const point = { x: e.clientX, y: e.clientY }
    const playerRect = playerRef.current?.getBoundingClientRect()
    if (playerRect) {
      const vertex = getCircleCenterCoords(playerRect)
      onSeek && onSeek(getRotationForPoint(vertex, point))
    }
  }

  return (
    <div className='rc-player' style={customStyles} onClick={onSeek && onSeekClick}>
      <div ref={playerRef} className='rc-player-inner'>
        <svg className='rc-ring-container'>
          <circle shapeRendering='geometricPrecision' className='rc-ring rc-ring__duration' />
          <circle shapeRendering='geometricPrecision' className='rc-ring rc-ring__loaded' />
          <circle shapeRendering='geometricPrecision' className='rc-ring rc-ring__played' />
        </svg>
        <div className='rc-button-container'>
          <button
            ref={buttonRef}
            type='button'
            className='rc-play-button'
            aria-label={labels.PLAY_BUTTON}
            onClick={onTogglePlaying}
          >
            {icon || <PlayIcon playing={playing} iconColor={iconColor} />}
          </button>
          <h5 className='rc-title'>{title}</h5>
        </div>
      </div>
    </div>
  )
}

ReactCirclePlayer.propTypes = {
  ariaLabels: PropTypes.shape({
    PLAY_BUTTON: PropTypes.string,
  }),
  color: PropTypes.string,
  icon: PropTypes.node,
  iconColor: PropTypes.string,
  loaded: PropTypes.number,
  progressSize: PropTypes.number,
  played: PropTypes.number,
  playing: PropTypes.bool.isRequired,
  size: PropTypes.number,
  onSeek: PropTypes.func,
  onTogglePlaying: PropTypes.func,
  title: PropTypes.string,
}

ReactCirclePlayer.defaultProps = {
  ariaLabels: null,
  color: '#ec2b52',
  icon: null,
  iconColor: '#ffffff',
  loaded: 0,
  progressSize: 12,
  played: 0,
  playing: false,
  size: 230,
  onSeek: null,
  onTogglePlaying: null,
  title: 'Title',
}

export default ReactCirclePlayer
