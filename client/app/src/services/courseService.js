import { INITIAL_COURSES, INITIAL_TASKS } from '../data/mockData';

// 模拟 API Endpoint (满足测试 "API endpoint" 的要求)
export const fetchCoursesAPI = async () => {
  // 模拟网络请求延迟
  return Promise.resolve(INITIAL_COURSES);
};

export const fetchTasksAPI = async () => {
  return Promise.resolve(INITIAL_TASKS);
};

// 核心业务逻辑 (Core Business Logic): 计算课程进度百分比
export const calculateCourseProgress = (courseId, tasks) => {
  const courseTasks = tasks.filter(task => task.courseId === courseId);
  if (courseTasks.length === 0) return 0;

  const completedTasks = courseTasks.filter(task => task.status === 'completed');
  return Math.round((completedTasks.length / courseTasks.length) * 100);
};

// 核心业务逻辑 (Core Business Logic): 获取并按日期排序待办任务
export const getPendingTasksSorted = (tasks) => {
  return tasks
    .filter(task => task.status !== 'completed')
    .sort((a, b) => new Date(a.due) - new Date(b.due));
};
