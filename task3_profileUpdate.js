const student = {
  id: 101,
  name: 'Ali',
  marks: 0,
  scholarship: false,
  address: {
    city: 'Islamabad',
    sector: 'F-10'
  },
  contact: {
    email: 'ali@university.edu'
  }
};

const update = {
  name: 'Ali Khan',
  address: {
    city: 'Rawalpindi'
  },
  contact: {
    phone: '03001234567'
  }
};

function updateStudentProfile(original, updateData = {}) {
  const { address: updateAddress = {}, contact: updateContact = {}, ...restUpdate } = updateData;
  const { address: origAddress = {}, contact: origContact = {}, ...restOriginal } = original;

  const [firstChar = ''] = (updateAddress.city ?? origAddress.city ?? '');

  const newAddress = {
    ...origAddress,
    ...updateAddress,
    city: updateAddress.city ?? origAddress.city,
    sector: updateAddress.sector ?? origAddress.sector
  };

  const newContact = {
    ...origContact,
    ...updateContact,
    email: updateContact.email ?? origContact.email,
    phone: updateContact.phone ?? origContact.phone
  };

  return {
    ...restOriginal,
    ...restUpdate,
    address: newAddress,
    contact: newContact
  };
}

const updatedStudent = updateStudentProfile(student, update);

console.log('Original Student:', student);
console.log('Updated Student:', updatedStudent);

console.log('Root comparison (student === updatedStudent):', student === updatedStudent);
console.log('Address comparison (student.address === updatedStudent.address):', student.address === updatedStudent.address);
console.log('Contact comparison (student.contact === updatedStudent.contact):', student.contact === updatedStudent.contact);