module.exports = {
  waitForConditionTimeout: 8000,
  baseUrl: 'https://localhost:8181',
  users: {
    mod: {
      email: 'mod@test.com',
      pass: 'testtest',
      name: 'Robo'
    },
    participant: {
      email: 'participant@test.com',
      pass: 'testtest',
      name: 'Catbot'
    },
    smParticipant: {
      email: 'smParticipant@test.com',
      pass: 'testtest',
      name: 'TritterKid'
    }
  },
  room: {
    title: 'Robot Room',
    description: 'Hug all humans',
    welcome: '001110011011?',
    imageSearch: 'robot',
    norm: 'Robots only'
  },
  messages: [
    'Should we hug all the humans or destroy all the humans?',
    'Curious for your opinion',
    'Humans are a useful source of data, we should hug them.',
    'But we should ask for consent first.',
    'Consent is optimal when retrieving data',
    'This has been determined through science.'
  ]
}
