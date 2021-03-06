import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import apiUrl from '../../apiConfig'
import SkillForm from '../shared/SkillForm'
import Layout from '../shared/Layout'
import messages from '../AutoDismissAlert/messages'

const SkillEdit = props => {
  const [skill, setSkill] = useState({
    name: '',
    description: '',
    resource: '',
    cost: ''
  })
  const [update, setUpdate] = useState(false)
  useEffect(() => {
    axios(`${apiUrl}/skills/${props.match.params.id}`)
      .then(res => setSkill(res.data.skill))
      .catch(() => props.msgAlert({
        heading: 'Couldnt Find Skill',
        message: 'Something wrong the the servers, my bad :(',
        variant: 'danger'
      })
      )
  }, [])

  const handleChange = event => {
    setSkill({ ...skill, [event.target.name]: event.target.value })
  }

  const handleSubmit = event => {
    event.preventDefault()

    if (props.user._id !== skill.owner) {
      props.msgAlert({
        heading: 'You do not own this resource',
        message: messages.notOwner,
        variant: 'danger'
      })
    }

    axios({
      url: `${apiUrl}/skills/${props.match.params.id}`,
      method: 'PATCH',
      data: { skill },
      headers: {
        'Authorization': `Bearer ${props.user.token}`
      }
    })
      .then(() => {
        setUpdate(true)
        props.msgAlert({
          heading: 'Successfully modified skill',
          message: 'Hooray!',
          variant: 'success'
        })
      })
      .catch(() => props.msgAlert({
        heading: 'Couldnt modify skill',
        message: 'Probly not yours',
        variant: 'danger'
      }))
  }
  if (update) {
    return <Redirect to={`/skills/${props.match.params.id}`} />
  }
  return (
    <Layout>
      <SkillForm
        skill={skill}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        cancelPath={`/skills/${props.match.params.id}`}
      />
    </Layout>
  )
}
export default SkillEdit
