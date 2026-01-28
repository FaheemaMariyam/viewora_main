
export default function PendingApproval() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-page px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-blue-50 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ⏳
        </div>
        <h2 className="text-2xl font-bold text-brand-primary mb-3">
          Approval Pending
        </h2>
        <p className="text-text-muted mb-8 leading-relaxed">
          Your account is currently under review by our administration team. 
          You will receive an email once your verification process is complete.
        </p>
        
        {/* We can add a logout or home button here if needed */}
        <p className="text-sm text-gray-400">
           Please check back later.
        </p>
      </div>
    </div>
  );
}
