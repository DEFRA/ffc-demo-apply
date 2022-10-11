function createMessage (claim) {
  return {
    body: claim,
    type: 'uk.gov.demo.claim.validated',
    source: 'ffc-demo-apply'
  }
}

module.exports = createMessage
