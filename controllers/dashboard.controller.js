const dashboardService = require("../services/dashboard.service");
const employeeService = require("../services/employee.service");

const attendanceSummaryCount = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
        present: 35,
        absent: 2,
        late: 6,
        on_leave: 3
    },
    message: "Attendance Summary Count Fetched Successfully...!"
  })
};

const EmployeesOnLeaveToday = async (req, res) => {
  const employees = await employeeService.getAllEmployees();
  const finalEmployees = await employees.map((employee) => {
    const empObj = employee.toObject();
    return {
      ...empObj,
      department : "Developement",
      start_date: '30-06-2025',
      end_date: '02-07-2025'
    }

  })
  res.status(201).json({
    success: true,
    data: finalEmployees,
    message: "fetched Employee List"
  });
};

const upcommingBirthday = async (req, res) => {
  const employees = await employeeService.getAllEmployees();
  const finalEmployees = await employees.map((employee) => {
    const empObj = employee.toObject();
    return {
      ...empObj,
      department : "Developement",
      Type: 'Birthday',
      date: '02-07-2025'
    }

  })
  res.status(201).json({
    success: true,
    data: finalEmployees,
    message: "fetched upcomming birthday and work anniversary List"
  });
};

const approvalPendings = async (req, res) => {  
  res.status(201).json({
    success: true,
    data: {
      timeSheets: 5,
      leave_request: 3,
      leaves_pendings_reviewer_approval: 4
    },
    message: "Approval Pendings List"
  });
};

// const myTasks = async (req, res) => {  
//   res.status(201).json({
//     success: true,
//     data: ['meeting with CS Team', 'meeting with tech Team'],
//     message: "fetched My Tasks List"
//   });
// };

const getTasks = async (req, res) => {  
  res.status(201).json({
    success: true,
    data: ['meeting with CS Team', 'meeting with tech Team'],
    message: "fetched My Tasks List"
  });
};

const addTask = async (req, res) => {  
  res.status(201).json({
    success: true,
    data: ['meeting with CS Team', 'meeting with tech Team'],
    message: "fetched My Tasks List"
  });
};

const updateTask = async (req, res) => {  
  res.status(201).json({
    success: true,
    data: ['meeting with CS Team', 'meeting with tech Team'],
    message: "fetched My Tasks List"
  });
};

const deleteTask = async (req, res) => {  
  res.status(201).json({
    success: true,
    data: ['meeting with CS Team', 'meeting with tech Team'],
    message: "fetched My Tasks List"
  });
};

module.exports = {
  attendanceSummaryCount,
  EmployeesOnLeaveToday,
  upcommingBirthday,
  approvalPendings,
  getTasks, addTask, updateTask, deleteTask
};
