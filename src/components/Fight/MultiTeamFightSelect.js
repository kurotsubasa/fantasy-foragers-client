import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'

import apiUrl from '../../apiConfig'
import Layout from '../shared/Layout'
import Button from 'react-bootstrap/Button'
import useSocket from 'socket.io-client'
import { CopyToClipboard } from 'react-copy-to-clipboard'
// import LetsFight from '../shared/LetsFight'
const MultiTeamFightSelect = props => {
  const [game, setGame] = useState({ player1: '', player2: '' })
  const [foragers, setForagers] = useState([])
  const [fighter1, setFighter1] = useState(null)
  const [fighter2, setFighter2] = useState(null)
  const [fighter3, setFighter3] = useState(null)
  const [fighter4, setFighter4] = useState(null)
  const [fighter5, setFighter5] = useState(null)
  const [fighter6, setFighter6] = useState(null)
  const [tem1, setTem1] = useState([])
  const [tem2, setTem2] = useState([])
  const [confirm1, setConfirm1] = useState(false)
  const [confirm2, setConfirm2] = useState(false)
  const [copier, setCopier] = useState(window.location.href)

  const socket = useSocket(apiUrl)
  socket.connect()

  useEffect(() => {
    axios({
      url: `${apiUrl}/games/${props.match.params.id}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${props.user.token}`
      }
    })
      .then(res => {
        setGame(res.data.game)
      })
      .catch()
    axios(`${apiUrl}/foragers`)
      .then(res => setForagers(res.data.foragers))
      .catch()

    socket.on('new peep', (fighter) => {
      if (fighter.fighter) {
        if (fighter.fighter.team1) {
          setTem1(fighter.fighter.team1)
          if (fighter.fighter.team1.length === 1) {
            setFighter1(fighter.fighter.team1[0])
          } else if (fighter.fighter.team1.length === 2) {
            setFighter1(fighter.fighter.team1[0])
            setFighter2(fighter.fighter.team1[1])
          } else if (fighter.fighter.team1.length === 3) {
            setFighter1(fighter.fighter.team1[0])
            setFighter2(fighter.fighter.team1[1])
            setFighter3(fighter.fighter.team1[2])
          }
        }
      }
      if (fighter.fighter) {
        if (fighter.fighter.team2) {
          setTem2(fighter.fighter.team2)
          if (fighter.fighter.team2.length === 1) {
            setFighter4(fighter.fighter.team2[0])
          } else if (fighter.fighter.team2.length === 2) {
            setFighter4(fighter.fighter.team2[0])
            setFighter5(fighter.fighter.team2[1])
          } else if (fighter.fighter.team2.length === 3) {
            setFighter4(fighter.fighter.team2[0])
            setFighter5(fighter.fighter.team2[1])
            setFighter6(fighter.fighter.team2[2])
          }
        }
      }
      if (fighter.game) {
        setGame(fighter.game.gamey)
      }
      if (fighter.confirm1) {
        setConfirm1(true)
      }
      if (fighter.confirm2) {
        setConfirm2(true)
      }
    })
  }, [])

  console.log(tem1)
  console.log(fighter1)
  const foragerss = foragers.map(forager => {
    const tem1Selector = () => {
      // setFighter1(forager._id)
      // setFighter1Skill(forager.skill)
      const team1 = [...tem1]
      const teammate1 = forager
      team1.push(teammate1)
      socket.emit('new peep', { fighter: { team1 } })
      if (fighter1 === null) {
        setFighter1(forager)
      } else if (fighter2 === null) {
        setFighter2(forager)
      } else if (fighter3 === null) {
        setFighter3(forager)
      }
    }
    const tem2Selector = () => {
      // setFighter2(forager._id)
      // setFighter2Skill(forager.skill)
      const team2 = [...tem2]
      const teammate2 = forager
      team2.push(teammate2)
      socket.emit('new peep', { fighter: { team2 } })
      if (!fighter4) {
        setFighter4(forager)
      } else if (!fighter5) {
        setFighter5(forager)
      } else {
        setFighter6(forager)
      }
    }

    return (
      <tbody className="lay" key={forager._id}>
        <tr>
          <td><Link to={`/foragers/${forager._id}`}>{forager.name}<br></br></Link>
            {props.user._id === game.player1 && (game.player2) && tem1.length <= 3 ? <Button variant="secondary" onClick={tem1Selector}>Team 1</Button> : ''}
            {props.user._id === game.player2 && tem2.length <= 3 ? <Button variant="secondary" onClick={tem2Selector}>Team 2</Button> : ''}
          </td>
          <td>{forager.description}</td>
          <td>{forager.hp}</td>
          <td>{forager.mp}</td>
          <td>{forager.str}</td>
        </tr>
      </tbody>
    )
  })

  const p2 = () => {
    axios({
      url: `${apiUrl}/games/${props.match.params.id}`,
      method: 'PATCH',
      data: { 'game': {
        'player2': `${props.user._id}`
      }
      },
      headers: {
        'Authorization': `Bearer ${props.user.token}`
      }
    })
      .then((res) => {
        const gamey = res.data.game
        socket.emit('new peep', { game: { gamey } })
        setGame(res.data.game)
      })
  }

  const confirmation1 = () => {
    setConfirm1(true)
    socket.emit('new peep', { confirm1: true })
    props.setTem1(tem1)
    props.setTem2(tem2)
  }

  const confirmation2 = () => {
    setConfirm2(true)
    socket.emit('new peep', { confirm2: true })
    props.setTem2(tem2)
    props.setTem1(tem1)
  }

  if (confirm1 === true) {
    if (confirm2 === true) {
      return <Redirect to={`/games/${game._id}/multiTeamFight`} />
    }
  }

  const confirmButton1 = (
    <Button onClick={confirmation1} type='button'>
      Lock in your team player 1
    </Button>
  )

  const confirmButton2 = (
    <Button onClick={confirmation2} type='button'>
      Lock in your team player 2
    </Button>
  )

  const p2Button = (
    <Button onClick={p2} type='button'>
      Are you Playing?
    </Button>
  )

  const handleChange = event => {
    const updatedField = event.target.value

    setCopier(updatedField)

    // setForager({ ...forager, [event.target.name]: event.target.value })
  }

  const urlCopier = (
    <div>
      <input value={copier} onChange={handleChange} />
      <CopyToClipboard text={copier}>
        <button>Copy URL</button>
      </CopyToClipboard>
    </div>
  )
  return (
    <Layout>
      <h4>Foragers</h4>
      {(game.player1 && game.player2) ? <h5>Please pick a selected forager and an opponent</h5> : <div><p>Please send your friend this link to get started:</p> { urlCopier }</div>}
      <div>
      Team 1:
        <ul>
          {(fighter1 !== null) ? <li>{fighter1.name}</li> : '' }
          {(fighter2 !== null) ? <li>{fighter2.name}</li> : '' }
          {(fighter3 !== null) ? <li>{fighter3.name}</li> : '' }
        </ul>
        Team 2:
        <ul>
          {(fighter4 !== null) ? <li>{fighter4.name}</li> : '' }
          {(fighter5 !== null) ? <li>{fighter5.name}</li> : '' }
          {(fighter6 !== null) ? <li>{fighter6.name}</li> : '' }
        </ul>
      </div>
      {((game) && (game.player2)) || ((game) && (props.user._id === game.player1)) ? '' : <p>{p2Button}</p>}
      {((tem1.length === 3) && (tem2.length === 3) && (props.user._id === game.player1) && (confirm1 === false)) ? <p>{confirmButton1}</p> : ''}
      {((tem1.length === 3) && (tem2.length === 3) && (props.user._id === game.player2) && (confirm2 === false)) ? <p>{confirmButton2}</p> : ''}
      <div>{(tem1.length < 3 && (game.player2) && (props.user._id === game.player1)) ? 'Please pick your forager' : ''}
        {(tem2.length < 3 && (game.player2) && (props.user._id === game.player2)) ? 'Please pick your forager' : ''}</div>
      {(tem1.length < 3 && (props.user._id === game.player2) ? 'Waiting for player 1 to choose a forager...' : '')}
      {(tem1.length < 3 && (game.player2) && (props.user._id === game.player1) ? 'Waiting for player 2 to choose a forager...' : '')}
      <div>{((tem1.length === 3) && (tem2.length === 3) && (confirm1 === false) && (props.user._id === game.player1)) ? 'Please lock in your forager' : ''}
        {((tem1.length === 3) && (tem2.length === 3) && (confirm2 === false) && (props.user._id === game.player2)) ? 'Please lock in your forager' : ''}</div>
      {(tem2.length === 3 && (tem1.length === 3) && (confirm2 === false) && (props.user._id === game.player1) ? 'Waiting for player 2 to lock in...' : '')}
      {(tem1.length === 3 && (tem2.length === 3) && (confirm1 === false) && (props.user._id === game.player2) ? 'Waiting for player 1 to lock in...' : '')}
      {(!game.player2) ? 'Waiting for player 2 to join...' : ''}
      <table className="table">
        <thead>
          <tr className="lay">
            <th scope="col">Name</th>
            <th scope="col">description</th>
            <th scope="col">hp</th>
            <th scope="col">mp</th>
            <th scope="col">str</th>
          </tr>
        </thead>
        {foragerss}
      </table>
    </Layout>
  )
}

export default MultiTeamFightSelect
