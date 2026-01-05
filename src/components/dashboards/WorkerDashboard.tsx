import React from 'react';
import { MapPin, Clock, Navigation, Image } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

export function WorkerDashboard() {
  const { weatherData, rewards } = useApp();
  const { t, i18n } = useTranslation();

  const citizenReports = rewards.filter(reward => reward.photoUrl && reward.latitude && reward.longitude);

  const todaysTasks = [
    { id: '1', location: 'Elm Street Block', type: 'Regular Collection', priority: 'medium', time: '09:00 AM' },
    { id: '2', location: 'Park Avenue', type: 'Bulk Waste', priority: 'high', time: '11:30 AM' },
    { id: '3', location: 'Oak Street', type: 'Recycling Pickup', priority: 'low', time: '02:00 PM' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t('workerDashboardTitle')}</h2>
        <p className="text-gray-600 mt-1">{t('workerTagline')}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('newCitizenReports')}</h3>
        {citizenReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {citizenReports.map(report => (
              <div key={report.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <img src={report.photoUrl} alt={t('wasteReportAlt')} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-800">{report.reason}</p>
                  {/* --- FIX 1: Corrected Google Maps URL --- */}
                  <a href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`} target="_blank" rel="noopener noreferrer" className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm">
                    <MapPin size={16} />
                    <span>{t('viewOnMap')}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Image size={48} className="mx-auto text-gray-400" />
            <p className="mt-4 text-gray-600">{t('noNewReports')}</p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('todaysTasks')}</h3>
          <div className="space-y-4">
            {todaysTasks.map(task => (
              <div key={task.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{task.location}</p>
                    <p className="text-sm text-gray-600">{task.type}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${ task.priority === 'high' ? 'bg-red-100 text-red-800' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800' }`}>
                    {t(task.priority)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1"><Clock size={14} /><span>{task.time}</span></div>
                  <button className="flex items-center space-x-1 text-blue-600 hover:underline"><Navigation size={14} /><span>{t('startRoute')}</span></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('weeklyForecast', { location: weatherData?.location.name })}</h3>
          {/* --- FIX 2: Added a check for loading weather data --- */}
          {weatherData ? (
            <div className="space-y-3">
              {weatherData.forecast.forecastday.slice(0, 5).map(day => (
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
          ) : (
            <p>{t('loadingWeather')}</p>
          )}
        </div>
      </div>
    </div>
  );
}