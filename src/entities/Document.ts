import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import {User} from "./User";

@Entity('document', { schema: 'client' })
export class Document {
    @PrimaryGeneratedColumn({ type: "int"})
    id: number;

    @Column({ type: 'text', nullable: true })
    file_path: string;

    @Column({ type: 'text', nullable: true })
    file_name: string;

    @Column({ type: 'varchar', nullable: true })
    file_size: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', nullable: true })
    minetype: string;

    @Column({ type: 'int', default: 1 })
    status: number;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamptz', nullable: true })
    updated_at: Date;

    @Column({ type: 'uuid', nullable: false })
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
