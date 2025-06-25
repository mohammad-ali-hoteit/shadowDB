import mongoose, { Schema } from 'mongoose';
import { ICompany } from '../types';
import { v4 as uuidv4 } from 'uuid';

const CompanySchema = new Schema<ICompany>(
  {
    companyId: {
      type: String,
      required: true,
      trim: true,
      default: () => generateCompanyId()
    },
    names: [{
      type: String,
      required: true,
      trim: true,
    }],
    location: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create text index for search functionality
CompanySchema.index({ names: 'text', location: 'text', owner: 'text' });

const generateCompanyId = (): string => {
  // Take first 6 characters of UUID
  const random = uuidv4().substring(0, 6).toUpperCase();

  return `CID-${random}`;
};

export default mongoose.model<ICompany>('Company', CompanySchema); 

