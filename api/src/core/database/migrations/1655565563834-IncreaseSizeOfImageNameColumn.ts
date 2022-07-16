import {MigrationInterface, QueryRunner} from "typeorm";

export class IncreaseSizeOfImageNameColumn1655565563834 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`file\` MODIFY \`imageName\` VARCHAR(30) NULL;`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`file\` MODIFY \`imageName\` VARCHAR(21) NULL;`
        );
    }
}
