import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity("menu", {schema: "auth"})
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type:"varchar", unique: true , nullable:false})
    name:string;

    @Column({ type:"varchar", nullable:false})
    icon: string;

    @Column({ type:"varchar", unique: true , nullable:false})
    link: string;

    @Column({ type:"int", nullable:false})
    order: number;

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