/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
// import { status as GrpcStatus } from '@grpc/grpc-js';
import { UserService } from './user.service';
import type {
  CreateProfileRequest,
  CreateProfileResponse,
  GetProfileResponse,
  UpdateProfileRequest,
} from './common/interface/user.interface';
import { from, Observable } from 'rxjs';

@Controller()
export class UserController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'CreateProfile') //
  async createProfileGrpc(
    data: CreateProfileRequest,
  ): Promise<CreateProfileResponse> {
    console.log('🟢 UserController.CreateProfile called with:', data);
    return this.userService.createProfile(data);
  }

  @GrpcMethod('UserService', 'GetProfile')
  async getProfileGrpc(data: {
    userId: number;
    role: string;
  }): Promise<GetProfileResponse> {
    const { userId, role } = data;

    const profile = await this.userService.getProfile({ userId, role });

    if (!profile) {
      throw new RpcException('Profile not found');
    }

    return profile;
  }

  @GrpcMethod('UserService', 'UpdateProfile')
  updateProfileGrpc(
    data: UpdateProfileRequest,
  ): Observable<GetProfileResponse> {
    if (!data || !data.userId || !data.role) {
      throw new RpcException('Invalid request');
    }

    // Call the UserService method instead of this controller
    const promise = this.userService.updateProfile(data.userId, data.role, {
      firstName: data.firstName,
      lastName: data.lastName,
      profilePhoto: data.profilePhoto,
      mobileNumber: data.mobileNumber,
      bio: data.bio,
      address: data.address,
    });

    return from(promise); // Convert Promise → Observable
  }

  @GrpcMethod('UserService', 'DeleteProfile')
  async deleteProfileGrpc(data: {
    userId: number;
    role: string;
  }): Promise<{ success: boolean; message: string }> {
    const { userId, role } = data;
    return this.userService.deleteProfile(userId, role);
  }
}
