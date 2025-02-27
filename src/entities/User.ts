import {
    Entity,
    Column,
    CreateDateColumn,
    Unique,
    PrimaryColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';

import { v4 as uuid} from "uuid"
import {Document} from "./Document";


@Entity('user', { schema: 'auth' })
@Unique(['email'])
export class User {
    @PrimaryColumn({ type: "uuid", nullable: false,unique:true })
    id: string;

    @Column({ type: 'varchar', nullable: false})
    name: string;

    @Column({ type: 'varchar', nullable: false})
    surname: string;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar', length: 4, nullable: true })
    pin: string;

    @Column({ type: 'varchar', nullable: true })
    phone: string;

    @Column({ type: 'varchar',nullable:true })
    username: string;

    @Column({type:"int", nullable: true})
    photo_id: number;

    @Column({ type: 'varchar' })
    password: string;

    @Column({ type: 'int', default: 1 })
    status: number;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamptz', nullable: true })
    updated_at: Date;

    @Column({ type: 'uuid', nullable: true })
    user_uuid: string;

    @Column({ type: 'uuid', nullable: true })
    user_update_uuid: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_uuid' })
    user: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_update_uuid' })
    user_update: User;

    @ManyToOne(() => Document)
    @JoinColumn({name: "photo_id"})
    photo:Document;

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }
    }
}
