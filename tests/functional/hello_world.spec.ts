import { test } from '@japa/runner'

test('ensure the root route works', async ({ client }) => {
  const response = await client.get('/')

  response.assertStatus(200)
  response.assertBodyContains({ hello: 'world' })
})
