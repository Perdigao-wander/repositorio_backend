import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultSchemaConfiguration1732809627569 implements MigrationInterface {

    name= 'DefaultSchemaConfiguration1732809627569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "lib"`);
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "auth"`);
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "client"`);
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "insurance"`);
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "finance"`);

        /* Default functions in schema lib*/
        await queryRunner.query(`
                create or replace function lib._encrypt(word text) returns character varying
                    language plpgsql
                as
                $fun$
                declare
                    wordMd5 character varying default md5(word);
                begin
                    return md5(
                            md5(
                                    wordMd5
                                        || substring(wordMd5, 1, 20)
                                        || md5(
                                            md5($$%#*//-+@$£€{}[]()?!&|\\\\:;,.^~ºª«»<>çáèíÒú$$)
                                                || word
                                                || substring(wordMd5, 15, 28)
                                                || substring(wordMd5, 13, 11)
                                                || substring(wordMd5, 17, 20)
                                                || substring(wordMd5, 7, 21)
                                           )
                            )
                           );
                end;
                $fun$;
                
                create or replace function lib.result_false(message text, data jsonb DEFAULT NULL::jsonb) returns jsonb
                    language plpgsql
                as
                $$
                
                declare
                    -- esta função serve para retornar um jsonb com o result false
                begin
                    return jsonb_build_object(
                            'result', false,
                            'message', message,
                            'data', data
                           );
                end;
                $$;
                
                create or replace function lib.result_true(message text, data jsonb DEFAULT NULL::jsonb) returns jsonb
                    language plpgsql
                as
                $$
                
                declare
                    -- esta função serve para retornar um jsonb com o result true
                begin
                    return jsonb_build_object(
                            'result', true,
                            'message', message,
                            'data', data
                           );
                end;
                $$;
                
                create or replace function lib.str_normalize(text text) returns text
                    immutable
                    strict
                    language plpgsql
                as
                $$
                declare
                    /**
                      Essa função serve para verificar se uma string esta normalizada (sem espacos desnecessarios)
                     */
                    new_text text;
                begin
                    new_text := trim( regexp_replace( text, '\\s+', ' ', 'g') );
                    if length( new_text ) = 0 then return null; end if;
                    return new_text;
                end;
                $$;
        
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP SCHEMA IF EXISTS "lib" CASCADE`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS "auth" CASCADE`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS "client" CASCADE`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS "insurance" CASCADE`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS "finance" CASCADE`);
    }

}
