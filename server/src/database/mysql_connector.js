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

// const _insertDefaultData = handles => {
//   const _companies = companyHandle => {
//     const companyData = [
//       {name: 'KITS AB', address: 'Norra Allégatan 8'},
//       {name: 'Home Office', address: 'At home'}
//     ];
//   };
//   const _employees = employeeHandle => {
//     const employeeData = [
//       {name: 'Gustav',email: 'gustav@mail.com'},
//       {name: 'Robert',email: 'robert@mail.com'},
//       {name: 'Anders',email: 'anders@mail.com'},
//       {name: 'Emil',email: 'emil@mail.com'}
//     ];
//     return Promise.all(employeeData.map(emp => {
//       return employeeHandle.find({where: {email: emp.email}})
//         .then(employee => employee ? employee : employeeHandle.create(emp));
//     }));
//   };
//   return _companies.then(companies).
//     // create companies, and let the employees be hired by a company
//   _employees(handles.Employee);
// };

export const connectDB = dbConfig => {
  const sequelize = _initiateSequelize(dbConfig);
  const tableHandles = _defineTables(sequelize);

  console.log('Connect');

  return sequelize.sync()
    // .then(() => _insertDefaultData(tableHandles))
    .then(() => tableHandles)
    .catch(err => {
      console.log(':(', {err});
      return err;
    });
};
