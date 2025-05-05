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

    pgm.createFunction('timestamp_z', [], {
        returns: 'timestamp',
        replace: true,
        language: 'sql'
    },
    `
    select CURRENT_TIMESTAMP at time zone 'utc';
    `
    );

    pgm.addColumns('comments', {
        created_date: {type: 'timestamp', default: pgm.func('timestamp_z()'), notNull: true}
    });

    pgm.addColumns('threads', {
        created_date: {type: 'timestamp', default: pgm.func('timestamp_z()'), notNull: true}
    });

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropColumn('threads', 'createdDate');
    pgm.dropColumn('comments', 'createdDate');
    pgm.dropFunction('timestamp_z');
};
