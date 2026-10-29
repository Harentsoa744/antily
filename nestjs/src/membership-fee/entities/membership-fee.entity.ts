import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { MembershipYear } from '../../membership-year/entities/membership-year.entity';
import { TerritoryLevel } from '../../territory-level/entities/territory-level.entity';
import { Role } from '../../role/entities/role.entity';
import { Membership } from '../../membership/entities/membership.entity';

@Entity('membership_fee')
export class MembershipFee {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  fee!: number | null;

  @Column({ name: 'membership_year_id', type: 'uuid', nullable: true })
  membershipYearId!: string | null;

  @ManyToOne(() => MembershipYear, (membershipYear) => membershipYear.membershipFees, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'membership_year_id' })
  membershipYear?: MembershipYear | null;

  @Column({ name: 'territory_level_id', type: 'uuid', nullable: true })
  territoryLevelId!: string | null;

  @ManyToOne(() => TerritoryLevel, (territoryLevel) => territoryLevel.membershipFees, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'territory_level_id' })
  territoryLevel?: TerritoryLevel | null;

  @Column({ name: 'role_id', type: 'uuid', nullable: true })
  roleId!: string | null;

  @ManyToOne(() => Role, (role) => role.membershipFees, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'role_id' })
  role?: Role | null;

  @OneToMany(() => Membership, (membership) => membership.membershipFee)
  memberships!: Membership[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}