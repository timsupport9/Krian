export default async (db) => {
  const plansExist = await db.queryOne('SELECT id FROM settings WHERE key = "subscription_plans_seeded"');
  
  if (plansExist) {
    console.log('Subscription plans already seeded, skipping');
    return;
  }

  const plans = [
    {
      name: 'Free',
      price: 0,
      billing_period: 'free',
      courses_limit: 5,
      appointments_limit: 1,
    },
    {
      name: 'Pro',
      price: 2999,
      billing_period: 'monthly',
      courses_limit: -1,
      appointments_limit: 10,
    },
    {
      name: 'Enterprise',
      price: 9999,
      billing_period: 'monthly',
      courses_limit: -1,
      appointments_limit: -1,
    },
  ];

  for (const plan of plans) {
    await db.query(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value=VALUES(value)',
      [`plan_${plan.name.toLowerCase()}`, JSON.stringify(plan)]
    );
  }

  await db.insert('settings', {
    key: 'subscription_plans_seeded',
    value: new Date().toISOString(),
  });

  console.log('Subscription plans seeded successfully');
};
