import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Hash from '@ioc:Adonis/Core/Hash'
import Admin from 'App/Models/Admin'

export default class extends BaseSeeder {
  public async run() {
    await Admin.createMany([
      {
        email: 'admin@admin.com',
        password: await Hash.make('123123'),
        status: 1,
        role: 1,
      },
    ])
  }
}
