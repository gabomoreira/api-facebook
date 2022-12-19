import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { Post } from 'App/Models'
import { StoreValidator } from 'App/Validators/Post/Media'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Application from '@ioc:Adonis/Core/Application'

export default class MediaController {
  public async store({ request, response, auth, params }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      const { file } = await request.validate(StoreValidator)
      const post = await Post.findOrFail(params.id)

      if (auth.user!.id !== post.userId) {
        return response.unauthorized()
      }

      const media = await post.related('media').create({
        fileCategory: 'post',
        fileName: `${cuid()}.${file.extname}`,
      })

      await file.move(Application.tmpPath('uploads'), {
        name: media.fileName,
      })

      return media
    })
  }
}
