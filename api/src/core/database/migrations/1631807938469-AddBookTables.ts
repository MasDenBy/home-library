import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookTables1631807938469 implements MigrationInterface {
  name = 'AddBookTables1631807938469';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`file\` (\`id\` int NOT NULL AUTO_INCREMENT, \`path\` varchar(500) NOT NULL, \`imageName\` varchar(21) NULL, \`libraryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`metadata\` (\`id\` int NOT NULL AUTO_INCREMENT, \`isbn\` varchar(13) NOT NULL, \`pages\` int NULL, \`year\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`book\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(1000) NOT NULL, \`description\` varchar(4000) NULL, \`authors\` varchar(255) NULL, \`fileId\` int NULL, \`metadataId\` int NULL, UNIQUE INDEX \`REL_a177e24cdf1f90a50e927559ce\` (\`fileId\`), UNIQUE INDEX \`REL_148e11580ee402195e4451823e\` (\`metadataId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD CONSTRAINT \`FK_3594e73a3171a699ca0f5ce4f07\` FOREIGN KEY (\`libraryId\`) REFERENCES \`library\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`book\` ADD CONSTRAINT \`FK_a177e24cdf1f90a50e927559ced\` FOREIGN KEY (\`fileId\`) REFERENCES \`file\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`book\` ADD CONSTRAINT \`FK_148e11580ee402195e4451823ed\` FOREIGN KEY (\`metadataId\`) REFERENCES \`metadata\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`book\` DROP FOREIGN KEY \`FK_148e11580ee402195e4451823ed\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`book\` DROP FOREIGN KEY \`FK_a177e24cdf1f90a50e927559ced\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_3594e73a3171a699ca0f5ce4f07\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_148e11580ee402195e4451823e\` ON \`book\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_a177e24cdf1f90a50e927559ce\` ON \`book\``,
    );
    await queryRunner.query(`DROP TABLE \`book\``);
    await queryRunner.query(`DROP TABLE \`metadata\``);
    await queryRunner.query(`DROP TABLE \`file\``);
  }
}
