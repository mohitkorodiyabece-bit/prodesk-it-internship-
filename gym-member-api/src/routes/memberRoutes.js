import { Router } from 'express';
import {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} from '../controllers/memberController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createMemberValidationRules,
  updateMemberValidationRules,
  memberIdValidationRules,
  memberQueryValidationRules,
} from '../utils/validationRules.js';

const router = Router();

router.get('/', memberQueryValidationRules, validateRequest, getAllMembers);
router.get('/:id', memberIdValidationRules, validateRequest, getMemberById);
router.post('/', createMemberValidationRules, validateRequest, createMember);
router.put(
  '/:id',
  [...memberIdValidationRules, ...updateMemberValidationRules],
  validateRequest,
  updateMember
);
router.delete('/:id', memberIdValidationRules, validateRequest, deleteMember);

export default router;