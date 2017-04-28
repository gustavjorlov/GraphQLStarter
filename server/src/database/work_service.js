export const WorkService = ({Employee, Skill, Company, EmployeeSkill}) => {
  const getCompanyByEmployeeId = id => Employee.find({where: {id}, include: {model: Company}}).then(_emp => _emp.Company);
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
    getEmployee: id => Employee.find({where: {id: id}}),
    getEmployeesBatch: ids => {
      console.log('getEmployeesBatch', ids);
      return Employee.findAll({
        where: {id: {$in: ids}},
        include: {
          model: Skill, attributes: ['id']
        }
      })
    },
    getEmployees: () => Employee.findAll(),
    getEmployeeKeysBySkillId: skillId => EmployeeSkill.findAll({where: {skillId}}).then(combos => {
      return combos.map(combo => combo.employeeId);
    }),
    getEmployeesByCompany: companyId => Employee.findAll({where: {companyId}}),
    getEmployeesByCompaniesBatch: companyIds => {
      return Employee.findAll({where: {companyId: {$in: companyIds}}});
    },

    // Skill getters
    getSkill: id => Skill.find({where: {id}}),
    getSkills: (limit = 2) => Skill.findAll({limit}),
    getSkillKeysByEmployeeId: employeeId => EmployeeSkill.findAll({where: {employeeId}}).then(combos => {
      return combos.map(combo => combo.skillId);
    }),
    getSkillsBatch: ids => {
      console.log('getSkillsBatch', ids)
      return Skill.findAll({where: {id: {$in: ids}}})
    },

    // Company getters
    getCompany: id => Company.find({where: {id}}),
    getCompanies: () => Company.findAll(),
    getCompaniesBatch: ids => {
      console.log('getCompaniesBatch', ids);
      return Company.findAll({where: {id: {$in: ids}}});
    },
    getCompanyByEmployeeId,
    getCompanyByEmployeeBatch: ids => {
      return Employee.findAll({
        where: {id: {$in: ids}},
        include: {model: Company}
      }).then(_employees => _employees.map(_emp => _emp.Company));
    }
  };
}