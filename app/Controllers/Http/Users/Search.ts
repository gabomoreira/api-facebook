import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User } from 'App/Models'

export default class SearchController {
  public async index({ request }: HttpContextContract) {
    const keyword = request.input('keyword')

    const users = await User.all()

    return users
  }
}
