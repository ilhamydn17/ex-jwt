import { Sequelize } from "sequelize";

const db = new Sequelize('jwt_auth', 'root', 'ilhamyudantyo', {host: '127.0.0.1', dialect: 'mysql'});

export default db