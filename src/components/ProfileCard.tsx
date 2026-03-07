'use client';

import { StaffMember } from '@/lib/types';
import { getRoleConfig } from '@/lib/roles';

interface ProfileCardProps {
  member: StaffMember;
  onEnter: () => void;
}

export default function ProfileCard({ member, onEnter }: ProfileCardProps) {
  const roleConfig = getRoleConfig(member.role);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-deep">
      <div className="card-gold max-w-md w-full mx-4 p-10 text-center">
        {/* Avatar */}
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-navy-800 border-2 border-border-gold flex items-center justify-center">
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={member.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-gold-500">
              {member.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
            </span>
          )}
        </div>

        <h1 className="text-xl font-bold text-text-primary mb-1">
          {member.name}
        </h1>
        <p className="text-sm text-gold-400 font-medium mb-4">
          {roleConfig.label}
        </p>
        <p className="text-xs text-text-muted mb-6">
          {roleConfig.description}
        </p>

        {/* Documents */}
        {member.documents.length > 0 && (
          <div className="mb-6 text-left">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
              Documents on File
            </h3>
            <div className="space-y-1.5">
              {member.documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-sage flex-shrink-0">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="text-text-secondary">{doc.label}</span>
                  <span className="text-text-muted ml-auto">{doc.fileName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onEnter}
          className="btn-gold w-full py-3.5 px-6 rounded-lg text-sm"
        >
          Enter FieldVoices
        </button>
      </div>
    </div>
  );
}
