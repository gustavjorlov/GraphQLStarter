const Sequelize = require('sequelize');

const _defineTables = sequelize => {
  const Employee = sequelize.define('Employee', {
    name: {type: Sequelize.STRING},
    email: {type: Sequelize.STRING, unique: true}
  }, {freezeTableName: true});
  const Skill = sequelize.define('Skill', {
    title: {type: Sequelize.STRING}
  }, {freezeTableName: true});
  const Company = sequelize.define('Company', {
    name: {type: Sequelize.STRING},
    address: {type: Sequelize.STRING}
  }, {freezeTableName: true});

  const EmployeeSkill = sequelize.define('EmployeeSkill', {}, {freezeTableName: true});

  Employee.belongsToMany(Skill, {through: EmployeeSkill, foreignKey: 'employeeId'});
  Skill.belongsToMany(Employee, {through: EmployeeSkill, foreignKey: 'skillId'});

  Employee.belongsTo(Company, {foreignKey: 'companyId'});
  Company.hasMany(Employee, {foreignKey: 'companyId'});

  return {Employee, Skill, Company, EmployeeSkill};
};

const _initiateSequelize = dbConfig => {
  return new Sequelize(dbConfig.database, dbConfig.userName, dbConfig.password, {
    host: dbConfig.host, dialect: dbConfig.dialect,
    pool: { max: 5, min: 0, idle: 10000 }, logging: dbConfig.logging
  });
};

export const connectDB = dbConfig => {
  const sequelize = _initiateSequelize(dbConfig);
  const tableHandles = _defineTables(sequelize);

  console.log('Connected');

  return sequelize.sync()
    .then(() => tableHandles)
    .catch(err => {
      console.log(':(', {err});
      return err;
    });
};
