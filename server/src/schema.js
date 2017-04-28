import {GraphQLSchema, GraphQLList, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt} from 'graphql';
var DataLoader = require('dataloader');

export const createSchema = dbService => {
  const employeeLoader = new DataLoader(keys => dbService.getEmployeesBatch(keys));
  const skillLoader = new DataLoader(keys => dbService.getSkillsBatch(keys));
  const companyLoader = new DataLoader(keys => dbService.getCompaniesBatch(keys));

  const Employee = new GraphQLObjectType({
    name: 'Employee',
    description: 'Nerd or programmer, what difference does it make?',
    fields: () => ({
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      company: {
        type: Company,
        resolve: (source) => source.Company ? companyLoader.load(source.Company.id) : null
      },
      skills: {
        type: new GraphQLList(Skill),
        resolve: (source, args) => source.Skills.map(_skill => skillLoader.load(_skill.id))
      }
    })
  });
  const Company = new GraphQLObjectType({
    name: 'Company',
    description: 'Workplace',
    fields: {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      address: { type: GraphQLString },
      employees: { 
        type: new GraphQLList(Employee),
        resolve: source => employeeLoader.loadMany(source.Employees.map(_emp => _emp.id))
      }
    }
  });
  const Skill = new GraphQLObjectType({
    name: 'Skill',
    description: "A thing you know and don't know",
    fields: () => ({
      id: { type: GraphQLString },
      title: { type: GraphQLString },
      masters: {
        type: new GraphQLList(Employee),
        resolve: (source) => employeeLoader.loadMany(source.Employees.map(_emp => _emp.id))
      }
    })
  });

  const Query = new GraphQLObjectType({
    name: 'Query',
    description: 'The root query',
    fields: {
      company: {
        type: Company,
        args: {id: {type: new GraphQLNonNull(GraphQLString)}},
        resolve: (source, {id}) => companyLoader.load(id)
      },
      companies: {
        type: new GraphQLList(Company),
        args: {limit: {type: GraphQLInt}},
        resolve: (sourve, {limit}) => dbService.getCompanies(limit)
      },
      employee: {
        type: Employee,
        args: {id: {type: new GraphQLNonNull(GraphQLString)}},
        resolve: (source, args) => employeeLoader.load(args.id)
      },
      employees: {
        type: new GraphQLList(Employee),
        args: {limit: {type: GraphQLInt}},
        resolve: (source, {limit}) => dbService.getEmployees(limit)
      },
      skill: {
        type: Skill,
        args: {id: {type: new GraphQLNonNull(GraphQLString)}},
        resolve: (source, {id}) => skillLoader.load(id)
      },
      skills: {
        type: new GraphQLList(Skill),
        args: {limit: {type: GraphQLInt}},
        resolve: (source, {limit}) => dbService.getSkills(limit)
      }
    }
  });

  const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'The root mutation',
    fields: {
      addCompany: {
        type: Company,
        args: {
          name: { type: new GraphQLNonNull(GraphQLString) },
          address: { type: GraphQLString }
        },
        resolve: (source, {name, address}) => dbService.createCompany({name, address})
      },
      addEmployee: {
        type: Company,
        args: {
          name: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: (source, {name, email}) => dbService.createEmployee({name, email})
      },
      addEmployeeToCompany: {
        type: Employee,
        args: {
          employeeId: {type: new GraphQLNonNull(GraphQLString)},
          companyId: {type: new GraphQLNonNull(GraphQLString)}
        },
        resolve: (source, {employeeId, companyId}) => {
          employeeLoader.clearAll();
          companyLoader.clearAll();
          return dbService.addEmployeeToCompany(employeeId, companyId);
        }
      },
      addSkill: {
        type: Skill,
        args: {
          title: {type: new GraphQLNonNull(GraphQLString)}
        },
        resolve: (source, {title}) => dbService.createSkill({title})
      },
      addSkillToEmployee: {
        type: Skill,
        args: {
          employeeId: {type: new GraphQLNonNull(GraphQLString)},
          skillId: {type: new GraphQLNonNull(GraphQLString)}
        },
        resolve: (source, {employeeId, skillId}) => {
          employeeLoader.clearAll();
          return dbService.addSkillToEmployee(skillId, employeeId)
        }
      }
    }
  });

  return new GraphQLSchema({
    query: Query,
    mutation: Mutation
  });
};
