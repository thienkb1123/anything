import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'page_builders'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('title', 255)
            table.string('uri', 2048)
            table.json('layouts')
            table.tinyint('status', 1)
            table.dateTime('created_at', { useTz: true })
            table.dateTime('updated_at', { useTz: true })
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
