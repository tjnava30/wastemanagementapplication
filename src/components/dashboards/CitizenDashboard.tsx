import React, { useState, useRef, useCallback } from 'react';
import { MapPin, Camera, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Reward } from '../../types';
import { useTranslation } from 'react-i18next';

export function CitizenDashboard() {
  const { t } = useTranslation();
  const { user, addReward } = useApp();
  const [reportReason, setReportReason] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed for clarity
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError(t('cameraNotSupported'));
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(playError => {
            console.error("Error playing video:", playError);
            setError(t('videoPlayError'));
          });
        }
      }, 0);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setError(t('cameraPermissionError'));
    }
  };

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          const capturedFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setPhoto(capturedFile);
          setPhotoPreview(URL.createObjectURL(capturedFile));
        }
      }, 'image/jpeg');
      stopCamera();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // The validatePhoto function has been removed.

  const handleReportSubmit = async () => {
    if (!reportReason.trim() || !photo) {
      setError(t('errorDescriptionPhoto'));
      return;
    }
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    // Proceed directly to geolocation and submission
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newReward: Omit<Reward, 'id'> = {
          userId: user!.id,
          points: 10,
          reason: reportReason,
          date: new Date().toISOString().split('T')[0],
          photoUrl: photoPreview!,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          name: 'Unattended Waste Report',
          claimed: false,
        };
        addReward(newReward);
        setSuccess(t('successReportSubmitted'));
        setReportReason('');
        setPhoto(null);
        setPhotoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTimeout(() => setSuccess(null), 5000);
        setIsSubmitting(false); // Stop submitting on success
      },
      (geoError) => {
        setError(`${t('errorGeolocation')}: ${geoError.message}.`);
        setIsSubmitting(false); // Stop submitting on error
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t('welcomeMessage', { name: user?.name })}</h2>
        <p className="text-gray-600 mt-1">{t('tagline')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('reportTitle')}</h3>
           <p className="text-gray-600 mb-6">If you see waste, send a photo.</p>
          <div className="space-y-4">
            <textarea value={reportReason} onChange={(e) => setReportReason(e.target.value)} placeholder={t('describePlaceholder')} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3} />
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={startCamera} className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                <Camera size={20} />
                <span>{t('openCamera')}</span>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2">
                <Upload size={20} />
                <span>{t('uploadFile')}</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
            {photoPreview && (
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <img src={photoPreview} alt={t('reportPreviewAlt')} className="mx-auto rounded-lg max-h-48 border" />
                <p className="text-sm mt-2 text-green-800 font-medium">{t('photoReady')}</p>
              </div>
            )}
            <button onClick={handleReportSubmit} disabled={isSubmitting} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 disabled:bg-gray-400">
              <MapPin size={18} />
              {/* Updated button text logic */}
              <span>{isSubmitting ? t('submittingReport') : t('submitButton')}</span>
            </button>
            {error && <p className="text-sm text-center text-red-600">{error}</p>}
            {success && <p className="text-sm text-center text-green-600">{success}</p>}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
           <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('ecoScore')}</h3>
           <div className="text-center py-4">
             <p className="text-5xl font-bold text-green-600">{user?.points}</p>
             <p className="text-gray-600">{t('points')}</p>
           </div>
        </div>
      </div>
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-2xl">
            <video ref={videoRef} playsInline className="w-full rounded-md mb-4 bg-black"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <div className="flex justify-center space-x-4">
              <button onClick={handleCapture} className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold">{t('capturePhoto')}</button>
              <button onClick={stopCamera} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg">{t('cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}