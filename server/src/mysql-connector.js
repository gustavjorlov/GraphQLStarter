const Sequelize = require('sequelize');

const _defineTables = sequelize => {
  const User = sequelize.define('User', {
    email: {type: Sequelize.STRING, unique: true},
    firstName: {type: Sequelize.STRING},
    lastName: {type: Sequelize.STRING},
    phoneNumber: {type: Sequelize.STRING},
    address: {type: Sequelize.STRING},
    city: {type: Sequelize.STRING},
    postalCode: {type: Sequelize.STRING},
    country: {type: Sequelize.STRING}
  }, {freezeTableName: true});
  const Permission = sequelize.define('Permission', {
    permission: {type: Sequelize.STRING, primaryKey: true}
  }, {freezeTableName: true});
  const Reseller = sequelize.define('Reseller', {
    resellerNumber: {type: Sequelize.STRING},
    resellerName: {type: Sequelize.STRING},
    additionalReference: {type: Sequelize.STRING},
    address: {type: Sequelize.STRING},
    phoneNumber: {type: Sequelize.STRING},
    city: {type: Sequelize.STRING},
    postalCode: {type: Sequelize.STRING},
    country: {type: Sequelize.STRING}
  }, {freezeTableName: true});
  const Customer = sequelize.define('Customer', {
    customerNumber: {type: Sequelize.STRING},
    customerName: {type: Sequelize.STRING},
    additionalReference: {type: Sequelize.STRING},
    phoneNumber: {type: Sequelize.STRING},
    address: {type: Sequelize.STRING},
    city: {type: Sequelize.STRING},
    postalCode: {type: Sequelize.STRING},
    country: {type: Sequelize.STRING}
  }, {freezeTableName: true});
  const BillingParameter = sequelize.define('BillingParameter', {
    testReadyModeEnabled: {type: Sequelize.BOOLEAN},
    numberOfDaysForTestPeriod: {type: Sequelize.DOUBLE},
    numberOfRequestsForTestPeriod: {type: Sequelize.DOUBLE},
    numberOfRequestsForTestPeriodEnabled: {type: Sequelize.BOOLEAN},
    dataStorageMegabytes: {type: Sequelize.DOUBLE},
    bundleNumber: {type: Sequelize.DOUBLE}
  }, {freezeTableName: true});
  const Solution = sequelize.define('Solution', {
    deploymentRegion: {type: Sequelize.STRING},
    deploymentGroup: {type: Sequelize.STRING},
    hostName: {type: Sequelize.STRING},
    awsAccountNumber: {type: Sequelize.STRING},
    stackName: {type: Sequelize.STRING},
    enableSignup: {type: Sequelize.BOOLEAN, defaultValue: true},
    dcpUserName: {type: Sequelize.STRING},
    dcpPassword: {type: Sequelize.STRING}
  }, {freezeTableName: true});

  const UserReseller = sequelize.define('UserReseller', {}, {freezeTableName: true});
  const UserPermission = sequelize.define('UserPermission', {}, {freezeTableName: true});

  User.belongsToMany(Reseller, {through: UserReseller, foreignKey: 'userId'});
  Reseller.belongsToMany(User, {through: UserReseller, foreignKey: 'resellerId'});

  User.belongsToMany(Permission, {through: UserPermission, foreignKey: 'userId'});
  Permission.belongsToMany(User, {through: UserPermission, foreignKey: 'permission'});

  Customer.belongsTo(Reseller, {foreignKey: 'resellerId'});
  Reseller.hasMany(Customer, {foreignKey: 'resellerId'});

  Customer.belongsTo(BillingParameter, {foreignKey: 'billingParameterId'});
  BillingParameter.hasMany(Customer, {foreignKey: 'billingParameterId'});

  Customer.belongsTo(Solution, {foreignKey: 'solutionId'});
  Solution.hasMany(Customer, {foreignKey: 'solutionId'});

  return {User, Permission, Reseller, Customer, UserReseller, UserPermission, BillingParameter, Solution};
};


const _initiateSequelize = dbConfig => {
  return new Sequelize(dbConfig.database, dbConfig.userName, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    logging: dbConfig.logging
  });
};

export const connectDB = dbConfig => {
  const sequelize = _initiateSequelize(dbConfig);
  const tableHandles = _defineTables(sequelize);

  return sequelize.sync()
    .then(() => tableHandles)
    .catch(err => {
      console.log(':(', {err});
      return err;
    });
};
