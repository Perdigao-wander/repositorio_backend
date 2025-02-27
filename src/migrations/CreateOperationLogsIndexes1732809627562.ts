import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOperationLogsIndexes1732809627562 implements MigrationInterface {
    name = 'CreateOperationLogsIndexes1732809627562';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE INDEX idx_operation_logs_user_id ON auth.operation_logs(user_id);
            CREATE INDEX idx_operation_logs_created_at ON auth.operation_logs(created_at);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX IF EXISTS idx_operation_logs_user_id;
            DROP INDEX IF EXISTS idx_operation_logs_created_at;
        `);
    }
}
