/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})
Route.post('/', async ({ request, response, logger }) => {
  logger.info("validating form ...")
  const formSchema = schema.create({
    email: schema.string({ trim: true }, [
      rules.required(),
      rules.unique({ table: 'users', column: 'email' })
    ]),
    password: schema.string({ escape: true }, [rules.required()]),
  })

  try {
    await request.validate({schema: formSchema})
  } catch (err) {
    // unexpected issue ?: TypeError: Cannot read property 'fatal' of undefined
    // at Object.validate (/home/prudence/workspace/hello-world/node_modules/@adonisjs/lucid/build/src/Bindings/Validator.js:170:20)
    console.error(err)
    return response.badRequest(err.messages)
  }
  logger.info("... form ok")
  return response.ok('validated!')
})
