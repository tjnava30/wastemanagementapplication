import { useEffect, useState } from 'react';
import { supabase, Feedback } from '../lib/supabase';
import BarChart from './BarChart';
import { BarChart3, Users, BookOpen } from 'lucide-react';

interface CourseStats {
  course: string;
  teacher: string;
  totalResponses: number;
  avgContent: number;
  avgDelivery: number;
  avgPace: number;
  avgClarity: number;
  overallAvg: number;
}

export default function AdminDashboard() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);
  const [overallStats, setOverallStats] = useState({
    totalResponses: 0,
    avgContent: 0,
    avgDelivery: 0,
    avgPace: 0,
    avgClarity: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFeedback(data || []);
      calculateStats(data || []);
    } catch (err) {
      console.error('Error fetching feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Feedback[]) => {
    if (data.length === 0) return;

    const courseGroups = data.reduce((acc, item) => {
      const key = `${item.course}|${item.teacher}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as Record<string, Feedback[]>);

    const stats: CourseStats[] = Object.entries(courseGroups).map(([key, items]) => {
      const [course, teacher] = key.split('|');
      const totalResponses = items.length;
      const avgContent = items.reduce((sum, i) => sum + i.content_rating, 0) / totalResponses;
      const avgDelivery = items.reduce((sum, i) => sum + i.delivery_rating, 0) / totalResponses;
      const avgPace = items.reduce((sum, i) => sum + i.pace_rating, 0) / totalResponses;
      const avgClarity = items.reduce((sum, i) => sum + i.clarity_rating, 0) / totalResponses;
      const overallAvg = (avgContent + avgDelivery + avgPace + avgClarity) / 4;

      return {
        course,
        teacher,
        totalResponses,
        avgContent,
        avgDelivery,
        avgPace,
        avgClarity,
        overallAvg,
      };
    });

    setCourseStats(stats);

    const totalResponses = data.length;
    const avgContent = data.reduce((sum, i) => sum + i.content_rating, 0) / totalResponses;
    const avgDelivery = data.reduce((sum, i) => sum + i.delivery_rating, 0) / totalResponses;
    const avgPace = data.reduce((sum, i) => sum + i.pace_rating, 0) / totalResponses;
    const avgClarity = data.reduce((sum, i) => sum + i.clarity_rating, 0) / totalResponses;

    setOverallStats({
      totalResponses,
      avgContent,
      avgDelivery,
      avgPace,
      avgClarity,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (feedback.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Feedback Yet</h3>
        <p className="text-gray-600">Feedback submissions will appear here once students start submitting their responses.</p>
      </div>
    );
  }

  const selectedStats = selectedCourse
    ? courseStats.find((s) => s.course === selectedCourse)
    : null;

  const displayStats = selectedStats || overallStats;
  const chartData = [
    { label: 'Content Quality', value: selectedStats?.avgContent || overallStats.avgContent },
    { label: 'Delivery & Teaching', value: selectedStats?.avgDelivery || overallStats.avgDelivery },
    { label: 'Pace of Teaching', value: selectedStats?.avgPace || overallStats.avgPace },
    { label: 'Clarity of Explanation', value: selectedStats?.avgClarity || overallStats.avgClarity },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Responses</p>
              <p className="text-3xl font-bold mt-1">
                {selectedStats?.totalResponses || overallStats.totalResponses}
              </p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Courses</p>
              <p className="text-3xl font-bold mt-1">{courseStats.length}</p>
            </div>
            <BookOpen className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Overall Average</p>
              <p className="text-3xl font-bold mt-1">
                {selectedStats
                  ? selectedStats.overallAvg.toFixed(2)
                  : (
                      (overallStats.avgContent +
                        overallStats.avgDelivery +
                        overallStats.avgPace +
                        overallStats.avgClarity) /
                      4
                    ).toFixed(2)}
              </p>
            </div>
            <BarChart3 className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Course
          </label>
          <select
            value={selectedCourse || ''}
            onChange={(e) => setSelectedCourse(e.target.value || null)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Courses</option>
            {courseStats.map((stat) => (
              <option key={stat.course} value={stat.course}>
                {stat.course} - {stat.teacher}
              </option>
            ))}
          </select>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-6">
          {selectedStats
            ? `${selectedStats.course} - ${selectedStats.teacher}`
            : 'Average Ratings Across All Courses'}
        </h3>

        <BarChart data={chartData} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Course-wise Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Course</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Teacher</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Responses</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Content</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Delivery</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Pace</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Clarity</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Overall</th>
              </tr>
            </thead>
            <tbody>
              {courseStats.map((stat) => (
                <tr key={stat.course} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800 font-medium">{stat.course}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{stat.teacher}</td>
                  <td className="py-3 px-4 text-sm text-center text-gray-800">{stat.totalResponses}</td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {stat.avgContent.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {stat.avgDelivery.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {stat.avgPace.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {stat.avgClarity.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded font-semibold">
                      {stat.overallAvg.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
