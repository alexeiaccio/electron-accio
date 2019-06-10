import server from './index'
import 'jest'

describe('server', () => {
  it('should be server', async () => {
    const res = await server
    expect(res).toBeDefined()
    return res.stop()
  })
})
