export default class CourseService {
  constructor(courseModel, enrollmentModel, logger) {
    this.courseModel = courseModel;
    this.enrollmentModel = enrollmentModel;
    this.logger = logger;
  }

  async createCourse(data, expertId) {
    try {
      const courseData = {
        ...data,
        expert_id: expertId,
        status: 'draft',
      };

      const result = await this.courseModel.create(courseData);
      this.logger.info(`Course created: ${data.title}`);
      return result;
    } catch (error) {
      this.logger.error('Course creation error:', error);
      throw error;
    }
  }

  async publishCourse(courseId) {
    try {
      await this.courseModel.update(courseId, { status: 'published' });
      this.logger.info(`Course published: ${courseId}`);
    } catch (error) {
      this.logger.error('Course publish error:', error);
      throw error;
    }
  }

  async enrollUser(userId, courseId) {
    try {
      const enrollment = await this.enrollmentModel.findByUserAndCourse(userId, courseId);

      if (enrollment) {
        throw new Error('User already enrolled in this course');
      }

      const result = await this.enrollmentModel.create({
        user_id: userId,
        course_id: courseId,
        status: 'active',
      });

      // Update enrolled count
      const course = await this.courseModel.find(courseId);
      await this.courseModel.update(courseId, {
        enrolled_count: (course.enrolled_count || 0) + 1,
      });

      this.logger.info(`User ${userId} enrolled in course ${courseId}`);
      return result;
    } catch (error) {
      this.logger.error('Enrollment error:', error);
      throw error;
    }
  }

  async getCourseProgress(userId, courseId) {
    try {
      const enrollment = await this.enrollmentModel.findByUserAndCourse(userId, courseId);
      return enrollment?.progress_percentage || 0;
    } catch (error) {
      this.logger.error('Progress retrieval error:', error);
      throw error;
    }
  }
}
