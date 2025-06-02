import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixResetTokenType1748755211499 implements MigrationInterface {
  name = 'FixResetTokenType1748755211499';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`resetTokenExpiration\` \`resetTokenExpires\` datetime NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`resetTokenExpires\` \`resetTokenExpiration\` datetime NULL`,
    );
  }
}
