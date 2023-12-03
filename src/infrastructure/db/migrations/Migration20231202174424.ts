import { Migration } from '@mikro-orm/migrations';

export class Migration20231202174424 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "products" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "updated_by" int null, "is_active" boolean not null default true, "name" varchar(255) not null, "description" varchar(255) null, "price" int not null, "quantity" int not null default 0, "owner" varchar(255) not null, constraint "products_pkey" primary key ("id"));',
    );
    this.addSql('create index "products_name_index" on "products" ("name");');

    this.addSql(
      'alter table "products" add constraint "products_owner_foreign" foreign key ("owner") references "users" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "products" cascade;');
  }
}
