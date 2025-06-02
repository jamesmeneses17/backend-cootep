import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResetTokentoUser1748744205233 implements MigrationInterface {
  name = 'AddResetTokentoUser1748744205233';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`resetToken\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`resetTokenExpiration\` datetime NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`resetTokenExpiration\``,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`resetToken\``);
  }
}
