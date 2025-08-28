const createMessage = require('../../../../app/messaging/outbox/create-message')

describe('messaging/outbox/create-message', () => {
  test('wraps claim into message envelope', () => {
    const claim = { claimId: 'X1' }
    const msg = createMessage(claim)
    expect(msg).toEqual({
      body: claim,
      type: 'uk.gov.demo.claim.validated',
      source: 'ffc-demo-apply'
    })
  })
})
