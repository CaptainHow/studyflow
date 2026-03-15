import { describe, it, expect } from 'vitest';
import { fetchCoursesAPI, calculateCourseProgress, getPendingTasksSorted } from './courseService';

describe('Frontend API Endpoint and Core Business Logic', () => {

  // 1. 测试 "API Endpoint" 等效功能 (前端请求层)
  describe('API Endpoint: fetchCoursesAPI', () => {
    it('should successfully fetch the list of courses (Simulated Endpoint)', async () => {
      const courses = await fetchCoursesAPI();
      expect(courses).toBeDefined();
      expect(Array.isArray(courses)).toBe(true);
      expect(courses.length).toBeGreaterThan(0);
      expect(courses[0]).toHaveProperty('id');
      expect(courses[0]).toHaveProperty('name');
    });
  });

  // 2. 测试 "Core Business Logic / Models"
  describe('Core Business Logic: calculateCourseProgress', () => {
    it('should calculate 50% progress when half tasks are completed for a specific course', () => {
      const mockTasks = [
        { id: 1, courseId: 'c1', status: 'completed' },
        { id: 2, courseId: 'c1', status: 'pending' },
        { id: 3, courseId: 'c2', status: 'pending' } // 属于其他课程的任务
      ];
      const progress = calculateCourseProgress('c1', mockTasks);
      expect(progress).toBe(50);
    });

    it('should return 0% progress when course has no tasks', () => {
      const progress = calculateCourseProgress('c3', []);
      expect(progress).toBe(0);
    });
  });

  describe('Core Business Logic: getPendingTasksSorted', () => {
    it('should filter out completed tasks and sort remaining tasks by due date', () => {
      const mockTasks = [
        { id: 1, status: 'completed', due: '2023-10-10' },
        { id: 2, status: 'pending', due: '2023-10-15' },
        { id: 3, status: 'pending', due: '2023-10-12' },
      ];
      const pending = getPendingTasksSorted(mockTasks);
      
      expect(pending.length).toBe(2);
      // 验证排序：10-12 应该排在 10-15 前面
      expect(pending[0].id).toBe(3); 
      expect(pending[1].id).toBe(2);
    });
  });
});
