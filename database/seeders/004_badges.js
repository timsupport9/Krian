export default async (db) => {
  const badgesExist = await db.queryOne('SELECT id FROM badges LIMIT 1');
  
  if (badgesExist) {
    console.log('Badges already seeded, skipping');
    return;
  }

  const badges = [
    {
      name: 'First Course Completion',
      description: 'Complete your first course',
      criteria: 'complete_1_course',
    },
    {
      name: 'Course Master',
      description: 'Complete 5 or more courses',
      criteria: 'complete_5_courses',
    },
    {
      name: 'Quiz Expert',
      description: 'Score 100% on 3 quizzes',
      criteria: 'perfect_quizzes_3',
    },
    {
      name: 'Active Learner',
      description: 'Complete a course in less than a week',
      criteria: 'complete_course_week',
    },
  ];

  for (const badge of badges) {
    await db.insert('badges', badge);
  }

  console.log('Badges seeded successfully');
};
