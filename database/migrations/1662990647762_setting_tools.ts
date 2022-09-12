import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'setting_tools'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('admin_id').notNullable()
      table.string('wp_username', 50).nullable()
      table.string('wp_password', 100).nullable()
      table.string('youtbe_api_key').nullable()
      table.string('source', 10).notNullable().defaultTo('')
      table.tinyint('status', 1)
      table.dateTime('created_at', { useTz: true }).notNullable()
      table.dateTime('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
