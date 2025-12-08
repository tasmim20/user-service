/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import {
  CreateProfileRequest,
  CreateProfileResponse,
  GetProfileResponse,
} from './common/interface/user.interface';
import { PrismaService } from './prisma.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(
    data: CreateProfileRequest,
  ): Promise<CreateProfileResponse> {
    const {
      userId,
      role,
      email,
      firstName,
      lastName,
      profilePhoto,
      bio,
      address,
      mobileNumber,
      drivingLicense,
    } = data;

    console.log('createProfile received:', data);

    let existingProfile: any = null;

    if (role === 'RIDER') {
      existingProfile = await this.prisma.riderProfile.findUnique({
        where: { riderId: userId },
      });
    } else if (role === 'DRIVER') {
      existingProfile = await this.prisma.driverProfile.findUnique({
        where: { driverId: userId },
      });
    } else if (role === 'ADMIN') {
      existingProfile = await this.prisma.adminProfile.findUnique({
        where: { adminId: userId },
      });
    }

    if (existingProfile) {
      return {
        success: false,
        message: 'Profile already exists',
        profileId: existingProfile.id,
      };
    }

    let profile: any;

    if (role === 'RIDER') {
      profile = await this.prisma.riderProfile.create({
        data: {
          riderId: userId,
          role: 'RIDER',
          email,
          firstName,
          lastName,
          mobileNumber: mobileNumber ?? null,
          profilePhoto: profilePhoto || null,
          bio: bio || null,
          address: address || null,
        },
      });
    } else if (role === 'DRIVER') {
      profile = await this.prisma.driverProfile.create({
        data: {
          driverId: userId,
          role: 'DRIVER',
          email,
          firstName,
          lastName,
          mobileNumber: mobileNumber ?? null,
          profilePhoto: profilePhoto || null,
          bio: bio || null,
          address: address || null,
          drivingLicense: drivingLicense || null,
        },
      });
    } else if (role === 'ADMIN') {
      profile = await this.prisma.adminProfile.create({
        data: {
          adminId: userId,
          role: 'ADMIN',
          email,
          firstName,
          lastName,
          mobileNumber: mobileNumber ?? null,
          profilePhoto: profilePhoto || null,
          bio: bio || null,
          address: address || null,
        },
      });
    } else {
      return {
        success: false,
        message: 'Invalid role',
        profileId: 0,
      };
    }

    console.log('Profile created in DB:', profile);

    return {
      success: true,
      message: 'Profile created successfully',
      profileId: profile.id,
    };
  }
  async getProfile(data: {
    userId: number;
    role: string;
  }): Promise<GetProfileResponse | null> {
    const { userId, role } = data;

    if (!userId) {
      throw new RpcException('User ID is required');
    }
    if (!role) {
      throw new RpcException('Role is required');
    }

    const roleUpper = role.toUpperCase();

    const modelMap = {
      RIDER: { model: this.prisma.riderProfile, idField: 'riderId' },
      DRIVER: { model: this.prisma.driverProfile, idField: 'driverId' },
      ADMIN: { model: this.prisma.adminProfile, idField: 'adminId' },
    };

    const modelConfig = modelMap[roleUpper];
    if (!modelConfig) {
      throw new RpcException('Invalid role');
    }

    // Fetch the profile
    const profile = await modelConfig.model.findUnique({
      where: { [modelConfig.idField]: userId },
    });

    if (!profile) return null;

    return {
      profileId: profile.id,
      userId: profile[modelConfig.idField],
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      role: roleUpper,
      profilePhoto: profile.profilePhoto ?? '',
      bio: profile.bio ?? '',
      address: profile.address ?? '',
      mobileNumber: profile.mobileNumber ?? '',
      ...(roleUpper === 'DRIVER'
        ? { drivingLicense: profile.drivingLicense ?? '' }
        : {}),
    };
  }

  // Update profile (excluding email)
  // Update profile (excluding email)
  async updateProfile(
    userId: number,
    role: string,
    updateData: Partial<
      Omit<CreateProfileRequest, 'role' | 'email' | 'userId'>
    >,
  ): Promise<GetProfileResponse> {
    const roleUpper = role.toUpperCase();

    const modelMap = {
      RIDER: { model: this.prisma.riderProfile, idField: 'riderId' },
      DRIVER: { model: this.prisma.driverProfile, idField: 'driverId' },
      ADMIN: { model: this.prisma.adminProfile, idField: 'adminId' },
    };

    const config = modelMap[roleUpper];
    if (!config) throw new RpcException('Invalid role');

    const existing = await config.model.findUnique({
      where: { [config.idField]: userId },
    });

    if (!existing) throw new RpcException('Profile not found');

    const updated = await config.model.update({
      where: { [config.idField]: userId },
      data: updateData,
    });

    return {
      profileId: updated.id ?? 0,
      userId: updated[config.idField],
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      role: roleUpper,
      profilePhoto: updated.profilePhoto ?? '',
      mobileNumber: updated.mobileNumber ?? '',
      bio: updated.bio ?? '',
      address: updated.address ?? '',
    };
  }

  async deleteProfile(
    userId: number,
    role: string,
  ): Promise<{ success: boolean; message: string }> {
    const roleUpper = role.toUpperCase();

    const modelMap = {
      RIDER: this.prisma.riderProfile,
      DRIVER: this.prisma.driverProfile,
      ADMIN: this.prisma.adminProfile,
    };

    const model = modelMap[roleUpper];
    if (!model) throw new RpcException('Invalid role');

    const existingProfile = await model.findUnique({
      where: { [`${roleUpper.toLowerCase()}Id`]: userId },
    });

    if (!existingProfile) throw new RpcException('Profile not found');

    await model.delete({
      where: { [`${roleUpper.toLowerCase()}Id`]: userId },
    });

    return { success: true, message: 'Profile deleted successfully' };
  }
}
