import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRelationToEmployee1748977213676
  implements MigrationInterface
{
  name = 'AddUserRelationToEmployee1748977213676';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`employees\` ADD \`user_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employees\` ADD UNIQUE INDEX \`IDX_2d83c53c3e553a48dadb9722e3\` (\`user_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_2d83c53c3e553a48dadb9722e3\` ON \`employees\` (\`user_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employees\` ADD CONSTRAINT \`FK_2d83c53c3e553a48dadb9722e38\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`employees\` DROP FOREIGN KEY \`FK_2d83c53c3e553a48dadb9722e38\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_2d83c53c3e553a48dadb9722e3\` ON \`employees\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employees\` DROP INDEX \`IDX_2d83c53c3e553a48dadb9722e3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employees\` DROP COLUMN \`user_id\``,
    );
  }
}
