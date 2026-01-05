import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle2 } from 'lucide-react';

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    course: '',
    teacher: '',
    feedback_date: new Date().toISOString().split('T')[0],
    content_rating: 3,
    delivery_rating: 3,
    pace_rating: 3,
    clarity_rating: 3,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSubmitSuccess(false);

    try {
      const { error: submitError } = await supabase
        .from('feedback')
        .insert([formData]);

      if (submitError) throw submitError;

      setSubmitSuccess(true);
      setFormData({
        course: '',
        teacher: '',
        feedback_date: new Date().toISOString().split('T')[0],
        content_rating: 3,
        delivery_rating: 3,
        pace_rating: 3,
        clarity_rating: 3,
      });

      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingInput = ({
    label,
    name,
    value
  }: {
    label: string;
    name: keyof typeof formData;
    value: number;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => setFormData({ ...formData, [name]: rating })}
            className={`w-12 h-12 rounded-lg font-semibold transition-all ${
              value === rating
                ? 'bg-blue-600 text-white shadow-lg scale-110'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Course Feedback</h2>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800">
          <CheckCircle2 className="w-5 h-5" />
          <span>Feedback submitted successfully!</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Name
            </label>
            <input
              type="text"
              required
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Data Structures"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teacher Name
            </label>
            <input
              type="text"
              required
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Dr. Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              required
              value={formData.feedback_date}
              onChange={(e) => setFormData({ ...formData, feedback_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="border-t pt-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Rate Your Experience (1 = Poor, 5 = Excellent)</h3>

          <RatingInput
            label="Content Quality"
            name="content_rating"
            value={formData.content_rating}
          />

          <RatingInput
            label="Delivery & Teaching Style"
            name="delivery_rating"
            value={formData.delivery_rating}
          />

          <RatingInput
            label="Pace of Teaching"
            name="pace_rating"
            value={formData.pace_rating}
          />

          <RatingInput
            label="Clarity of Explanation"
            name="clarity_rating"
            value={formData.clarity_rating}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
