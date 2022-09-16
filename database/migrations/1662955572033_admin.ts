import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'admin'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('given_name', 100).notNullable().defaultTo('')
      table.string('email', 100).notNullable().defaultTo('')
      table.string('password', 100).notNullable().defaultTo('')
      table.tinyint('status', 1)
      table.tinyint('role', 1)
      table.dateTime('registered_at', { useTz: true }).notNullable()
      table.dateTime('updated_at', { useTz: true }).notNullable()
      table.dateTime('last_login', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
