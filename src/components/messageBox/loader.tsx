export default function Loader({ role }: {role: string}) {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-md mx-2 my-2">
        <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className="bg-[#141414] text-white p-2 rounded-2xl">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
