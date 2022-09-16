import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'post_tag'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('post_id')
      table.integer('tag_id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
