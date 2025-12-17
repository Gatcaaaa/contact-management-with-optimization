export async function generateDummyData(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    firstName: `User${i}`,
    lastName: `Test${i}`,
    email: `user.test.${i}@example.com`,
    phoneNumber: `08000000${i}`,
  }))
}