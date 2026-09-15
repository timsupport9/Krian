export default async (db) => {
  const categoriesExist = await db.queryOne('SELECT id FROM settings WHERE key = "course_categories_seeded"');
  
  if (categoriesExist) {
    console.log('Course categories already seeded, skipping');
    return;
  }

  const categories = [
    { name: 'Technology', slug: 'technology' },
    { name: 'Business', slug: 'business' },
    { name: 'Design', slug: 'design' },
    { name: 'Marketing', slug: 'marketing' },
    { name: 'Health & Wellness', slug: 'health-wellness' },
    { name: 'Personal Development', slug: 'personal-development' },
  ];

  for (const category of categories) {
    await db.query(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value=VALUES(value)',
      [`category_${category.slug}`, category.name]
    );
  }

  await db.insert('settings', {
    key: 'course_categories_seeded',
    value: new Date().toISOString(),
  });

  console.log('Course categories seeded successfully');
};
