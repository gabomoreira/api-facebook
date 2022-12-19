import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    password: schema.string({ trim: true }, [rules.confirmed('passwordConfirmation')]),
    key: schema.string({ trim: true }, [rules.exists({ table: 'user_keys', column: 'key' })]),
  })

  public messages: CustomMessages = {}
}
