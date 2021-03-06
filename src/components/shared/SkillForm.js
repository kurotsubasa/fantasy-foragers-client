import React from 'react'
import { Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const ForagerForm = ({ skill, handleSubmit, handleChange, cancelPath }) => {
  const resources = ['MP', 'STR']
  const resourceJSX = resources.map(resource => {
    let isChecked = false
    if (resource === skill.resource) {
      isChecked = true
    }

    return (
      <fieldset key={resource} className="resources">
        <label htmlFor={resource}>{resource}</label>
        <Form.Control
          type="radio"
          id={resource}
          value={resource || ''}
          name="resource"
          onChange={handleChange}
          checked={isChecked}
        />
      </fieldset>
    )
  })

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Label>Name</Form.Label>
      <Form.Control
        placeholder="A Great Skill"
        value={skill.name}
        name="name"
        onChange={handleChange}
      />

      <Form.Label>Description</Form.Label>
      <Form.Control
        placeholder="John Doe"
        value={skill.description}
        name="description"
        onChange={handleChange}
      />

      <fieldset>
        {resourceJSX}
      </fieldset>

      <Form.Label>Cost</Form.Label>
      <Form.Control
        type='Number'
        min="0"
        max="100"
        placeholder="00"
        value={skill.cost}
        name="cost"
        onChange={handleChange}
      />

      <Button type="submit">Submit</Button>
      <Link to={cancelPath}>
        <Button>Cancel</Button>
      </Link>
    </Form>
  )
}

export default ForagerForm
