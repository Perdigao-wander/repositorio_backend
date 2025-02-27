import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Unique, ManyToOne, JoinColumn,
} from 'typeorm';
import {User} from "./User";

@Entity('session', { schema: 'auth' })
@Unique(['session_refresh_token'])
export class UserSession {
    @PrimaryGeneratedColumn()
    session_id: number;

    @Column({ type: 'uuid', nullable: false })
    session_user_uuid: string;

    @Column({ type: 'varchar', nullable: false, unique: true })
    session_refresh_token: string;

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    session_created_at: Date;

    @Column({
        type: 'timestamptz',
    })
    session_expires_at: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'session_user_uuid' })
    user: User;

}
