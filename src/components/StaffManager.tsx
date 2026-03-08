'use client';

import { useState } from 'react';
import { UserRole, StaffMember } from '@/lib/types';
import { ROLES } from '@/lib/roles';
import { useStaffStore } from '@/lib/useStaffStore';

export default function StaffManager() {
  const { staff, addStaff, updateStaff, removeStaff } = useStaffStore();
  const [addingForRole, setAddingForRole] = useState<UserRole | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDocLabel, setFormDocLabel] = useState('');

  const handleAdd = (role: UserRole) => {
    if (!formName.trim()) return;
    addStaff({
      name: formName.trim(),
      role,
      accessCode: formCode || '000',
    });
    setFormName('');
    setFormCode('');
    setAddingForRole(null);
  };

  const handleUpdate = (member: StaffMember) => {
    if (!formName.trim()) return;
    updateStaff(member.id, {
      name: formName.trim(),
      accessCode: formCode || member.accessCode,
    });
    setFormName('');
    setFormCode('');
    setEditingId(null);
  };

  const handleAddDoc = (memberId: string) => {
    if (!formDocLabel.trim()) return;
    const member = staff.find((s) => s.id === memberId);
    if (!member) return;
    updateStaff(memberId, {
      documents: [
        ...member.documents,
        { label: formDocLabel.trim(), fileName: `${formDocLabel.trim()}.pdf` },
      ],
    });
    setFormDocLabel('');
  };

  const startEdit = (member: StaffMember) => {
    setEditingId(member.id);
    setFormName(member.name);
    setFormCode(member.accessCode);
    setAddingForRole(null);
  };

  const cancelForm = () => {
    setAddingForRole(null);
    setEditingId(null);
    setFormName('');
    setFormCode('');
  };

  // Group roles into tiers for display
  const tier1Roles = ROLES.filter((r) => r.canRequest);
  const tier2Roles = ROLES.filter((r) => !r.canRequest);

  const renderRoleSection = (role: typeof ROLES[number]) => {
    const members = staff.filter((s) => s.role === role.value);
    const isAdding = addingForRole === role.value;

    return (
      <div key={role.value} className="card-surface p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-sm font-medium text-text-primary">{role.label}</h4>
            <p className="text-xs text-text-muted mt-0.5">{role.description}</p>
          </div>
          {!isAdding && editingId === null && (
            <button
              onClick={() => {
                setAddingForRole(role.value);
                setFormName('');
                setFormCode('');
              }}
              className="btn-navy px-3 py-1.5 rounded-lg text-xs flex-shrink-0"
            >
              + Add Person
            </button>
          )}
        </div>

        {/* Existing members */}
        {members.length > 0 && (
          <div className="mt-3 space-y-2">
            {members.map((member) => (
              <div key={member.id}>
                {editingId === member.id ? (
                  /* Edit form */
                  <div className="rounded-lg border border-gold-500/30 bg-navy-800/50 p-3 space-y-2">
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Full name"
                      className="input-navy w-full px-3 py-1.5 text-sm"
                      autoFocus
                    />
                    <input
                      type="text"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="3-digit code"
                      maxLength={3}
                      className="input-navy w-full px-3 py-1.5 text-sm"
                    />
                    {/* Documents */}
                    {member.documents.length > 0 && (
                      <div className="space-y-2">
                        {member.documents.map((doc, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-text-muted">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-sage">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                            {doc.label}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formDocLabel}
                        onChange={(e) => setFormDocLabel(e.target.value)}
                        placeholder="Add doc (e.g., Resume, JD)"
                        className="input-navy flex-1 px-2 py-1 text-xs"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddDoc(member.id);
                        }}
                      />
                      <button
                        onClick={() => handleAddDoc(member.id)}
                        disabled={!formDocLabel.trim()}
                        className="btn-navy px-2 py-1 rounded text-xs disabled:opacity-30"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={cancelForm}
                        className="px-3 py-1 text-xs text-text-muted hover:text-text-primary transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(member)}
                        className="btn-gold px-3 py-1 rounded-lg text-xs"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Display card */
                  <div className="flex items-center gap-3 rounded-lg bg-navy-800/40 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-navy-700 border border-border-subtle flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-text-primary">
                        {member.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">{member.name}</p>
                      <p className="text-[11px] text-text-muted">
                        Code: •••{member.documents.length > 0 ? ` · ${member.documents.length} doc${member.documents.length !== 1 ? 's' : ''}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => startEdit(member)}
                        className="p-1 rounded hover:bg-navy-700 text-text-muted hover:text-gold-400 transition-colors"
                        title="Edit"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => removeStaff(member.id)}
                        className="p-1 rounded hover:bg-navy-700 text-text-muted hover:text-alert-rose transition-colors"
                        title="Remove"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add person form */}
        {isAdding && (
          <div className="mt-3 rounded-lg border border-gold-500/30 bg-navy-800/50 p-3 space-y-2">
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Full name"
              className="input-navy w-full px-3 py-1.5 text-sm"
              autoFocus
            />
            <input
              type="text"
              value={formCode}
              onChange={(e) => setFormCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
              placeholder="3-digit access code"
              maxLength={3}
              className="input-navy w-full px-3 py-1.5 text-sm"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={cancelForm}
                className="px-3 py-1 text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAdd(role.value)}
                disabled={!formName.trim()}
                className="btn-gold px-3 py-1 rounded-lg text-xs disabled:opacity-30"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {members.length === 0 && !isAdding && (
          <p className="text-xs text-text-muted mt-2 italic">No staff added yet</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary mb-2">
        Add team members and assign roles. Each person gets a 3-digit access code for login.
      </p>

      {/* Tier 1 — Leadership */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2">
          Leadership (can create surveys)
        </h3>
        <div className="space-y-3">
          {tier1Roles.map(renderRoleSection)}
        </div>
      </div>

      {/* Tier 2 — Staff */}
      <div className="mt-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Staff (participate &amp; be heard)
        </h3>
        <div className="space-y-3">
          {tier2Roles.map(renderRoleSection)}
        </div>
      </div>
    </div>
  );
}
