import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

export interface UserInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  COMPANY_MANAGER = 'COMPANY_MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  USER = 'USER',
}

export interface UserDocument extends UserInput, mongoose.Document {
  phoneNumber: string;
  country: string;
  city: string;
  zip: string;
  address: string;
  passwordResetCode: string;
  verificationCode: string;
  verified: boolean;
  disabled: boolean;
  birthdate: Date;
  fileNumber: number;
  startDate: Date;
  endDate: Date;
  companyName: string;
  companyLicenseNumber: string;
  categories: Array<{ id: string; name: string }>;
  profilePictureId: string;
  role: Role;
  companyId: string;
  employeeId: string;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 128,
    },
    fileNumber: {
      type: Number,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    country: {
      type: String,
      maxlength: 128,
      trim: true,
    },
    city: {
      type: String,
      maxlength: 128,
      trim: true,
    },
    zip: {
      type: String,
      maxlength: 5,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    passwordResetCode: {
      type: String,
    },
    verificationCode: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    companyLicenseNumber: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },
    birthdate: {
      type: Date,
    },
    companyName: {
      type: String,
    },
    categories: {
      type: [
        {
          id: String,
          name: String,
        },
      ],
    },
    profilePictureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    },
    role: { type: String, enum: Role, default: Role.USER },
  },
  {
    timestamps: true,
    collection: 'User',
    minimize: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        const newRet = { ...ret };
        delete newRet.password;
        delete newRet.passwordResetCode;
        delete newRet.verificationCode;
        return newRet;
      },
    },
  },
);

userSchema.virtual('fullName').get(function () {
  return (this.firstName || '') + ' ' + (this.lastName || '');
});

userSchema.virtual('employee', {
  ref: 'User',
  localField: 'employeeId',
  foreignField: '_id',
  justOne: true,
});

userSchema.virtual('company', {
  ref: 'User',
  localField: 'companyId',
  foreignField: '_id',
  justOne: true,
});

userSchema.virtual('profilePicture', {
  ref: 'Media',
  localField: 'profilePictureId',
  foreignField: '_id',
  justOne: true,
});

userSchema.virtual('resume', {
  ref: 'Media',
  localField: 'resumeId',
  foreignField: '_id',
  justOne: true,
});

userSchema.pre('save', async function (next) {
  const user = this as UserDocument;

  if (!user.isModified('password')) {
    return next();
  }

  const rounds = config.get<number>('saltWorkFactor');

  const salt = await bcrypt.genSalt(rounds);

  const hash = await bcrypt.hashSync(user.password, +salt);

  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch(e => false);
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export { UserModel };
