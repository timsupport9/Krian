export default async (db) => {
  const rolesExist = await db.queryOne('SELECT id FROM settings WHERE key = "roles_seeded"');
  
  if (rolesExist) {
    console.log('Roles already seeded, skipping');
    return;
  }

  const roles = ['student', 'expert', 'corporate', 'admin'];
  
  for (const role of roles) {
    await db.query(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value=VALUES(value)',
      [`role_${role}_created`, new Date().toISOString()]
    );
  }

  await db.insert('settings', {
    key: 'roles_seeded',
    value: new Date().toISOString(),
  });

  console.log('Roles seeded successfully');
};
