import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLibraryTable1631436479521 implements MigrationInterface {
  name = 'AddLibraryTable1631436479521';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`homelibrary-db\`.\`library\` (\`id\` int NOT NULL AUTO_INCREMENT, \`path\` varchar(500) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`homelibrary-db\`.\`library\``);
  }
}
