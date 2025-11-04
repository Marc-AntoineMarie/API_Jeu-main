export default function Card({ title, value }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 text-center flex flex-col justify-center">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-[#0D0A4B]">{value}</p>
    </div>
  );
}
