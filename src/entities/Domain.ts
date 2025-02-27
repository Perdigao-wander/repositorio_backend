import {
    Entity,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {User} from "./User";

@Entity('domain', { schema: 'auth' })
export class Domain {
    @PrimaryGeneratedColumn({type:"int"})
    id: number;

    @Column({ type: 'varchar', nullable: false })
    domain: string;

    @Column({ type: 'varchar', nullable: false })
    value: string;

    @Column({ type: 'varchar', nullable: false })
    description: string;

    @Column({ type: 'int', nullable: true })
    orderby: number;

    @Column({ type: 'varchar', nullable: true })
    obs: string;

    @Column({ type: 'int',nullable: true})
    self_id: number;

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
}
