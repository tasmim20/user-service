/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { UserService } from './user.service';
import type {
  CreateProfileRequest,
  CreateProfileResponse,
  GetProfileRequest,
  GetProfileResponse,
} from './common/interface/user.interface';

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
  async getProfileGrpc(data: GetProfileRequest): Promise<GetProfileResponse> {
    try {
      console.log('🟢 UserController.GetProfile called with:', data);

      const result = await this.userService.getProfile(data);

      if (!result) {
        console.error('Profile not found for:', data);
        throw new RpcException({
          code: GrpcStatus.NOT_FOUND,
          message: 'Profile not found',
        });
      }

      console.log('🟢 GetProfile result:', result);
      return result;
    } catch (error) {
      console.error('Error in getProfileGrpc:', error);
      throw error;
    }
  }
}
