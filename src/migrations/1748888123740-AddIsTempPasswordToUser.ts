import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsTempPasswordToUser1748888123740
  implements MigrationInterface
{
  name = 'AddIsTempPasswordToUser1748888123740';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`isTempPassword\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`isTempPassword\``,
    );
  }
}
