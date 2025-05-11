/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable(
    'users',
    {
      id: 'id',
      name: { type: 'varchar(255)', notNull: true },
      email: { type: 'varchar(255)', notNull: true, unique: true },
      created_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func('current_timestamp')
      }
    },
    {
      ifNotExists: true
    }
  );

  pgm.createTable(
    'sso_accounts',
    {
      id: 'id',
      user_id: { type: 'integer', notNull: true, references: '"users"', onDelete: 'CASCADE' },
      provider: { type: 'TEXT', notNull: true },
      provider_id: { type: 'TEXT', notNull: true }
    },
    {
      ifNotExists: true
    }
  );

  pgm.addConstraint('sso_accounts', 'sso_accounts_provider_provider_id_unique', {
    unique: ['provider', 'provider_id']
  });

  pgm.createIndex('users', ['name', 'email']);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('users', { ifExists: true });
};
