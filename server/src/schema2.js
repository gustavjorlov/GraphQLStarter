import {GraphQLSchema, GraphQLList, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt} from 'graphql';
var DataLoader = require('dataloader');

export const createSchema = dbService => {
  const employeeLoader = new DataLoader(keys => dbService.getEmployeesBatch(keys), { cache: false });
  const skillLoader = new DataLoader(keys => dbService.getSkillsBatch(keys), { cache: false });
  const companyLoader = new DataLoader(keys => dbService.getCompaniesBatch(keys), { cache: false });
  const employeesByCompanyLoader = new DataLoader(keys => dbService.getEmployeesByCompaniesBatch(keys), { cache: false });
  const companyByEmployeeLoader = new DataLoader(keys => dbService.getCompanyByEmployeeBatch(keys), { cache: false });

  const Employee = new GraphQLObjectType({
    name: 'Employee',
    description: 'Nerd or programmer, what difference does it make?',
    fields: () => ({
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      employer: {
        type: Company,
        resolve: ({id}) => companyByEmployeeLoader.load(id)
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
        resolve: ({id}, args) => dbService.getEmployeesByCompany(id)
        // resolve: ({id}, args) => employeesByCompanyLoader.load(id) //nope.. doesn't return array of same length...
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
        resolve: (source, args) => dbService.getEmployeeKeysBySkillId(source.id).then(_empKeys => {
          return _empKeys.map(_empKey => employeeLoader.load(_empKey));
        })
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
        resolve: (sourve, args) => dbService.getCompanies()
      },
      employee: {
        type: Employee,
        args: {id: {type: new GraphQLNonNull(GraphQLString)}},
        resolve: (source, args) => employeeLoader.load(args.id)
      },
      employees: {
        type: new GraphQLList(Employee),
        resolve: () => dbService.getEmployees()
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
          companyId: { type: new GraphQLNonNull(GraphQLString) },
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
        resolve: (source, {employeeId, companyId}) => dbService.addEmployeeToCompany(employeeId, companyId)
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
        resolve: (source, {employeeId, skillId}) => dbService.addSkillToEmployee(skillId, employeeId)
      }
    }
  });

  return new GraphQLSchema({
    query: Query,
    mutation: Mutation
  });
};
