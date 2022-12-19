import Route from '@ioc:Adonis/Core/Route'

Route.put('/reactions', 'Reactions/Main.update').middleware('auth')
Route.delete('/reactions', 'Reactions/Main.destroy').middleware('auth')
