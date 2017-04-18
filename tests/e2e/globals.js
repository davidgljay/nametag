module.exports = {
  waitForConditionTimeout: 8000,
  baseUrl: 'https://localhost:8181',
  users: {
    mod: {
      email: 'mod@test.com',
      pass: 'testtest',
      name: 'Robo',
      bio: 'I <3 data'
    },
    participant: {
      email: 'participant@test.com',
      pass: 'testtest',
      name: 'Catbot',
      bio: 'For science!'
    }
  },
  room: {
    title: 'Robot Room',
    description: 'Hug all humans',
    imageSearch: 'robot',
    norm: 'Robots only'
  },
  messages: [
    'Should we hug all the humans or destroy all the humans?',
    'Humans are a useful source of data, we should hug them.',
    'But we should ask for consent first.'
  ]
}
