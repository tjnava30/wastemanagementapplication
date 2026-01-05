interface BarChartProps {
  data: {
    label: string;
    value: number;
  }[];
}

export default function BarChart({ data }: BarChartProps) {
  const maxValue = 5;

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.label} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
            <span className="text-sm font-bold text-blue-600">{item.value.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 flex items-center justify-end px-3"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            >
              <span className="text-white text-xs font-semibold">
                {item.value.toFixed(2)} / 5.0
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
