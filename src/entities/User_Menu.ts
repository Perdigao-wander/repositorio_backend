import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";
import {Menu} from "./Menu";

@Entity("user_menu", {schema: "auth"})
export class UserMenu {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "uuid", nullable: false })
    user_owner_uuid: string;

    @Column({ type:"int", nullable: false })
    menu_uuid: number;

    @Column({type: "int", default: 1})
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

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_owner_uuid' })
    user_owner: User;

    @ManyToOne(() => Menu)
    @JoinColumn({ name: 'menu_uuid' })
    menu: User;
}