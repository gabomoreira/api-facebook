import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { User, UserKey } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/User/ForgotPassword'

export default class UserRegisterController {
  public async store({ request }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      const { email, redirectUrl } = await request.validate(StoreValidator)

      const user = await User.findByOrFail('email', email)
      user.useTransaction(trx)

      const key = (new Date().getTime() + user.id).toString()
      await user.related('keys').create({ key })
      const link = `${redirectUrl.replace(/\/$/, '')}}/${key}`

      Mail.send((message) => {
        message.to(email),
          message.from('contatofacebook@gmail.com', 'facebook'),
          message.subject('Criação de uma nova senha'),
          message.htmlView('emails/forgot-password', { link })
      })
    })
  }

  public async show({ params }: HttpContextContract) {
    const userKey = await UserKey.findByOrFail('key', params.key)
    const user = await userKey.related('user').query().firstOrFail()

    return user
  }

  public async update({ request, response }: HttpContextContract) {
    const { key, password } = await request.validate(UpdateValidator)

    const userKey = await UserKey.findByOrFail('key', key)
    const user = await userKey.related('user').query().firstOrFail()

    user.merge({ password })
    await user.save()

    await userKey.delete()

    return response.ok({ message: 'ok' })
  }
}
