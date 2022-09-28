import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'menu_category'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('menu_id')
      table.integer('category_id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
