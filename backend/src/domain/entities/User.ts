import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm"

@Entity("users")
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true, nullable: false})
    email: string;

    @Column({unique: true, nullable: false})
    phone: string;

    @Column()
    password: string;

    @Column({type: "enum", enum: ["doctor", "admin"], default: "doctor"})
    role: 'doctor' | 'admin';

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date

    //--- Relations ---//
    //  User --> Token
    @OneToMany(() => Token, token => token.user)
    tokens: Token[]
}

/* User Token */
@Entity("tokens")
@Unique(["userID", "token", "type"])
export class Token {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid'})
    userID: string;

    @Column()
    token: string;

    @Column({type: "enum", enum: ["refresh", "password_reset"], default: "refresh"})
    type: 'refresh' | 'password-reset';

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

    //--- Relations ---//
    //  Token --> User
    @ManyToOne(() => User, user => user.tokens)
    @JoinColumn({name: "userID"})
    user: User;
}

