import { randomUUID } from 'crypto';
import {
  findAllMembers,
  findMemberById,
  findMemberByEmail,
  findMemberByPhone,
  addMember,
  updateMemberInStore,
  removeMemberById,
} from '../data/members.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { buildSanitizedMemberData } from '../utils/sanitizeMember.js';
import { logAnalytics, ANALYTICS_MESSAGES } from '../utils/analytics.js';

const applyFilters = (allMembers, { search, membershipType, isActive }) => {
  let result = allMembers;

  if (search) {
    const term = search.toLowerCase();
    result = result.filter(
      (member) =>
        member.name.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        member.phone.includes(term) ||
        member.membershipType.toLowerCase().includes(term)
    );
  }

  if (membershipType) {
    result = result.filter((member) => member.membershipType === membershipType);
  }

  if (isActive !== undefined) {
    const boolValue = isActive === 'true' || isActive === true;
    result = result.filter((member) => member.isActive === boolValue);
  }

  return result;
};

export const getAllMembers = (req, res) => {
  const { search, membershipType, isActive } = req.query;
  const allMembers = findAllMembers();
  const filtered = applyFilters(allMembers, { search, membershipType, isActive });

  const isSearchOrFilter = Boolean(search || membershipType || isActive !== undefined);
  logAnalytics(isSearchOrFilter ? ANALYTICS_MESSAGES.SEARCHED : ANALYTICS_MESSAGES.VIEWED);

  if (filtered.length === 0) {
    return sendSuccess(res, 200, 'No data found', []);
  }

  return sendSuccess(res, 200, 'Members retrieved successfully', filtered);
};

export const getMemberById = (req, res) => {
  const member = findMemberById(req.params.id);

  if (!member) {
    return sendError(res, 404, 'Member not found');
  }

  logAnalytics(ANALYTICS_MESSAGES.VIEWED_ONE);
  return sendSuccess(res, 200, 'Member retrieved successfully', member);
};

export const createMember = (req, res) => {
  const sanitized = buildSanitizedMemberData(req.body);

  const existingEmail = findMemberByEmail(sanitized.email);
  if (existingEmail) {
    return sendError(res, 409, 'A member with this email already exists');
  }

  const existingPhone = findMemberByPhone(sanitized.phone);
  if (existingPhone) {
    return sendError(res, 409, 'A member with this phone number already exists');
  }

  const now = new Date().toISOString();
  const newMember = {
    id: randomUUID(),
    name: sanitized.name,
    email: sanitized.email,
    phone: sanitized.phone,
    membershipType: sanitized.membershipType,
    joiningDate: sanitized.joiningDate,
    isActive: sanitized.isActive !== undefined ? sanitized.isActive : true,
    createdAt: now,
    updatedAt: now,
  };

  addMember(newMember);
  logAnalytics(ANALYTICS_MESSAGES.CREATED);
  return sendSuccess(res, 201, 'Member created successfully', newMember);
};

export const updateMember = (req, res) => {
  const { id } = req.params;
  const existingMember = findMemberById(id);

  if (!existingMember) {
    return sendError(res, 404, 'Member not found');
  }

  const sanitized = buildSanitizedMemberData(req.body);

  if (sanitized.email) {
    const emailConflict = findMemberByEmail(sanitized.email, id);
    if (emailConflict) {
      return sendError(res, 409, 'A member with this email already exists');
    }
  }

  if (sanitized.phone) {
    const phoneConflict = findMemberByPhone(sanitized.phone, id);
    if (phoneConflict) {
      return sendError(res, 409, 'A member with this phone number already exists');
    }
  }

  const updatedMember = updateMemberInStore(id, {
    ...sanitized,
    updatedAt: new Date().toISOString(),
  });

  logAnalytics(ANALYTICS_MESSAGES.UPDATED);
  return sendSuccess(res, 200, 'Member updated successfully', updatedMember);
};

export const deleteMember = (req, res) => {
  const { id } = req.params;
  const existingMember = findMemberById(id);

  if (!existingMember) {
    return sendError(res, 404, 'Member not found');
  }

  removeMemberById(id);
  logAnalytics(ANALYTICS_MESSAGES.DELETED);
  return sendSuccess(res, 200, 'Member deleted successfully', existingMember);
};