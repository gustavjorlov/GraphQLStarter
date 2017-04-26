import {GraphQLSchema, GraphQLList, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt} from 'graphql';
var DataLoader = require('dataloader');

export const createSchema = db => {
  const Employee = new GraphQLObjectType({
    name: 'Employee',
    description: 'Nerd or programmer, what difference does it make?',
    fields: () => ({
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      colleagues: {
        type: new GraphQLList(Employee),
        resolve: (source, args) => {
          
        }
      },
      employer: { type: Company },
      skills: {
        type: new GraphQLList(Skill),
        resolve: (source, args) => {
          return db.Employee.find({
            where: {id: source.id},
            include: {model: db.Skill}
          }).then(employee => employee.Skills);
        }
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
      employees: { type: new GraphQLList(Employee) }
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
        resolve: (source, args) => {
          return db.Skill.find({
            where: {id: source.id},
            include: {model: db.Employee}
          }).then(skill => skill.Employees);
        }
      }
    })
  });

  const Query = new GraphQLObjectType({
    name: 'Query',
    description: 'The root query',
    fields: {
      employee: {
        type: Employee,
        args: {id: {type: new GraphQLNonNull(GraphQLString)}},
        resolve: (source, args) => {
          console.log({args});
          return db.Employee.find({where: {id: args.id}});
        }
      },
      skill: {
        type: Skill,
        args: {id: {type: new GraphQLNonNull(GraphQLString)}},
        resolve: (source, args) => db.Skill.find({where: {id: args.id}})
      },
      skills: {
        type: new GraphQLList(Skill),
        args: {
          limit: {type: GraphQLInt}
        },
        resolve: (source, args) => db.Skill.findAll({limit: args.limit || 2})
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
        resolve: (source, args) => {
          console.log('Creating company', args);
          return db.Company.create({
            name: args.name,
            address: args.address || 'in space'
          });
        }
      },
      addEmployee: {
        type: Company,
        args: {
          companyId: { type: new GraphQLNonNull(GraphQLString) },
          name: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: (source, args) => {
          console.log('Creating employee', args);
          return db.Employee.create({
            name: args.name,
            email: args.email
          }).then(_employee => _employee.setCompany(args.companyId));
        }
      },
      addSkill: {
        type: Skill,
        args: {
          title: {type: new GraphQLNonNull(GraphQLString)}
        },
        resolve: (source, {title}) => db.Skill.create({title})
      },
      addSkillToEmployee: {
        type: Skill,
        args: {
          employeeId: {type: new GraphQLNonNull(GraphQLString)},
          skillId: {type: new GraphQLNonNull(GraphQLString)}
        },
        resolve: (source, args) => {
          return db.Employee.find({where: {id: args.employeeId}}).then(_employee => {
            return _employee.addSkill(args.skillId);
          });
        }
      }
    }
  });

  return new GraphQLSchema({
    query: Query,
    mutation: Mutation
  });
};
