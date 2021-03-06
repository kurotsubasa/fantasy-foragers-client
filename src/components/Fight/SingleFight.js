import React, { useState, useEffect } from 'react'
import axios from 'axios'
import apiUrl from '../../apiConfig'
import BattleLog from './BattleLog'
import Button from 'react-bootstrap/Button'
import Layout from '../shared/Layout'

const SingleFight = props => {
  const [fighter, setFighter] = useState({ name: '', description: '', hp: 1, mp: 1, str: 1 })
  const [enemy, setEnemy] = useState({ name: '', description: '', hp: 1, mp: 1, str: 1 })
  const [fighterSkill, setFighterSkill] = useState({ name: '', description: '', cost: '', resource: '' })
  const [enemySkill, setEnemySkill] = useState({ name: '', description: '', cost: '', resource: '' })
  const [turn, setTurn] = useState(1)
  const [log, setLog] = useState([])
  console.log(props)

  useEffect(() => {
    axios(`${apiUrl}/foragers`)
      .then(res => {
        const foragers = res.data.foragers
        const foundFighter = foragers.find(forager => forager._id === props.fighter)
        const foundEnemy = foragers.find(forager => forager._id === props.opponent)
        foundFighter.hp = 200 + (foundFighter.hp * 2)
        foundEnemy.hp = 200 + (foundEnemy.hp * 2)
        setFighter(foundFighter)
        setEnemy(foundEnemy)
      })
      .catch()

    if (props.fighterSkill !== undefined) {
      axios(`${apiUrl}/skills/${props.fighterSkill}`)
        .then((res) => setFighterSkill(res.data.skill))
        .catch()
    }
    if (props.enemySkill !== undefined) {
      axios(`${apiUrl}/skills/${props.enemySkill}`)
        .then((res) => setEnemySkill(res.data.skill))
        .catch()
    }
  }, [])

  const templog = [...log]
  const fighterDmg = () => {
    if (fighter.str > fighter.mp) {
      const ouch = enemy.hp - fighter.str
      const updatedHp = { hp: ouch }
      const editedEnemy = Object.assign({ ...enemy }, updatedHp)
      setEnemy(editedEnemy)
      templog.push({ [templog.length]: `you have dealt ${fighter.str} damage` })
    } else if (fighter.mp > fighter.str) {
      const ouch = enemy.hp - fighter.mp
      const updatedHp = { hp: ouch }
      const editedEnemy = Object.assign({ ...enemy }, updatedHp)
      setEnemy(editedEnemy)
      templog.push({ [templog.length]: `you have dealt ${fighter.mp} damage` })
    } else {
      const ouch = enemy.hp - (fighter.mp + fighter.str)
      const updatedHp = { hp: ouch }
      const editedEnemy = Object.assign({ ...enemy }, updatedHp)
      setEnemy(editedEnemy)
      templog.push({ [templog.length]: `you have dealt ${fighter.str + fighter.mp} damage` })
    }
  }

  const enemyDmg = () => {
    if (enemy.str > enemy.mp) {
      const ouch = fighter.hp - enemy.str
      const updatedHp = { hp: ouch }
      const editedFighter = Object.assign({ ...fighter }, updatedHp)
      setFighter(editedFighter)
      templog.push({ [templog.length]: `you have been dealt ${enemy.str} damage` })
    } else if (enemy.mp > enemy.str) {
      const ouch = fighter.hp - enemy.mp
      const updatedHp = { hp: ouch }
      const editedFighter = Object.assign({ ...fighter }, updatedHp)
      setFighter(editedFighter)
      templog.push({ [templog.length]: `you have been dealt ${enemy.mp} damage` })
    } else {
      const ouch = fighter.hp - (enemy.mp + enemy.str)
      const updatedHp = { hp: ouch }
      const editedFighter = Object.assign({ ...fighter }, updatedHp)
      setFighter(editedFighter)
      templog.push({ [templog.length]: `you have been dealt ${enemy.str + enemy.mp} damage` })
    }
  }

  const attack = () => {
    const newTurn = turn + 2
    setTurn(newTurn)
    fighterDmg()
    enemyDmg()
    setLog([...templog])
  }

  let updatedHp1
  let updatedStat1
  let updatedHp2
  let updatedStat2
  const fighterAbility = () => {
    let ouch
    if (fighterSkill.resource === 'mp') {
      ouch = enemy.hp - Math.floor((Math.pow(fighterSkill.cost, 1.2)))
      const weak = fighter.mp - fighterSkill.cost
      updatedStat1 = { mp: weak }
      templog.push({ [templog.length]: `you have dealt ${Math.floor((Math.pow(fighterSkill.cost, 1.2)))} damage` })
      if (fighter.mp < 0) {
        templog.push({ [templog.length]: 'Your skill resource is negative, you have healed your opponent for 300hp' })
      }
    } else {
      ouch = enemy.hp - ((fighterSkill.cost * 2) + 10)
      const weak = fighter.str - fighterSkill.cost
      updatedStat1 = { str: weak }
      templog.push({ [templog.length]: `you have dealt ${(fighterSkill.cost * 2) + 10} damage` })
      if (fighter.str < 0) {
        templog.push({ [templog.length]: 'Your skill resource is negative, you have healed your opponent for 300hp' })
      }
    }
    if (fighter.mp < 0 || fighter.str < 0) {
      ouch = ouch + 300
    }
    updatedHp1 = { hp: ouch }
  }

  const enemyAbility = () => {
    let ouch2
    if (enemySkill.resource === 'mp') {
      ouch2 = fighter.hp - Math.floor((Math.pow(enemySkill.cost, 1.2)))
      const weak = enemy.mp - enemySkill.cost
      updatedStat2 = { mp: weak }
      templog.push({ [templog.length]: `you have been dealt ${Math.floor((Math.pow(enemySkill.cost, 1.2)))} damage` })
      if (enemy.mp < 0) {
        templog.push({ [templog.length]: 'Your enemies skill resource is negative, you have been healed for 300hp' })
      }
    } else {
      ouch2 = fighter.hp - ((enemySkill.cost * 2) + 10)
      const weak = enemy.str - enemySkill.cost
      updatedStat2 = { str: weak }
      templog.push({ [templog.length]: `you have been dealt ${(enemySkill.cost * 2) + 10} damage` })
      if (enemy.str < 0) {
        templog.push({ [templog.length]: 'Your enemies skill resource is negative, you have been healed for 300hp' })
      }
    }
    if (enemy.mp < 0 || enemy.str < 0) {
      ouch2 = ouch2 + 300
    }
    updatedHp2 = { hp: ouch2 }
  }

  const useAbility = () => {
    const newTurn = turn + 2
    setTurn(newTurn)
    fighterAbility()
    enemyAbility()
    const editedEnemy = Object.assign({ ...enemy }, updatedHp1, updatedStat2)
    const editedFighter = Object.assign({ ...fighter }, updatedHp2, updatedStat1)
    setEnemy(editedEnemy)
    setFighter(editedFighter)
    setLog([...templog])
  }

  if (fighter.hp <= 0 && enemy.hp <= 0) {
    return 'Its a tie!'
  }

  if (fighter.hp <= 0) {
    return 'You lose!'
  }

  if (enemy.hp <= 0) {
    return 'You win!'
  }

  if (turn === 15) {
    return 'Game Over'
  }

  const revLog = log.reverse()

  return (
    <Layout>
      <div>
        <div className="float-md-left float-lg-left float-xl-left mt-2">
          <ul>your stats:
            <li>hp: {fighter.hp}</li>
            <li>str: {fighter.str}</li>
            <li>mp: {fighter.mp}</li>
            <li>skill: {fighterSkill.name}</li>
          </ul>
          <Button onClick={attack}>Attack!</Button>
          <Button onClick={useAbility}>Use your Ability!</Button>
        </div>
        <div className="float-md-right float-lg-right float-xl-right mt-2">
          <ul>opponents stats:
            <li>hp: {enemy.hp}</li>
            <li>str: {enemy.str}</li>
            <li>mp: {enemy.mp}</li>
            <li>skill: {enemySkill.name}</li>
          </ul>
        </div>
        <div className="buttons">
          <BattleLog log={revLog} />
        </div>
      </div>
    </Layout>
  )
}

export default SingleFight
