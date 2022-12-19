import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { User, UserKey } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/User/Register'

export default class UserRegisterController {
  public async store({ request }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      const { email, redirectUrl } = await request.validate(StoreValidator)

      const user = new User()
      user.useTransaction(trx)
      user.email = email
      await user.save()

      const key = (new Date().getTime() + user.id).toString()
      user.related('keys').create({ key })
      const link = `${redirectUrl.replace(/\/$/, '')}/${key}`

      // envio do email
      await Mail.send((message) => {
        message.to(email),
          message.from('contato@facebook.com', 'Facebook'),
          message.subject('Criação de conta'),
          message.htmlView('emails/verify-email', { link })
      })
    })
  }

  public async show({ params }: HttpContextContract) {
    const userKey = await UserKey.findByOrFail('key', params.key)
    await userKey.load('user')

    return userKey.user
  }

  public async update({ request, response }: HttpContextContract) {
    const { key, name, password } = await request.validate(UpdateValidator)

    const userKey = await UserKey.findByOrFail('key', key)
    const user = await userKey.related('user').query().firstOrFail()
    const username = name.split(' ')[0].toLocaleLowerCase() + new Date().getTime()

    user.merge({ name, password, username })
    await user.save()

    await userKey.delete()

    return response.ok({ message: 'Ok' })
  }
}
