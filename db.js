import pg from 'pg';

export default new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'market',
    password: '',
    port: 5432,
});