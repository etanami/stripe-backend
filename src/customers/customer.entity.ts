import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, OneToOne, Column } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.customer)
  user: User;

  @Column({ unique: true })
  stripeCustomerId: string;
}
