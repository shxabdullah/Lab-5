class Person {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  introduce() {
    return `Hello, I am ${this.name} (${this.email}).`;
  }
}

class Student extends Person {
  constructor(name, email, rollNo, marks) {
    super(name, email);
    this.rollNo = rollNo;
    this.marks = marks;
  }

  introduce() {
    return `${super.introduce()} I am a student with Roll No: ${this.rollNo}.`;
  }

  getResult() {
    return this.marks >= 50 ? 'Passed' : 'Failed';
  }
}

class FacultyMember extends Person {
  constructor(name, email, employeeId, department) {
    super(name, email);
    this.employeeId = employeeId;
    this.department = department;
  }

  introduce() {
    return `${super.introduce()} I am a faculty member in ${this.department} department (ID: ${this.employeeId}).`;
  }
}

const users = [
  new Student('Sara', 'sara@uni.edu', 'CS-101', 88),
  new FacultyMember('Dr. Zafar', 'zafar@uni.edu', 'EMP-501', 'Computer Science'),
  new Student('Usman', 'usman@uni.edu', 'SE-202', 45)
];

users.forEach(user => console.log(user.introduce()));

const guest = {
  name: 'Dr. Ahmed',
  email: 'ahmed@example.com'
};

const guestIntroduction = Person.prototype.introduce.call(guest);
console.log('Guest Call Result:', guestIntroduction);

const sampleStudent = new Student('Hamza', 'hamza@uni.edu', 'AI-303', 75);
const detachedIntroduce = sampleStudent.introduce;

try {
  detachedIntroduce();
} catch (error) {
  console.log('Detached Method Call Error:', error.message);
}

const safelyBoundIntroduce = sampleStudent.introduce.bind(sampleStudent);
console.log('Bound Method Call Result:', safelyBoundIntroduce());
