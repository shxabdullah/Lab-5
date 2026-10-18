function loadStudent(studentId, callback) {
  setTimeout(() => {
    if (studentId !== 101) {
      return callback(new Error('Student does not exist'), null);
    }
    callback(null, { id: studentId, name: 'Ali', completedPrereq: true });
  }, 100);
}

function checkPrerequisites(student, courseCode, callback) {
  setTimeout(() => {
    if (!student.completedPrereq) {
      return callback(new Error('Prerequisite not completed'), null);
    }
    callback(null, { student, courseCode, prereqPassed: true });
  }, 100);
}

function checkAvailableSeats(courseCode, callback) {
  setTimeout(() => {
    if (courseCode === 'FULL101') {
      return callback(new Error('Course is full'), null);
    }
    callback(null, { courseCode, seatsAvailable: true });
  }, 100);
}

function registerCourse(studentId, courseCode, callback) {
  setTimeout(() => {
    if (courseCode === 'CS400') {
      return callback(new Error('Student already registered'), null);
    }
    callback(null, { studentId, course: courseCode, status: 'REGISTERED' });
  }, 100);
}

function registerStudentPipeline(studentId, courseCode, finalCallback) {
  loadStudent(studentId, (err1, student) => {
    if (err1) return finalCallback(err1, null);

    checkPrerequisites(student, courseCode, (err2, prereqData) => {
      if (err2) return finalCallback(err2, null);

      checkAvailableSeats(courseCode, (err3, seatData) => {
        if (err3) return finalCallback(err3, null);

        registerCourse(studentId, courseCode, (err4, registration) => {
          if (err4) return finalCallback(err4, null);

          finalCallback(null, registration);
        });
      });
    });
  });
}

registerStudentPipeline(101, 'CS401', (err, result) => {
  if (err) {
    console.error('Registration Failed:', err.message);
  } else {
    console.log('Registration Successful:', result);
  }
});

registerStudentPipeline(999, 'CS401', (err, result) => {
  if (err) {
    console.error('Registration Failed:', err.message);
  } else {
    console.log('Registration Successful:', result);
  }
});