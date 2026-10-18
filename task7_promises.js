function getStudent(studentId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (studentId === 101) {
        resolve({ id: studentId, name: 'Ali', prereqsCompleted: true });
      } else {
        reject(new Error('Student record not found'));
      }
    }, 100);
  });
}

function getCourse(courseCode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (courseCode !== 'INVALID') {
        resolve({ code: courseCode, title: 'Advanced JS', maxCapacity: 30 });
      } else {
        reject(new Error('Course does not exist'));
      }
    }, 100);
  });
}

function checkPrerequisites(student, course) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (student.prereqsCompleted) {
        resolve({ student, course, eligible: true });
      } else {
        reject(new Error('Prerequisites not satisfied'));
      }
    }, 100);
  });
}

function checkSeats(course) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (course.code !== 'FULL101') {
        resolve({ course, available: true });
      } else {
        reject(new Error('No seats available'));
      }
    }, 100);
  });
}

function registerStudent(student, course) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ studentId: student.id, course: course.code, status: 'REGISTERED' });
    }, 100);
  });
}

function sendEmail(student) {
  return new Promise((resolve) => setTimeout(() => resolve('Email sent to ' + student.id), 100));
}

function sendSMS(student) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('SMS service offline')), 100));
}

function writeAuditLog(student, course) {
  return new Promise((resolve) => setTimeout(() => resolve(`Audit logged for ${student.id} in ${course}`), 100));
}

function runRegistrationChain(studentId, courseCode) {
  let studentRef;
  let courseRef;

  return getStudent(studentId)
    .then(student => {
      studentRef = student;
      return getCourse(courseCode);
    })
    .then(course => {
      courseRef = course;
      return checkPrerequisites(studentRef, courseRef);
    })
    .then(() => checkSeats(courseRef))
    .then(() => registerStudent(studentRef, courseRef))
    .then(registration => {
      console.log('Registration Chain Complete:', registration);
      return runPostRegistrationServices(studentRef, courseRef.code);
    })
    .catch(error => {
      console.error('Registration Chain Failed:', error.message);
    })
    .finally(() => {
      console.log('Registration Workflow Settled.');
    });
}

function runPostRegistrationServices(student, courseCode) {
  return Promise.allSettled([
    sendEmail(student),
    sendSMS(student),
    writeAuditLog(student, courseCode)
  ]).then(results => {
    const services = ['Email', 'SMS', 'Audit'];
    const report = results.map((res, index) => ({
      service: services[index],
      status: res.status
    }));
    console.log('Post-Registration Report:', report);
    return report;
  });
}

function fetchCourseFromFastestServer(courseCode) {
  const server1 = new Promise((resolve) => {
    setTimeout(() => resolve({ code: courseCode, server: 'Server 1' }), 150);
  });

  const server2 = new Promise((resolve) => {
    setTimeout(() => resolve({ code: courseCode, server: 'Server 2' }), 80);
  });

  return Promise.any([server1, server2])
    .then(result => {
      console.log('First successful server returned:', result);
      return result;
    });
}

runRegistrationChain(101, 'CS401')
  .then(() => fetchCourseFromFastestServer('CS401'));