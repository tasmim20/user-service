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
          profilePhoto: profilePhoto || null,
          bio: bio || null,
          address: address || null,
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

    if (!userId) throw new Error('User ID is required');
    if (!role) throw new Error('Role is required');

    let profile: any;

    switch (role.toUpperCase()) {
      case 'RIDER':
        profile = await this.prisma.riderProfile.findUnique({
          where: { riderId: userId },
        });
        break;
      case 'DRIVER':
        profile = await this.prisma.driverProfile.findUnique({
          where: { driverId: userId },
        });
        break;
      case 'ADMIN':
        profile = await this.prisma.adminProfile.findUnique({
          where: { adminId: userId },
        });
        break;
      default:
        throw new Error('Invalid role');
    }

    if (!profile) return null; // Return null if not found

    return {
      profileId: profile.id, // DB record ID
      userId: profile.riderId ?? profile.driverId ?? profile.adminId, // Return the profile's userId
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      role: role.toUpperCase(),
      profilePhoto: profile.profilePhoto ?? '',
      bio: profile.bio ?? '',
      address: profile.address ?? '',
    };
  }
}
