import { Migration } from '@mikro-orm/migrations';

export class Migration20231202155831 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "users" ("id" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null, "updated_by" int null, "is_active" boolean not null default true, "email" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "password" varchar(255) not null, "phone" varchar(255) not null, constraint "users_pkey" primary key ("id"));',
    );
    this.addSql('create index "users_email_index" on "users" ("email");');
    this.addSql(
      'alter table "users" add constraint "users_email_unique" unique ("email");',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "users" cascade;');
  }
}
