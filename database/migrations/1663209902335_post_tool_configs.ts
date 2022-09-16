import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'post_tool_config'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('admin_id', 11).notNullable()
      table.string('site', 100).nullable().unique()
      table.string('site_api_key', 255).nullable()
      table.string('source_api_key', 255).nullable()
      table.string('source', 10).notNullable().defaultTo('')
      table.tinyint('status', 1)
      table.dateTime('created_at', { useTz: true }).notNullable()
      table.dateTime('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
