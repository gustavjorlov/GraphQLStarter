export const WorkService = ({Employee, Skill, Company}) => {
  return {
    
    // Mutations
    createEmployee: _employee => Employee.create(_employee),
    createSkill: _skill => Skill.create(_skill),
    createCompany: _company => Company.create(_company),
    addSkillToEmployee: (skillId, employeeId) => Skill.find({where: {id: skillId}}).then(_skill => {
      return _skill.addEmployee(employeeId);
    }),
    addEmployeeToCompany: (employeeId, companyId) => {
      return Employee.find({where: {id: employeeId}}).then(_emp => _emp.setCompany(companyId));
    },

    // Employee getters
    getEmployeesBatch: ids => {
      console.log('getEmployeesBatch', ids);
      return Employee.findAll({
        where: {id: {$in: ids}},
        include: [
          {model: Skill, attributes: ['id']},
          {model: Company, attributes: ['id']}
        ]
      })
    },
    getEmployees: (limit = 2) => Employee.findAll({
      limit,
      include: [
        {model: Skill, attributes: ['id']},
        {model: Company, attributes: ['id']}
      ]
    }),

    // Skill getters
    getSkill: id => {
      console.log('getSkill', id);  
      return Skill.find({
        where: {id},
        include: {model: Employee, attributes: ['id']}
      });
    },
    getSkills: (limit = 2) => Skill.findAll({
      limit,
      include: {model: Employee, attributes: ['id']}
    }),
    getSkillsBatch: ids => {
      console.log('getSkillsBatch', ids)
      return Skill.findAll({
        where: {id: {$in: ids}},
        include: {model: Employee, attributes: ['id']}
      })
    },

    // Company getters
    getCompanies: (limit = 2) => Company.findAll({
      limit,
      include: {model: Employee, attributes: ['id']}
    }),
    getCompaniesBatch: ids => {
      console.log('getCompaniesBatch', ids);
      return Company.findAll({
        where: {id: {$in: ids}},
        include: {model: Employee, attributes: ['id']}
      });
    }
  };
}