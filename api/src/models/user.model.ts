import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
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
  address: string;
  passwordResetCode: string;
  verificationCode: string;
  verified: boolean;
  active: boolean;
  birthdate: Date;
  profilePictureId: string;
  role: Role;
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
    active: {
      type: Boolean,
      default: true,
    },
    birthdate: {
      type: Date,
    },
    companyName: {
      type: String,
    },
    profilePictureId: {
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

userSchema.virtual('profilePicture', {
  ref: 'Media',
  localField: 'profilePictureId',
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

  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export { UserModel };
