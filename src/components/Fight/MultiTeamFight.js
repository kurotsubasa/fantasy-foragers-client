import React, { useState, useEffect } from 'react'
import axios from 'axios'
import apiUrl from '../../apiConfig'
import BattleLog from './BattleLog'
import useSocket from 'socket.io-client'
import Button from 'react-bootstrap/Button'

const MultiTeamFight = props => {
  const [tem1, setTem1] = useState([])
  const [tem2, setTem2] = useState([])
  const [tem1Defeated, setTem1Defeated] = useState([])
  const [tem2Defeated, setTem2Defeated] = useState([])
  const [fighter1, setFighter1] = useState({ name: '', description: '', hp: 1, mp: 1, str: 1 })
  const [fighter2, setFighter2] = useState({ name: '', description: '', hp: 1, mp: 1, str: 1 })
  const [fighter1Skill, setFighter1Skill] = useState({ name: '', description: '', cost: '', resource: '' })
  const [fighter2Skill, setFighter2Skill] = useState({ name: '', description: '', cost: '', resource: '' })
  const [game, setGame] = useState({ player1: '', player2: '' })
  const [turn, setTurn] = useState(1)
  const [log, setLog] = useState([])

  const socket = useSocket(apiUrl)
  socket.connect()

  useEffect(() => {
    setTem1(props.tem1)
    setTem2(props.tem2)
    console.log(props.tem1)
    console.log(props.tem2)

    axios(`${apiUrl}/skills/${props.tem1[0].skill}`)
      .then((res) => {
        setFighter1Skill(res.data.skill)
        setFighter1(props.tem1[0])
      })
      .catch()

    axios(`${apiUrl}/skills/${props.tem2[0].skill}`)
      .then((res) => {
        setFighter2Skill(res.data.skill)
        setFighter2(props.tem2[0])
      })
      .catch()

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

    socket.on('new peep', (fighter) => {
      if (fighter.fighter !== undefined) {
        if (fighter.fighter.editedFighter2 !== undefined) {
          const editedFighter2 = fighter.fighter.editedFighter2
          setFighter2(editedFighter2)
        }
      }
      if (fighter.fighter !== undefined) {
        if (fighter.fighter.editedFighter1 !== undefined) {
          const editedFighter1 = fighter.fighter.editedFighter1
          setFighter1(editedFighter1)
        }
        if (fighter.fighter.fer1 !== undefined) {
          const fer1 = fighter.fighter.fer1
          const defeated1 = [...tem1Defeated]
          defeated1.push(fer1)
          setTem1Defeated(defeated1)
          setFighter1(fer1)
          axios({
            url: `${apiUrl}/skills/${fer1.skill}`,
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${props.user.token}`
            }
          })
            .then(res => {
              setFighter1Skill(res.data.skill)
            })
            .catch()
        }

        if (fighter.fighter.fer2 !== undefined) {
          const fer2 = fighter.fighter.fer2
          const defeated2 = [...tem2Defeated]
          defeated2.push(fer2)
          setTem2Defeated(defeated2)
          setFighter2(fer2)
          axios({
            url: `${apiUrl}/skills/${fer2.skill}`,
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${props.user.token}`
            }
          })
            .then(res => {
              setFighter2Skill(res.data.skill)
            })
            .catch()
        }
      }
      if (fighter.turn) {
        setTurn(fighter.turn.newTurn)
      }
      if (fighter.log) {
        const newLog = fighter.log.templog
        setLog([...newLog])
      }
    })
  }, [])

  console.log(tem1)
  console.log(tem2)

  const templog = [...log]
  const fighter1Dmg = () => {
    if (fighter1.str > fighter1.mp) {
      const ouch = fighter2.hp - fighter1.str
      const updatedHp = { hp: ouch }
      const editedFighter2 = Object.assign({ ...fighter2 }, updatedHp)
      setFighter2(editedFighter2)
      templog.push({ [templog.length]: `${fighter1.name} has dealt ${fighter1.str} damage` })
      socket.emit('new peep', { fighter: { editedFighter2 } })
    } else if (fighter1.mp > fighter1.str) {
      const ouch = fighter2.hp - fighter1.mp
      const updatedHp = { hp: ouch }
      const editedFighter2 = Object.assign({ ...fighter2 }, updatedHp)
      setFighter2(editedFighter2)
      templog.push({ [templog.length]: `${fighter1.name} has dealt ${fighter1.mp} damage` })
      socket.emit('new peep', { fighter: { editedFighter2 } })
    } else {
      const ouch = fighter2.hp - (fighter1.mp + fighter1.str)
      const updatedHp = { hp: ouch }
      const editedFighter2 = Object.assign({ ...fighter2 }, updatedHp)
      setFighter2(editedFighter2)
      templog.push({ [templog.length]: `${fighter1.name} has dealt ${fighter1.str + fighter1.mp} damage` })
      socket.emit('new peep', { fighter: { editedFighter2 } })
    }
  }

  const fighter2Dmg = () => {
    if (fighter2.str > fighter2.mp) {
      const ouch = fighter1.hp - fighter2.str
      const updatedHp = { hp: ouch }
      const editedFighter1 = Object.assign({ ...fighter1 }, updatedHp)
      setFighter1(editedFighter1)
      templog.push({ [templog.length]: `${fighter2.name} has dealt ${fighter2.str} damage` })
      socket.emit('new peep', { fighter: { editedFighter1 } })
    } else if (fighter2.mp > fighter2.str) {
      const ouch = fighter1.hp - fighter2.mp
      const updatedHp = { hp: ouch }
      const editedFighter1 = Object.assign({ ...fighter1 }, updatedHp)
      setFighter1(editedFighter1)
      templog.push({ [templog.length]: `${fighter2.name} has dealt ${fighter2.mp} damage` })
      socket.emit('new peep', { fighter: { editedFighter1 } })
    } else {
      const ouch = fighter1.hp - (fighter2.mp + fighter2.str)
      const updatedHp = { hp: ouch }
      const editedFighter1 = Object.assign({ ...fighter1 }, updatedHp)
      setFighter1(editedFighter1)
      templog.push({ [templog.length]: `${fighter2.name} has dealt ${fighter2.str + fighter2.mp} damage` })
      socket.emit('new peep', { fighter: { editedFighter1 } })
    }
  }

  const fighter1Attack = () => {
    const newTurn = turn + 1
    socket.emit('new peep', { turn: { newTurn } })
    fighter1Dmg()
    socket.emit('new peep', { log: { templog } })
  }

  const fighter2Attack = () => {
    const newTurn = turn + 1
    socket.emit('new peep', { turn: { newTurn } })
    fighter2Dmg()
    socket.emit('new peep', { log: { templog } })
  }

  let updatedHp1
  let updatedStat1
  let updatedHp2
  let updatedStat2
  const fighter1Ability = () => {
    let ouch
    if (fighter1Skill.resource === 'mp') {
      ouch = fighter2.hp - Math.floor((Math.pow(fighter1Skill.cost, 1.2)))
      const weak = fighter1.mp - fighter1Skill.cost
      updatedStat1 = { mp: weak }
      templog.push({ [templog.length]: `${fighter1.name} has dealt ${Math.floor((Math.pow(fighter1Skill.cost, 1.2)))} damage with ${fighter1Skill.name}` })
      if (fighter1.mp < 0) {
        templog.push({ [templog.length]: `${fighter1.name} has used their skill with negative resources, their opponent has been healed for 300hp` })
      }
    } else {
      ouch = fighter2.hp - ((fighter1Skill.cost * 2) + 10)
      const weak = fighter1.str - fighter1Skill.cost
      updatedStat1 = { str: weak }
      templog.push({ [templog.length]: `${fighter1.name} has dealt ${(fighter1Skill.cost * 2) + 10} damage with ${fighter1Skill.name}` })
      if (fighter1.str < 0) {
        templog.push({ [templog.length]: `${fighter1.name} has used their skill with negative resources, their opponent has been healed for 300hp` })
      }
    }
    if (fighter1.mp < 0 || fighter1.str < 0) {
      ouch = ouch + 300
    }
    updatedHp1 = { hp: ouch }
  }

  const fighter2Ability = () => {
    let ouch2
    if (fighter2Skill.resource === 'mp') {
      ouch2 = fighter1.hp - Math.floor((Math.pow(fighter2Skill.cost, 1.2)))
      const weak = fighter2.mp - fighter2Skill.cost
      updatedStat2 = { mp: weak }
      templog.push({ [templog.length]: `${fighter2.name} has dealt ${Math.floor((Math.pow(fighter2Skill.cost, 1.2)))} damage with ${fighter2Skill.name}` })
      if (fighter2.mp < 0) {
        templog.push({ [templog.length]: `${fighter2.name} has used their skill with negative resources, their opponent has been healed for 300hp` })
      }
    } else {
      ouch2 = fighter1.hp - ((fighter2Skill.cost * 2) + 10)
      const weak = fighter2.str - fighter2Skill.cost
      updatedStat2 = { str: weak }
      templog.push({ [templog.length]: `${fighter2.name} has dealt ${(fighter2Skill.cost * 2) + 10} damage with ${fighter2Skill.name}` })
      if (fighter2.str < 0) {
        templog.push({ [templog.length]: `${fighter2.name} has used their skill with negative resources, their opponent has been healed for 300hp` })
      }
    }
    if (fighter2.mp < 0 || fighter2.str < 0) {
      ouch2 = ouch2 + 300
    }
    updatedHp2 = { hp: ouch2 }
  }

  const fighter1UseAbility = () => {
    const newTurn = turn + 1
    socket.emit('new peep', { turn: { newTurn } })
    fighter1Ability()
    const editedFighter1 = Object.assign({ ...fighter1 }, updatedHp2, updatedStat1)
    const editedFighter2 = Object.assign({ ...fighter2 }, updatedHp1, updatedStat2)
    socket.emit('new peep', { log: { templog } })
    socket.emit('new peep', { fighter: { editedFighter1 } })
    socket.emit('new peep', { fighter: { editedFighter2 } })
  }

  const fighter2UseAbility = () => {
    const newTurn = turn + 1
    socket.emit('new peep', { turn: { newTurn } })
    fighter2Ability()
    const editedFighter2 = Object.assign({ ...fighter2 }, updatedHp1, updatedStat2)
    const editedFighter1 = Object.assign({ ...fighter1 }, updatedHp2, updatedStat1)
    socket.emit('new peep', { log: { templog } })
    socket.emit('new peep', { fighter: { editedFighter2 } })
    socket.emit('new peep', { fighter: { editedFighter1 } })
  }

  if (fighter1.hp <= 0 && fighter2.hp <= 0) {
    return 'Its a tie!'
  }

  if (fighter1.hp <= 0) {
    const t1Defeated = [...tem1Defeated]
    t1Defeated.push(tem1[0])
    const fighterIndex = (t1Defeated.length - 1)
    if (fighterIndex < 3) {
      const fer1 = tem1[fighterIndex]
      fer1.hp = 200 + (fer1.hp * 2)
      socket.emit('new peep', { fighter: { fer1 } })
      setTem1Defeated(t1Defeated)
    } else {
      return (`${fighter2.name} wins!`)
    }
  }

  if (fighter2.hp <= 0) {
    const t2Defeated = [...tem2Defeated]
    t2Defeated.push(tem2[0])
    const fighterIndex = (t2Defeated.length - 1)
    if (fighterIndex < 3) {
      const fer2 = tem2[fighterIndex]
      fer2.hp = 200 + (fer2.hp * 2)
      socket.emit('new peep', { fighter: { fer2 } })
      setTem2Defeated(t2Defeated)
    } else {
      return (`${fighter2.name} wins!`)
    }
  }

  if (turn === 40) {
    return 'Time Over!'
  }
  const fighter2Button = (
    <div>
      <Button onClick={fighter2Attack}>Attack!</Button>
      <Button onClick={fighter2UseAbility}>Use your Ability!</Button>
    </div>
  )

  const fighter1Button = (
    <p>
      <Button onClick={fighter1Attack}>Attack!</Button>
      <Button onClick={fighter1UseAbility}>Use your Ability!</Button>
    </p>
  )

  const fighter1ButtonDead = (
    <p>
      <Button variant="secondary" disabled>Attack!</Button>
      <Button variant="secondary" disabled>Use your Ability!</Button>
    </p>
  )

  const fighter2ButtonDead = (
    <p>
      <Button variant="secondary" disabled>Attack</Button>
      <Button variant="secondary" disabled>Use your Ability!</Button>
    </p>
  )

  const revLog = log.reverse()
  return (
    <div>
      <div className="float-md-left float-lg-left float-xl-left mt-2">
        <ul>{fighter1.name}:
          <li>hp: {fighter1.hp}</li>
          <li>str: {fighter1.str}</li>
          <li>mp: {fighter1.mp}</li>
          <li>skill: {fighter1Skill.name}</li>
          {((turn % 2 !== 0) && (props.user._id === game.player1)) ? <div>{ fighter1Button }</div> : (props.user._id === game.player2) ? '' : <div>{ fighter1ButtonDead }</div> }
          {(turn % 2 !== 0) ? 'Waiting for player 1 to take their turn' : '' }
          {(turn % 2 === 0) ? 'Waiting for player 2 to take their turn' : '' }
        </ul>
      </div>

      <div className="float-md-right float-lg-right float-xl-right mt-2">
        <ul>{fighter2.name}:
          <li>hp: {fighter2.hp}</li>
          <li>str: {fighter2.str}</li>
          <li>mp: {fighter2.mp}</li>
          <li>skill: {fighter2Skill.name}</li>
          {((turn % 2 === 0) && (props.user._id === game.player2)) ? <p>{ fighter2Button }</p> : (props.user._id === game.player1) ? '' : <div>{ fighter2ButtonDead }</div> }
          {(turn % 2 === 0) ? 'Waiting for player 2 to take their turn' : '' }
          {(turn % 2 !== 0) ? 'Waiting for player 1 to take their turn' : '' }
        </ul>
      </div>
      <BattleLog log={revLog} />
    </div>
  )
}

export default MultiTeamFight
