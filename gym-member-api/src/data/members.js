export const members = [];

export const findAllMembers = () => members;

export const findMemberById = (id) => members.find((member) => member.id === id);

export const findMemberByEmail = (email, excludeId = null) =>
  members.find((member) => member.email === email && member.id !== excludeId);

export const findMemberByPhone = (phone, excludeId = null) =>
  members.find((member) => member.phone === phone && member.id !== excludeId);

export const addMember = (member) => {
  members.push(member);
  return member;
};

export const updateMemberInStore = (id, updatedFields) => {
  const index = members.findIndex((member) => member.id === id);
  if (index === -1) return null;
  members[index] = { ...members[index], ...updatedFields };
  return members[index];
};

export const removeMemberById = (id) => {
  const index = members.findIndex((member) => member.id === id);
  if (index === -1) return null;
  const [removed] = members.splice(index, 1);
  return removed;
};