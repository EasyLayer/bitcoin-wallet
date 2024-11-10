import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from '@easylayer/components/secure-storage';

@Entity('keys')
export class KeysViewModel {
  @PrimaryColumn({ type: 'varchar', length: 128 })
  @Index()
  public public_key_hash!: string;

  @Column({ type: 'varchar', length: 64, nullable: false })
  public private_key!: string;

  @Column({ type: 'varchar', nullable: true })
  public seed!: string | null; // Seed phrase (encrypted)

  @Column({ type: 'varchar', nullable: true })
  public mnemonic!: string | null; // Mnemonic phrase (encrypted)

  @ManyToOne(() => KeysViewModel, (key) => key.children, { nullable: true })
  @JoinColumn({ name: 'parent_hash' }) // Foreign key to the parent's public_key_hash
  public parent!: KeysViewModel | null; // Reference to the parent key

  @OneToMany(() => KeysViewModel, (key) => key.parent)
  public children!: KeysViewModel[]; // Relation to child keys
}
