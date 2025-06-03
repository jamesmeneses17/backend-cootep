import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenToUser1748917593076 implements MigrationInterface {
  name = 'AddRefreshTokenToUser1748917593076';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`refreshToken\` varchar(500) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`refreshToken\``,
    );
  }
}
