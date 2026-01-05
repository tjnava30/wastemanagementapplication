import React from 'react';
import { Users, Truck, CheckSquare, BarChart2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

export function GovernmentDashboard() {
  const { workers, weatherData } = useApp();
  const { t, i18n } = useTranslation();

  const activeWorkers = workers.filter(w => w.status === 'on-duty' || w.status === 'active').length;
  const totalTasks = workers.reduce((sum, worker) => sum + worker.tasksCompleted, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t('governmentDashboardTitle')}</h2>
        <p className="text-gray-600 mt-1">{t('governmentTagline')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4"><Users className="h-8 w-8 text-blue-500" /><div><p className="text-gray-600">{t('activeWorkers')}</p><p className="text-2xl font-bold">{activeWorkers}</p></div></div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4"><Truck className="h-8 w-8 text-green-500" /><div><p className="text-gray-600">{t('routesCompleted')}</p><p className="text-2xl font-bold">128</p></div></div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4"><CheckSquare className="h-8 w-8 text-yellow-500" /><div><p className="text-gray-600">{t('totalTasksCompleted')}</p><p className="text-2xl font-bold">{totalTasks}</p></div></div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4"><BarChart2 className="h-8 w-8 text-indigo-500" /><div><p className="text-gray-600">{t('recyclingRate')}</p><p className="text-2xl font-bold">68%</p></div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('workerStatus')}</h3>
          <div className="space-y-4">
            {workers.map(worker => (
              <div key={worker.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold`}>{worker.name.charAt(0)}</div>
                  <div>
                    <p className="font-semibold text-gray-800">{worker.name}</p>
                    <p className="text-sm text-gray-500">{t('area')}: {worker.area}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${ worker.status === 'on-duty' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                    {t(worker.status)}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{t('tasksDone', { count: worker.tasksCompleted })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('weeklyForecast', { location: weatherData?.location.name })}</h3>
          <div className="space-y-3">
            {weatherData?.forecast.forecastday.slice(0, 5).map(day => (
              <div key={day.date} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img src={day.day.condition.icon} alt={day.day.condition.text} className="w-10 h-10"/>
                  <div>
                    <p className="font-semibold text-gray-800">{new Date(day.date).toLocaleDateString(i18n.language, { weekday: 'long' })}</p>
                    <p className="text-sm text-gray-500">{day.day.condition.text}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">{Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°C</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}