export default async (db) => {
  const adminExists = await db.queryOne('SELECT id FROM users WHERE role = "admin" LIMIT 1');
  
  if (adminExists) {
    console.log('Admin user already exists, skipping seeder');
    return;
  }

  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.default.hash('admin@123', 10);

  await db.insert('users', {
    name: 'Administrator',
    email: 'admin@experthub.com',
    phone: '+254712345678',
    password: hashedPassword,
    role: 'admin',
    status: 'active',
    email_verified_at: new Date(),
  });

  console.log('Admin user created successfully');
};
