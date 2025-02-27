import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { User } from "./User"; // Supondo que você tenha uma entidade User

@Entity("operation_logs",{schema:"auth"})
export class OperationLog {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid", nullable: true })
    user_id: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ type: "text" })
    operation: string;

    @Column({ type: "varchar", length: 255 })
    route: string;

    @Column({ type: "varchar", length: 10 })
    method: string;

    @Column({ type: "jsonb", nullable: true })
    request_body: object;

    @Column({ type: "jsonb", nullable: true })
    response_body: object;

    @CreateDateColumn()
    created_at: Date;
}
